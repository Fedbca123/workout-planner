import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert} from 'react-native';
import React, {useState} from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useGlobalState} from '../../GlobalState.js';

export default function HomeHeader () {
    const [globalState, updateGlobalState] = useGlobalState();

    const onLogout = () => {
        
    }

    return (
        <View styles= {styles.container}>
            <View style={styles.buttonContainer}>
                <Button
                        style = {styles.button}
                        title = "Logout"
                        onPress={() => onLogout()}
                    />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Hello {globalState.user.firstName}!</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        marginTop: 30,
    },
    buttonContainer: {
        alignContent: 'flex-start',
        height: 37,
        alignItems: 'flex-start',
        marginLeft: 10,
        marginTop: 40
    },
    textContainer: {
    },
    button: {
    },
    text:{
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center'
    }
});