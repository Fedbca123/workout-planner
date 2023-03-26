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
	useWindowDimensions,
    Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import reactDom, { render } from "react-dom";
import Workouts from "./workout.js";
import { useNavigation } from "@react-navigation/native";
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance.js";
import { AntDesign } from "@expo/vector-icons";

export default function ExerciseReview({ setCurrState, workout, updateWorkout}) {
    // const [globalState, updateGlobalState] = useGlobalState();
    const [exercises, updateExercises] = useState(!workout[0].exercises ? [] : workout[0].exercises);
    
    // useEffect(() => {
	// 	 loadWorkouts();
	// }, []);

    useEffect(() => {
        let temp = {...workout}
        temp[0].exercises = exercises;
        updateWorkout(temp);
    }, [exercises])

    return (
        <View style={styles.Background}>
            <TouchableOpacity 
				style={styles.addExerciseButton}
				onPress={() => {
					setCurrState("ExerciseSearch")
				}}
			>
				<Text style={{fontSize: 18, padding: 5, textAlign: 'center', fontWeight: 'bold'}}>Add an Exercise</Text>
			</TouchableOpacity>
            <FlatList
                data={exercises}
                style={{height: "70%"}}
                ListEmptyComponent={
                    <View style={{flex: 1, alignItems: 'center', marginTop: '30%'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>This workout currently has no exercises</Text>
                    </View>                  
                }
                renderItem={({ item, index}) => (
                    <View style={styles.ExerciseCard}>
                        <Image source={{ uri: item.image }} style={styles.ExerciseImage} />
                        <Text style={styles.ExerciseText}>{item.title}</Text>  
                        <TouchableOpacity onPress={() => {
                            let temp = [...exercises];
                            temp.splice(index, 1);
                            updateExercises(temp);
                        }}>
                            <AntDesign style={styles.DeleteExerciseBttn} name="minus"  size={20}/>
                        </TouchableOpacity>
                    </View>
                    
                )}
            />

            <View style={{ display: "flex", flex: 1, flexDirection: "row", borderWidth: 1, justifyContent: "space-evenly" }}>
                <View style={{ backgroundColor: "#FF8C4B", flex: 1}}>
                     <TouchableOpacity style={{ flex:1, alignItems:"center", justifyContent: "center"}} onPress={() => {setCurrState("chooseTemplate")}}>
                        <AntDesign size={useWindowDimensions().height * 0.08} name="leftcircle" color={"white"}/>
                    </TouchableOpacity>
                </View>

                <View style={{ alignSelf: "center", flex:1}}>
                    <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#10B9F1" }} onPress={() => {
                        if (workout[0].exercises.length === 0) {
                            Alert.alert("Love the enthusiasm, but you have to at least have one exercise if you wanna workout");
                        } else {
                            setCurrState("BeginFinalizing"); 
                        }
                        
                    }}>
                        <AntDesign size={useWindowDimensions().height * 0.08} name="rightcircle" color={"white"}/>
                    </TouchableOpacity>  
                </View>
            </View>
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
        alignItems: "center",
        justifyContent: "space-between",
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
        borderRadius: 100,
    },
    BttnText: {
        color: "white",
        fontSize: 20,
    },
    addExerciseButton: {
		borderWidth: .5, 
		width: '60%', 
		alignSelf: 'center',
		marginVertical: 15, 
		backgroundColor: '#DDF2FF',
		borderRadius: 8,
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		elevation: 2,
	}
})