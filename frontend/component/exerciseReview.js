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
import { useNavigation } from "@react-navigation/native";
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance.js";

export default function ExerciseReview({ setCurrState, setCurrWorkout, workout}) {
    const [globalState, updateGlobalState] = useGlobalState();
    const [exercises, updateExercises] = useState([]);
    


    return (
        <View>
            <Workouts data={workout}/>
            <Button title="Back" onPress={() =>{ setCurrState("chooseTemplate") }}/>
        </View>
    );
}