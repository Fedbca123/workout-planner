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
	ScrollView,
	Alert,
} from "react-native";
import React, { useEffect } from "react";
import reactDom from "react-dom";
import axios from "axios";
import config from "../../config";
import { useGlobalState } from "../../GlobalState.js";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-screens";
import WorkOuts from "./workout";
import HomeNav from "../navigation/homeNav";

const baseUrl = config.API_URL + config.PORT + '/';

export default function ExerciseSearch(props) {
	const navigation = useNavigation();
	const [globalState, updateGlobalState] = useGlobalState();
	const exercises = [
		{
			title: "Romanian Deadlift",
			muscleGroups: ["Hamstrings", "Lower Back", "Glutes"],
		},
		{
			title: "Barbell Bench Press",
			muscleGroups: ["Chest", "triceps", "shoulders"],
		},
		{
			title: "Preacher Curls",
			muscleGroups: ["Biceps"],
		},
		{
			title:"Lunges",
			muscleGroups: ["Quads"],
		},
		{
			title:"Skullcrushers",
			muscleGroups:["triceps", "Upper Chest"]
		},
		{
			title:"Deadman hangs",
			muscleGroups:["forearms"]
		},
		{
			title:"Barbell Front Squats",
			muscleGroups:["Hamstrings", "glutes"]
		}
	];

	function loadExercises() {

		// console.log(globalState.user._id);
		axios.post(baseUrl + "exercises/search", {
			ownerId: globalState.user._id
		}).then((response) => {
			if (response.status == 200) {
				return response.data.exercises;
			}
		}).catch((e) => {
			console.log(e);
			// Alert.alert(e);
		})
	}

	return (
		<SafeAreaView >
			<SearchBar placeholder="Enter exercise names or muscle groups you wish to train!"></SearchBar>
			<WorkOuts data={globalState.workout} />
			<Text style={styles.TitleText}>Exercises:</Text>
			<FlatList
				data={loadExercises()}
				keyExtractor={(item) => item.title}
				renderItem={({ item }) => (
					<View style={styles.ExerciseCard}>
						<TouchableOpacity
							onPress={() => {
								globalState.workout[0].content.push(item);
								Alert.alert("Exercise Added to workout!");
								
							}}
						>
						{/* <TouchableOpacity onPress={useEffect(() => {
						  	globalState.workout[0].content.push(item);
							Alert.alert("Exercise Added to workout!");
						  return () => {
							<WorkOuts data={globalState.workout} />
						  }
						}, [globalState.workout[0].content.length])
						}> */}
							{/* Image component Here */}
							<Text>{item.title}</Text>
							{/* Button to take user to page about info for the workout */}
						</TouchableOpacity>
					</View>
				)}
			/>
			<Button
				title="Finalize Workout"
				onPress={() => {
					// updateGlobalState("workout", userWorkout);
					navigation.navigate("finalizeWorkout");
				}}
			/>
			<Button title="Custom Exercise" onPress={() => {
				// updateGlobalState("workout", userWorkout);
				navigation.navigate("customExercise");
			}} />
			{/* <HomeNav/> */}
			
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	ExerciseCard: {
		backgroundColor: "#F1F3FA",
		padding: 20,
		marginBottom: 0,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
		borderRadius: 15,
	},
	TitleText:{
		fontSize: 20,
    	fontWeight: 'bold',
	}
});
