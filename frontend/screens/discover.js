import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function DiscoverPage(props) {
  return (
    <View>
      <View style={styles.discoveryPageHeader}>
        <Text style={styles.discoverTitle}>Discover</Text>
        <Text style={styles.discoverSubtitle}>Refresh your fitness knowledge or learn something new</Text>
            <View style={styles.discoverBttnsCntnr}>
              <View style={styles.discoverWorkoutsBttnsContainer}>
                <TouchableOpacity onPress={console.log("Workouts Pressed")}>
                  <Text style={styles.workoutsBttnText}>Workouts</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.discoverExercisesBttnsContainer}>
                <TouchableOpacity onPress={console.log("Exercises Pressed")}>
                  <Text style={styles.exercisesBttnText}>Exercises</Text>
                </TouchableOpacity>
              </View>
            </View>
                {/* <StatusBar style= "auto" />*/}
            </View>
    </View>
   );
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
