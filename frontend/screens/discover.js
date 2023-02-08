import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import {Card} from 'react-native-paper';

const exerciseData = [
  {Name: 'Top', Sets: 2, Reps: 3},
  {Name: 'Benchpress', Sets: 3, Reps: 5},
  {Name: 'Lunges', Sets: 5, Reps: 5},
  {Name: 'Deadlift', Sets: 1, Reps: 3},
  {Name: 'Skullcrusher', Sets: 4, Reps: 3},
  {Name: 'Squats', Sets: 2, Reps: 3},
  {Name: 'Benchpress', Sets: 3, Reps: 5},
  {Name: 'Lunges', Sets: 5, Reps: 5},
  {Name: 'Deadlift', Sets: 1, Reps: 3},
  {Name: 'Skullcrusher', Sets: 4, Reps: 3},
  {Name: 'Squats', Sets: 2, Reps: 3},
  {Name: 'Benchpress', Sets: 3, Reps: 5},
  {Name: 'Lunges', Sets: 5, Reps: 5},
  {Name: 'Deadlift', Sets: 1, Reps: 3},
  {Name: 'Bottom', Sets: 4, Reps: 3},
];
const workoutData = [
  {Name: 'Arms', Exercises: 5},
  {Name: 'Legs', Exercises: 6},
  {Name: 'Full Body', Exercises: 11}
];
const numColumns = 3;

class DiscoverPage extends React.Component {

  constructor (props)
  {
   // const [listShowing, setListShowing] = useState("");

    super(props);
    this.handleExercisePress = this.handleExercisePress.bind(this);
    this.handleWorkoutPress = this.handleWorkoutPress.bind(this);
  }

  handleExercisePress(){
    console.log("Exercise button pressed");
  }

  handleWorkoutPress(){
    console.log("Workout button pressed");
  }

  displayWorkoutInfo(item){
    Alert.alert('Workout Info')
  }

  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={()=>
      {
        this.displayWorkoutInfo(item);
      }}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.Name}</Text>
          <Text style={styles.itemText}>Reps: {item.Reps} Sets: {item.Sets}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
  return (
    <View style = {styles.page}>
      <View style = {styles.discoverHeaderContainer}>
        <View style={styles.discoveryPageHeader}>
          <Text style={styles.discoverTitle}>Discover</Text>
          <Text style={styles.discoverSubtitle}>Refresh your fitness knowledge or learn something new</Text>
          
          <View style={styles.discoverBttnsCntnr}>
            <TouchableOpacity onPress={() =>
                  {
                    this.handleWorkoutPress
                   // setListShowing(workout)
                  }}>
              <View style={styles.discoverWorkoutsBttnsContainer}>
                <Text style={styles.workoutsBttnText}>Workouts</Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={() =>
                  {
                    this.handleExercisePress
                   // setListShowing(exercise)
                  }}>
              <View style={styles.discoverExercisesBttnsContainer}>
                <Text style={styles.exercisesBttnText}>Exercises</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.discoverBodyContainer}>
         
          <FlatList
            data = {exerciseData}
            style = {styles.boxContainer}
            renderItem = {this.renderItem}
            //numColumns = {numColumns}
  
          />
          {/* <StatusBar style= "auto" />*/}
      </View>
    </View>
    );
  }
}
const styles = StyleSheet.create({
  boxContainer:{
    flex: 1,
    
  },
   item:{
      backgroundColor: '#4D243D',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10, 
      //height: Dimensions.get('window') / numColumns,
      flex: 1,
      margin: 1,
   },
   itemText:{
      color: "#fff"
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
  discoverBodyContainer:{
    backgroundColor: 'pink',
    height: "76%"
   // flex: 2,
  },
  discoverHeaderContainer:{
    backgroundColor: 'white',
    //flex: 1,
  },
  page:{
  },
  container: {
  //  height: 700,
    //backgroundColor: '#fff',
    //alignItems: 'stretch',
    //justifyContent: 'space-evenly',
  },
});

export default DiscoverPage;