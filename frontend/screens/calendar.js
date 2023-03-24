import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import API_Instance from "../../backend/axios_instance";
import moment from 'moment';
import {useGlobalState} from '../GlobalState.js';
import { useIsFocused } from "@react-navigation/native";

const CalendarScreen = ({}) => {
    const [globalState, updateGlobalState] = useGlobalState();
    const [weeklyEvents, setWeeklyEvents] = useState({});
    const isFocused = useIsFocused();

    const fetchEvents = async () => {
      try {
        const response = await API_Instance.get(`users/${globalState.user._id}/calendar/all`, {
          headers: {
            'authorization': `Bearer ${globalState.authToken}`,
          },
        });
        // console.log(response.data.workouts);
        // console.log("My user email is", globalState.user.email);
        const formattedEvents = formatEvents(response.data.workouts);
        setWeeklyEvents(formattedEvents);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          Alert.alert('Failed to authenticate you');
        }
        console.log(error);
        setWeeklyEvents({});
      }
    };
  
    useEffect(() => {
      if(isFocused){
        //console.log('rendering calendar')
        fetchEvents();
      }
    }, [isFocused]);
    
    useEffect(() => {
      handleDayPress({ dateString: selectedDate });
  }, [weeklyEvents]);
  
    //changes date to yyyy-mm-dd
    const formatEvents = (events) => {
      const formattedEvents = {};
      events.forEach((event) => {
        let date = moment(event.scheduledDate || event.dateOfCompletion).format('YYYY-MM-DD');
        const isMyWorkout = event.ownerEmail === globalState.user?.email;
        const dot = {
          key: isMyWorkout ? 'myWorkout' : 'friendWorkout',
          color: isMyWorkout ? '#24C8FE' : '#808080',
          selectedDotColor: isMyWorkout ? 'blue' : 'gray',
        };
    
        if (event.recurrence) {
          for (let i = 0; i < 12; i++) {
            if (!formattedEvents[date]) {
              formattedEvents[date] = { marked: true, events: [], dots: [dot] };
            } else if (!formattedEvents[date].dots.some((d) => d.key === dot.key)) {
              formattedEvents[date].dots.push(dot);
            }
            formattedEvents[date].events.push(event);
            date = moment(date).add(7, 'days').format('YYYY-MM-DD');
          }
        } else {
          if (!formattedEvents[date]) {
            formattedEvents[date] = { marked: true, events: [], dots: [dot] };
          } else if (!formattedEvents[date].dots.some((d) => d.key === dot.key)) {
            formattedEvents[date].dots.push(dot);
          }
          formattedEvents[date].events.push(event);
        }
      });
      return formattedEvents;
    };

    const handleDayPress = (day) => {
      const formattedDate = moment(day.dateString).format('YYYY-MM-DD');
      if (weeklyEvents[formattedDate]) {
        const events = weeklyEvents[formattedDate].events; // Access the events array
        setEvents(events);
        setSelectedDate(formattedDate);
      } else {
        setEvents([]);
        setSelectedDate(formattedDate);
      }
    };
  
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

    const renderItem = ({ item }) => {
      const eventDate = item.scheduledDate || item.dateOfCompletion;
      const dateText = item.scheduledDate ? 'Scheduled' : 'Completed';
      const startTime = moment(item.scheduledDate).format('hh:mm A');

      if (item.ownerEmail === globalState.user?.email) {
        return (
          <View style={styles.myExercise}>
              {/* <Text>{dateText} {moment(eventDate).format('MMMM D, YYYY')}</Text> */}
              <Text>{dateText} workout at {startTime} </Text>
              <Text style={{ fontWeight: 'bold' }}>{item.title} - {item.ownerName} </Text>
              <Text>Location: {item.location}</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.friendExercise}>
              {/* <Text>{dateText}: {moment(eventDate).format('MMMM D, YYYY')}</Text> */}
              <Text>{dateText} workout at {startTime}</Text>
              <Text style={{ fontWeight: 'bold' }}>{item.title} - {item.ownerName} </Text>
              <Text>Location: {item.location}</Text>
          </View>
        );
      }
    };
  
    return (
      <View style ={styles.container}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={weeklyEvents}
          markingType={'multi-dot'}
          selected={[selectedDate]}
        />
      
        {selectedDate !== '' && 
          <Text style={styles.Title}>
            {moment(selectedDate).format('MMMM D, YYYY')}
          </Text>
        }

        <FlatList 
          data={events} 
          renderItem={renderItem} 
          keyExtractor={(item, index) => `${item._id}_${item.scheduledDate || item.dateOfCompletion}_${index}`}
          ListEmptyComponent={() => (
            <Text style={styles.noEvents}>No events scheduled</Text>
          )}
        />
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  Title:{
    fontFamily: 'HelveticaNeue-Bold',
    color: '#2B2B2B',
    fontSize: 24,
    textAlign: 'left',
    padding: 10,
},
  myExercise:{
    backgroundColor: '#DDF2FF',
    padding: 20,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendExercise:{
    backgroundColor: '#F1F3FA',
    padding: 20,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noEvents: {
    textAlign: 'left',
    marginTop: 10,
    paddingLeft: 20,
    fontSize: 16,
  }
});

export default CalendarScreen;