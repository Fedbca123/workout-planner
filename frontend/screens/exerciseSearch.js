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
import React, { useEffect, useState } from "react";
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
	const [exercises, updateExercises] = useState([]);

	const loadExercises = async () => {

		axios.post(baseUrl + "exercises/search", {
			ownerId: globalState.user._id
		}).then((response) => {
			// console.log(response.data);
			if (response.status == 200) {
				updateExercises(response.data);
			} else {
				console.log(response.status);
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	useEffect(() => {
		loadExercises();
	}, []);

	useEffect(() => {
		
	}, [])
	
	// console.log("Rerendering Search");

	return (
		<SafeAreaView >
			<SearchBar placeholder="Enter exercise names or muscle groups you wish to train!"></SearchBar>
			<Text style={styles.TitleText}>Current Workout:</Text>
			<WorkOuts data={globalState.workout} />
			<Text style={styles.TitleText}>Exercises:</Text>
			<FlatList
				data={exercises}
				keyExtractor={(item) => item.title}
				renderItem={({ item }) => (
					<View style={styles.ExerciseCard}>
						<TouchableOpacity
							onPress={() => {
								let workout = [...globalState.workout];
								workout[0].content.push(item);
								updateGlobalState("workout", workout);
								Alert.alert("Exercise Added to workout!");
								
							}}
						>
							<Image source={{uri: item.image}} />
							<Text>{item.title}</Text>
							{/* Button to take user to page about info for the workout */}
						</TouchableOpacity>
					</View>
				)}
			/>
			<Button
				title="Finalize Workout"
				onPress={() => {
					navigation.navigate("finalizeWorkout");
				}}
			/>
			<Button title="Custom Exercise" onPress={() => {
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
		margin:10,
		// marginBottom: 0,
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
	},
	ImageStyle:{
		height: 100,
		width:100,
	}
});
