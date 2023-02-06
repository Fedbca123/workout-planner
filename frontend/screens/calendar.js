import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
const legs = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
const arms = {key: 'workout', color: 'green'};

export default function CalendarPage(props) {
  //console.log("calendar", props.route.params.user) -> works
  return (
    
    <View style={styles.container}>

    <Calendar markingType = {'multi-dot'} markedDates={{
    '2023-01-16': {dots: [arms]},
    '2023-01-23': {dots: [arms, legs]}}}/>
    
    <StatusBar style= "auto" />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 500,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
});
