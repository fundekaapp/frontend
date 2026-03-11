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

interface WavyLoaderProps {
	/** 0 to 1 — how far the arc has progressed */
	percentage: number;
	/** When true the arc is animated/wavy; when false it renders as a smooth circle */
	running: boolean;
}

export default function WavyLoader({ percentage, running }: WavyLoaderProps) {
	const size = 500;
	const center = size / 2;
	const baseRadius = 150;
	const amplitude = 5;
	const frequency = 15;

	// ─── animation driver for the wave phase ──────────────────────────────────
	const phase = useSharedValue(0);

	useEffect(() => {
		if (running) {
			phase.value = withRepeat(
				withTiming(Math.PI * 2, {
					duration: 2000,
					easing: Easing.linear,
				}),
				-1,
				false,
			);
		} else {
			// stop the wave by freezing the phase at its current value
			phase.value = phase.value;
		}
	}, [running]);

	// ─── animated percentage value ────────────────────────────────────────────
	const animatedPercentage = useSharedValue(percentage);

	useEffect(() => {
		animatedPercentage.value = withTiming(percentage, {
			duration: 400,
			easing: Easing.out(Easing.quad),
		});
	}, [percentage]);

	// ─── PRIMARY arc (wavy when running) ─────────────────────────────────────
	// Starts at the top (-π/2) and sweeps clockwise.
	// The arc covers `percentage` of the full circle.
	const primaryPath = useDerivedValue(() => {
		const p = Skia.Path.Make();
		const maxAngle = animatedPercentage.value * Math.PI * 2;
		const steps = 200;

		for (let i = 0; i <= steps; i++) {
			const t = (i / steps) * maxAngle - Math.PI / 2;

			// when not running, amplitude collapses to 0 → smooth arc
			const currentAmplitude = running ? amplitude : 0;
			const radius =
				baseRadius + currentAmplitude * Math.sin(frequency * t + phase.value);

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

	// ─── COMPLEMENTARY arc (always smooth) ───────────────────────────────────
	// Starts where the primary arc ends and covers the *remaining* portion of
	// the circle, giving a complementary "ghost" track on the opposite side.
	const complementaryPath = useDerivedValue(() => {
		const p = Skia.Path.Make();

		const primaryAngle = animatedPercentage.value * Math.PI * 2;
		const gapAngle = (12 * Math.PI) / 180; // 8° gap on each side
		// remaining angle minus a gap at each end
		const remainingAngle =
			(1 - animatedPercentage.value) * Math.PI * 2 - gapAngle * 2;

		if (remainingAngle <= 0) return p;

		const steps = 200;
		// start after the gap
		const startAngle = primaryAngle - Math.PI / 2 + gapAngle;

		for (let i = 0; i <= steps; i++) {
			const t = startAngle + (i / steps) * remainingAngle;
			const x = center + baseRadius * Math.cos(t);
			const y = center + baseRadius * Math.sin(t);

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
				{/* Complementary arc — subtle, light purple */}
				<Path
					path={complementaryPath}
					color='#C8B8E8'
					style='stroke'
					strokeWidth={18}
					strokeCap='round'
				/>
				{/* Primary arc — bold purple, wavy when running */}
				<Path
					path={primaryPath}
					color='#6A4FB3'
					style='stroke'
					strokeWidth={18}
					strokeCap='round'
				/>
			</Canvas>
		</View>
	);
}
