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
} from 'react-native';
import React, { useEffect, useState } from "react";
import reactDom, { render } from "react-dom";
import API_Instance from "../../backend/axios_instance.js";
import { AntDesign } from "@expo/vector-icons";
import { useGlobalState } from "../GlobalState.js";

export default function ExerciseSearch({ workout, setCurrState }) {

    const [exercises, updateExercises] = useState([]);
    const [globalState, updateGlobalState] = useGlobalState();
    

	function loadExercises(){

		API_Instance.post("exercises/search", {
			ownerId: globalState.user._id
		}, {
			headers: {
				'authorization': `BEARER ${globalState.authToken}`
			}
		}).then((response) => {
			if (response.status == 200) {
				updateExercises(response.data);
			} else {
				console.log(response.status);
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	useEffect(() => {
		loadExercises();
    }, []);
    
  return (
    <View style={styles.Background}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.title}
        style={{maxHeight:450}}
        renderItem={({ item }) => (
            <View >
                <TouchableOpacity style={styles.ExerciseCard}
                    onPress={() => {
                        let workout = [...globalState.workout];
                        workout[0].exercises.push(item);
                        updateGlobalState("workout", workout);
                        Alert.alert("Exercise Added to workout!");
                        
                    }}
                >
                    <Image source={{ uri: item.image }} style={styles.ImageStyle} />
                    <Text style={styles.ExerciseText}>{item.title}</Text>
                    {/* Button to take user to page about info for the workout */}
                </TouchableOpacity>
            </View>
        )}
          />
          <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, justifyContent: "space-evenly", height:"15%", bottom:-88 }}>
                <View style={{ backgroundColor: "#FF8C4B", flex: 1}}>
                     <TouchableOpacity style={{ flex:1, alignItems:"center", justifyContent: "center"}} onPress={() => {setCurrState("ExerciseReview")}}>
                      {/* <AntDesign size={useWindowDimensions().height * 0.08} name="leftcircle" color={"white"}/> */}
                      <Text style={styles.BttnText}>Return to Review</Text>
                    </TouchableOpacity>
                </View>

                {/* <View style={{ alignSelf: "center", flex:1}}>
                    <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#10B9F1" }} onPress={() => {
                        if (workout[0].exercises.length === 0) {
                            Alert.alert("Love the enthusiasm, but you have to at least have one exercise if you wanna workout");
                        } else {
                            setCurrState("BeginFinalizing"); 
                        }
                        
                    }}>
                        <AntDesign size={useWindowDimensions().height * 0.08} name="rightcircle" color={"white"}/>
                    </TouchableOpacity>  
                </View> */}
            </View>
    </View>
  )
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
    }
})