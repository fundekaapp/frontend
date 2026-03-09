import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
	runOnJS,
	useAnimatedReaction,
	useDerivedValue,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./themed-text";

interface Props {
	width: number;
	height: number;
	stroke: number;
	progress: number;
	color: string;
}

export default function CircularProgress({
	width,
	height,
	stroke,
	progress,
	color,
}: Props) {
	const size = Math.min(width, height);
	const radius = (size - stroke) / 2;
	const center = size / 2;

	const backgroundPath = useMemo(() => {
		const p = Skia.Path.Make();
		p.addCircle(center, center, radius);
		return p;
	}, [center, radius]);

	const foregroundPath = useMemo(() => {
		const p = Skia.Path.Make();
		p.addArc(
			{
				x: center - radius,
				y: center - radius,
				width: radius * 2,
				height: radius * 2,
			},
			-90,
			360,
		);
		return p;
	}, [center, radius]);

	const animatedProgress = useSharedValue(0);
	const [displayPercentage, setDisplayPercentage] = useState(0);
	const [canvasKey, setCanvasKey] = useState(0); // 👈 key to force remount

	useEffect(() => {
		// Reset and remount the canvas on each mount to get a fresh WebGL context
		animatedProgress.value = 0;
		setCanvasKey((k) => k + 1); // 👈 triggers Canvas remount

		const timer = setTimeout(() => {
			animatedProgress.value = withTiming(progress, { duration: 1000 });
		}, 50); // 👈 small delay lets the new Canvas context initialize

		return () => {
			clearTimeout(timer);
			animatedProgress.value = 0;
		};
	}, [progress]);

	const animatedEnd = useDerivedValue(() => animatedProgress.value);

	useAnimatedReaction(
		() => Math.round(animatedProgress.value * 100),
		(current, previous) => {
			if (current !== previous) {
				runOnJS(setDisplayPercentage)(current);
			}
		},
	);

	return (
		<View style={{ width: size, height: size }}>
			<Canvas
				key={canvasKey} // 👈 forces a fresh Canvas + WebGL context
				style={{ width: size + stroke, height: size }}
			>
				<Path
					path={foregroundPath}
					style='stroke'
					strokeWidth={stroke}
					color={color}
					strokeCap='round'
					start={0}
					end={animatedEnd}
				/>
			</Canvas>
			<View style={styles.center}>
				<ThemedText style={styles.text}>{displayPercentage}%</ThemedText>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	center: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	text: {
		fontSize: 10,
		alignSelf: "center",
		fontWeight: "600",
	},
});
