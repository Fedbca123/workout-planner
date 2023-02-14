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
		<View>
			<Text>What do you wanna name the workout?</Text>
			<TextInput placeholder="My Leg Day Workout" onChangeText={(val)=>{globalState.workout[0].title = val}}/>
			<Text>Where are you going to have this workout?</Text>
			<TextInput placeholder="Planet Fitness" onChangeText={(val)=>{globalState.workout[0].location = val}}/>
			<Text>How Long will this workout be?(in min)</Text>
			<TextInput keyboardType="number-pad" placeholder="90 min" onChangeText={(val)=>{globalState.workout[0].duration = Number(val)}}/>
			<WorkOuts data={globalState.workout} showInput={true}/>
			<Button title="Add Workout" onPress={()=>{
				updateGlobalState("workoutScheduled",globalState.workout);
				navigation.navigate("home");
		}}/>
		</View>
	);
}
