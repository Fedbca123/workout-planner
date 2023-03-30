import React, { useState, useEffect, useInter } from 'react';
import { StyleSheet, View, Image, Text, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import API_Instance from "../../backend/axios_instance";
import CircularProgress from 'react-native-circular-progress-indicator';
import { useGlobalState } from "../GlobalState.js";
import { Icon } from 'react-native-elements';

const workout1={
  "_id": "64167911f5e0a64f6c02a720",
  "title": "Blah",
  "description": "Blah",
  "image": "https://res.cloudinary.com/djbbyeabd/image/upload/v1676577900/workouts/workoutDefault_m5co8w.jpg",
  "imageId": "workouts/workoutDefault_m5co8w.jpg",
  "exercises": [
    {
      "title": "Pushups",
      "description": "The classic Pushups exercise",
      "image": "https://res.cloudinary.com/djbbyeabd/image/upload/v1676577889/exercises/exerciseDefault_bgnsno.jpg",
      "imageId": "exercises/itcyvmgvlbus6marx998",
      "exerciseType": "AMRAP",
      "sets": "1",
      "reps": "2",
      "time": "600",
      "weight": "3",
      "restTime": "60",
      "tags": [
        "Bodyweight",
        "Calisthenics",
        "Pushups"
      ],
      "muscleGroups": [
        "Chest",
        "Shoulders",
        "Triceps",
        "Core"
      ],
      "_id": "63fa2ca3f43bb11786b20838",
      "createdAt": {
        "$date": {
          "$numberLong": "1677339811121"
        }
      },
      "updatedAt": {
        "$date": {
          "$numberLong": "1677339811121"
        }
      },
      "__v": {
        "$numberInt": "0"
      }
    },
    {
      "title": "Calf Raises Public",
      "description": "Test Calf Raise Exercise",
      "image": "https://res.cloudinary.com/djbbyeabd/image/upload/v1676577889/exercises/exerciseDefault_bgnsno.jpg",
      "imageId": "exercises/exerciseDefault_bgnsno",
      "exerciseType": "SETSXREPS",
      "sets":"1",
      "reps":"2",
      "weight": "3",
      "restTime": "30",
      "tags": [
        "",
        "Body Weight",
        "Calf",
        "Raises",
        "Public"
      ],
      "muscleGroups": [
        "Legs",
        "Calfs"
      ],
      "_id":"640100ed07897c9d0ea77846",
      "createdAt": {
        "$date": {
          "$numberLong": "1677787373593"
        }
      },
      "updatedAt": {
        "$date": {
          "$numberLong": "1677787373593"
        }
      },
      "__v": {
        "$numberInt": "0"
      }
    },
    {
      "title": "QQQ",
      "description": "Deez Nutta",
      "image": "https://res.cloudinary.com/djbbyeabd/image/upload/v1676577889/exercises/exerciseDefault_bgnsno.jpg",
      "imageId": "exercises/wvkeriew03ffbzxwqffa",
      "exerciseType": "AMRAP",
      "sets": "1",
      "time": "3",
      "weight": "2",
      "tags": [
        "BodyWeight/None,Dumbbells",
        "QQQ"
      ],
      "muscleGroups": [
        "Chest,Lats,Biceps"
      ],
      "owner": {
        "$oid": "63e03004bcfba81ffcec233d"
      },
      "_id": {
        "$oid": "6413df51c128ea8b89f0de6b"
      },
      "createdAt": {
        "$date": {
          "$numberLong": "1679023953736"
        }
      },
      "updatedAt": {
        "$date": {
          "$numberLong": "1679023953736"
        }
      },
      "__v": {
        "$numberInt": "0"
      }
    }
  ],
  "duration": "69",
  "location": "UCF",
  "recurrence": true,
  "scheduledDate": {
    "$date": {
      "$numberLong": "1679971825000"
    }
  },
  "tags": [
    "Bodyweight",
    "Calisthenics",
    "Pushups",
    "",
    "Body Weight",
    "Calf",
    "Raises",
    "Public",
    "BodyWeight/None,Dumbbells",
    "QQQ",
    "Blah"
  ],
  "muscleGroups": [
    "Chest",
    "Shoulders",
    "Triceps",
    "Core",
    "Legs",
    "Calfs",
    "Chest,Lats,Biceps"
  ],
  "owner": "63e03004bcfba81ffcec233d",
  "createdAt": {
    "$date": {
      "$numberLong": "1679194385547"
    }
  },
  "updatedAt": {
    "$date": {
      "$numberLong": "1679346677691"
    }
  },
  "__v": {
    "$numberInt": "0"
  }
}

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
          <Image source={{uri: workout.image}} style={[styles.image, {marginBottom: 50, borderRadius: 1000000}]}/>
          <Text style={styles.heading}> {workout.title}</Text>
          <View style={{flex:1, justifyContent: 'center', width: '30%'}}>
            <TouchableOpacity style={styles.beginButton} onPress={() => handleNext()}>
              <Text>Begin</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else if (currentExerciseIndex === exercises.length) {
      // last page with congratulatory message
      return (
        <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
          <Image source={{uri: workout.image}} style={[styles.image, {marginBottom: 50, borderRadius: 1000000}]}/>
          <Text style={styles.heading}> Congratulations!</Text>
          <Text style={styles.text}> You have completed {workout.title}.</Text>
          <View style={{flex:1, width: '30%'}}>
            <TouchableOpacity 
              style={styles.beginButton} 
              onPress={() => {
              navigation.popToTop();
              navigation.navigate('Home'); 
              }}>
              <Text>Return to Home</Text>
            </TouchableOpacity>
          </View>  
        </View>
      );
    } else {
      // page with exercise information and progress bar
      return (
        <View style={styles.container}>
          <View style={{flexDirection: 'column'}}>
            <TouchableOpacity style={{alignItems: 'flex-start', marginLeft: 5}}
              onPress={()=> {
                navigation.popToTop();
                navigation.navigate('Home'); 
              }}>
              <Icon
                size={35}
                name='clear'
                type='material'/>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', height: 8, backgroundColor: 'white' }}>
              <View style={{ flex: progress, backgroundColor: '#FA7B34' }} />
              <View style={{ flex: 1 - progress, backgroundColor: 'lightgray' }} />
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'center', marginVertical: 10, marginTop: 30}}>
            <Image source={{uri: exercises[currentExerciseIndex].image}} style={styles.image} />
            <View style={{flex: 1, marginTop: 20, alignContent: 'center'}}>
              <Text style={styles.heading}>{exercises[currentExerciseIndex].title}</Text>
              {exercises[currentExerciseIndex].exerciseType === 'SETSXREPS' &&
                <View style={{flex: 1, marginTop: '20%'}}>
                  <Text style={[styles.text2, {marginBottom: 40}]}>{`Set ${exercises[currentExerciseIndex].setNumber} of ${exercises[currentExerciseIndex].sets}`}</Text>
                  <Text style={styles.text2}>{`${exercises[currentExerciseIndex].weight} lbs for ${exercises[currentExerciseIndex].reps} reps`}</Text>
                </View>}
              {exercises[currentExerciseIndex].exerciseType === 'CARDIO' &&
                <View style={{alignItems: 'center', justifyContent: 'space-between', flex: 1}}>
                    <Text style={styles.text}>Cardio!</Text>
                    <CircularProgress
                      value={remainingTime}
                      radius={80}
                      duration={0}
                      progressValueColor={'black'}
                      activeStrokeColor={'#FA7B34'}
                      maxValue={timerDuration}
                      title={'Seconds'}
                      titleColor={'black'}
                      progressFormatter={(value) => {
                        'worklet';
              
                        return value;
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
                  <Text style={[styles.text2, {marginBottom: 0}]}>{`Set ${exercises[currentExerciseIndex].setNumber} of ${exercises[currentExerciseIndex].sets}`}</Text>
                  <Text style={[styles.text2, {marginBottom: 0}]}>{`${exercises[currentExerciseIndex].weight}lbs`}</Text>
                  <Text style={styles.text}>As many reps as possible!</Text>
                  <CircularProgress
                    value={remainingTime}
                    radius={80}
                    duration={0}
                    progressValueColor={'black'}
                    activeStrokeColor={'#FA7B34'}
                    maxValue={timerDuration}
                    title={'Seconds'}
                    titleColor={'black'}
                    progressFormatter={(value) => {
                      'worklet';
            
                      return value;
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
		// fontFamily: "HelveticaNeue-Bold",
		fontSize: 24,
		textAlign: "center",
    marginBottom: 10
	},
	text: {
		// fontFamily: "HelveticaNeue",
		fontWeight: 400,
		fontSize: 16,
		fontWeight: "normal",
		color: "#2B2B2B",
		textAlign: "center",
    marginBottom: 20
	},
  text2: {
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