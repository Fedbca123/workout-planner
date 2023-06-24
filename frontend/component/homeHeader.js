import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert} from 'react-native';
import React from 'react';
import {useGlobalState} from '../GlobalState.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDrawerStatus } from '@react-navigation/drawer';

export default function HomeHeader ({ navigation }) {
    const [globalState, updateGlobalState] = useGlobalState();

    return (
        <View style= {styles.container(globalState.theme.colorBackground)}>
            <View style={styles.buttonContainer(globalState.theme.colorBackground)}>
                <TouchableOpacity
                onPress={() => { navigation.openDrawer() }}>
                    <Image
                        source={require('../../assets/menu-burger.png')}
                        style={styles.ImageIconStyle(globalState.theme.colorText)}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
                {globalState.user && <Text style={styles.text(globalState.theme.colorText)}>Hello {globalState.user.firstName}!</Text>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: (backgroundColor) => {
        return {
            height: 110,
            backgroundColor: backgroundColor,
        }
    },
    buttonContainer: (buttonBackgroundColor) => {
        return {
            height: 30,
            width: 40,
            marginLeft: 20,
            marginTop: 50,
            backgroundColor: buttonBackgroundColor
        }
    },
    textContainer: {
    },
    button: {
    },
    text: (textColor) => {
        return {
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
            color: textColor
        }
    },
    ImageIconStyle: (imageColor) => {
        return {
            width: 30,
            height: 30,
            tintColor: imageColor
        } 
    }
});