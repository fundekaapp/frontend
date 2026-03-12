import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import Page from "@/components/page";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import WeeklyBarChart from "@/components/weekly-bar-chart";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

//
//
export default function StatsScreen() {
	const [chartData, setChartData] = useState([
		{ day: "M", stat: 2 },
		{ day: "T", stat: 9.5 },
		{ day: "W", stat: 3.5 },
		{ day: "T", stat: 7.5 },
		{ day: "F", stat: 2.5 },
		{ day: "S", stat: 2.5 },
		{ day: "S", stat: 3 },
	]);
	const onPrimary = useThemeColor({}, "onPrimary");
	const primary = useThemeColor({}, "primary");
	const secondary = useThemeColor({}, "secondary");
	const onSecondary = useThemeColor({}, "onSecondary");
	const calendarButtonColor = useThemeColor({}, "surfaceBright");
	const textColor = useThemeColor({}, "text");
	return (
		<Page style={{ justifyContent: "flex-start", maxWidth: 500 }}>
			<ThemedText type='title'>Today</ThemedText>
			<View style={styles.statsHeaderContainer}>
				<View style={[styles.statsHeader, { backgroundColor: secondary }]}>
					<ThemedText style={{ color: onSecondary }}>Concepts</ThemedText>
					<ThemedText style={[styles.statsHeaderValue, { color: onSecondary }]}>
						33/62
					</ThemedText>
				</View>
				<View style={[styles.statsHeader, { backgroundColor: primary }]}>
					<ThemedText style={{ color: onPrimary }}>Focus</ThemedText>
					<ThemedText style={[styles.statsHeaderValue, { color: onSecondary }]}>
						11h 25m
					</ThemedText>
				</View>
			</View>
			<View style={styles.graphControlsContainer}>
				<ThemedText style={styles.graphControlsTitle} type='title'>
					This Week
				</ThemedText>
				<ButtonGroup>
					<Button
						icon='chevron.left'
						backgroundColor={calendarButtonColor}
						type='pill-narrow'
						textColor={textColor}
					/>
					<Button
						icon='chevron.right'
						backgroundColor={calendarButtonColor}
						type='pill-narrow'
						textColor={textColor}
					/>
					<Button
						icon='calendar'
						backgroundColor={calendarButtonColor}
						type='circle'
						textColor={textColor}
					/>
				</ButtonGroup>
			</View>
			<View style={styles.dayStatsTextContainer}>
				<ThemedText style={styles.statsHeaderValue}>11h 25m</ThemedText>
				<ThemedText style={{ alignSelf: "flex-end", marginLeft: 16 }}>
					Focus per day (avg)
				</ThemedText>
			</View>
			<ThemedText>
				You hit your goal on 2 days and studied for a total of 22 hours
			</ThemedText>
			<WeeklyBarChart
				data={chartData}
				threshold={5} // bars at or above 5 turn teal + get sun icon
				maxValue={12}
				yLabels={["0h", "3h", "6h", "9h", "12h"]}
			/>
			<View style={styles.peakSegmentContainer}>
				<View
					style={[
						styles.peakSegmentIconContainer,
						{ backgroundColor: primary },
					]}
				>
					<IconSymbol
						style={{ alignSelf: "center" }}
						color={onPrimary}
						size={36}
						name='chart.xyaxis.line'
					/>
				</View>
				<View style={styles.peakSegmentTextContainer}>
					<ThemedText style={styles.peakSegmentSubtleText}>
						Peak Segment
					</ThemedText>
					<ThemedText type='subtitle'>Tuesday</ThemedText>
					<ThemedText style={styles.peakSegmentSubtleText}>9h 33m</ThemedText>
				</View>
			</View>
		</Page>
	);
}

const styles = StyleSheet.create({
	statsHeaderContainer: {
		display: "flex",
		justifyContent: "center",
		flexDirection: "row",
		marginTop: 8,
	},
	peakSegmentContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginTop: 8,
	},
	peakSegmentSubtleText: {
		opacity: 0.5,
	},
	peakSegmentIconContainer: {
		display: "flex",
		alignContent: "center",
		justifyContent: "center",
		width: 72,
		height: 72,
		borderRadius: 36,
	},
	peakSegmentTextContainer: {
		marginLeft: 12,
	},
	statsHeader: {
		height: 96,
		width: 160,
		padding: 8,
		borderRadius: 16,
		display: "flex",
		paddingVertical: 16,
		marginHorizontal: 4,
	},
	graphControlsContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginVertical: 16,
	},
	dayStatsTextContainer: {
		display: "flex",
		flexDirection: "row",
		marginVertical: 16,
	},
	statsHeaderValue: {
		fontFamily: "Audiowide",
		fontSize: 32,
		marginTop: 8,
		alignSelf: "center",
	},
	graphControlsTitle: {
		alignSelf: "center",
	},
});
