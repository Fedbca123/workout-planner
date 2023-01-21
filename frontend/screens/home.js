import { StyleSheet, Button, Text, Image, View, SafeAreaView, TextInput } from 'react-native';
import React from 'react';

const Home = (route, navigation) => {
    const user = route.params.user
    return  (
        <View style={{flex : 1}}>
            <Text>Hello ${user.firstName} ${user.lastName}</Text>
        </View>
    )
}

export default Home; 