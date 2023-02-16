import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {Switch, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import {Card} from 'react-native-paper';
import Toggle from "react-native-toggle-element";

const exerciseData = [
  {Name: 'Top Exercise', id: 1, Sets: 2, Reps: 3},
  {Name: 'Benchpress', id: 2, Sets: 3, Reps: 5},
  {Name: 'Lunges', id: 3, Sets: 5, Reps: 5},
  {Name: 'Deadlift', id: 4, Sets: 1, Reps: 3},
  {Name: 'Skullcrusher', id: 5, Sets: 4, Reps: 3},
  {Name: 'Squats', id: 6, Sets: 2, Reps: 3},
  {Name: 'Benchpress', id: 7, Sets: 3, Reps: 5},
  {Name: 'Lunges', id: 8, Sets: 5, Reps: 5},
  {Name: 'Deadlift', id: 9, Sets: 1, Reps: 3},
  {Name: 'Skullcrusher', id: 10, Sets: 4, Reps: 3},
  {Name: 'Squats', id: 11, Sets: 2, Reps: 3},
  {Name: 'Benchpress', id: 12, Sets: 3, Reps: 5},
  {Name: 'Lunges', id: 13, Sets: 5, Reps: 5},
  {Name: 'Deadlift', id: 14, Sets: 1, Reps: 3},
  {Name: 'Bottom Exercise', id: 15, Sets: 4, Reps: 3},
];
const workoutData = [
  {Name: 'Top Workout', id: 1, Exercises: 5},
  {Name: 'Legs', id: 2, Exercises: 6},
  {Name: 'Full Body', id: 3, Exercises: 11},
  {Name: 'Arms', id: 4, Exercises: 5},
  {Name: 'Legs', id: 5, Exercises: 6},
  {Name: 'Full Body', id: 6, Exercises: 11},
  {Name: 'Arms', id: 7, Exercises: 5},
  {Name: 'Legs', id: 8, Exercises: 6},
  {Name: 'Full Body', id: 9, Exercises: 11},
  {Name: 'Bottom Workout', id: 10, Exercises: 5},
];

export default function DiscoverPage(props) {

  // const [isWorkoutVisible, setWorkoutVisible] = useState(false);
  // const [isExerciseVisible, setExerciseVisible] = useState(false);

  const [toggleValue, setToggleValue] = useState(false);



  function handleExercisePress() {
    console.log("Exercise button pressed");
  }

  function handleWorkoutPress() {
    console.log("Workout button pressed");
  }

  function showWorkout() {
      if (!isWorkoutVisible){
        setWorkoutVisible(true);
        setExerciseVisible(false);
      }
  }
  function showExercise() {
      if (!isExerciseVisible) {
        setExerciseVisible(true);
        setWorkoutVisible(false);
  }
}

return (
    <SafeAreaView style = {styles.page}>
      <View style = {styles.discoverHeaderContainer}>
        <View style={styles.discoveryPageHeader}>


          <Text style={styles.discoverTitle}>Discover</Text>
          <Text style={styles.discoverSubtitle}>Refresh your fitness knowledge or learn something new</Text>
          <View style={styles.toggleButton}>
          <Toggle 
            value = {toggleValue}
            onPress = {(newState) => setToggleValue(newState)}
            leftTitle = "Workouts"
            rightTitle = "Exercises"
                      
              trackBar={{
              width: 180,
              height: 50,
              //radius: 40,
             borderWidth: -1,
            }}
          
            thumbButton={{
              width: 80,
              height: 50,
              radius: 30,
              borderWidth: 1
              }}
            />
            
            </View> 
            
            <View style={styles.discoverExerciseContainer}>
            {toggleValue ? <FlatList
            data = {exerciseData}
            style = {styles.boxContainer}
            renderItem = {({item}) => <TouchableOpacity onPress={()=>
            Alert.alert(item.Name)}><Text style={styles.exerciseItems}>{item.id}{". "}{item.Name}</Text></TouchableOpacity>}
              /> : <FlatList
            data = {workoutData}
            style = {styles.boxContainer}
            renderItem = {({item}) => <TouchableOpacity onPress={()=>
            Alert.alert(item.Name)}><Text style={styles.workoutItems}>{item.id}{". "}{item.Name}</Text></TouchableOpacity>}
            />}
              </View>
        </View>
      </View>

    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  boxContainer:{
    flex: 1,
  },
  workoutItems:{
    backgroundColor: '#3377ff',
    color: "#33ff9c",
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10, 
    //height: Dimensions.get('window') / numColumns,
    flex: 1,
    margin: 1,
 },
  exerciseItems:{
      backgroundColor: '#8333ff',
      color: "#ddff33",
      justifyContent: 'center',
      textAlign: 'center',
      padding: 10, 
      //height: Dimensions.get('window') / numColumns,
      flex: 1,
      margin: 1,
   },

  discoveryPageHeader:{
    backgroundColor: 'white',
  },
  toggleButton:{
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 20
  },
  // workoutsBttnText:{
  //   color: '#12BEF6',
  //   fontWeight: 'bold',
  // },
  // exercisesBttnText:{
  //   color: '#FA7B34',
  //   fontWeight: 'bold',
  // },
  // discoverBttnsCntnr:{
  //   justifyContent: 'center',
  //   flexDirection: 'row',
  // },
  // discoverWorkoutsBttnsContainer:{
  //   backgroundColor: '#DCF1FE',
  //   margin: 30,
  //   padding: 15,
  //   borderRadius: '10rem',
  // },
  // discoverExercisesBttnsContainer:{
  //   backgroundColor: '#F8E1D2',
  //   margin: 30,
  //   padding: 15,
  //   borderRadius: '10rem',
  // },
  discoverTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  },
  discoverSubtitle:{
    padding: 10,
    opacity: .45,
  },
  discoverExerciseContainer:{
    backgroundColor: 'salmon',
    height: "75.5%",
    //flex: 2,
  },
  discoverHeaderContainer:{
    backgroundColor: 'white',
    //flex: 1,
  },
  page:{
    //height: 600,
  },
  container: {
  //  height: 700,
    //backgroundColor: '#fff',
    //alignItems: 'stretch',
    //justifyContent: 'space-evenly',
  },
});
