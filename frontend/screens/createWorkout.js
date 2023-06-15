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
import ChooseTemplateComponent from "../component/createWorkout/chooseTemplateComponent.js";
import ExerciseReview from "../component/createWorkout/exerciseReview.js";
import ExerciseSearch from "../component/createWorkout/exerciseSearch.js";
import BeginFinalizeWorkout from "../component/createWorkout/beginFinalizeWorkout.js";
import CreateWorkoutHeader from "../component/createWorkoutHeader.js";
import ScheduleWorkout from "../component/createWorkout/scheduleWorkout.js";
import FinalizeReview from "../component/createWorkout/finalizeReview.js";
import CreateExercise from "../component/createWorkout/createExercise.js";

export default function CreateWorkout({ navigation, route }) {
    const [workoutData, _] = useState(route.params ? route.params.workoutData : null);
    const [currState, setCurrState] = useState(workoutData ? "ExerciseReview" : "chooseTemplate");
    const [currWorkout, setCurrWorkout] = useState(workoutData ? [workoutData] : []);
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
                header: () => <CreateWorkoutHeader title={"Add an Exercise"} navigation={navigation}/>,
            })
            //navigation.setParams({ title: "Begin Finalizing" });
        } else if (currState === "BeginFinalizing") {
            navigation.setOptions({
                header: () => <CreateWorkoutHeader title={"Finalize Workout"} navigation={navigation}/>,
            })
            //navigation.setOptions({ title: "Finalize Workout" });
        } else if (currState === "Schedule") {
            navigation.setOptions({
                header: () => <CreateWorkoutHeader title={`Schedule ${currWorkout[0].title}`} navigation={navigation}/>,
            })
            //navigation.setOptions({ title: "Finalize Workout" });
        } else if (currState === "FinalizeReview") {
            navigation.setOptions({
                header: () => <CreateWorkoutHeader title={"Almost There!"}
                navigation={navigation} />,
            })
        } else if (currState === "CustomExercise") {
            navigation.setOptions({
                header: () => <CreateWorkoutHeader title={"Custom Exercise"}
                navigation={navigation} />,
            })
        }
	}, [currState]);
    
    // navigation.setOptions({ headertitle: "TEMP" });


    // let currState = { current: "chooseTemplate" };

    // console.log("every render: ", currWorkout[0] ? currWorkout[0].save : "none");
    return (
        <View style={{flex: 1}}>
            {currState === "chooseTemplate" && <ChooseTemplateComponent setCurrState={setCurrState} setCurrWorkout={setCurrWorkout} setCreateNew={setCreateNew} modifyScheduledWorkout={route.params.modifyScheduledWorkout}/>}
            {currState === "ExerciseReview" && <ExerciseReview setCurrState={setCurrState} updateWorkout={setCurrWorkout} workout={currWorkout} setCreateNew={setCreateNew}modifyScheduledWorkout={route.params.modifyScheduledWorkout}/>}
            {currState === "ExerciseSearch" && <ExerciseSearch workout={currWorkout} updateWorkout={setCurrWorkout} setCurrState={setCurrState} modifyScheduledWorkout={route.params.modifyScheduledWorkout} />}
            {currState === "BeginFinalizing" && <BeginFinalizeWorkout workout={currWorkout} updateWorkout={setCurrWorkout} setCurrState={setCurrState} modifyScheduledWorkout={route.params.modifyScheduledWorkout}/>}
            {currState === "Schedule" && <ScheduleWorkout workout={currWorkout} updateWorkout={setCurrWorkout} setCurrState={setCurrState} modifyScheduledWorkout={route.params.modifyScheduledWorkout}/>}
            {currState === "FinalizeReview" && <FinalizeReview workout={currWorkout} updateWorkout={setCurrWorkout} setCurrState={setCurrState} navigation={navigation} modifyScheduledWorkout={route.params.modifyScheduledWorkout}/>}
            {currState === "CustomExercise" && <CreateExercise workout={currWorkout} updateWorkout={setCurrWorkout} setCurrState={setCurrState} navigation={navigation} modifyScheduledWorkout={route.params.modifyScheduledWorkout}/>}
        </View>
    );
}