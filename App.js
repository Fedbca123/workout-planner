import React from 'react';
import Login from './frontend/screens/login.js';
import LandingPage from './frontend/screens/landingPage.js';
import Register from './frontend/screens/registration.js';
import Calendar from './frontend/screens/calendar.js';
import Friends from './frontend/screens/friends.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login" >
          <Stack.Screen name="login" 
          component={Login}
          options={{headerShown: false}}/>
          <Stack.Screen name="landingPage" component={LandingPage}/>
          <Stack.Screen name="registration" 
          component={Register} 
          options={{headerShown: false}}/>
          <Stack.Screen name="calendar" 
          component={Calendar} 
          options={{headerShown: false}}/>
          <Stack.Screen name="friends" 
          component={Friends} 
          options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
};