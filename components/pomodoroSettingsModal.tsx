import type { PomodoroSettings } from "@/context/PomodoroContext";
import { usePomodoro } from "@/context/PomodoroContext";
import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import {
	Keyboard,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_SESSIONS = 1;
const MAX_SESSIONS = 8;
const STEPS = MAX_SESSIONS - MIN_SESSIONS; // 7
const RAIL_WIDTH = 260;
const SELECTOR_W = 6; // slim vertical rectangle
const SELECTOR_H = 28;
const RAIL_H = 10;
const DOT_SIZE = 8;

// Usable travel distance for the selector center
const TRAVEL = RAIL_WIDTH - SELECTOR_W;
const STEP_PX = TRAVEL / STEPS;

const COLORS = {
	bg: "#13131A",
	surface: "#1E1E2A",
	surfaceHigh: "#26263A",
	primary: "#6A4FB3",
	primaryLight: "#C8B8E8",
	trackInactive: "#2E2E42",
	text: "#FFFFFF",
	textMuted: "#7A7A9A",
	border: "#2A2A3C",
};

// ─── Segmented Draggable Slider ───────────────────────────────────────────────

interface SessionSliderProps {
	value: number;
	onChange: (v: number) => void;
}

function SessionSlider({ value, onChange }: SessionSliderProps) {
	// Convert session value → pixel offset of selector left edge
	const valueToX = (v: number) =>
		((Math.max(MIN_SESSIONS, Math.min(MAX_SESSIONS, v)) - MIN_SESSIONS) /
			STEPS) *
		TRAVEL;

	const selectorX = useSharedValue(valueToX(value));
	const startX = useSharedValue(valueToX(value));

	// Keep in sync when value changes externally
	useEffect(() => {
		selectorX.value = withSpring(valueToX(value), {
			damping: 20,
			stiffness: 260,
		});
	}, [value]);

	const snapToNearest = (x: number) => {
		"worklet";
		const clamped = Math.max(0, Math.min(TRAVEL, x));
		return Math.round(clamped / STEP_PX) * STEP_PX;
	};

	const notifyChange = (x: number) => {
		const clamped = Math.max(0, Math.min(TRAVEL, x));
		onChange(Math.round(clamped / STEP_PX) + MIN_SESSIONS);
	};

	const pan = Gesture.Pan()
		.onBegin(() => {
			startX.value = selectorX.value;
		})
		.onUpdate((e) => {
			selectorX.value = Math.max(
				0,
				Math.min(TRAVEL, startX.value + e.translationX),
			);
		})
		.onEnd(() => {
			const snapped = snapToNearest(selectorX.value);
			selectorX.value = withSpring(snapped, { damping: 20, stiffness: 300 });
			runOnJS(notifyChange)(snapped);
		});

	// Active rail width = selector left edge
	const activeRailStyle = useAnimatedStyle(() => ({
		width: selectorX.value,
	}));

	// Inactive rail width = remaining space after selector
	const inactiveRailStyle = useAnimatedStyle(() => ({
		width: TRAVEL - selectorX.value,
	}));

	// Selector position
	const selectorStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: selectorX.value }],
	}));

	// Dot positions (stop markers between the rails, under the selector layer)
	const dots = Array.from({ length: MAX_SESSIONS }, (_, i) => {
		const x = i * STEP_PX + SELECTOR_W / 2; // center of each stop
		return x;
	});

	return (
		<View style={segStyles.wrapper}>
			{/* Main track row */}
			<View style={segStyles.track}>
				{/* Active rail */}
				<Animated.View style={[segStyles.railActive, activeRailStyle]} />

				{/* Selector — slim vertical rectangle */}
				<GestureDetector gesture={pan}>
					<Animated.View style={[segStyles.selector, selectorStyle]} />
				</GestureDetector>

				{/* Inactive rail */}
				<Animated.View style={[segStyles.railInactive, inactiveRailStyle]} />

				{/* Stop dots — absolutely positioned over the full track */}
				{dots.map((x, i) => (
					<Pressable
						key={i}
						onPress={() => onChange(i + MIN_SESSIONS)}
						style={[segStyles.dot, { left: x - DOT_SIZE / 2 }]}
					/>
				))}
			</View>

			{/* Min / max labels */}
			<View style={segStyles.labels}>
				<Text style={segStyles.labelText}>{MIN_SESSIONS}</Text>
				<Text style={segStyles.labelText}>{MAX_SESSIONS}</Text>
			</View>
		</View>
	);
}

