import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import API_Instance from "../../backend/axios_instance";
import moment from 'moment';
import {useGlobalState} from '../GlobalState.js';

const CalendarScreen = () => {
  const [globalState, updateGlobalState] = useGlobalState();
  const [workouts, setWorkouts] = useState([]);
  const [weeklyEvents, setWeeklyEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const fetchEvents = async () => {
    try {
      const startOfWeek = moment().startOf('week').toISOString();
      const endOfWeek = moment().endOf('week').toISOString();
      const response = await API_Instance.get(`users/${globalState.user._id}/calendar/all`, {
        params: {
          startOfWeek,
          endOfWeek,
        }, 
        headers: {
          'authorization': `Bearer ${globalState.authToken}`,
        },
      });
      console.log("My workouts are", response.data.workouts);
      setWeeklyEvents(response.data.workouts);
      setSelectedDate(moment().startOf('week').toISOString());
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        Alert.alert('Failed to authenticate you');
      }
      setWeeklyEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  

  const eventsByDate = {};
  weeklyEvents.forEach((event) => {
  const eventDate = event.scheduledDate || event.dateOfCompletion;
  if (!eventsByDate[eventDate]) {
    eventsByDate[eventDate] = [];
  }
  eventsByDate[eventDate].push(event);
});

const markedDates = {};
Object.keys(eventsByDate).forEach((date) => {
  markedDates[date] = { dots: [{ color: '#24C8FE' }] };
});
  const onDayPress = (day) => {
    const selectedDay = moment(day.dateString).toISOString();
    setSelectedDate(selectedDay);
  };

  const renderEvent = ({ item }) => {
    const date = item.scheduledDate || item.dateOfCompletion;
    if (date === selectedDate) {
      return (
        <View style={{ padding: 10, backgroundColor: '#24C8FE' }}>
          <Text style={{ fontWeight: 'bold' }}>{date}</Text>
          <Text style={{ fontWeight: 'bold' }}>{item.title} - {item.ownerName} </Text>
          <Text>Location: {item.location}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true },
        }}
        theme={{
          todayTextColor: '#24C8FE',
          arrowColor: '#24C8FE',
          selectedDayBackgroundColor: '#24C8FE',
        }}
      />
      <FlatList
        data={weeklyEvents}
        renderItem={renderEvent}
        keyExtractor={(item, index) => `${item._id}_${item.scheduledDate || item.dateOfCompletion}_${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default CalendarScreen;
