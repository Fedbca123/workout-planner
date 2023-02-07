import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import React, { useState } from 'react';

const legs = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
const arms = {key: 'workout', color: 'green'};


const screenWidth = Math.round(Dimensions.get('window').width);

export default function CalendarPage(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      name: 'Event 1',
      date: new Date(2023, 1, 5),
    },
    {
      name: 'Event 2',
      date: new Date(2023, 2, 12),
    },
    {
      name: 'Event 3',
      date: new Date(2023, 2, 11),
    },
  ]);

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      <CalendarPicker
        onDateChange={onDateChange}
        selectedDate={selectedDate}
        events={events}
        screenWidth={screenWidth}
      />
      <View style={styles.eventContainer}>
        {events.length === 0 ? (
          <Text style={styles.noEventsText}>No events scheduled</Text>
        ) : (
          events
            .filter((event) => event.date.getDate() === selectedDate.getDate())
            .map((event, index) => (
              <TouchableOpacity key={index} style={styles.eventCard}>
                <Text style={styles.eventText}>{event.name}</Text>
              </TouchableOpacity>
            ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 50,
  },
  eventContainer: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 20,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  eventText: {
    fontSize: 20,
    textAlign: 'center',
  },
});


// export default function CalendarPage(props) {
//   //console.log("calendar", props.route.params.user) -> works
//   return (
    
//     <View style={styles.container}>

//     <Calendar markingType = {'multi-dot'} markedDates={{
//     '2023-01-16': {dots: [arms]},
//     '2023-01-23': {dots: [arms, legs]}}}/>
    
//     <StatusBar style= "auto" />
    
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     height: 500,
//     backgroundColor: '#fff',
//     alignItems: 'stretch',
//     justifyContent: 'space-evenly',
//   },
// });
