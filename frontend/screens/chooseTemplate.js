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

export default function ChooseTemplate(props) {
	const navigation = useNavigation();
	const [globalState, updateGlobalState] = useGlobalState();
	const [workouts, updateWorkouts] = useState([]);
	function loadWorkouts() {

		API_Instance.post("workouts/search", {
			ownerId: globalState.user._id
		}, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'authorization': `BEARER ${globalState.authToken}`
			}
		}).then((response) => {
			// console.log(response.data);
			if (response.status == 200) {

				// console.log(response.data);
				// console.log(response.data.length);]
				const newData = response.data.map(obj => [obj]);
				// updateWorkouts(newData);
				// console.log(newData);
				updateWorkouts(response.data);

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

	function comments(n) {
		console.log(JSON.stringify(n, null, 2));
		// console.log("\n");
	}

	return (
		<SafeAreaView style={styles.Background}>
			<Text style={styles.HeaderText}>Your Saved Workouts</Text>
			{/* <Workouts data={SECTIONS} showButton={true} showInput={false} /> */}
			<Text style={styles.HeaderText}>Workout Templates</Text>
			<FlatList
				data={workouts}
				renderItem={(item) => {
					// <View>
						<Text style={{fontSize:16}}>Test Item</Text>
						// <Workouts data={[item.item]} showButton={true} showInput={false} />
						// {comments([item.item])}
					// </View>
				}}
				ListEmptyComponent={<Text style={{ fontSize: 64 }}>NO WORKOUTS</Text>}
				refreshing={true}
			/>
				{/* <Workouts data={(workouts?.length !== 0 ? workouts[0] : [])} showButton={true} showInput={false} /> */}
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
