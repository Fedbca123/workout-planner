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
import BeginFinalizeWorkout from "../component/beginFinalizeWorkout.js";
import CreateWorkoutHeader from "../component/createWorkoutHeader.js";
import ScheduleWorkout from "../component/scheduleWorkout.js";

export default function CreateWorkout({ navigation }) {
    const [currState, setCurrState] = useState("chooseTemplate");
    const [currWorkout, setCurrWorkout] = useState([]);
    const [createNew, setCreateNew] = useState(false);
    // const navigation = useNavigation();
    
    useEffect(() => {
        if (currState === "chooseTemplate") {
            navigation.setOptions({
                header: () => <CreateWorkoutHeader title={"Create A Workout"} navigation={navigation}/>,
            })
            //navigation.setParams({ title: "Create A Workout"});
        } else if (currState === "ExerciseReview") {
            navigation.setOptions({
                header: () => <CreateWorkoutHeader title={"Edit Your Workout"} navigation={navigation}/>,
            })
            //navigation.setParams({ title: "Edit Your Workout",});
        } else if (currState === "ExerciseSearch") {
            navigation.setOptions({
                header: () => <CreateWorkoutHeader title={"Create A Workout"} navigation={navigation}/>,
            })
            //navigation.setParams({ title: "Begin Finalizing" });
        } else if (currState === "BeginFinalizing") {
            navigation.setOptions({
                header: () => <CreateWorkoutHeader title={"Finalize Workout"} navigation={navigation}/>,
            })
            //navigation.setOptions({ title: "Finalize Workout" });
        }
        else if (currState === "Schedule") {
            navigation.setOptions({
                header: () => <CreateWorkoutHeader title={"Schedule Workout"} navigation={navigation}/>,
            })
            //navigation.setOptions({ title: "Finalize Workout" });
        }
	}, [currState]);
    
    // navigation.setOptions({ headertitle: "TEMP" });


    // let currState = { current: "chooseTemplate" };


    return (
        <View style={{flex: 1}}>
            {currState === "chooseTemplate" && <ChooseTemplateComponent setCurrState={setCurrState} setCurrWorkout={setCurrWorkout} setCreateNew={setCreateNew}/>}
            {currState === "ExerciseReview" && <ExerciseReview setCurrState={setCurrState} updateWorkout={setCurrWorkout} workout={currWorkout} setCreateNew={setCreateNew}/>}
            {currState === "ExerciseSearch" && <ExerciseSearch workout={currWorkout} updateWorkout={setCurrWorkout} setCurrState={setCurrState} />}
            {currState === "BeginFinalizing" && <BeginFinalizeWorkout workout={currWorkout} updateWorkout={setCurrWorkout} setCurrState={setCurrState} />}
            {currState === "Schedule" && <ScheduleWorkout workout={currWorkout} updateWorkout={setCurrWorkout} setCurrState={setCurrState} />}
        </View>
    );
}