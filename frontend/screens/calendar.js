import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, Modal, Button, StyleSheet, Text, TextInput, View, Switch, FlatList, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import API_Instance from "../../backend/axios_instance";
import moment from 'moment';
import {useGlobalState} from '../GlobalState.js';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ScrollView } from 'react-native'

const CalendarScreen = ({}) => {
    const navigation = useNavigation();

    const [datePickerText, setDatePickerText] = useState("Select Date & Time");

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [workoutToEdit, setWorkoutToEdit] = useState(null);

    const [completedWorkoutModalVisible, setCompletedWorkoutModalVisible] = useState(false);
    const [selectedCompletedWorkout, setSelectedCompletedWorkout] = useState(null);

    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null);

    const [editedScheduledDate, setEditedScheduledDate] = useState('');
    const [editedRecurrence, setEditedRecurrence] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    
    const [globalState, updateGlobalState] = useGlobalState();
    const [weeklyEvents, setWeeklyEvents] = useState({});
    const isFocused = useIsFocused();

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        fetchEvents();
      });
    
      return unsubscribe;
    }, [navigation]);

    const handleCompletedWorkoutDetails = (workout) => {
      setSelectedCompletedWorkout(workout);
      setCompletedWorkoutModalVisible(true);
    };

    const fetchEvents = async () => {
      try {
        const response = await API_Instance.get(`users/${globalState.user._id}/calendar/all`, {
          headers: {
            'authorization': `Bearer ${globalState.authToken}`,
          },
        });
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
        fetchEvents();
      }
    }, [isFocused]);
    
    useEffect(() => {
      handleDayPress({ dateString: selectedDate });
  }, [weeklyEvents]);
  
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
        const events = weeklyEvents[formattedDate].events; 
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

    const handleConfirm = (date) => {
      const formattedDate = moment(date).format('YYYY-MM-DDTHH:mm');
      setEditedScheduledDate(formattedDate);
      setDatePickerText(moment(date).format("MMMM D, YYYY hh:mm A"));
      hideDatePicker();
    };

    const updateWorkout = async (workout, updatedInfo) => {
      try {
        const response = await API_Instance.patch(
          `workouts/${workout}`,
          updatedInfo,
          {
            headers: {
              'authorization': `Bearer ${globalState.authToken}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error('Error updating workout:', error);
        return null;
      }
    };

    const showDatePicker = () => {
      setDatePickerVisible(true);
    };
    
    const hideDatePicker = () => {
      setDatePickerVisible(false);
    };

    const handleEditModalClose = () => {
      setEditModalVisible(false);
    };

    const handleSave = async () => {
      const updatedInfo = {
        scheduledDate: editedScheduledDate,
        recurrence: editedRecurrence,
      };

      const updatedWorkout = await updateWorkout(workoutToEdit._id, updatedInfo);
    
      if (updatedWorkout) {
        handleEditModalClose();
        fetchEvents(); 
      } else {
        Alert.alert('Error', 'Failed to update the workout. Please try again.');
      }
    };

    const handleDelete = async (workout) => {
      // console.log(workout);
      try {
        await API_Instance.patch(`users/${globalState.user._id}/workouts/remove/${workout._id}`, {}, {
          headers: {
            'authorization': `Bearer ${globalState.authToken}`,
          },
        });
        Alert.alert('Workout deleted');
        fetchEvents(); 
      } catch (error) {
        if (error.response && error.response.status === 403) {
          Alert.alert('Failed to authenticate you');
        }
        console.log(error);
      }
    };
  
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

    const renderItem = ({ item }) => {
      // const eventDate = item.scheduledDate || item.dateOfCompletion;
      const dateText = item.scheduledDate ? 'Scheduled' : 'Completed';
      const startTime = moment(item.scheduledDate).format('hh:mm A');
    
      if (item.ownerEmail === globalState.user?.email && item.scheduledDate) {
        return (
          <View style={styles.myExercise}>
            <Text>{dateText} workout at {startTime} </Text>
            <Text style={{ fontWeight: 'bold' }}>{item.title} - {item.ownerName} </Text>
            {item.location && <Text>Location: {item.location}</Text>}
            <View style={{ flexDirection: 'row' }}>
              <View style={{marginRight: 10,}}>
                <Button title="Edit" onPress={() => handleEdit(item)} />
              </View>
              <View style={{marginRight: 10,}}>
                <Button title="Start" onPress={() => {navigation.navigate("start", {workout: item})}} />
              </View>
              <Button title="Delete" onPress={ 
                () => {
                  Alert.alert( `Are you sure you want to delete ${item.title}?`,'',
                    [{
                        text: 'Yes',
                        onPress: () => {
                          handleDelete(item)
                        },
                    },
                    {
                        text: 'No',
                    }],
                    { cancelable: false}
                  ); 
                }}
              />
            </View>
          </View>
        );
      } else if (item.ownerEmail === globalState.user?.email) {
          return (
            <View style={styles.myExercise}>
              <Text>{dateText} </Text>
              <Text style={{ fontWeight: 'bold' }}>{item.title} - {item.ownerName} </Text>
              {item.location && <Text>Location: {item.location}</Text>}
              <View style={{ flexDirection: 'row' }}>
                <Button title="Details" onPress={() => handleCompletedWorkoutDetails(item)} />
              </View>
            </View>
          );
        } else {
        return (
          <View style={styles.friendExercise}>
            <Text>{dateText} workout at {startTime}</Text>
            <Text style={{ fontWeight: 'bold' }}>{item.title} - {item.ownerName} </Text>
            {item.location && <Text>Location: {item.location}</Text>}
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
                  <Text>Date & Time:</Text>
                  <View style={styles.timedate}>
                    <TouchableOpacity onPress={showDatePicker} style={styles.datePickerContainer}>
                      <Text style={styles.datePickerText}>{datePickerText}</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePickerModal
                    isVisible={datePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                  <Text>Recurrence:</Text>
                  <View style={styles.modalSwitch}>
                    <Text>No</Text>
                    <Switch
                      value={editedRecurrence}
                      onValueChange={setEditedRecurrence}
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={editedRecurrence ? '#FFFFFF' : '#f4f3f4'}
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={completedWorkoutModalVisible}
          onRequestClose={() => setCompletedWorkoutModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {selectedCompletedWorkout && (
                <>
                  <Text style={styles.modalTitle}>Workout Details</Text>
                  <Text>{selectedCompletedWorkout.title}</Text>
                  {/* <Text>Description: {selectedCompletedWorkout.description}</Text>
                  <Text>Owner Name: {selectedCompletedWorkout.ownerName}</Text>
                  {selectedCompletedWorkout.location && <Text>Location: {selectedCompletedWorkout.location}</Text>} */}
                  <Text style={styles.modalSubTitle}>Completed:</Text>
                  <Text style={styles.modalSubTitle}>{new Date(selectedCompletedWorkout.dateOfCompletion).toLocaleDateString('en-us',{
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  })}</Text>
                  <Text style={styles.modalSubTitle}>Exercises</Text>
                  {selectedCompletedWorkout.exercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseDetails}>
                      <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                      <Text>({exercise.exerciseType})</Text>
                      {/* uncomment if we see a need but it looks nicer like this imo - Nestor <Text>Description: {exercise.description}</Text>*/}
                      {(exercise.exerciseType == 'SETSXREPS' || exercise.exerciseType == 'AMRAP') && <Text>Sets: {exercise.sets}</Text>}
                      {(exercise.exerciseType == 'SETSXREPS'                                    ) && <Text>Reps: {exercise.reps}</Text>}
                      {(exercise.exerciseType == 'SETSXREPS' || exercise.exerciseType == 'AMRAP') && <Text>Weight: {exercise.weight} lbs</Text>}
                      {(exercise.exerciseType == 'CARDIO'   || exercise.exerciseType == 'AMRAP') && <Text>Time: {exercise.time}</Text>}
                    </View>
                  ))}
                  
                  <View style={styles.modalButtons}>
                    <Button title="Close" onPress={() => setCompletedWorkoutModalVisible(false)} />
                  </View>
                </>
              )}
            </ScrollView>
    
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
  Title: {
    ...Platform.select({
      ios: {
        fontFamily: 'HelveticaNeue-Bold'
      },
      android: {
        fontFamily: "Roboto"
      },
    }),
    color: '#2B2B2B',
    fontSize: 24,
    textAlign: 'left',
    padding: 10,
},
  datePickerText:{
    color: '#9FA2AE',
    fontSize: 15,
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
    // added paddingTop because modal kept touching top of screen and got cutoff by 'island' on my iphone
    paddingTop: '15%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
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
  timedate: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  modalSubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  exerciseDetails: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  exerciseTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  }
});

export default CalendarScreen;
