import { useThemeColor } from "@/hooks/use-theme-color"; // adjust path as needed
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

// --- Types ---
interface DayStat {
	day: string;
	stat: number;
}

interface WeeklyBarChartProps {
	data: DayStat[];
	threshold: number;
	maxValue?: number;
	yLabels?: string[];
}

// --- Main Component ---
const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({
	data,
	threshold,
	maxValue,
	yLabels,
}) => {
	const primary = useThemeColor({}, "primary");
	const secondary = useThemeColor({}, "secondary");
	const surface = useThemeColor({}, "surfaceBright");
	const textColor = useThemeColor({}, "text");

	const CHART_HEIGHT = 200;
	const BAR_WIDTH = 36;
	const BAR_RADIUS = 18;
	const Y_AXIS_WIDTH = 36;

	const derivedMax = maxValue ?? Math.max(...data.map((d) => d.stat)) * 1.25;

	const animatedHeights = useRef(data.map(() => new Animated.Value(0))).current;

	useEffect(() => {
		const animations = data.map((item, i) => {
			const targetHeight = Math.min(item.stat / derivedMax, 1) * CHART_HEIGHT;
			return Animated.spring(animatedHeights[i], {
				toValue: targetHeight,
				useNativeDriver: false,
				tension: 60,
				friction: 10,
				delay: i * 60,
			});
		});
		Animated.parallel(animations).start();
	}, [data, derivedMax]);

	const resolvedYLabels = yLabels ?? ["0h", "3h", "6h", "9h", "12h"];

	return (
		<View style={[styles.wrapper, { backgroundColor: surface, maxWidth: 400 }]}>
			<View style={styles.chartArea}>
				{/* Y-Axis Labels */}
				<View style={[styles.yAxis, { height: CHART_HEIGHT }]}>
					{resolvedYLabels.map((label, i) => {
						const bottom = (i / (resolvedYLabels.length - 1)) * CHART_HEIGHT;
						return (
							<Text
								key={`${label}-${i}`}
								style={[
									styles.yLabel,
									{ bottom: bottom - 8, color: textColor },
								]}
							>
								{label}
							</Text>
						);
					})}
				</View>

				{/* Bars + Threshold line */}
				<View style={{ flex: 1 }}>
					{/* Threshold line */}
					<View
						style={[
							styles.thresholdLine,
							{
								bottom: (threshold / derivedMax) * CHART_HEIGHT,
								backgroundColor: textColor,
								opacity: 0.15,
							},
						]}
					/>

					{/* Bars */}
					<View style={[styles.barsRow, { height: CHART_HEIGHT }]}>
						{data.map((item, i) => {
							const isAbove = item.stat >= threshold;
							const barBg = !isAbove ? primary : secondary;

							return (
								<View
									key={`${item.day}-${i}`}
									style={[styles.barColumn, { width: BAR_WIDTH }]}
								>
									<Animated.View
										style={[
											styles.bar,
											{
												height: animatedHeights[i],
												backgroundColor: barBg,
												width: BAR_WIDTH,
												borderTopLeftRadius: BAR_RADIUS,
												borderTopRightRadius: BAR_RADIUS,
												borderBottomLeftRadius: BAR_RADIUS,
												borderBottomRightRadius: BAR_RADIUS,
											},
										]}
									/>
								</View>
							);
						})}
					</View>
				</View>
			</View>

			{/* Day labels */}
			<View style={[styles.dayLabelsRow, { paddingLeft: Y_AXIS_WIDTH }]}>
				{data.map((item, i) => (
					<View
						key={`label-${item.day}-${i}`}
						style={{ width: BAR_WIDTH + 8, alignItems: "center" }}
					>
						<Text style={[styles.dayLabel, { color: textColor, opacity: 0.5 }]}>
							{item.day}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		borderRadius: 20,
		padding: 16,
		paddingBottom: 8,
		width: "100%",
		alignSelf: "center",
		marginVertical: 16,
	},
	chartArea: {
		flexDirection: "row",
		alignItems: "flex-end",
	},
	yAxis: {
		width: 36,
		position: "relative",
	},
	yLabel: {
		position: "absolute",
		right: 4,
		fontSize: 11,
		fontWeight: "500",
	},
	barsRow: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-around",
		flex: 1,
		position: "relative",
	},
	barColumn: {
		alignItems: "center",
		justifyContent: "flex-end",
	},
	bar: {
		minHeight: 8,
	},
	thresholdLine: {
		position: "absolute",
		left: 0,
		right: 0,
		height: 1.5,
		zIndex: 5,
	},
	dayLabelsRow: {
		flexDirection: "row",
		marginTop: 6,
	},
	dayLabel: {
		fontSize: 12,
		fontWeight: "600",
	},
});

export default WeeklyBarChart;

// ─── USAGE EXAMPLE ──────────────────────────────────────────────────────────
//
// <WeeklyBarChart
//   data={[
//     { day: 'M', stat: 2 },
//     { day: 'T', stat: 5.5 },
//     { day: 'W', stat: 3.5 },
//     { day: 'T', stat: 9.5 },
//     { day: 'F', stat: 2.5 },
//     { day: 'S', stat: 2.5 },
//     { day: 'S', stat: 3 },
//   ]}
//   threshold={5}
//   maxValue={12}
//   yLabels={['0h', '3h', '6h', '9h', '12h']}
// />
