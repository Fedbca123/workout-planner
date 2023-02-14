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
import reactDom, { render } from "react-dom";
import Workouts from "./workout.js";
import { useNavigation } from "@react-navigation/native";
import config from "../../config";
import axios from "axios";
const baseUrl = config.API_URL + config.PORT + "/";

export default function ChooseTemplate(props) {
	function loadWorkouts() {
		axios.get(baseUrl + "/").then((response) => {
			if (response.status === 200) {
				return <Workouts data={response.data} />;
			}
		});
	}
	const SECTIONS = [
		{
			title: "Leg Day",
			duration:45,
			location:"Gold's Gym",
			content: [
				{
					title: "Deadlift",
					ExerciseType: "SETSXREPS",
					sets: 3,
					reps: 10,
				},
				{
					title: "Front Squats",
					ExerciseType: "SETSXREPS",
					sets: 4,
					reps: 12,
				},
				{
					title: "Calf Raises",
					ExerciseType: "AMRAP",
					time: 60000,
				},
				{
					title: "Bulgarian Split Squats",
					ExerciseType: "SETSXREPS",
					sets: 3,
					reps: 10,
				},
				{
					title: "Leg Press",
					ExerciseType: "SETSXREPS",
					sets: 4,
					reps: 12,
				},
				{
					title: "Lunges",
					ExerciseType: "SETSXREPS",
					sets: 3,
					reps: 15,
				},
			],
		},
	];
	const sections = [
		{
			title: "Heavy Chest Day",
			duration:70,
			location:"L.A. Fitness",
			content: [
				{
					title: "Barbell Bench Press",
					ExerciseType: "SETSXREPS",
					sets: 3,
					reps: 10,
				},
				{
					title: "Incline Dumbbell Press",
					ExerciseType: "SETSXREPS",
					sets: 3,
					reps: 8,
				},
				{
					title: "Decline Barbell Bench Press",
					ExerciseType: "SETSXREPS",
					sets: 3,
					reps: 8,
				},
				{
					title: "Pec Fly",
					ExerciseType: "AMRAP",
					time: 60000,
				},
			],
		},
	];

	return (
		<SafeAreaView style={styles.Background}>
			<Text style={styles.HeaderText}>Your Saved Workouts</Text>
			<Workouts data={SECTIONS} showButton={true} showInput={false} />
			<Text styles={styles.HeaderText}>Workout Templates</Text>
			<Workouts data={sections} showButton={true} showInput={false} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	Background: {
		backgroundColor: "white",
		// flex: 1,
	},
	HeaderText: {
		fontSize: 20,
    	fontWeight: 'bold',
	},
});
