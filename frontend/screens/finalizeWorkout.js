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
	Alert,
} from "react-native";
import React, { useState } from "react";
import reactDom from "react-dom";
import API_Instance from "../../backend/axios_instance";
import { useGlobalState } from "../GlobalState.js";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectBox from "react-native-multi-selectbox";
import { Dropdown } from "react-native-element-dropdown";




export default function FinalizeWorkout({ navigation}) {
	const [globalState, updateGlobalState] = useGlobalState();
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const [exercises, updateExercises] = useState(globalState.workout[0].exercises);
	const exerciseTypes = [
	{label: 'Cardio', value: "CARDIO"},
	{label: 'Sets and Reps', value: "SETSXREPS"},
	{label: 'As many reps as possible', value: "AMRAP"},
	];

	function scheduledWorkout() {
		if (globalState.workout[0].scheduledDate == Date("2022-01-01")) {
			Alert.alert("Please choose a time to schedule this workout");
		} else if (globalState.workout[0].location === "") {
			Alert.alert("Please select where you are going to have this workout");
		} else {

		}
	}

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
		<SafeAreaView style={styles.container}>
			<Text style={styles.TitleText}>What do you wanna name the workout?</Text>

			<TextInput style={styles.TextInputBox} placeholder="My Leg Day Workout" onChangeText={(val) => { globalState.workout[0].title = val }} defaultValue={globalState.workout[0].title} />

			<Text style={styles.TitleText}>Edit Description</Text>

			<TextInput style={styles.TextInputBox} placeholder="My Leg Day Workout" onChangeText={(val) => { globalState.workout[0].description= val }} defaultValue={globalState.workout[0].description} />
			
			<Text style={styles.TitleText}>Where are you going to have this workout?</Text>

			<TextInput style={styles.TextInputBox} placeholder="Planet Fitness" onChangeText={(val) => { globalState.workout[0].location = val }} defaultValue={globalState.workout[0].location} />

			<Text style={styles.TitleText}>How Long will this workout be?(in min)</Text>

			<TextInput style={styles.TextInputBox} placeholder="90 min" maxLength={3} onChangeText={(val) => { globalState.workout[0].duration = Number(val) }} keyboardType="number-pad"/>

			<Text style={styles.TitleText}>When do you want to have this workout?</Text>

			<Button title="Choose a Day and Time" onPress={showDatePicker} />

			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode="datetime"
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
			/>

			{/* <FlatList
				initialNumToRender={1}
				style={{maxHeight:220}}
				data={exercises}
				renderItem={({ item }) => (
					<View style={styles.ExerciseCard}>
						<Text style={styles.ExerciseText}>
							{item.title}	
							<View>
								<Dropdown
									style={styles.dropdown}
									data={exerciseTypes}
									labelField="label"
									valueField="value"
									value={"SETSXREPS"}
									onChange={(val) => {
										item.exerciseType = val.value;
									}}
								/>
							</View>
							
						</Text>
						
					</View>
				)}
			/> */}

			{/* <WorkOuts data={globalState.workout} showInput={true} /> */}
			
			<Button title="Continue" onPress={() => {
				
				if (globalState.workout[0].scheduledDate == Date("2022-01-01")) {
					Alert.alert("Please choose a time to schedule this workout");
				} else if (globalState.workout[0].location === "") {
					Alert.alert("Please select where you are going to have this workout");
				} else if (globalState.workout[0].title === "") {
					Alert.alert("Please enter a title for the workout");
				} else if (globalState.workout[0].duration === 0 || globalState.workout[0].duration === "") {
					Alert.alert("Please choose a valid duration for the workout.");
				} else {
					navigation.push("finalizedContinued");
				}
				
			}}/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	TitleText:{
		fontSize: 20,
    	fontWeight: 'bold',
	},
	TextInputBox: {
		backgroundColor: "#F1F3FA",
		margin: 10,
		padding: 15,
		borderRadius: 20
		// flex: 0.5,
		// shadowOpacity: 2
	},
	container: {
		flex: 1,
		backgroundColor: "white",
		padding: 16,
	},
	buttonStyle: {
		backgroundColor: "#F1F3FA",
		margin: 10,
		padding: 15,
		borderRadius: 10,
	},
	ImageStyle:{
		height: 75,
		width: 75,
		// flex: 0.5,
		borderWidth: 1,
		borderRadius:100
	},
	ExerciseCard: {
		backgroundColor: "#F1F3FA",
		padding: 20,
		margin:10,
		// marginBottom: 0,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
		borderRadius: 15,
		flexDirection: "row",
		// flexDirection: "row",
		alignItems: "center"
	},
	ExerciseText: {
		fontSize: 16,
		fontWeight: 'bold',
		left: 10,
		// top: 30,
		// marginVertical: "auto"
		textAlignVertical: "bottom",
		// flex:0.5
	},
	dropdown: {
		 width:120,
    //   margin: 2,
    //   height: 50,
    //   borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
    },
})
