import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import startWorkout from "../screens/startWorkout.js";


const Stack = createNativeStackNavigator();

export default function StartWorkoutNav() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="start">
				<Stack.Screen
					name="start"
					component={startWorkout}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}