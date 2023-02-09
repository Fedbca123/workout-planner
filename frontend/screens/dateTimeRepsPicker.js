import {
	StyleSheet,
	Button,
	TouchableOpacity,
	Text,
	Image,
	View,
	SafeAreaView,
	TextInput,
	FlatList,
} from "react-native";
import React from "react";
import Workouts from "./workout.js";
import { useGlobalState } from "../../GlobalState.js";
import { useNavigation } from "@react-navigation/native";
import config from "../../config";
import axios from "axios";
const baseUrl = config.API_URL + config.PORT + "/";

export default function DateTimeRepsPicker(props) {
	const [globalState, updateGlobalState] = useGlobalState();
	const navigation = useNavigation();

	function addWorkoutToUser(workout) {
		axios
			.post(baseUrl + "/:" + globalState.user.id, {
				scheduledWorkouts: globalState.workout,
			})
			.then((response) => {
				if (response.status === 200) {
					navigation.navigate("home");
				}
			});
	}

	return (
		<SafeAreaView>
			<Text>When will this workout be?</Text>
			{/* This is where the Integration to the Calendar Page will go */}
			<Text>Where are you going to be working out?</Text>
			{/* Integeration with Google Maps API will be here */}
			<Text>Will this workout be reoccurring?</Text>
			{/* Button to change it to true */}
			<Workouts
				data={globalState.workout}
				showButton={false}
				showInput={true}
			/>
			<Button
				onPress={() => {
					// addWorkoutToUser();
					navigation.navigate("home");
					updateGlobalState("workoutScheduled", globalState.workout);
				}}
				title="Add Workout"
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	addWorkoutBttn: {
		flexDirection: "row",
		backgroundColor: "#F1F3FA",
		margin: 30,
		padding: 15,
	},
});
