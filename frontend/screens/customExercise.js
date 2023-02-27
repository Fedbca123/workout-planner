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
import * as ImagePicker from "expo-image-picker";

export default function CustomExercise(props) {

	const navigation = useNavigation();
	const [globalState, updateGlobalState] = useGlobalState();
	const exercise = {
		title:"",
		description:"",
		muscleGroups: [],
		exerciseType: [],
		image: null,
		imageId: "",
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

	const getPhotoForExercise = async() =>{
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.cancelled) {
			exercise.image = result.uri;
		}
	}

	const takePhotoForExercise = async() =>{
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.cancelled) {
			exercise.image = result.uri;
		}
	}

	function picChooser() {
		
	}

    return(
		<View style={styles.container}>
			<Text style={styles.TitleText}>What is the name of the exercise?</Text>
			<TextInput style={styles.TextInputBox} onChange={(text) => {exercise.title = text}}/>
			<Text style={styles.TitleText}>Can you give a description of the exercise?</Text>
			<TextInput style={styles.TextInputBox} onChange={(text) => {exercise.description = text}}/>
			<Text style={styles.TitleText}>What muscle groups does this workout train?</Text>
			{/* Gonna wait till how muscle groups are finalized as an array to display of them to select. */}
			<Text style={styles.TitleText}>Upload an image demonstrating the exercise if possible.</Text>
			{/* <Button  title="Choose an Image" onPress={() => {
				getPhotoForExercise();
			}}/> */}
			{ exercise.image && <Image source={{ uri: exercise.image}} style={{ width: 200, height: 200 }} />}
                    { !exercise.image && <Button title = "Choose An Image"
				onPress={() => {
					getPhotoForExercise();
				}}/> }
                    { exercise.image && <Button title = "Clear"
                    onPress={async () => {
                        exercise.image = null;
                    }}/>}
			<Text style={styles.TitleText}>What equipment does this exercise possibly use?</Text>
			{/* Gotta wait till we change tags to equipment and see how it's structured in the backend before using it. */}
			<Button title="Create Exercise" onPress={() => { createExercise(); }} />
			
		</View>
	);
}

const styles = StyleSheet.create({
	TitleText:{
		fontSize: 20,
    	fontWeight: 'bold',
	},
	TextInputBox: {
		backgroundColor: "#F1F3FA",
		margin: 10,
		padding: 15,
		borderRadius: "20rem",
		// flex: 0.5,
		// shadowOpacity: 2
	},
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	buttonStyle: {
		backgroundColor: "#F1F3FA",
		margin: 10,
		padding: 15,
		borderRadius: "10rem",
	}
})