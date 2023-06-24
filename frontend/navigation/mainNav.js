import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeNav from './homeNav.js';
import StartWorkout from "../screens/startWorkout.js";
import HomeHeader from "../component/homeHeader.js";
import CreateWorkoutHeader from "../component/createWorkoutHeader.js";
import CreateWorkout from "../screens/createWorkout.js";

const Stack = createNativeStackNavigator();

export default function MainNav() {
    
	return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={HomeNav}
                options={{ header: HomeHeader }}
            />
            <Stack.Screen
                name="createWorkout"
                component={CreateWorkout}
                // options={{ headerShown: false }}
                options={{ header: CreateWorkoutHeader}}
            />
            <Stack.Screen
				      name="start"
				      component={StartWorkout}
				      options={{ headerShown: false }}
			      />
        </Stack.Navigator>
	);
}