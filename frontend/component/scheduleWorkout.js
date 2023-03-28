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
	useWindowDimensions
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

export default function ScheduleWorkout() {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
    	setDatePickerVisibility(true);
  	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleConfirm = (date) => {
		let temp = new Date(date).toString();
		globalState.workout[0].scheduledDate = temp;
		// console.log(typeof (temp));
		// console.log("A date has been picked: ", globalState.workout[0].scheduledDate);
		// console.log("A date has been picked: ", temp);
		hideDatePicker();
	};

    return (
        <View style={styles.container}>
           <View style={styles.navButtonContainer}>
                <View style={{ backgroundColor: "#FF8C4B", flex: 1}}>
                     <TouchableOpacity 
                        style={{ flex:1, alignItems:"center", justifyContent: "center"}} 
                        onPress={() => {
                            setCurrState("chooseTemplate")
                        }}>
                        <AntDesign size={useWindowDimensions().height * 0.08} name="leftcircle" color={"white"}/>
                    </TouchableOpacity>
                </View>

                <View style={{ alignSelf: "center", flex:1}}>
                    <TouchableOpacity 
                        style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#10B9F1" }} 
                        onPress={() => {
                        setCurrState("BeginFinalizing");     
                    }}>
                        <AntDesign size={useWindowDimensions().height * 0.08} name="rightcircle" color={"white"}/>
                    </TouchableOpacity>  
                </View>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
			    />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column-reverse',
    },
    navButtonContainer: {
        height: '15%',
        display: "flex", 
        flexDirection: "row",
        borderWidth: 1, 
        justifyContent: "space-evenly"
    },
})