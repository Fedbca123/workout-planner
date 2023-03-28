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

export default function ChooseTemplateComponent({ setCurrState, setCurrWorkout, setCreateNew }) {
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
			scheduledDate: "",
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
			{/* <View style={{marginVertical: 10, borderWidth: 1}}>
				<Button title="Create A Custom Workout" onPress={() => {
					setCurrWorkout(noTemplate);
					setCurrState("ExerciseReview");
				}} />
			</View> */}

			<TouchableOpacity 
				style={styles.createButton}
				onPress={() => {
					setCurrWorkout(noTemplate);
					setCreateNew(true);
					setCurrState("ExerciseReview");
				}}
			>
				<Text style={{fontSize: 18, padding: 5, textAlign: 'center', fontWeight: 'bold'}}>Create a custom workout</Text>
			</TouchableOpacity>
			

			<Text style={{fontSize:20, textAlign:"center", fontWeight: 'bold'}}>-OR-</Text>

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
							setCreateNew={setCreateNew}
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
		justifyContent: 'space-between'
	},
	HeaderText: {
		fontSize: 20,
    	fontWeight: 'bold',
		marginLeft: 10
	},
	createButton: {
		borderWidth: .5, 
		width: '60%', 
		alignSelf: 'center',
		marginTop: 15, 
		backgroundColor: '#DDF2FF',
		borderRadius: 8,
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		elevation: 2,
	}
});
