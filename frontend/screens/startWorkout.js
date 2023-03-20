import React, { useState, useEffect, useInter } from 'react';
import { StyleSheet, View, Image, Text, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import API_Instance from "../../backend/axios_instance";
import CircularProgress from 'react-native-circular-progress-indicator';
import { Timer } from 'react-native-stopwatch-timer'


const StartWorkout = ({ navigation, route }) => {
  const { workout } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState([])
  const [timerDuration, setTimerDuration] = useState(90000);
  const [remainingTime, setRemainingTime] = useState(0.000);
  const [endTime, setEndTime] = useState(new Date().getTime());
  const [isTimerStart, setIsTimerStart] = useState(false);

  useEffect(() => {
    const rawExercises = [...workout.exercises];
    const displayExercises = [];
    for (let i = 0; i < rawExercises.length; i++)
    {
      if (rawExercises[i].exerciseType === 'SETSXREPS')
      {
        for (let j = 0; j < rawExercises[i].sets; j++)
        {
          let tempExercise = {...rawExercises[i]}
          tempExercise.setNumber = j + 1;
          displayExercises.push(tempExercise);
        }
      }
      else
      {
        displayExercises.push(rawExercises[i]);
      }
    }
    setExercises(displayExercises);
  }, [])

  useEffect(() => {
    const currentTime = new Date().getTime();
    const endTime = new Date(currentTime + remainingTime * 1000);
    const interval = setInterval(() => {
      if (isTimerStart)
      {
        let remaining = (endTime - new Date().getTime()) / 1000;
        setRemainingTime(remaining);
        if (remaining <= 0)
        {
          setIsTimerStart(false);
          setRemainingTime(0);
        }
      }
    }, 1);
    return () => clearInterval(interval)
  }, [isTimerStart])


  const handleNext = () => {
    if (exercises[currentExerciseIndex + 1] != null && exercises[currentExerciseIndex + 1].exerciseType !== 'SETSXREPS')
    {
      setTimerDuration(exercises[currentExerciseIndex + 1].time);
      setRemainingTime(exercises[currentExerciseIndex + 1].time);
    }
    setCurrentExerciseIndex(currentExerciseIndex + 1);
  };

  const handleBack = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleStart = () => {
    setIsTimerStart(true);
  }

  const handlePause = () => {
    setIsTimerStart(false);
  }

  const handleReset = () => {
    setIsTimerStart(false);
    setRemainingTime(timerDuration);
  }

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
          <View style={{ flex: 1, alignItems: 'center', marginVertical: 10, marginTop: 30}}>
            <Image source={{uri: exercises[currentExerciseIndex].image}} style={styles.image} />
            <View style={{flex: 1, marginTop: 20, alignContent: 'center'}}>
              <Text style={styles.heading}>{exercises[currentExerciseIndex].title}</Text>
              {exercises[currentExerciseIndex].exerciseType === 'SETSXREPS' ? (
                <>
                  <Text style={styles.text}>{`Set ${exercises[currentExerciseIndex].setNumber} of ${exercises[currentExerciseIndex].sets}`}</Text>
                  <Text style={styles.text}>{`${exercises[currentExerciseIndex].reps} reps`}</Text>
                </>
              ) : (
                <>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.text}>As many reps as possible!</Text>
                    <CircularProgress
                      value={remainingTime}
                      radius={80}
                      duration={0}
                      progressValueColor={'black'}
                      activeStrokeColor={'#FA7B34'}
                      maxValue={timerDuration}
                      title={'Secs'}
                      titleColor={'black'}
                      titleStyle={{fontWeight: 'bold'}}
                      progressFormatter={(value) => {
                        'worklet';
                          
                        return value.toFixed(2);
                      }}
                    />
                    <View style={{flex:1, flexDirection:'row', justifyContent:'center', marginTop:10}}>
                      <Button title="start" onPress={() => handleStart()}/>
                      <Button title="pause" onPress={() => handlePause()}/>
                      <Button title="reset" onPress={() => handleReset()}/>
                    </View>
                    <View style={{flex:3, flexDirection:'row', justifyContent:'center', alignItems: 'flex-start'}}>
                      <Button title="Back" onPress={() => handleBack()}/>
                      <Button title="Skip" onPress={() => handleNext()}/> 
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
          {exercises[currentExerciseIndex].exerciseType === 'SETSXREPS' && <View style={styles.touch}>
            <TouchableOpacity
              style={styles.opacity}
              onPress={handleBack}
            />
            <TouchableOpacity
              style={styles.opacity}
              onPress={handleNext}
            />
          </View>}
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
    marginBottom: 10
	},
	text: {
		fontFamily: "HelveticaNeue",
		fontWeight: 400,
		fontSize: 16,
		fontWeight: "normal",
		color: "#2B2B2B",
		textAlign: "center",
    marginBottom: 20
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
  },
  image: {
    width: '80%', 
    aspectRatio: 1, 
    borderRadius: 10, 
    borderColor: 'black', 
    borderWidth: 3
  }
  
});

export default StartWorkout;