import {
	StyleSheet,
	Button,
	Text,
	Image,
    TextInput,
	View,
    TouchableOpacity,
    Alert
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Icon } from 'react-native-elements'
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance";
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../AuthProvider';


export default function Inbox({ navigation }) 
{
    return(
            <View style={styles.container}>
                <Text style={{ paddingLeft: 20 }}>Incoming friend requests</Text>
            </View>

    );
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
});