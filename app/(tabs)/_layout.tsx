import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { TabBar } from "@/components/TabBar";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const color = useThemeColor({}, "background");

	return (
		<Tabs
			tabBar={(props) => <TabBar {...props} />}
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerStyle: { backgroundColor: color },
				headerShown: true,
				headerShadowVisible: false,
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
					headerTitle: "Study Stats",
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
