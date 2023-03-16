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
import API_Instance from "../../backend/axios_instance";
import { useGlobalState } from "../GlobalState.js";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-screens";
import WorkOuts from "./workout";
import HomeNav from "../navigation/homeNav";

// const baseUrl = config.API_URL + config.PORT + '/';

export default function ExerciseSearch(props) {
	const navigation = useNavigation();
	const [globalState, updateGlobalState] = useGlobalState();
	const [exercises, updateExercises] = useState([]);

	const loadExercises = async () => {

		API_Instance.post("exercises/search", {
			ownerId: globalState.user._id
		}, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'authorization': `BEARER ${globalState.authToken}`
			}
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
			<Text style={styles.TitleText}>Current Workout:</Text>
			<WorkOuts data={globalState.workout} />
			<Button
				title="Finalize Workout"
				onPress={() => {
					if (globalState.workout[0].exercises.length !== 0) {
						navigation.push("finalizeWorkout");
					} else {
						Alert.alert("Please add at least one exercise to this workout.");
					}
				}}
			/>
			<Text style={styles.TitleText}>Exercises:</Text>
			<Button title="Custom Exercise" onPress={() => {
				navigation.navigate("customExercise");
			}} />
			<FlatList
				data={exercises}
				keyExtractor={(item) => item.title}
				renderItem={({ item }) => (
					<View >
						<TouchableOpacity style={styles.ExerciseCard}
							onPress={() => {
								let workout = [...globalState.workout];
								workout[0].exercises.push(item);
								updateGlobalState("workout", workout);
								Alert.alert("Exercise Added to workout!");
								
							}}
						>
							<Image source={{ uri: item.image }} style={styles.ImageStyle} />
							<Text style={styles.ExerciseText}>{item.title}</Text>
							{/* Button to take user to page about info for the workout */}
						</TouchableOpacity>
					</View>
				)}
			/>
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
		flexDirection: "row",
		// flexDirection: "row",
		alignItems: "center"
	},
	TitleText:{
		fontSize: 20,
		fontWeight: 'bold',
		// justifyContent:"flex-start"
	},
	ImageStyle:{
		height: 50,
		width: 50,
		// flex: 0.5,
		borderWidth: 1,
		borderRadius:100
	},
	ExerciseText: {
		fontSize: 20,
		fontWeight: 'bold',
		left: 10,
		// top: 30,
		// marginVertical: "auto"
		textAlignVertical: "bottom",
		// flex:0.5
	}
});
