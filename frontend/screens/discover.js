import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import {Card} from 'react-native-paper';

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
  {Name: 'Arms', id: 10, Exercises: 5},
  {Name: 'Legs', id: 11, Exercises: 6},
  {Name: 'Full Body', id: 12, Exercises: 11},
  {Name: 'Arms', id:13, Exercises: 5},
  {Name: 'Legs', id:14, Exercises: 6},
  {Name: 'Bottom Workout', id: 15, Exercises: 11}
];
const numColumns = 3;

export default function DiscoverPage(props) {

  const [isWorkoutVisible, setWorkoutVisible] = useState(false);
  const [isExerciseVisible, setExerciseVisible] = useState(false);

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
  const showExercise = () => {
      if (!isExerciseVisible) {
        setExerciseVisible(true);
        setWorkoutVisible(false);
  }
}

return (
    <View style = {styles.page}>
      <View style = {styles.discoverHeaderContainer}>
        <View style={styles.discoveryPageHeader}>
          <Text style={styles.discoverTitle}>Discover</Text>
          <Text style={styles.discoverSubtitle}>Refresh your fitness knowledge or learn something new</Text>
          
          <View style={styles.discoverBttnsCntnr}>
            <TouchableOpacity onPress={() =>
                  {
                    showWorkout();
                    handleWorkoutPress();
                  }
                }>
              <View style={styles.discoverWorkoutsBttnsContainer}>
                <Text style={styles.workoutsBttnText}>Workouts</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() =>
                  {
                    showExercise();
                    handleExercisePress();
                  }}>
              <View style={styles.discoverExercisesBttnsContainer}>
                <Text style={styles.exercisesBttnText}>Exercises</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.discoverExerciseContainer}>
          {isExerciseVisible ? <FlatList
            data = {exerciseData}
            style = {styles.boxContainer}
            renderItem = {({item}) => <TouchableOpacity onPress={()=>
            Alert.alert(item.id, item.Name)}><Text style={styles.exerciseItems}>{item.Name}</Text></TouchableOpacity>}
          /> : <FlatList
            data = {workoutData}
            style = {styles.boxContainer}
            renderItem = {({item}) => <TouchableOpacity onPress={()=>
            Alert.alert(item.id, item.Name)}><Text style={styles.workoutItems}>{item.Name}</Text></TouchableOpacity>}
            />}
      </View>
      {/* <View style={styles.discoverWorkoutContainer}>
          {isWorkoutVisible ? <FlatList
            data = {workoutData}
            style = {styles.boxContainer}
            renderItem = {({item}) => <Text style={styles.workoutItems}>{item.Name}</Text>}
  
          /> : <FlatList
            data = {exerciseData}
            style = {styles.boxContainer}
            renderItem = {({item}) => <Text style={styles.exerciseItems}>{item.Name}</Text>}
            />
            }
      </View> */}
    </View>
  )
}


const styles = StyleSheet.create({
  boxContainer:{
    flex: 1,
  },
  workoutItems:{
    backgroundColor: '#4D243D',
    color: "#fff",
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10, 
    //height: Dimensions.get('window') / numColumns,
    flex: 1,
    margin: 1,
 },
  exerciseItems:{
      backgroundColor: '#4D243D',
      color: "#fff",
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
  workoutsBttnText:{
    color: '#12BEF6',
    fontWeight: 'bold',
  },
  exercisesBttnText:{
    color: '#FA7B34',
    fontWeight: 'bold',
  },
  discoverBttnsCntnr:{
    justifyContent: 'center',
    flexDirection: 'row',
  },
  discoverWorkoutsBttnsContainer:{
    backgroundColor: '#DCF1FE',
    margin: 30,
    padding: 15,
    borderRadius: '10rem',
  },
  discoverExercisesBttnsContainer:{
    backgroundColor: '#F8E1D2',
    margin: 30,
    padding: 15,
    borderRadius: '10rem',
  },
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
  discoverWorkoutContainer:{
    backgroundColor: 'pink',
    height: "75.5%"
    //flex: 2,
  },
  discoverExerciseContainer:{
    backgroundColor: 'pink',
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
