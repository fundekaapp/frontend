import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { TabBar } from "@/components/TabBar";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			tabBar={(props) => <TabBar {...props} />}
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: true,
				tabBarButton: HapticTab,
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: "Home",
					animation: "shift",
				}}
			/>
			<Tabs.Screen
				name='library'
				options={{
					title: "Library",
					animation: "shift",
				}}
			/>
			<Tabs.Screen
				name='stats'
				options={{
					title: "Stats",
					animation: "shift",
				}}
			/>
			<Tabs.Screen
				name='pomodoro'
				options={{
					title: "Pomodoro",
					animation: "shift",
				}}
			/>
		</Tabs>
	);
}
