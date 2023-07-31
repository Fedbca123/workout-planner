import React, { useState, useEffect, useInter } from 'react';
import { StyleSheet, View, Image, Text, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import API_Instance from "../../backend/axios_instance";
import CircularProgress from 'react-native-circular-progress-indicator';
import { useGlobalState } from "../GlobalState.js";
import { Icon } from 'react-native-elements';

const StartWorkout = ({ navigation, route }) => {
  const [globalState, updateGlobalState] = useGlobalState();
  const { workout } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState([{}])
  const [timerDuration, setTimerDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTimerStart, setIsTimerStart] = useState(false);

  useEffect(() => {
    const rawExercises = [...workout.exercises];
    const displayExercises = [];
    displayExercises.push("");
    for (let i = 0; i < rawExercises.length; i++)
    {
      if (rawExercises[i].exerciseType === 'SETSXREPS' || rawExercises[i].exerciseType === 'AMRAP' )
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
        setRemainingTime(remaining.toFixed(0));
        if (remaining <= 0)
        {
          setIsTimerStart(false);
          setRemainingTime(0);
        }
      }
    }, 1);
    return () => clearInterval(interval)
  }, [isTimerStart])

  useEffect(() => {
    if (currentExerciseIndex === exercises.length)
    {
      // Complete Workout Endpoint
      API_Instance
      .patch(`users/${globalState.user._id}/workouts/complete/${workout._id}`,{}, {
        headers: {
          'authorization': `bearer ${globalState.authToken}`,
        }
      })
      .then((response) => {
        if (response.status == 200) {
          console.log("Success!");
        }
      })
      .catch((e) => {
        console.log(e)
      });
    }
  }, [currentExerciseIndex])


  const handleNext = () => {
    if (exercises[currentExerciseIndex + 1] != null && (exercises[currentExerciseIndex+1].exerciseType === 'AMRAP' || exercises[currentExerciseIndex+1].exerciseType === 'CARDIO'))
    {
      setTimerDuration(+exercises[currentExerciseIndex+1].time);
      setRemainingTime(+exercises[currentExerciseIndex+1].time);
    }
    setCurrentExerciseIndex(currentExerciseIndex + 1);
  };

  const handleBack = () => {
    if (currentExerciseIndex > 0) {
    if ((exercises[currentExerciseIndex-1].exerciseType === 'AMRAP' || exercises[currentExerciseIndex-1].exerciseType === 'CARDIO'))
    {
      setTimerDuration(+exercises[currentExerciseIndex-1].time);
      setRemainingTime(+exercises[currentExerciseIndex-1].time);
    }
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

  const progress = (currentExerciseIndex - 1) / (exercises.length - 1);

  const renderCurrentPage = () => {
    if (exercises.length === 0 || currentExerciseIndex == 0)
    {
      return (
        <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
          <Image source={{uri: workout.image}} style={[styles.image, {marginBottom: 50, borderRadius: 1000000, borderColor: globalState.theme.colorText}]}/>
          <Text style={[styles.heading, {color: globalState.theme.colorText}]}> {workout.title}</Text>
          <View style={{flex:1, justifyContent: 'center', width: '30%'}}>
            <TouchableOpacity style={[styles.beginButton, {backgroundColor: globalState.theme.color1, borderColor: globalState.theme.colorText}]} onPress={() => handleNext()}>
              <Text style={{color: globalState.theme.colorText}}>Begin</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else if (currentExerciseIndex === exercises.length) {
      // last page with congratulatory message
      return (
        <View style={{ flex: 1, alignItems: 'center', marginTop: 40, backgroundColor: globalState.theme.colorBackground}}>
          <Image source={{uri: workout.image}} style={[styles.image, {marginBottom: 50, borderRadius: 1000000}]}/>
          <Text style={[styles.heading, {color: globalState.theme.colorText}]}> Congratulations!</Text>
          <Text style={[styles.text, {color: globalState.theme.colorText}]}> You have completed {workout.title}.</Text>
          <View style={{flex:1, width: '30%'}}>
            <TouchableOpacity 
              style={[styles.beginButton, {backgroundColor: globalState.theme.color1, borderColor: globalState.theme.colorText}]} 
              onPress={() => {
              navigation.popToTop();
              navigation.navigate('Home'); 
              }}>
              <Text style={{color: globalState.theme.colorText}}>Return to Home</Text>
            </TouchableOpacity>
          </View>  
        </View>
      );
    } else {
      // page with exercise information and progress bar
      return (
        <View style={[styles.container, {backgroundColor: globalState.theme.colorBackground}]}>
          <View style={{flexDirection: 'column'}}>
            <TouchableOpacity style={{alignItems: 'flex-start', marginLeft: 5}}
              onPress={()=> {
                navigation.popToTop();
                navigation.navigate('Home'); 
              }}>
              <Icon
                size={35}
                name='clear'
                type='material'
                color={globalState.theme.colorText}/>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', height: 8, backgroundColor: 'white' }}>
              <View style={{ flex: progress, backgroundColor: '#FA7B34' }} />
              <View style={{ flex: 1 - progress, backgroundColor: 'lightgray' }} />
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'center', marginVertical: 10, marginTop: 30}}>
            <Image source={{uri: exercises[currentExerciseIndex].image}} style={styles.image} />
            <View style={{flex: 1, marginTop: 20, alignContent: 'center'}}>
              <Text style={[styles.heading, {color: globalState.theme.colorText}]}>{exercises[currentExerciseIndex].title}</Text>
              {exercises[currentExerciseIndex].exerciseType === 'SETSXREPS' &&
                <View style={{flex: 1, marginTop: '20%'}}>
                  <Text style={[styles.text2, {marginBottom: 40, color: globalState.theme.colorText}]}>{`Set ${exercises[currentExerciseIndex].setNumber} of ${exercises[currentExerciseIndex].sets}`}</Text>
                  <Text style={[styles.text2, {color: globalState.theme.colorText}]}>{`${exercises[currentExerciseIndex].weight} lbs for ${exercises[currentExerciseIndex].reps} reps`}</Text>
                </View>}
              {exercises[currentExerciseIndex].exerciseType === 'CARDIO' &&
                <View style={{alignItems: 'center', justifyContent: 'space-between', flex: 1}}>
                    <Text style={[styles.text, { color: globalState.theme.colorText}]}>Cardio!</Text>
                    <CircularProgress
                      value={remainingTime}
                      radius={80}
                      duration={0}
                      progressValueColor={globalState.theme.colorText}
                      activeStrokeColor={'#FA7B34'}
                      maxValue={timerDuration}
                      titleColor={globalState.theme.colorText}
                      progressFormatter={(value) => {
                        'worklet';
                        let m = Math.floor(value / 60);
                        let s = value % 60;
                        let secs = "";
                        let mins = "";
                        if (s < 10)
                        {
                          secs = "0" + s.toString();
                        }
                        else 
                        {
                          secs = s.toString();
                        }

                        if (m < 10)
                        {
                          mins = "0" + m.toString();
                        }
                        else 
                        {
                          mins = m.toString();
                        }

                        return `${mins}:${secs}`
                      }}
                    />
                    <View style={{flexDirection:'row', justifyContent:'center', height:"20%"}}>
                      <Button title="start" onPress={() => handleStart()}/>
                      <Button title="pause" onPress={() => handlePause()}/>
                      <Button title="reset" onPress={() => handleReset()}/>
                    </View>
                </View>}
              {exercises[currentExerciseIndex].exerciseType === 'AMRAP' &&
                <View style={{alignItems: 'center', justifyContent: 'space-between', flex: 1}}>
                  <Text style={[styles.text2, {marginBottom: 0, color: globalState.theme.colorText}]}>{`Set ${exercises[currentExerciseIndex].setNumber} of ${exercises[currentExerciseIndex].sets}`}</Text>
                  <Text style={[styles.text2, {marginBottom: 0, color: globalState.theme.colorText}]}>{`${exercises[currentExerciseIndex].weight}lbs`}</Text>
                  <Text style={[styles.text, {color: globalState.theme.colorText}]}>As many reps as possible!</Text>
                  <CircularProgress
                    value={remainingTime}
                    radius={80}
                    duration={0}
                    progressValueColor={globalState.theme.colorText}
                    activeStrokeColor={'#FA7B34'}
                    maxValue={timerDuration}
                    titleColor={globalState.theme.colorText}
                    progressFormatter={(value) => {
                      'worklet';
                      let m = Math.floor(value / 60);
                      let s = value % 60;
                      let secs = "";
                      let mins = "";
                      if (s < 10)
                      {
                        secs = "0" + s.toString();
                      }
                      else 
                      {
                        secs = s.toString();
                      }

                      if (m < 10)
                      {
                        mins = "0" + m.toString();
                      }
                      else 
                      {
                        mins = m.toString();
                      }

                      return `${mins}:${secs}`
                    }}
                  />
                  <View style={{flexDirection:'row', justifyContent:'center', height:"20%"}}>
                    <Button title="start" onPress={() => handleStart()}/>
                    <Button title="pause" onPress={() => handlePause()}/>
                    <Button title="reset" onPress={() => handleReset()}/>
                  </View>
              </View>}
            </View>
          </View>

          {/* Touch and move icons for setsXreps (no timer) */}
          <View style={[styles.touch, { marginTop: 40, height: '85%'}]}>
            <TouchableOpacity
              style={[styles.opacity, {alignItems: 'flex-start'}]}
              onPress={handleBack}>
              <Text style={styles.moveIcon}>{'<'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.opacity, {alignItems: 'flex-end'}]}
              onPress={handleNext}>
              <Text style={styles.moveIcon}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: globalState.theme.colorBackground}}>
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
    ...Platform.select({
      ios: {
        fontFamily: 'HelveticaNeue-Bold'
      },
      android: {
        fontFamily: "Roboto"
      },
    }),
		// fontFamily: "HelveticaNeue-Bold",
		fontSize: 24,
		textAlign: "center",
    marginBottom: 10
	},
  text: {
    ...Platform.select({
      ios: {
        fontFamily: 'HelveticaNeue-Bold'
      },
      android: {
        fontFamily: "Roboto"
      },
    }),
		// fontFamily: "HelveticaNeue",
		fontWeight: 400,
		fontSize: 16,
		fontWeight: "normal",
		color: "#2B2B2B",
		textAlign: "center",
    marginBottom: 20
	},
  text2: {
    ...Platform.select({
      ios: {
        fontFamily: 'HelveticaNeue'
      },
      android: {
        fontFamily: "Roboto"
      },
    }),
		// fontFamily: "HelveticaNeue",
		fontWeight: 400,
		fontSize: 20,
		fontWeight: "bold",
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
    zIndex: 0,
    justifyContent: 'center',
    // borderWidth: 2,
  },
  image: {
    height: '40%', 
    aspectRatio: 1, 
    borderRadius: 10, 
    borderColor: 'black', 
    borderWidth: 3
  },
  beginButton: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#E0F0FE",
    alignItems: 'center',
    justifyContent: 'center',
    height: '15%'
  },
  moveIcon: {
    fontSize: 40,
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
    marginHorizontal: 8,
    marginTop: 60,
    color: 'gray'
    //borderWidth: 2
  },
  touchIconView: {
    flexDirection: 'row',
    position: 'absolute',
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-between',
    top: 40,
    left: 0,
    right: 0,
    bottom: 0,
    zindex: 1,
    // borderWidth: 2,
    // marginTop: 5,
    // overflow: "visible"
  }
  
});

export default StartWorkout;