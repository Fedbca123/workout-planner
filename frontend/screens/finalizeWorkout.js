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
	return (
		<View>
			<Text>TEMP</Text>
			<TextInput placeholder="TEMP"></TextInput>
			<WorkOuts data={globalState.workout} />
		</View>
	);
}
