import WavyLoader from "@/components/wavyLoader";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "./themed-text";

export interface PomodoroClockProps {
	/** Total session duration in seconds */
	duration: number;
	/** Seconds elapsed so far — parent owns the timer */
	elapsed: number;
	/** Drives the wavy animation on the arc */
	running: boolean;
	/** Current session number, e.g. 2 */
	sessionCurrent: number;
	/** Total number of sessions, e.g. 4 */
	sessionTotal: number;
	/** Called once when elapsed >= duration */
	onComplete: () => void;
}

/** Format seconds → "MM:SS" */
function formatTime(seconds: number): string {
	const remaining = Math.max(0, seconds);
	const m = Math.floor(remaining / 60);
	const s = remaining % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function PomodoroClockInner({
	duration,
	elapsed,
	running,
	sessionCurrent,
	sessionTotal,
	onComplete,
}: PomodoroClockProps) {
	const percentage = duration > 0 ? Math.min(elapsed / duration, 1) : 0;
	const timeRemaining = Math.max(0, duration - elapsed);

	// fire onComplete exactly once when session ends
	const completedRef = useRef(false);
	useEffect(() => {
		if (elapsed >= duration && !completedRef.current) {
			completedRef.current = true;
			onComplete();
		}
		if (elapsed === 0) {
			completedRef.current = false;
		}
	}, [elapsed, duration, onComplete]);
	const primary = useThemeColor({}, "primary");
	return (
		<View style={styles.container}>
			{/* Skia canvas sits behind the text overlay */}
			<WavyLoader percentage={percentage} running={running} />

			{/* Centered text overlay */}
			<View style={styles.overlay} pointerEvents='none'>
				<ThemedText style={styles.time}>{formatTime(timeRemaining)}</ThemedText>
				<Text style={[styles.session, { color: primary }]}>
					{sessionCurrent} of {sessionTotal}
				</Text>
			</View>
		</View>
	);
}

/** Native version — imports WavyLoader directly */
export default function PomodoroClock(props: PomodoroClockProps) {
	return <PomodoroClockInner {...props} />;
}

const styles = StyleSheet.create({
	container: {
		width: 340,
		height: 340,
		alignItems: "center",
		justifyContent: "center",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
	},
	time: {
		fontFamily: "Audiowide",
		fontSize: 64,
		lineHeight: 64,
		alignSelf: "center",
		letterSpacing: 2,
	},
	session: {
		fontSize: 14,
		fontWeight: "600",
		marginTop: 4,
	},
});
