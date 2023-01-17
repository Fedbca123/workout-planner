import React from 'react';
import { Image } from 'react-native';
import LandingPage from '../screens/landingPage';
import Friends from '../screens/friends';
import CalendarPage from '../screens/calendar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function HomeNav () {
    return (
        <Tab.Navigator initialRouteName='landingPage'>
            <Tab.Screen name="landingPage" 
                component={LandingPage}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({color, size}) => (
                        <Image 
                            source={require('../../assets/homeIcon.png')}
                            style={{
                                width: size,
                                height: size,
                            }}
                        />
                    )
                }} 
            />
            <Tab.Screen name="friends" 
                component={Friends} 
                options={{
                    headerShown: false,
                    tabBarLabel: 'Friends',
                    tabBarIcon: ({color, size}) => (
                        <Image 
                            source={require('../../assets/friendsIcon.png')}
                            style={{
                                width: size,
                                height: size,
                            }}
                        />
                    )
                    }} />
            <Tab.Screen name="calendar" 
                component={CalendarPage}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Calendar',
                    tabBarIcon: ({color, size}) => (
                        <Image 
                            source={require('../../assets/calendarIcon.png')}
                            style={{
                                width: size,
                                height: size,
                            }}
                        />
                    )
                }} 
            />
        </Tab.Navigator>
    )
};