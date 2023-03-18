import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import API_Instance from "../../backend/axios_instance";

const workout = {"_id":{"$oid":"6413de8e5c5b7c27ee312ca5"},"title":"Test Workout`","description":"This is a test workout","image":"https://res.cloudinary.com/djbbyeabd/image/upload/workouts/workoutDefault_m5co8w.jpg","imageId":"workouts/workoutDefault_m5co8w","exercises":[{"title":"Pushups","description":"The classic Pushups exercise","image":"http://res.cloudinary.com/djbbyeabd/image/upload/v1677339810/exercises/itcyvmgvlbus6marx998.jpg","imageId":"exercises/itcyvmgvlbus6marx998","exerciseType":"SETSXREPS","sets":{"$numberInt":"4"},"reps":{"$numberInt":"20"},"time":{"$numberInt":"600"},"restTime":{"$numberInt":"60"},"tags":["Bodyweight","Calisthenics","Pushups"],"muscleGroups":["Chest","Shoulders","Triceps","Core"],"_id":{"$oid":"63fa2ca3f43bb11786b20838"},"createdAt":{"$date":{"$numberLong":"1677339811121"}},"updatedAt":{"$date":{"$numberLong":"1677339811121"}},"__v":{"$numberInt":"0"}},{"title":"Calf Raises Public","description":"Test Calf Raise Exercise","image":"https://res.cloudinary.com/djbbyeabd/image/upload/exercises/exerciseDefault_bgnsno.jpg","imageId":"exercises/exerciseDefault_bgnsno","exerciseType":"SETSXREPS","sets":{"$numberInt":"5"},"reps":{"$numberInt":"30"},"restTime":{"$numberInt":"30"},"tags":["","Body Weight","Calf","Raises","Public"],"muscleGroups":["Legs","Calfs"],"_id":{"$oid":"640100ed07897c9d0ea77846"},"createdAt":{"$date":{"$numberLong":"1677787373593"}},"updatedAt":{"$date":{"$numberLong":"1677787373593"}},"__v":{"$numberInt":"0"}},{"title":"Calf Raises Private","description":"Test Calf Raise Exercise","image":"https://res.cloudinary.com/djbbyeabd/image/upload/exercises/exerciseDefault_bgnsno.jpg","imageId":"exercises/exerciseDefault_bgnsno","exerciseType":"SETSXREPS","sets":{"$numberInt":"3"},"reps":{"$numberInt":"30"},"restTime":{"$numberInt":"30"},"tags":["","Body Weight","Calf","Raises","Private"],"muscleGroups":["Legs","Calfs"],"owner":{"$oid":"63bda2382fd6238bb45af3f6"},"_id":{"$oid":"6401020d6aff280dffd54960"},"createdAt":{"$date":{"$numberLong":"1677787661317"}},"updatedAt":{"$date":{"$numberLong":"1677787661317"}},"__v":{"$numberInt":"0"}}],"duration":{"$numberInt":"20"},"location":"RWC","tags":[null,"Test","Workout`"],"muscleGroups":[],"createdAt":{"$date":{"$numberLong":"1679023758118"}},"updatedAt":{"$date":{"$numberLong":"1679023758118"}},"__v":{"$numberInt":"0"}}

const StartWorkout = ({ navigation, route }) => {
  //const { workout } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    const rawExercises = [...workout.exercises];
    const displayExercises = [];
    for (let i = 0; i < rawExercises.length; i++)
    {
      for (let j = 0; j < rawExercises[i].sets.$numberInt; j++)
      {
        let tempExercise = {...rawExercises[i]}
        tempExercise.setNumber = j + 1;
        displayExercises.push(tempExercise);
      }
    }
    setExercises(displayExercises);
  }, [])

  const handleNext = () => {
    if (currentExerciseIndex === exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const progress = (currentExerciseIndex + 1) / exercises.length;

  const renderCurrentPage = () => {
    if (exercises.length === 0)
    {
      return <></>
    }

    if (currentExerciseIndex === exercises.length) {
      // last page with congratulatory message
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../../assets/congrats.png')} style={{ justifyContent: 'center' }}/>
          <Text style={styles.heading}> Congratulations!</Text>
          <Text style={styles.text}> You have completed your workout.</Text>
          <Button title="Return to Home" onPress={() => { 
            navigation.popToTop();
            navigation.navigate('Home'); 
            }} />
        </View>
      );
    } else {
      // page with exercise information and progress bar
      return (
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', height: 8, backgroundColor: 'white' }}>
            <View style={{ flex: progress, backgroundColor: '#FA7B34' }} />
            <View style={{ flex: 1 - progress, backgroundColor: 'lightgray' }} />
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={{uri: exercises[currentExerciseIndex].image}} style={{ width: 150, height: 150 }} />
            <Text style={styles.heading}>{exercises[currentExerciseIndex].title}</Text>
            {exercises[currentExerciseIndex].exerciseType === 'SETSXREPS' ? (
              <>
                <Text>{`Set ${exercises[currentExerciseIndex].setNumber} of ${exercises[currentExerciseIndex].sets.$numberInt}`}</Text>
                <Text>{`${exercises[currentExerciseIndex].reps.$numberInt} reps`}</Text>
              </>
            ) : (
              <Text>{`${exercises[currentExerciseIndex].time.$numberInt / 1000} seconds`}</Text>
            )}
          </View>
          <View style={styles.touch}>
              <TouchableOpacity
              style={styles.opacity}
              onPress={handleBack}
            />
            <TouchableOpacity
              style={styles.opacity}
              onPress={handleNext}
            />
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {renderCurrentPage()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  heading: {
		color: "#2B2B2B",
		fontFamily: "HelveticaNeue-Bold",
		fontSize: 24,
		textAlign: "center",
		paddingBottom: 5,
	},
	text: {
		fontFamily: "HelveticaNeue",
		fontWeight: 400,
		fontSize: 16,
		fontWeight: "normal",
		color: "#2B2B2B",
		textAlign: "center",
	},
  touch: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  opacity: {
    flex: 1,
    backgroundColor: 'transparent',
  }
});

export default StartWorkout;