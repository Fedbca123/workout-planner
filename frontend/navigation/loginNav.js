import React from 'react';
import Login from '../screens/login.js';
import Register from '../screens/registration.js';
import HomeNav from './homeNav.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useGlobalState } from '../../GlobalState.js';
import HomeHeader from '../component/homeHeader.js';

const Stack = createNativeStackNavigator();

export default function LoginNav() {
  const [globalState, updateGlobalState] = useGlobalState();
  var header;
  if (globalState.user == null)
    header = "null";
  else
    header = "Hello " + globalState.user.firstName + "!";

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login" >
        <Stack.Screen name="login" 
          component={Login}
          options={{headerShown: false}}/>
        <Stack.Screen name="home" 
          component={HomeNav}
          options={{header: HomeHeader}}/>
        <Stack.Screen name="registration" 
          component={Register} 
          options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
};