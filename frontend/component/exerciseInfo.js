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
} from "react-native";
import React from "react";
import { useState } from "react";
import reactDom from "react-dom";
import Collapsible from "react-native-collapsible";
import Accordion from "react-native-collapsible/Accordion";
import { useNavigation } from "@react-navigation/native";
import { useGlobalState } from "../GlobalState.js";

export default function ExerciseInfo({ exercise }){


    return (
        <View>
            <SafeAreaView style={styles.exerciseInfoHeader}>
              <Text style={styles.exerciseInfoTitle}>{exercise.title}</Text>
                <Image style={styles.exerciseInfoImage} src={exercise.image} />
            </SafeAreaView>

            <SafeAreaView style={styles.exerciseInfoBody}>
              <Text style={styles.exerciseInfoDescription}>{exercise.description}</Text>
              <Text style={styles.exerciseInfoMuscleGroups}>Muscle Groups: {exercise.MuscleGroups && exercise.MuscleGroups.join(", ")}</Text> 
              <Text style={styles.exerciseInfoTags}>Tags: {exercise.tags && exercise.tags.join(", ")}</Text>
            </SafeAreaView>

            {/* <SafeAreaView>
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeInfoModal}>
                <View style={styles.closeButtonContainer}>
                  <Text style={styles.closeText}>Close</Text>
                </View>
              </TouchableOpacity> 
            </SafeAreaView> */}

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
    },
    exerciseInfoImage:{
        width: "75%",
		height: "65%",
		borderWidth: 2,
		borderRadius: 10,
        // resizeMode: "contain"
    },
    exerciseInfoBody:{
        flex: 1,
        alignItems: 'center',
    },
    exerciseInfoDescription:{
        fontSize: 20,
        fontWeight: 'bold',
    },
    exerciseInfoMuscleGroups:{
        fontSize: 16,
        fontWeight: 'bold',
    },
    exerciseInfoTags:{
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButtonContainer:{
        backgroundColor: 'white',
        borderColor: "black",
        overflow: 'hidden',
        borderWidth: 3,
        borderRadius: "20rem",
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
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    bottom: "2%",
    width: "100%"
    // bottom: -375,
    // width: "90%",
    // justifyContent: 'center',
    // alignContent:'center',
    //width:"100%",
    //borderColor: "black"
    // right: -170,
    // backgroundColor: 'gray',
  },
    
})