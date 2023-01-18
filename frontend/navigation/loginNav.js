import React from 'react';
import Login from '../screens/login.js';
import Register from '../screens/registration.js';
import HomeNav from './homeNav.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function LoginNav() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login" >
          <Stack.Screen name="login" 
            component={Login}
            options={{headerShown: false}}/>
          <Stack.Screen name="home" 
            component={HomeNav}/>
          <Stack.Screen name="registration" 
            component={Register} 
            options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
};