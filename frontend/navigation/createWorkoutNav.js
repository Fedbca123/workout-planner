import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useGlobalState } from "../../GlobalState.js";
import ChooseTemplate from "../screens/chooseTemplate.js";
import ExerciseSearch from "../screens/exerciseSearch.js";
import Finalize from "../screens/finalizeWorkout.js";
import startWorkout from "../screens/startWorkout.js";
import CustomExercise from "../screens/customExercise.js";

const Stack = createNativeStackNavigator();

export default function CreateWorkoutNav() {
	const [globalState, updateGlobalState] = useGlobalState();
	var header;
	if (globalState.user == null) header = "null";
	else header = "Hello " + globalState.user.firstName + "!";
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="chooseTemplate">
				<Stack.Screen
					name="chooseTemplate"
					component={ChooseTemplate}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="start"
					component={startWorkout}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="exerciseSearch"
					component={ExerciseSearch}
				/>
				<Stack.Screen name="finalizeWorkout" component={Finalize} />
				<Stack.Screen name="customExercise" component={CustomExercise} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}