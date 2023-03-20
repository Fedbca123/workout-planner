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
	VirtualizedList,
} from "react-native";
import React, { useEffect, useState } from "react";
import reactDom, { render } from "react-dom";
import Workouts from "./workout.js";
import { useNavigation } from "@react-navigation/native";
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance.js"
import { Header } from "react-native-elements";

export default function ChooseTemplate({ navigation }) {
	const [globalState, updateGlobalState] = useGlobalState();
	const [publicWorkouts, updatePublicWorkouts] = useState([]);
	const [privateWorkouts, updatePrivateWorkouts] = useState([]);
	function loadWorkouts() {

		API_Instance.post("workouts/search", {
			ownerId: globalState.user._id
		}, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'authorization': `BEARER ${globalState.authToken}`
			}
		}).then((response) => {

			if (response.status == 200) {

				let publicW = [];
				let privateW = [];

				for (let data of response.data) {

					console.log(JSON.stringify(data, null, 2));
					
					if (data.owner != globalState.user._id) {
						// updatePublicWorkouts(data);
						// publicWorkouts.push(data);
						publicW.push(data);
					} else {
						// updatePrivateWorkouts(data);
						// privateWorkouts.push(data);
						privateW.push(data);
					}
				}

				updatePublicWorkouts(publicW);
				updatePrivateWorkouts(privateW);
				
				// const newData = response.data.map(obj => [obj]);
				// updateWorkouts(newData);
				// updateWorkouts(response.data);

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
			title: "My Custom Workout",
			duration: 0,
			description: "",
			exercises: [],
			location:"",
			scheduledDate: new Date("2022-01-01"),
			tags: [],
			muscleGroups: [],
		}
	];

	function comments(n) {
		console.log(typeof (n));
		console.log(JSON.stringify(n, null, 2));
	}

	return (
		<SafeAreaView style={styles.Background}>
			<Text style={styles.HeaderText}>Your Saved Workouts</Text>

			<FlatList
				data={privateWorkouts}
				renderItem={(item) => (
					<View>
						{/* {comments(item.item)} */}
						<Workouts data={[item.item]} showButton={true} showInput={false} />
					</View>
				)}
				ListEmptyComponent={<Text style={{ fontSize: 16 }}>NO WORKOUTS</Text>}
				refreshing={true}
			/>

			<Text style={styles.HeaderText}>Workout Templates</Text>
			<FlatList
				data={publicWorkouts}
				renderItem={(item) => (
					<View>
						{/* {comments(item.item)} */}
						<Workouts data={[item.item]} showButton={true} showInput={false} />
					</View>
				)}
				ListEmptyComponent={<Text style={{ fontSize: 16 }}>NO WORKOUTS</Text>}
				refreshing={true}
			/>
			<Button title="Create from Scratch" onPress={() => {
				updateGlobalState("workout", noTemplate);
				navigation.push("exerciseSearch");
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
