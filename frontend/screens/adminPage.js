import { 
    StyleSheet, 
    Button, 
    Text, 
    Image, 
    View, 
    TextInput,
    KeyboardAvoidingView,
    ScrollView
  } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, {useState, useRef} from 'react';
import axios from 'axios';
import config from '../../config';
import { useGlobalState } from '../../GlobalState.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toggle from "react-native-toggle-element";

const baseUrl = config.API_URL + config.PORT + '/';

export default function AdminPage(props) {
    const [toggleValue, setToggleValue] = useState(false);
    return (
        <View styles={styles.container}>
            <View styles={styles.header}>
                <Toggle
                    styles={{marginTop: 20}}
                    value={toggleValue}
                    onPress={(newState) => setToggleValue(newState)}
                    leftTitle="Exercise"
                    rightTitle="Workout"
                />
            </View>
            {/* <View>
                <TextInput/>
                <TextInput/>
                <TextInput/>
                <TextInput/>
                <TextInput/>
                <TextInput/>
                <TextInput/>
                <TextInput/>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 1,
        alignItems: 'center'
    }
});