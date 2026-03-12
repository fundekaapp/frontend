import { useThemeColor } from "@/hooks/use-theme-color";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import type { PomodoroClockProps } from "./pomodoroClock";
import { ThemedText } from "./themed-text";

/** Format seconds → "MM:SS" */
function formatTime(seconds: number): string {
	const remaining = Math.max(0, seconds);
	const m = Math.floor(remaining / 60);
	const s = remaining % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Web version — loads the Skia canvas asynchronously via WithSkiaWeb */
export default function PomodoroClockWeb({
	duration,
	elapsed,
	running,
	sessionCurrent,
	sessionTotal,
	onComplete,
}: PomodoroClockProps) {
	const percentage = duration > 0 ? Math.min(elapsed / duration, 1) : 0;
	const timeRemaining = Math.max(0, duration - elapsed);
	const primary = useThemeColor({}, "primary");
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

	return (
		<View style={styles.container}>
			{/* Skia canvas loaded async for web */}
			<WithSkiaWeb
				opts={{ locateFile: (file) => `/canvaskit/${file}` }}
				getComponent={() => import("@/components/wavyLoader")}
				componentProps={{ percentage, running }}
				fallback={<View style={styles.fallback} />}
			/>

			{/* Centered text overlay — native Views work fine on web */}
			<View style={styles.overlay} pointerEvents='none'>
				<ThemedText style={styles.time}>{formatTime(timeRemaining)}</ThemedText>
				<ThemedText style={[styles.session, { color: primary }]}>
					{sessionCurrent} of {sessionTotal}
				</ThemedText>
			</View>
		</View>
	);
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
	fallback: {
		width: 340,
		height: 340,
	},
	time: {
		fontFamily: "Audiowide",
		alignSelf: "center",
		fontSize: 64,
		fontWeight: "700",
		color: "#FFFFFF",
		letterSpacing: 2,
		marginTop: 60,
	},
	session: {
		fontSize: 14,
		alignSelf: "center",
		fontWeight: "600",
		marginTop: 55,
	},
});
