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
import reactDom from "react-dom";
import axios from "axios";
import config from "../../config";
import { useGlobalState } from "../../GlobalState.js";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-screens";
// import { FlatList } from "react-native-web";

export default function ExerciseSearch(props) {
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
	];
	return (
		<View>
			<SearchBar placeholder="Enter exercise names or muscle groups you wish to train!"></SearchBar>
			<Text>Saved Workouts</Text>
			<FlatList data={exercises} />
		</View>
	);
}

const styles = StyleSheet.create({
	ExerciseCard: {
		backgroundColor: "#DDF2FF",
		padding: 20,
		marginBottom: 0,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
		borderRadius: 15,
	},
});
