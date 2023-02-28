import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, Button, SafeAreaView } from 'react-native';

const exercises = [
  // this image I used is not open source and we should not keep it for the future
  { title: 'Pec Fly', type: 'AMRAP', time: 60000, image: require('../../assets/pecfly.png')},
  { title: 'Decline Barbell Bench Press', type: 'SETXREPS', sets: 3, reps: 8, image: require('../../assets/declinebarbellbenchpress.jpeg') },
  { title: 'Incline Dumbbell Press', type: 'SETXREPS', sets: 5, reps: 9, image: require('../../assets/inclinedumbbellpress.jpeg')},
  { title: 'Climbing Session', type: 'CARDIO', time: 80000, image: require('../../assets/climbing.png') },
];

const StartWorkout = (props) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

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
    if (currentExerciseIndex === exercises.length) {
      // last page with congratulatory message
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../../assets/congrats.png')} style={{ justifyContent: 'center' }}/>
          <Text style={styles.heading}> Congratulations!</Text>
          <Text style={styles.text}> You have completed your workout.</Text>
          <Button title="Return to Home" onPress={() => {props.navigation.navigate('home');}} />
        </View>
      );
    } else {
      // page with exercise information and progress bar
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', height: 10, backgroundColor: '#FFFFFF' }}>
            <View style={{ flex: progress, backgroundColor: '#FEE2CF' }} />
            <View style={{ flex: 1 - progress, backgroundColor: 'lightgray' }} />
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={exercises[currentExerciseIndex].image} style={{ width: 150, height: 150 }} />
            <Text style={styles.heading}>{exercises[currentExerciseIndex].title}</Text>
            {exercises[currentExerciseIndex].type === 'SETXREPS' ? (
              <Text>{`${exercises[currentExerciseIndex].sets} sets x ${exercises[currentExerciseIndex].reps} reps`}</Text>
            ) : (
              <Text>{`${exercises[currentExerciseIndex].time / 1000} seconds`}</Text>
            )}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button title="Back" onPress={handleBack} disabled={currentExerciseIndex === 0} />
            <Button title={currentExerciseIndex === exercises.length - 1 ? "Finish" : "Next"} onPress={handleNext} />
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {renderCurrentPage()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default StartWorkout;