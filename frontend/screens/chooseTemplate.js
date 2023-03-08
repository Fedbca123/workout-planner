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
} from "react-native";
import React, { useEffect, useState } from "react";
import reactDom, { render } from "react-dom";
import Workouts from "./workout.js";
import { useNavigation } from "@react-navigation/native";
import { useGlobalState } from "../../GlobalState.js";
import API_Instance from "../../backend/axios_instance.js"

export default function ChooseTemplate(props) {
	const navigation = useNavigation();
	const [globalState, updateGlobalState] = useGlobalState();
	const [workouts, updateWorkouts] = useState([]);
	function loadWorkouts() {

		axios.post(baseUrl + "workouts/search", {
			ownerId: globalState.user._id
		}).then((response) => {
			// console.log(response.data);
			if (response.status == 200) {

				// console.log(response.data[0].exercises);
				// console.log(response.data.length);
				updateWorkouts(response.data.splice(0, response.data.length));
				console.log(workouts);

			} else {
				console.log(response.status);
			}
		}).catch((e) => {
			console.log(e);
		});

	}

	useEffect(() => {
		loadWorkouts();
	}, []);

	const noTemplate = [
		{
			title: "Your Workout",
			duration: 60,
			location: "",
			exercises: [],
		}
	];

	return (
		<SafeAreaView style={styles.Background}>
			<Text style={styles.HeaderText}>Your Saved Workouts</Text>
			{/* <Workouts data={SECTIONS} showButton={true} showInput={false} /> */}
			<Text style={styles.HeaderText}>Workout Templates</Text>
				<Workouts data={workouts} showButton={true} showInput={false} />
			<Button title="Create from Scratch" onPress={() => {
				updateGlobalState("workout", noTemplate);
				navigation.navigate("exerciseSearch");
			}} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	Background: {
		backgroundColor: "white",
		flex: 1,
	},
	HeaderText: {
		fontSize: 20,
    	fontWeight: 'bold',
	},
});
