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
import Workouts from "../component/workout.js";
import { useNavigation } from "@react-navigation/native";
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance.js"
import { Header } from "react-native-elements";
import ChooseTemplateComponent from "../component/chooseTemplateComponent.js";
import ExerciseReview from "../component/exerciseReview.js";
import ExerciseSearch from "../component/exerciseSearch.js";

export default function CreateWorkout({ navigation }) {
    const [currState, setCurrState] = useState("chooseTemplate");
    const [currWorkout, setCurrWorkout] = useState([]);
    // const navigation = useNavigation();
    
    useEffect(() => {
        if (currState === "chooseTemplate") {
            navigation.setOptions({ title: "Create A Workout"});
        } else if (currState === "ExerciseReview") {
            navigation.setOptions({ title: "Edit Your Workout",});
        } else if (currState === "ExerciseSearch") {
            navigation.setOptions({ title: "Add an Exercise To Your Workout" });
        }
	}, [currState]);
    
    // navigation.setOptions({ headertitle: "TEMP" });


    // let currState = { current: "chooseTemplate" };


    return (
        <View style={{flex :1}}>
            {currState === "chooseTemplate" && <ChooseTemplateComponent setCurrState={setCurrState} setCurrWorkout={setCurrWorkout}/>}
            {currState === "ExerciseReview" && <ExerciseReview setCurrState={setCurrState} updateWorkout={setCurrWorkout} workout={currWorkout} />}
            {currState === "ExerciseSearch" && <ExerciseSearch workout={currWorkout} setCurrState={setCurrState} />}
        </View>
    );
}