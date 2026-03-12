import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import HeaderButton from "@/components/header-button";
import Page from "@/components/page";
import PomodoroClock from "@/components/pomodoroClock";
import PomodoroSettingsModal from "@/components/pomodoroSettingsModal";
import { ThemedText } from "@/components/themed-text";
import { PomodoroProvider, usePomodoro } from "@/context/PomodoroContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

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
	const textColor = useThemeColor({}, "text");
	const primary = useThemeColor({}, "primary");
	const onPrimary = useThemeColor({}, "onPrimary");
	return (
		<Page style={styles.screen}>
			<Stack.Screen
				options={{
					headerRight: () => (
						<HeaderButton
							onPress={() => setSettingsOpen(true)}
							icon='gear'
							color={textColor}
						/>
					),
				}}
			/>
			{/* ── Header ── */}
			<ThemedText type='display' style={styles.sessionLabel}>
				{currentSession.label}
			</ThemedText>
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
					backgroundColor={primary}
					textColor={onPrimary}
				/>
				<Button
					type='circle'
					size='large'
					icon='arrow.counterclockwise'
					onPress={restart}
					backgroundColor={primary}
					textColor={onPrimary}
				/>
				<Button
					type='pill-narrow'
					size='large'
					icon='forward.end.fill'
					onPress={skip}
					backgroundColor={primary}
					textColor={onPrimary}
				/>
			</ButtonGroup>

			{/* ── Up next ── */}
			{nextSession && (
				<View style={styles.upNext}>
					<ThemedText style={styles.upNextLabel}>Up next</ThemedText>
					<ThemedText style={[styles.upNextTime, { color: primary }]}>
						{formatTime(nextSession.duration)}
					</ThemedText>
					<ThemedText style={styles.upNextSession}>
						{nextSession.label}
					</ThemedText>
				</View>
			)}
		</Page>
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
		gap: 32,
		position: "relative",
	},
	sessionLabel: {
		alignSelf: "center",
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
		alignSelf: "center",
		fontWeight: "500",
		opacity: 0.6,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	upNextTime: {
		fontSize: 22,
		fontFamily: "Audiowide",
		alignSelf: "center",
		letterSpacing: 1,
	},
	upNextSession: {
		alignSelf: "center",
		opacity: 0.6,
		fontSize: 13,
		fontWeight: "500",
	},
});
