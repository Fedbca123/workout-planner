import {
	StyleSheet,
	Button,
	TouchableOpacity,
	Text,
	Image,
	View,
	SafeAreaView,
	TextInput,
	FlatList,
	ScrollView,
	VirtualizedList,
    useWindowDimensions,
    Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import reactDom, { render } from "react-dom";
import Workouts from "./workout.js";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance.js"
import { AntDesign } from "@expo/vector-icons";
import { Header, SearchBar } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function FinalizeReview({ workout, updateWorkout, setCurrState }) {
    const [expanded, setExpanded] = useState(false);
    const handlePress = () => {
      setExpanded(!expanded);
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.navButtonContainer}>
                <View style={{ backgroundColor: "#FF8C4B", flex: 1}}>
                     <TouchableOpacity 
                        style={{ flex:1, alignItems:"center", justifyContent: "center"}} 
                        onPress={() => {
                            setCurrState("Schedule");
                        }}>
                        <AntDesign size={useWindowDimensions().height * 0.08} name="leftcircle" color={"white"}/>
                    </TouchableOpacity>
                </View>

                <View style={{ alignSelf: "center", flex:1}}>
                    <TouchableOpacity 
                        style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#10B9F1" }} 
                        onPress={() => {
                        setCurrState("FinalizeReview");     
                    }}>
                        <AntDesign size={useWindowDimensions().height * 0.08} name="checkcircle" color={"white"} />
                    </TouchableOpacity>  
                </View>

            </View>
        </View>
    );
}

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column-reverse',
        // justifyContent:"space-between"
    },
    navButtonContainer: {
        height: '15%',
        display: "flex", 
        flexDirection: "row",
        borderWidth: 1, 
        justifyContent: "space-evenly"
    },
})