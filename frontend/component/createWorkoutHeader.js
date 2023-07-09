import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert} from 'react-native';
import React from 'react';
import {useGlobalState} from '../GlobalState.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDrawerStatus } from '@react-navigation/drawer';
import { AntDesign } from '@expo/vector-icons';

export default function CreateWorkoutHeader ({ navigation, title }) {
    const [globalState, updateGlobalState] = useGlobalState();

    return (
        <View style= {styles.container(globalState.theme.colorBackground)}>
            <View style={styles.buttonContainer(globalState.theme.colorBackground)}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("Home");
                    }}>
                    {/* <AntDesign name="banckward" /> */}
                    <Text style={styles.CancelText}> <AntDesign name="close" size={32}/></Text>
                    
                </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text(globalState.theme.colorText)}>{title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: (color) => {
        return {
            height: 110,
            backgroundColor: color,  
        }
        
    },
    buttonContainer: (color) => {
        return {
            height: 30,
            width: 40,
            marginLeft: 20,
            marginTop: 50,
            backgroundColor: color
        }
        
    },
    textContainer: {
    },
    button: {
    },
    text: (color) => {
        return {
           fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
            color: color 
        }  
    },
    ImageIconStyle: {
        width: 30,
        height: 30
    },
    CancelText: {
        fontSize: 16,
        color: "#006ee6",
        // borderWidth: 2,
        // top: 20,
        // width: 50,
        // flex: 1.5,
        // display: "flex",
        // flex: 1,
        // flexDirection: "row",
    }
});