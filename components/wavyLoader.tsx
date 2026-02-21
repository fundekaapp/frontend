import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { View } from "react-native";
import {
	Easing,
	useDerivedValue,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

export default function WavyLoader() {
	const size = 500;
	const center = size / 2;
	const baseRadius = 150;
	const amplitude = 5;
	const frequency = 15;

	const phase = useSharedValue(0);
	const progress = useSharedValue(1);

	useEffect(() => {
		phase.value = withRepeat(
			withTiming(Math.PI * 2, {
				duration: 2000,
				easing: Easing.linear,
			}),
			-1,
			false,
		);

		progress.value = withTiming(0, {
			duration: 50000,
			easing: Easing.linear,
		});
	}, []);

	const path = useDerivedValue(() => {
		const p = Skia.Path.Make();
		const maxAngle = progress.value * Math.PI * 2;
		const steps = 200;

		for (let i = 0; i <= steps; i++) {
			const t = (i / steps) * maxAngle - Math.PI / 2;

			const radius =
				baseRadius + amplitude * Math.sin(frequency * t + phase.value);

			const x = center + radius * Math.cos(t);
			const y = center + radius * Math.sin(t);

			if (i === 0) {
				p.moveTo(x, y);
			} else {
				p.lineTo(x, y);
			}
		}

		return p;
	});

	return (
		<View>
			<Canvas style={{ width: size, height: size }}>
				<Path
					path={path}
					color='#6A4FB3'
					style='stroke'
					strokeWidth={8}
					strokeCap='round'
				/>
			</Canvas>
		</View>
	);
}
