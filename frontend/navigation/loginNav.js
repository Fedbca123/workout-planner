import React from "react";
import Login from "../screens/login.js";
import Register from "../screens/registration.js";
import AdminPage from "../screens/adminPage.js";
import HomeNav from "./homeNav.js";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useGlobalState } from "../../GlobalState.js";
import HomeHeader from "../component/homeHeader.js";
import ChooseTemplate from "../screens/chooseTemplate.js";
import DTRpicker from "../screens/dateTimeRepsPicker.js";
import ExerciseSearch from "../screens/exerciseSearch.js";
import Finalize from "../screens/finalizeWorkout.js";
import startWorkout from "../screens/startWorkout.js";
import CustomExercise from "../screens/customExercise.js";

const Stack = createNativeStackNavigator();

export default function LoginNav() {
	const [globalState, updateGlobalState] = useGlobalState();
	var header;
	if (globalState.user == null) header = "null";
	else header = "Hello " + globalState.user.firstName + "!";
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="login">
				<Stack.Screen
					name="login"
					component={Login}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="home"
					component={HomeNav}
					options={{ header: HomeHeader }}
				/>
				<Stack.Screen
					name="chooseTemplate"
					component={ChooseTemplate}
				/>
				<Stack.Screen
					name="registration"
					component={Register}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="admin"
					component={AdminPage}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="start"
					component={startWorkout}
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="dateTimeRepsPicker" component={DTRpicker} />
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
