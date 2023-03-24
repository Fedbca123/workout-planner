import React, { useState, useEffect } from 'react';
import { Modal, Button, StyleSheet, Text, TextInput, View, Switch, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import API_Instance from "../../backend/axios_instance";
import moment from 'moment';
import {useGlobalState} from '../GlobalState.js';
import { useIsFocused, useNavigation } from "@react-navigation/native";

const CalendarScreen = ({}) => {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [workoutToEdit, setWorkoutToEdit] = useState(null);
    const [editedScheduledDate, setEditedScheduledDate] = useState('');
    const [editedRecurrence, setEditedRecurrence] = useState(false);
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

    const handleEdit = (workout) => {
      setWorkoutToEdit(workout);
      setEditedScheduledDate(moment(workout.scheduledDate || workout.dateOfCompletion).format('YYYY-MM-DDTHH:mm'));
      setEditedRecurrence(workout.recurrence);
      setEditModalVisible(true);
    };

    const handleSave = () => {
      // implement save functionality here
      setEditModalVisible(false);
    };
  
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

    const renderItem = ({ item }) => {
      const eventDate = item.scheduledDate || item.dateOfCompletion;
      const dateText = item.scheduledDate ? 'Scheduled' : 'Completed';
      const startTime = moment(item.scheduledDate).format('hh:mm A');
    
      if (item.ownerEmail === globalState.user?.email && item.scheduledDate) {
        return (
          <View style={styles.myExercise}>
            <Text>{dateText} workout at {startTime} </Text>
            <Text style={{ fontWeight: 'bold' }}>{item.title} - {item.ownerName} </Text>
            <Text>Location: {item.location}</Text>
            <Button title="Edit" onPress={() => handleEdit(item)} />
          </View>
        );
      } else if (item.ownerEmail === globalState.user?.email) {
        return (
          <View style={styles.myExercise}>
            <Text>{dateText} </Text>
            <Text style={{ fontWeight: 'bold' }}>{item.title} - {item.ownerName} </Text>
            <Text>Location: {item.location}</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.friendExercise}>
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {workoutToEdit && (
          <>
            <Text style={styles.modalTitle}>Edit Workout</Text>
            {/* Edit the workout information */}
            <Text>Date & Time:</Text>
            <TextInput
              style={styles.modalInput}
              value={editedScheduledDate}
              onChangeText={setEditedScheduledDate}
              mode="datetime"
              placeholder="YYYY-MM-DDTHH:mm"
            />
            <Text>Recurrence:</Text>
            <View style={styles.modalSwitch}>
              <Text>No</Text>
              <Switch
                value={editedRecurrence}
                onValueChange={setEditedRecurrence}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={editedRecurrence ? '#f5dd4b' : '#f4f3f4'}
              />
              <Text>Yes</Text>
            </View>

            <View style={styles.modalButtons}>
              <Button title="Close" onPress={() => setEditModalVisible(false)} />
              <Button title="Save" onPress={handleSave} />
            </View>
          </>
              )}
            </View>
          </View>
        </Modal>
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 5,
  },
  modalSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});

export default CalendarScreen;