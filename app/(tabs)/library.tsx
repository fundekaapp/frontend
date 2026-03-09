import ActivityCard from "@/components/activity-card";
import CourseCard from "@/components/course-card";
import { FlashcardDeckCardProps } from "@/components/flashcard-deck-card";
import Page from "@/components/page";
import { ThemedText } from "@/components/themed-text";
import { database } from "@/hooks/useDatabase";
import { useEffect, useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";

export default function HomeScreen() {
	const { width } = useWindowDimensions();

	const [courses, setCourses] = useState([]);
	const [activities, setActivities] = useState([]);
	const user = "Munyaradzi";

	useEffect(() => {
		console.log("Fetching data...");
		async function fetchData() {
			const courses = await database.getCourses();
			const activityList = await database.getActivities("all");
			setCourses(courses);
			setActivities(activityList);
		}
		fetchData();
		console.log("Courses:", courses);
	}, []);

	return (
		<Page>
			<ThemedText type='display'>Welcome Back</ThemedText>
			<ThemedText type='display'>{user}</ThemedText>
			<ScrollView
				horizontal
				style={{
					overflow: "hidden",
					width: "100%",
					height: 215,
				}}
			>
				{courses.map((course: FlashcardDeckCardProps, y) => (
					<CourseCard key={y} {...course} />
				))}
			</ScrollView>
			<ThemedText type='link'>Show all</ThemedText>
			<ThemedText type='display'>Recent Activities</ThemedText>
			{/* responsive grid: two items per row when viewport width > 800px */}
			<ScrollView
				contentContainerStyle={{
					flexDirection: "row",
					flexWrap: "wrap",
				}}
				style={{ width: "100%", maxWidth: 800 }}
				showsVerticalScrollIndicator={width < 800}
			>
				{activities.map((activity, y) => {
					const itemStyle = {
						width: width > 800 ? "50%" : "100%",
					};
					return (
						<View key={y} style={itemStyle}>
							<ActivityCard {...activity} />
						</View>
					);
				})}
			</ScrollView>
		</Page>
	);
}
