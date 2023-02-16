import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

const screenWidth = Math.round(Dimensions.get('window').width);
LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

LocaleConfig.defaultLocale = 'en';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [eventList, setEventList] = useState([
    { date: '2023-02-11', title: 'Running', type: 'Cardio', sets: 3, recurring: true },
    { date: '2023-02-12', title: 'Yoga', type: 'Flexibility', sets: 1, recurring: false },
    { date: '2023-02-13', title: 'Weightlifting', type: 'Strength', sets: 5, recurring: true },
    { date: '2023-02-14', title: 'Pilates', type: 'Core', sets: 2, recurring: false },
    { date: '2023-02-15', title: 'Swimming', type: 'Endurance', sets: 4, recurring: true },
  ]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const renderEvent = ({ item }) => {
    if (item.date === selectedDate) {
      return (
        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.date}</Text>
          <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
          <Text>Workouts: {item.type}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{ [selectedDate]: { selected: true } }}
      />
      <FlatList
        data={eventList}
        renderItem={renderEvent}
        keyExtractor={(item) => item.date}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  }
});

export default CalendarScreen;
