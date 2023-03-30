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
    useWindowDimensions,
    Platform,
} from "react-native";
import React from "react";
import { useState } from "react";
import reactDom from "react-dom";
import { useGlobalState } from "../GlobalState.js";

export default function ExerciseInfo({ exercise, setModalVisbility }){

    return (
        <View style={{flex: 1}}>
            <View style={{display:"flex", flex:1, justifyContent:"space-evenly"}}>
                <View style={styles.exerciseInfoHeader}>
                <Text style={styles.exerciseInfoTitle}>{exercise.title}</Text>
                    <Image style={styles.exerciseInfoImage} src={exercise.image} />
                </View>

                <View style={styles.exerciseInfoBody}>
                <Text style={styles.exerciseInfoDescription}>{exercise.description}</Text>
                </View>

                <View style={{}}>
                <Text style={styles.exerciseInfoMuscleGroups}>Muscle Groups: {exercise.muscleGroups && exercise.muscleGroups.join(", ")}</Text> 
                <Text style={styles.exerciseInfoTags}>Tags:{exercise.tags && exercise.tags.join(", ")}</Text> 
                </View>

            </View>

             <View style={{bottom:10}}>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => {setModalVisbility(false)}}>
                    <View style={styles.closeButtonContainer}>
                    <Text style={styles.closeText}>Close</Text>
                    </View>
                </TouchableOpacity> 
            </View>
        </View>

        
    )
}

const styles = StyleSheet.create({
	exerciseInfoHeader:{
        // flex: 1,
        alignItems: 'center',
    },
    exerciseInfoTitle:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom:10,
    },
    exerciseInfoImage:{
        width: "70%",
		// height: "60%",
		borderWidth: 2,
        borderRadius: 10,
        aspectRatio: 6/7,
        // resizeMode: "contain"
    },
    exerciseInfoBody:{
        // flex: 1,
        // display: "flex",
        // alignItems:"center",
        // borderWidth: 2,
        // borderRadius:10,
        // alignItems: 'center',
        // top: "-17%",
        // height:"30%",
        padding:10,
    },
    exerciseInfoDescription:{
        fontSize: 20,
        fontWeight: 'bold',

    },
    exerciseInfoMuscleGroups:{
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: "center",
        padding: 10,
    },
    exerciseInfoTags:{
        fontSize: 16,
        fontWeight: 'bold',
        textAlign:"center",
    },
    closeButtonContainer:{
        backgroundColor: 'white',
        borderColor: "black",
        overflow: 'hidden',
        borderWidth: 3,
        borderRadius: 20,
        // bottom: -375,
        alignItems: 'center',
        paddingHorizontal: 10,
        marginHorizontal: 1,
        //width: "35%",
        justifyContent: 'center',
        alignContent: 'center',
    },
    closeText:{
        fontWeight: 'bold',
        color: 'black',
        fontSize: 30,
        paddingHorizontal: 8,
        //borderRadius: "20rem",
    },

    modalCloseButton:{
    alignItems: 'center',
    // top:"-95%"  
  },
    
})