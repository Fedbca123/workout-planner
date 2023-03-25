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
	useWindowDimensions
} from "react-native";
import React, { useEffect, useState } from "react";
import reactDom, { render } from "react-dom";
import Workouts from "./workout.js";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance.js"
import { Header, SearchBar } from "react-native-elements";

export default function ChooseTemplateComponent({ setCurrState, setCurrWorkout, selectedWorkout }) {
	const [globalState, updateGlobalState] = useGlobalState();
	const [publicWorkouts, updatePublicWorkouts] = useState([]);
	const [privateWorkouts, updatePrivateWorkouts] = useState([]);
	const [allWorkouts, setAllWorkouts] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [searchResults, updateSearchResults] = useState([]);
	const isFocused = useIsFocused();

	function loadWorkouts() {

		API_Instance.post("workouts/search", {
			ownerId: globalState.user._id
		}, {
			headers: {
				// 'Content-Type': 'multipart/form-data',
				'authorization': `BEARER ${globalState.authToken}`
			}
		}).then((response) => {

			if (response.status == 200) {

				// let publicW = [];
				// let privateW = [];

				// for (let data of response.data) {

				// 	// console.log(JSON.stringify(data, null, 2));
					
				// 	if (data.owner != globalState.user._id) {
				// 		// updatePublicWorkouts(data);
				// 		// publicWorkouts.push(data);
				// 		publicW.push(data);
				// 	} else {
				// 		// updatePrivateWorkouts(data);
				// 		// privateWorkouts.push(data);
				// 		privateW.push(data);
				// 	}
				// }

				// updatePublicWorkouts(publicW);
				// updatePrivateWorkouts(privateW);

				setAllWorkouts(response.data);

				updateSearchResults(response.data);
				

			} else {
				console.log(response.status);
			}
		}).catch((e) => {
			console.log(e);
		});

	}

	function handleSearch(str) {

		updateSearchResults([]);
		
		for (let workout of allWorkouts) {
			if (true /*Figure out herer how to search properly*/ ) {
				searchResults.push(workout);
			}
		}
	}

	useEffect(() => {
		loadWorkouts();
	}, [isFocused]);

	// useEffect(() => {
	// 	handleSearch(searchText);
	// }, [searchText.length]);

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
			<Button title="Create A Custom Workout" onPress={() => {
				setCurrWorkout(noTemplate);
				setCurrState("ExerciseReview");
			}} />

			<Text style={{fontSize:20, textAlign:"center"}}>-OR-</Text>

			<Text style={styles.HeaderText}>Select a Workout:</Text>

			<SearchBar
				platform="default"
				lightTheme={true}
				containerStyle={{ backgroundColor: "white" }}
				inputStyle={{color: "black"}}
				onChangeText={(val) => {
					handleSearch(setSearchText(val));
				}}
				round={true}
				value={searchText}
				cancelButtonTitle=""
				onClear={() => {
					setSearchText("");
					updateSearchResults(allWorkouts);
					// searchResults.push(publicWorkouts);
					// searchResults.push(privateWorkouts);
				}}
				onCancel={() => {
					setSearchText("");
					updateSearchResults(allWorkouts);
					// searchResults.push(publicWorkouts);
					// searchResults.push(privateWorkouts);
				}}
				placeholder="Search by name, muscle groups, or equipment"
			/>

			<FlatList
				data={searchResults}
				style={{ maxHeight: useWindowDimensions().height * .65}}
				renderItem={(item) => (
					<View>
						{/* {comments(item.item)} */}
						<Workouts
							data={[item.item]}
							showButton={true}
							showInput={false}
							setCurrState={setCurrState}
							setCurrWorkout={setCurrWorkout}
							passData={setCurrWorkout}
						/>
					</View>
				)}
				ListEmptyComponent={<Text style={{ fontSize: 16 }}>NO WORKOUTS</Text>}
				refreshing={true}
			/>
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
