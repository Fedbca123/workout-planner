import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert} from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useGlobalState } from '../GlobalState';

export default function SettingsHeader ({navigation, globalState}) {

    // const [globalState, updateGlobalState] = useGlobalState();

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
                <Text style={styles.text(globalState.theme.colorText)}>Settings</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: (color) => {
        return {
            height: 110,
            backgroundColor: color,
    }},
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
    ImageIconStyle: (color) => {
        return {
            width: 30,
            height: 30  ,
            tintColor: color
        }
    }
});