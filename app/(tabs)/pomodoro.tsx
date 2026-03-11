import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import PomodoroClock from "@/components/pomodoroClock";
import PomodoroSettingsModal from "@/components/pomodoroSettingsModal";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PomodoroProvider, usePomodoro } from "@/context/PomodoroContext";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

/** Format seconds → "MM:SS" */
function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function PomodoroScreenInner() {
	const {
		settings,
		running,
		elapsed,
		currentSession,
		nextSession,
		sessionCurrent,
		sessionTotal,
		play,
		pause,
		restart,
		skip,
		onComplete,
	} = usePomodoro();

	const isRunning = running;
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<View style={styles.screen}>
			{/* ── Header ── */}
			<Pressable onPress={() => setSettingsOpen(true)}>
				<IconSymbol name='gear' color={"#fff"} />
			</Pressable>
			<Text style={styles.title}>{currentSession.label}</Text>
			{settingsOpen && (
				<PomodoroSettingsModal
					visible={settingsOpen}
					onClose={() => setSettingsOpen(false)}
				/>
			)}

			{/* ── Clock ── */}
			<View style={styles.clockWrapper}>
				<PomodoroClock
					duration={currentSession.duration}
					elapsed={elapsed}
					running={isRunning}
					sessionCurrent={sessionCurrent}
					sessionTotal={sessionTotal}
					onComplete={onComplete}
				/>
			</View>

			{/* ── Controls ── */}
			<ButtonGroup>
				<Button
					size='large'
					icon={isRunning ? "pause.fill" : "play.fill"}
					onPress={isRunning ? pause : play}
				/>
				<Button
					type='circle'
					size='large'
					icon='arrow.counterclockwise'
					onPress={restart}
				/>
				<Button
					type='pill-narrow'
					size='large'
					icon='forward.end.fill'
					onPress={skip}
				/>
			</ButtonGroup>

			{/* ── Up next ── */}
			{nextSession && (
				<View style={styles.upNext}>
					<Text style={styles.upNextLabel}>Up next</Text>
					<Text style={styles.upNextTime}>
						{formatTime(nextSession.duration)}
					</Text>
					<Text style={styles.upNextSession}>{nextSession.label}</Text>
				</View>
			)}
		</View>
	);
}

export default function PomodoroScreen() {
	return (
		<PomodoroProvider>
			<PomodoroScreenInner />
		</PomodoroProvider>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: "#0D0D0F",
		gap: 32,
		position: "relative",
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		color: "#FFFFFF",
		letterSpacing: 0.3,
	},
	clockWrapper: {
		alignItems: "center",
		justifyContent: "center",
	},
	upNext: {
		alignItems: "center",
		gap: 2,
	},
	upNextLabel: {
		fontSize: 12,
		fontWeight: "500",
		color: "#6A6A7A",
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	upNextTime: {
		fontSize: 22,
		fontWeight: "700",
		color: "#C8B8E8",
		letterSpacing: 1,
	},
	upNextSession: {
		fontSize: 13,
		fontWeight: "500",
		color: "#6A6A7A",
	},
});
