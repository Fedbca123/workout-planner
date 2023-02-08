import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-web';
import {Card} from 'react-native-paper';


class DiscoverPage extends React.Component {
  constructor (props)
  {
    super(props);
    this.state = {
        exerciseList:[
            {Name: 'Squats', Sets: 2, Reps: 3},
            {Name: 'Benchpress', Sets: 3, Reps: 5},
            {Name: 'Lunges', Sets: 5, Reps: 5},
            {Name: 'Deadlift', Sets: 1, Reps: 3},
            {Name: 'Skullcrusher', Sets: 4, Reps: 3},
        ],
        workoutList:[
            {Name: 'Arms', Exercises: 5},
            {Name: 'Legs', Exercises: 6},
            {Name: 'Full Body', Exercises: 11}
          ]
    }
  }
  render() {
  return (
    <View>
      <View style={styles.discoveryPageHeader}>
        <Text style={styles.discoverTitle}>Discover</Text>
        <Text style={styles.discoverSubtitle}>Refresh your fitness knowledge or learn something new</Text>
        
        <View style={styles.discoverBttnsCntnr}>
          <TouchableOpacity onPress={console.log("Workouts Pressed")}>
            <View style={styles.discoverWorkoutsBttnsContainer}>
                <Text style={styles.workoutsBttnText}>Workouts</Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={console.log("Exercises Pressed")}>
            <View style={styles.discoverExercisesBttnsContainer}>
              <Text style={styles.exercisesBttnText}>Exercises</Text>
            </View>
          </TouchableOpacity>

          </View>
              <FlatList
                  exerciseData = {this.state.exerciseList}
                  renderItem = {({item}) =>
                    <Card>
                      <View>
                        <Text>Exercise Name</Text>
                        <Text>{item.Name}</Text>
                      </View>
                    </Card>
                  }
                  keyExtractor = {item=>item.Name}

                />
              {/* <StatusBar style= "auto" />*/}
          </View>
    </View>
   );
  }
}
const styles = StyleSheet.create({
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
  container: {
    height: 700,
    //backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
});

export default DiscoverPage;