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
        <View style={{flex: 1}}>
            {/* <View style={{display:"flex", flex:1, justifyContent:"space-evenly"}}> */}
                <View style={styles.exerciseInfoHeader}>
                    <View style={styles.exerciseInfoTitleContainer}>
                        <Text style={styles.exerciseInfoTitle}>{exercise.title}</Text>
                    </View>
                    <View style={styles.exerciseInfoCardImageContainer}>
                        <Image style={styles.exerciseInfoImage} src={exercise.image} />
                    </View>
                </View>

                <View style={styles.exerciseInfoBody}>
                    <ScrollView>
                {/* <ScrollView contentContainerStyle={{marginBottom: 5}}> */}
                        <View style={styles.exerciseInfoDescriptionContainer}>
                            <Text style={styles.exerciseInfoDescriptionTitle}>Description:</Text>
                            <Text style={styles.exerciseInfoDescription}>{exercise.description}</Text>
                        </View>

                        <View style={styles.exerciseInfoMuscleGroupsContainer}>
                            <Text style={styles.exerciseInfoMuscleGroupsTitle}>Muscle Groups:</Text>
                            <Text style={styles.exerciseInfoMuscleGroups}>{exercise.muscleGroups && exercise.muscleGroups.join(", ")}</Text>
                        </View>

                        {/* <View style={styles.exerciseInfoOwnerContainer}>
                            <Text style={styles.exerciseInfoOwnerTitle}>Exercise Owner:</Text> 
                            <Text style={styles.exerciseInfoOwner}>{exercise.tags && exercise.tags.join(", ")}</Text> 
                        </View>  */}
                    </ScrollView>

                </View>

                <View style={styles.modalCloseButton}>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={() => {setModalVisbility(false)}}>
                        <View style={styles.closeButtonContainer}>
                        <Text style={styles.closeText}>Close</Text>
                        </View>
                    </TouchableOpacity> 
                </View>
        {/* </View> */}
    </View>
        
    )
}

const styles = StyleSheet.create({
    exerciseInfoMuscleGroupsContainer:{
        marginTop: 5
    },
    exerciseInfoMuscleGroupsTitle:{
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
	exerciseInfoHeader:{
        flex: 1.5,
        // borderWidth: 2,
    },
    exerciseInfoDescriptionTitle:{
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    exerciseInfoTitleContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flex: .2,
    },
    exerciseInfoCardImageContainer:{
        width: "100%",
        flex: 1,
    },
    exerciseInfoTitle:{


        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    exerciseInfoImage:{

        width: "100%",
        height: "100%",
        borderRadius: 22,
        borderWidth: 3,
    },
    exerciseInfoDescriptionContainer:{
        // borderWidth: 2
        marginTop: 10,
    },
    exerciseInfoBody:{
        flex: 1.3,
        // borderWidth: 2,
    },
    exerciseInfoDescription:{

        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',

    },
    exerciseInfoMuscleGroups:{

        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    exerciseInfoOwner:{
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    closeButtonContainer:{
        backgroundColor: 'white',
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    closeText:{
        fontWeight: 'bold',
        color: 'black',
        fontSize: 30,
        paddingHorizontal: 8,
        // borderRadius: "20rem",
    },

    modalCloseButton:{
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: "black",
    // borderWidth: 3,
    borderRadius: 20,
    paddingHorizontal: 10,
    // top:"-95%"  
  },
    
})