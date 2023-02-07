import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const startWorkout = () => {
  const [index, setIndex] = useState(0);
  const [workouts, setWorkouts] = useState([
    { exercise: 'Push-Ups', reps: 10, image: require('./pushup.jpg') },
    { exercise: 'Squats', reps: 15, image: require('./squats.jpg') },
    { exercise: 'Lunges', reps: 12, image: require('./lunges.jpg') },
    { exercise: 'Plank', reps: 30, image: require('./plank.jpg') },
  ]);

  const handleNext = () => {
    if (index === workouts.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={workouts[index].image} />
      <Text style={{ fontSize: 20 }}>{workouts[index].exercise}</Text>
      <Text style={{ fontSize: 20 }}>{workouts[index].reps} reps</Text>
      <TouchableOpacity onPress={handleNext}>
        <Text style={{ fontSize: 20 }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default startWorkout;