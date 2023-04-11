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
    ScrollView,
} from "react-native";
import React from "react";
import { useState } from "react";
import reactDom from "react-dom";
import { useGlobalState } from "../GlobalState.js";

export default function ExerciseInfo({ exercise, setModalVisbility }) {
    const [globalState, updateGlobalState] = useGlobalState();
    
    const getWorkoutOwner = (exercise) => {
        if (!exercise.owner)
        return "Public";
        else if (exercise.owner === globalState.user?._id) {
        return "You";
        } else {
        // console.log("exercise " + exercise.title+  " owner: "+ exercise.ownerName);
        return exercise.ownerName;
        }
    };

    return (
        <View style={{flex: 5, flexDirection: "column", display:"flex",alignContent:"space-between",}}>
            <View style={styles.exerciseInfoHeader}>
              <View style={styles.exerciseInfoTitleandDelete}>
                <View style={styles.exerciseInfoTitleContainer}>
                  <Text style={styles.exerciseInfoTitle}>{exercise.title}</Text>
                </View>
              </View>
              <View style={styles.exerciseInfoCardImageContainer}>
                <Image  style={styles.exerciseInfoImage} src ={exercise.image}/>
              </View>
            </View>

            <View style={styles.exerciseInfoBody}>
              <ScrollView>
              <View style={styles.exerciseInfoDescriptionContainer}>
                <Text style={styles.exerciseInfoDescriptionTitle}>Description:</Text>
                <Text style={styles.exerciseInfoDescription}>{exercise.description}</Text>
              </View>
              <View style={styles.exerciseInfoMuscleGroupsContainer}>
                <Text style={styles.exerciseInfoMuscleGroupsTitle}>Muscle Groups:</Text>
                <Text style={styles.exerciseInfoMuscleGroups}>{exercise.muscleGroups && exercise.muscleGroups.join(", ")}</Text> 
              </View>

              <View style={styles.exerciseInfoOwnerContainer}>
                <Text style={styles.exerciseInfoOwnerTitle}>Exercise Owner:</Text>
                <Text style={styles.exerciseInfoOwner}>{getWorkoutOwner(exercise)}
                </Text> 
              </View>
              </ScrollView>
            </View>

             <View style={{marginBottom: 5}}>
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
        flex: 1.5,
        marginBottom: 20,
        marginTop: 20,
        // alignItems: 'center',
    },
    exerciseInfoTitleandDelete:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    exerciseInfoTitleContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        // flex: .15,
        flex: 1,
        // alignSelf: 'center',
    },
    exerciseInfoTitle:{
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    exerciseInfoCardImageContainer:{
        width: "100%",
        flex: 1,
        marginTop: 10,
    },
    exerciseInfoBody:{
        flex: 1.3,
    },
    exerciseInfoDescriptionContainer:{
        marginBottom: 0,
        marginTop: 0,
    },
    exerciseInfoImage:{
        width: "100%",
        height: "100%",
        // resizeMode: 'stretch',
        borderRadius: 22,
        borderWidth: 3,
    },
    exerciseInfoDescriptionTitle:{
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    exerciseInfoDescription:{
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    exerciseInfoMuscleGroupsContainer:{
        marginTop: 5
    },
    exerciseInfoMuscleGroupsTitle:{
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    exerciseInfoMuscleGroups:{
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    exerciseInfoOwnerContainer:{
        marginTop: 5
    },
    exerciseInfoOwnerTitle:{
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    exerciseInfoOwner:{
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
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