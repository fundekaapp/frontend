import ActivityCard from "@/components/activity-card";
import Page from "@/components/page";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useContext } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { CourseContext } from "./_layout";

const Course = () => {
	const backgroundColor = useThemeColor({}, "background");
	const onPrimary = useThemeColor({}, "onPrimary");
	const { course, lessons } = useContext(CourseContext);
	const { width } = useWindowDimensions();

	return (
		<Page style={{ paddingTop: 10, flex: 1 }}>
			<ParallaxScrollView
				headerBackgroundColor={{
					dark: backgroundColor,
					light: backgroundColor,
				}}
				headerImage={
					<View
						style={{
							backgroundColor: "#C8BFFF",
							height: 240,
							borderRadius: 24,
						}}
					>
						<ThemedText style={{ color: onPrimary }} type='display'>
							{course.title}
						</ThemedText>
					</View>
				}
			>
				<View
					style={{
						width: "100%",
						maxWidth: 800,
						flexDirection: "row",
						flexWrap: "wrap",
					}}
				>
					{lessons.map((activity, y) => {
						const itemStyle = {
							width: width > 800 ? "50%" : "100%",
						};
						return (
							<View key={y} style={itemStyle}>
								<ActivityCard {...activity} />
							</View>
						);
					})}
				</View>
			</ParallaxScrollView>
		</Page>
	);
};

export default Course;

const styles = StyleSheet.create({});
