import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import API_Instance from "../../backend/axios_instance";
import moment from 'moment';
import {useGlobalState} from '../GlobalState.js';

const CalendarScreen = ({}) => {
    const [globalState, updateGlobalState] = useGlobalState();
    const [weeklyEvents, setWeeklyEvents] = useState({});
  
    const fetchEvents = async () => {
      try {
        const response = await API_Instance.get(`users/${globalState.user._id}/calendar/all`, {
          headers: {
            'authorization': `Bearer ${globalState.authToken}`,
          },
        });
        console.log("My workouts are", response.data.workouts);
        const formattedEvents = formatEvents(response.data.workouts);
        setWeeklyEvents(formattedEvents);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 403) {
          Alert.alert('Failed to authenticate you');
        }
        setWeeklyEvents({});
      }
    };
  
    useEffect(() => {
      fetchEvents();
    }, []);
  
    const formatEvents = (events) => {
      const formattedEvents = {};
      events.forEach((event) => {
        const date = moment(event.scheduledDate || event.dateOfCompletion).format('YYYY-MM-DD');
        if (!formattedEvents[date]) {
          formattedEvents[date] = [];
        }
        formattedEvents[date].push(event);
      });
      return formattedEvents;
    };
  
    const handleDayPress = (day) => {
      const formattedDate = moment(day.dateString).format('YYYY-MM-DD');
      if (weeklyEvents[formattedDate]) {
        const events = weeklyEvents[formattedDate];
        setEvents(events);
      } else {
        setEvents([]);
      }
    };
  
    const [events, setEvents] = useState([]);
  
    const renderItem = ({ item }) => (
      <View>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
    );
  
    return (
      <View>
        <Calendar onDayPress={handleDayPress} markedDates={weeklyEvents} />
        <FlatList data={events} renderItem={renderItem} />
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