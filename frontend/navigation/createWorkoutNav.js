import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChooseTemplate from "../screens/chooseTemplate.js";
import ExerciseSearch from "../screens/exerciseSearch.js";
import Finalize from "../screens/finalizeWorkout.js";
import startWorkout from "../screens/startWorkout.js";
import CustomExercise from "../screens/customExercise.js";
import FinalizedContinued from "../screens/finalizedContinued.js";

const Stack = createNativeStackNavigator();

export default function CreateWorkoutNav() {
	return (
		<Stack.Navigator initialRouteName="chooseTemplate">
			<Stack.Screen
				name="chooseTemplate"
				component={ChooseTemplate}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="start"
				component={startWorkout}
				// options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="exerciseSearch"
				component={ExerciseSearch}
				// options={{ headerShown: false }}
			/>
			<Stack.Screen 
				name="finalizeWorkout" 
				component={Finalize} 
				// options={{ headerShown: false }}
			/>
			<Stack.Screen 
				name="finalizedContinued" 
				component={FinalizedContinued} 
				// options={{ headerShown: false }}
			/>
			<Stack.Screen 
				name="customExercise" 
				component={CustomExercise}
				options={{ headerShown: false }} 
			/>
		</Stack.Navigator>
	);
}