const segStyles = StyleSheet.create({
	wrapper: {
		width: RAIL_WIDTH,
		gap: 6,
	},
	track: {
		width: RAIL_WIDTH,
		height: SELECTOR_H,
		flexDirection: "row",
		alignItems: "center",
		position: "relative",
		overflow: "visible",
	},
	railActive: {
		height: RAIL_H,
		borderRadius: 4,
		backgroundColor: COLORS.primary,
	},
	railInactive: {
		height: RAIL_H,
		borderRadius: 4,
		backgroundColor: COLORS.trackInactive,
	},
	selector: {
		position: "absolute",
		left: 0,
		width: SELECTOR_W,
		height: SELECTOR_H,
		borderRadius: 3,
		backgroundColor: COLORS.primaryLight,
		shadowColor: COLORS.primary,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.7,
		shadowRadius: 6,
		elevation: 6,
		zIndex: 2,
	},
	dot: {
		position: "absolute",
		width: DOT_SIZE,
		height: DOT_SIZE,
		borderRadius: DOT_SIZE / 2,
		backgroundColor: COLORS.border,
		top: (SELECTOR_H - DOT_SIZE) / 2,
		zIndex: 1,
	},
	labels: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 2,
	},
	labelText: {
		fontSize: 11,
		color: COLORS.textMuted,
		fontWeight: "500",
	},
});

// ─── Duration Card ────────────────────────────────────────────────────────────

interface DurationCardProps {
	label: string;
	valueMinutes: number;
	onCommit: (minutes: number) => void;
}

function DurationCard({ label, valueMinutes, onCommit }: DurationCardProps) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(String(valueMinutes));
	const inputRef = useRef<TextInput>(null);

	const open = () => {
		setDraft(String(valueMinutes));
		setEditing(true);
		setTimeout(() => inputRef.current?.focus(), 80);
	};

	const commit = () => {
		const parsed = parseInt(draft, 10);
		if (!isNaN(parsed) && parsed >= 1 && parsed <= 99) onCommit(parsed);
		setEditing(false);
		Keyboard.dismiss();
	};

	return (
		<Pressable onPress={open} style={cardStyles.card}>
			<Text style={cardStyles.label}>{label}</Text>
			{editing ? (
				<TextInput
					ref={inputRef}
					style={cardStyles.input}
					value={draft}
					onChangeText={setDraft}
					keyboardType='number-pad'
					maxLength={2}
					onBlur={commit}
					onSubmitEditing={commit}
					selectTextOnFocus
				/>
			) : (
				<Text style={cardStyles.value}>{valueMinutes}</Text>
			)}
		</Pressable>
	);
}

