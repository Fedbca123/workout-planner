import {
	StyleSheet,
	Button,
	TouchableOpacity,
	Text,
	Image,
	View,
	SafeAreaView,
	TextInput,
} from "react-native";
import React from "react";
import reactDom from "react-dom";
import axios from "axios";
import config from "../../config";
import { useGlobalState } from "../../GlobalState.js";
import { useNavigation } from "@react-navigation/native";
import WorkOuts from "./workout";

const baseUrl = config.API_URL + config.PORT + "/";

export default function LandingPage(props) {
	const [globalState, updateGlobalState] = useGlobalState();
	const navigation = useNavigation();

	const handleScratchPress = () => {
		// console.log("Scratch Button Pressed");
		navigation.navigate("exerciseSearch");
	};
	const handleTemplatePress = () => {
		// console.log("Template Button Pressed");
		navigation.navigate("chooseTemplate");
	};

	const loadCurrentDayWorkoutStatus = () => {
		// logic to define whether a workout exists today or not
		if (globalState.workoutScheduled != null) {
			return "a workout scheduled today";
		} else {
			return "no workout scheduled today";
		}
		return "no workout scheduled today";
	};

	function loadTodaysWorkout() {
		if (globalState.workoutScheduled != null) {
			return (
				<WorkOuts
					data={globalState.workoutScheduled}
					showButton={false}
					showInput={true}
				/>
			);
		} else {
			return;
		}
	}

	//componentWillMount(){
	// could do a call through axios to get user info for each render.
	// this would be a lot of API calls though I think.
	// either way this is something to consider and discuss but for now we have loaded info
	//}

	//render(){
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.Header}>
				<Text style={styles.HeaderText}>
					You have {loadCurrentDayWorkoutStatus()}
				</Text>
			</View>

			<View style={{ marginTop: 30 }}>
				<Text style={styles.bodyHeader}>Create a Workout from</Text>
			</View>
			<View style={styles.CreateWorkoutCntnr}>
				<View style={styles.CreateWorkoutBttnsContainer}>
					<TouchableOpacity onPress={handleScratchPress}>
						<Text style={styles.CreateWorkoutBttns}>Scratch</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.CreateWorkoutBttnsContainer}>
					<TouchableOpacity onPress={handleTemplatePress}>
						<Text style={styles.CreateWorkoutBttns}>Template</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.BodyContainer}>
				<Text style={styles.bodyHeader}>Your Scheduled Workouts:</Text>
				{loadTodaysWorkout()}
				{/* Logic to define how to load the saved workouts */}
			</View>
		</SafeAreaView>
	);
	//}
}

const styles = StyleSheet.create({
	HeaderText: {
		fontWeight: "bold",
		fontSize: 20,
		alignSelf: "center",
		marginTop: 40,
	},
	HeaderContainer: {
		alignItems: "center",
	},
	CreateWorkoutCntnr: {
		flexDirection: "row",
		alignSelf: "center",
	},
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	bodyHeader: {
		fontSize: 18,
		fontWeight: "bold",
		paddingLeft: 20,
	},
	BodyContainer: {
		flex: 1,
	},
	Text: {
		fontSize: 20,
		textAlign: "center",
	},
	BoldText: {
		fontWeight: "bold",
	},
	CreateWorkoutBttns: {
		color: "black",
		fontWeight: "bold",
		fontSize: 23,
	},
	CreateWorkoutBttnsContainer: {
		alignItems: "center",
		backgroundColor: "#E0F0FE",
		margin: 30,
		padding: 15,
		borderRadius: "10rem",
		flex: 0.5,
	},
	CreateWorkoutText: {
		fontFamily: "HelveticaNeue",
		fontWeight: 400,
		fontSize: 12,
		fontWeight: "normal",
		color: "#C4C4C4",
		textAlign: "center",
	},
	space: {
		width: 50,
		height: 20,
	},
});

//export default LandingPage;
