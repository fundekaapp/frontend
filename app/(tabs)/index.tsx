import ActivityCard from "@/components/activity-card";
import DeckCarousel from "@/components/DeckCarousel";
import Page from "@/components/page";
import { ThemedText } from "@/components/themed-text";
import { database } from "@/hooks/useDatabase";
import { useEffect, useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";

export default function HomeScreen() {
	const { width } = useWindowDimensions();

	const [flashcardDecks, setFlashcardDecks] = useState([]);
	const [activities, setActivities] = useState([]);
	const user = "Munyaradzi";

	useEffect(() => {
		async function fetchData() {
			const decks = await database.getFlashcardDecks([]);
			const activityList = await database.getActivities("all");
			setFlashcardDecks(decks);
			setActivities(activityList);
		}
		fetchData();
	}, []);

	return (
		<Page>
			<ThemedText type='display'>Welcome Back</ThemedText>
			<ThemedText type='display'>{user}</ThemedText>
			{flashcardDecks && <DeckCarousel decks={flashcardDecks} />}
			<ThemedText type='link'>Show all</ThemedText>
			<ThemedText type='display'>Recent Activities</ThemedText>
			{/* responsive grid: two items per row when viewport width > 800px */}
			<ScrollView
				contentContainerStyle={{
					flexDirection: "row",
					flexWrap: "wrap",
					paddingBottom: 50,
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
