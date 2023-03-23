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
import { AntDesign } from "@expo/vector-icons";

export default function ExerciseReview({ setCurrState, workout}) {
    const [globalState, updateGlobalState] = useGlobalState();
    const [exercises, updateExercises] = useState(workout[0].exercises);
    
    useEffect(() => {
		// loadWorkouts();
	}, []);

    return (
        <View style={styles.Background}>
            {/* <Workouts data={workout} /> */}
            <FlatList
                data={workout[0].exercises}
                renderItem={({ item, index}) => (
                    <View style={styles.ExerciseCard}>
                        <Image source={{ uri: item.image }} style={styles.ExerciseImage} />
                        <Text style={styles.ExerciseText}>{item.title}</Text>  
                        <TouchableOpacity onPress={() => {
                            workout[0].exercises.pop[index];
                            console.log(JSON.stringify(workout[0].exercises, null, 2));
                        }}>
                            <AntDesign style={styles.DeleteExerciseBttn} name="minus"  size={20}/>
                        </TouchableOpacity>
                    </View>
                    
                )}
            />
            <Button title="Back" onPress={() =>{ setCurrState("chooseTemplate") }}/>
        </View>
    );
}

const styles = StyleSheet.create({
    Background: {
		backgroundColor: "white",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignContent: "space-between",
        // alignItems: "flex-end",
	},
    ExerciseCard: {
        backgroundColor: "#F1F3FA",
        padding: 20,
        margin:10,
        // marginBottom: 0,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        borderRadius: 15,
        flexDirection: "row",
        // flexDirection: "row",
        alignItems: "center"
    },
    ExerciseImage: {
		height: 50,
		width: 50,
		borderWidth: 1,
		borderRadius: 20,
		// marginTop: 10
    },
    ExerciseText: {
		fontSize: 14,
		fontWeight: 'bold',
		left: 5,
		// top: 30,
		// marginVertical: "auto"
		textAlignVertical: "bottom",
		// flex:0.5
    },
    DeleteExerciseBttn: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 50,
    },
})