const cardStyles = StyleSheet.create({
	card: {
		flex: 1,
		backgroundColor: COLORS.surfaceHigh,
		borderRadius: 16,
		paddingVertical: 16,
		paddingHorizontal: 12,
		alignItems: "center",
		gap: 8,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	label: {
		fontSize: 11,
		fontWeight: "600",
		color: COLORS.textMuted,
		textTransform: "uppercase",
		letterSpacing: 0.8,
		textAlign: "center",
	},
	value: {
		fontSize: 40,
		fontWeight: "800",
		color: COLORS.text,
		lineHeight: 44,
	},
	input: {
		fontSize: 40,
		fontWeight: "800",
		color: COLORS.primaryLight,
		lineHeight: 44,
		textAlign: "center",
		minWidth: 60,
		borderBottomWidth: 2,
		borderBottomColor: COLORS.primary,
		padding: 0,
	},
});

// ─── Modal ────────────────────────────────────────────────────────────────────

interface PomodoroSettingsModalProps {
	visible: boolean;
	onClose: () => void;
}

export default function PomodoroSettingsModal({
	visible,
	onClose,
}: PomodoroSettingsModalProps) {
	const { settings, updateSettings } = usePomodoro();
	const [draft, setDraft] = useState<PomodoroSettings>({ ...settings });

	useEffect(() => {
		if (visible) setDraft({ ...settings });
	}, [visible]);

	const patch = (p: Partial<PomodoroSettings>) =>
		setDraft((prev) => ({ ...prev, ...p }));

	const handleDone = () => {
		updateSettings(draft);
		onClose();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
			onRequestClose={onClose}
		>
			{/* Blurred backdrop — tap to close */}
			<Pressable style={modalStyles.backdrop} onPress={onClose}>
				<BlurView intensity={24} tint='dark' style={StyleSheet.absoluteFill} />
			</Pressable>

			<View style={modalStyles.container}>
				<View style={modalStyles.sheet}>
					<View style={modalStyles.handle} />

					{/* Header */}
					<View style={modalStyles.header}>
						<Pressable onPress={onClose} hitSlop={12}>
							<Text style={modalStyles.cancelBtn}>Cancel</Text>
						</Pressable>
						<Text style={modalStyles.title}>Timer Settings</Text>
						<Pressable onPress={handleDone} hitSlop={12}>
							<Text style={modalStyles.doneBtn}>Done</Text>
						</Pressable>
					</View>

					{/* Duration cards */}
					<View style={modalStyles.section}>
						<View style={modalStyles.durationRow}>
							<DurationCard
								label='Focus'
								valueMinutes={Math.floor(draft.focusDuration / 60)}
								onCommit={(m) => patch({ focusDuration: m * 60 })}
							/>
							<DurationCard
								label='Short Break'
								valueMinutes={Math.floor(draft.shortBreakDuration / 60)}
								onCommit={(m) => patch({ shortBreakDuration: m * 60 })}
							/>
							<DurationCard
								label='Long Break'
								valueMinutes={Math.floor(draft.longBreakDuration / 60)}
								onCommit={(m) => patch({ longBreakDuration: m * 60 })}
							/>
						</View>
					</View>

					{/* Session length slider */}
					<View style={modalStyles.section}>
						<View style={modalStyles.sliderCard}>
							<View style={modalStyles.sliderTitleRow}>
								<Text style={modalStyles.sliderIcon}>⏱</Text>
								<View>
									<Text style={modalStyles.sliderTitle}>Session Length</Text>
									<Text style={modalStyles.sliderSub}>
										Focus intervals in one session:{" "}
										<Text style={modalStyles.sliderSubBold}>
											{draft.sessionsBeforeLongBreak}
										</Text>
									</Text>
								</View>
							</View>
							<View style={modalStyles.sliderContainer}>
								<SessionSlider
									value={draft.sessionsBeforeLongBreak}
									onChange={(v) => patch({ sessionsBeforeLongBreak: v })}
								/>
							</View>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const modalStyles = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
	},
	container: {
		flex: 1,
		justifyContent: "flex-end",
		pointerEvents: "box-none",
	},
	sheet: {
		backgroundColor: COLORS.bg,
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		paddingBottom: 48,
		borderWidth: 1,
		borderBottomWidth: 0,
		borderColor: COLORS.border,
	},
	handle: {
		width: 36,
		height: 4,
		borderRadius: 2,
		backgroundColor: COLORS.border,
		alignSelf: "center",
		marginTop: 12,
		marginBottom: 4,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	title: {
		fontSize: 16,
		fontWeight: "700",
		color: COLORS.text,
	},
	cancelBtn: {
		fontSize: 15,
		color: COLORS.textMuted,
		fontWeight: "500",
	},
	doneBtn: {
		fontSize: 15,
		color: COLORS.primaryLight,
		fontWeight: "700",
	},
	section: {
		paddingHorizontal: 20,
		marginBottom: 16,
	},
	durationRow: {
		flexDirection: "row",
		gap: 10,
	},
	sliderCard: {
		backgroundColor: COLORS.surface,
		borderRadius: 18,
		padding: 18,
		borderWidth: 1,
		borderColor: COLORS.border,
		gap: 16,
	},
	sliderTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	sliderIcon: { fontSize: 18 },
	sliderTitle: {
		fontSize: 14,
		fontWeight: "700",
		color: COLORS.text,
	},
	sliderSub: {
		fontSize: 12,
		color: COLORS.textMuted,
		marginTop: 2,
	},
	sliderSubBold: {
		color: COLORS.primaryLight,
		fontWeight: "700",
	},
	sliderContainer: {
		alignItems: "center",
	},
});
