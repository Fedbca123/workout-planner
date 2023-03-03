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

export default function FinalizeWorkout({ props, data }) {
	const [globalState, updateGlobalState] = useGlobalState();
	const navigation = useNavigation();
	return (
		<View style={styles.container}>
			<Text style={styles.TitleText}>What do you wanna name the workout?</Text>
			<TextInput style={styles.TextInputBox} placeholder="My Leg Day Workout" onChangeText={(val)=>{globalState.workout[0].title = val}}/>
			<Text style={styles.TitleText}>Where are you going to have this workout?</Text>
			<TextInput style={styles.TextInputBox} placeholder="Planet Fitness" onChangeText={(val)=>{globalState.workout[0].location = val}}/>
			<Text style={styles.TitleText}>How Long will this workout be?(in min)</Text>
			<TextInput style={styles.TextInputBox} inputMode="numeric" placeholder="90 min" maxLength={3} onChangeText={(val)=>{globalState.workout[0].duration = Number(val)}}/>
			<WorkOuts data={globalState.workout} showInput={true}/>
			<Button title="Add Workout" onPress={()=>{
				updateGlobalState("workoutScheduled",globalState.workout);
				navigation.navigate("home");
		}}/>
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
