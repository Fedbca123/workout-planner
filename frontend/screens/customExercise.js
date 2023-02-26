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
import React from "react";
import reactDom from "react-dom";
import axios from "axios";
import config from "../../config";
import { useGlobalState } from "../../GlobalState.js";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-screens";
import WorkOuts from "./workout";
import HomeNav from "../navigation/homeNav";

export default function CustomExercise(props) {

	const navigation = useNavigation();
	const [globalState, updateGlobalState] = useGlobalState();
	const exercise = {
		title:"",
		description:"",
		muscleGroups: [],
		exerciseType:[],
	};

	function createExercise(){
		if(exercise.title == ""){
			Alert.alert("Please Name the Exercise");
		} else if(exercise.description == ""){
			Alert.alert("Please Give Your Exercise a Description");
		} else if(exercise.muscleGroups == []){
			Alert.alert("Make sure to list what muscles this exercise targets");
		} else {
			globalState.workout[0].content.push(exercise);
			navigation.navigate("exerciseSearch");
		}
	}

	const options = {
		mediaType: 'photo',

	}


	function getPhotoForExercise() {
		
	}

    return(
		<View>
			<Text>What is the name of the exercise?</Text>
			<TextInput onChange={(text) => {exercise.title = text}}/>
			<Text>Can you give a description of the exercise?</Text>
			<TextInput onChange={(text) => {exercise.description = text}}/>
			<Text>What muscle groups does this workout train?</Text>
			{/* Gonna wait till how muscle groups are finalized as an array to display of them to select. */}
			<Text>Upload an image demonstrating the exercise if possible.</Text>
			<Button title="Choose an Image" onPress={() => {
				
			}}/>
			<Text>What equipment does this exercise possibly use?</Text>
			{/* Gotta wait till we change tags to equipment and see how it's structured in the backend before using it. */}
			<Button title="Create Exercise" onPress={() => { createExercise(); }} />
			
		</View>
	);
}