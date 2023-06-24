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
} from "react-native";
import React, { useEffect, useState } from "react";
import reactDom from "react-dom";
import API_Instance from "../../backend/axios_instance";
import { useGlobalState } from "../GlobalState.js";
import { useIsFocused } from "@react-navigation/native";
import WorkOuts from "../component/workout";
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../AuthProvider'

export default function LandingPage({navigation}) {
	const [globalState, updateGlobalState] = useGlobalState();
	const [todaysWorkouts, setTodaysWorkouts] = useState([]);
	const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);
  	const isFocused = useIsFocused();

	const handleScratchPress = () => {
		// console.log("Scratch Button Pressed");
		navigation.navigate("exerciseSearch");
	};
	const handleTemplatePress = () => {
		// console.log("Template Button Pressed");
		navigation.push("createWorkout");
	};

	const loadCurrentDayWorkouts = () => {
		// logic to define whether a workout exists today or not

		API_Instance.get(`users/${globalState.user._id}/workouts/today`, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'authorization': `BEARER ${globalState.authToken}`
			}
		}).then((response) => {

				// console.log(response.data);
				// for (let workout of response.data) {
				// for (let i = 0; i < response.data.length; i++){
				// 		// console.log(JSON.parse);
				// 		// todaysWorkouts.push(response.data[i]);
				// 	}
				setTodaysWorkouts(response.data);
			
			}).catch((e) => {
				// Alert.alert("Error");
				console.log(e);
			});
	};

	const loadCurrentDayWorkoutStatus = () => {
		if (todaysWorkouts.length === 1) {
			return "a workout scheduled today!";
		} else if (todaysWorkouts.length > 1) {
			return `${todaysWorkouts.length} workouts scheduled today!`;
		} else {
			return "no workout scheduled today";
			//or "you are done with your workout today!"
		}
	}

	function loadTodaysWorkout() {
		if (todaysWorkouts.length !== 0) {
			return (
				<FlatList
					data={todaysWorkouts}
					renderItem={(item) => (
						<View>
							<WorkOuts data={[item.item]} startButton={true} navigation={navigation}/>
						</View>
					)}
					ListEmptyComponent={<Text>Nothing</Text>}
				/>
			);
		} else {
			return;
		}
	}

	useEffect(() => {
    if(isFocused){
		if (!globalState.user)
		{
			updateGlobalState("authToken", null);
            updateGlobalState("user", null);
            SecureStore.deleteItemAsync("authKey");
            SecureStore.deleteItemAsync("userId");
            setIsLoggedIn(false);
		}
      	//console.log('rendering landing page in use effect');
		loadCurrentDayWorkouts();
		loadTodaysWorkout();
		loadCurrentDayWorkoutStatus();
		// console.log(globalState.user.darkMode);
		// console.log(colors.darkmode.color1)
		// setColorsPalette(((globalState.user && globalState.user.darkMode) == true ? colors.darkmode : colors.lightmode));
    }
	}, [isFocused]);


	return (
	
		<SafeAreaView style={styles.container(globalState.theme.colorBackground)}>
			{/*<View style={{ marginTop: 30 }}>
				<Text style={styles.bodyHeader}>Create a Workout from</Text>
			</View>*/}
			<View style={styles.CreateWorkoutCntnr}>	
				<View>
					<TouchableOpacity onPress={handleTemplatePress} style={styles.CreateWorkoutBttnsContainer(globalState.theme.color1)}>
						<Text style={styles.CreateWorkoutBttns(globalState.theme.colorText)}>Create A Workout</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.Header}>
				<Text style={styles.HeaderText(globalState.theme.colorText)}>
					You have {loadCurrentDayWorkoutStatus()}
				</Text>
			</View>
			{todaysWorkouts.length != 0 && <View style={styles.BodyContainer}>
				<Text style={styles.bodyHeader}>Your Scheduled Workouts:</Text>
				{/* <Button title="start" onPress={() => {navigation.navigate("start", {workout: null})}}/> */}
				{loadTodaysWorkout()}
			</View>}
		</SafeAreaView>
	);
	//}
}

const styles = StyleSheet.create({
	HeaderText: (textColor) => {
		return {
			fontWeight: "bold",
			fontSize: 20,
			alignSelf: "center",
			marginTop: 40,
			color: textColor
		}
	},
	HeaderContainer: {
		alignItems: "center",
	},
	CreateWorkoutCntnr: {
		flexDirection: "row",
		alignSelf: "center",
	},
	container: (color) => {
		return {
			flex: 1,
			backgroundColor: color,
		}
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
	CreateWorkoutBttns: (color) => {
		return {
			color: color,
			fontWeight: "bold",
			fontSize: 23,	
		}	
	},
	CreateWorkoutBttnsContainer: (color) => {
		return {
			alignItems: "center",
			backgroundColor: color,
			marginTop: 15,
			padding: 25,
			borderRadius: 20,
			borderWidth: .5,
			// flex: 2,
			width: 350,
			height:82
		}
	},
	CreateWorkoutText: {
		...Platform.select({
      ios: {
        fontFamily: 'HelveticaNeue-Bold'
      },
      android: {
        fontFamily: "Roboto"
      },
    }),
	// fontFamily: "HelveticaNeue",
	fontWeight: 400,
	fontSize: 12,
	fontWeight: "normal",
	color: "#C4C4C4",
	textAlign: "center",
	position: "absolute",
	// justifyContent:"center"
	// left: 300
	},
	space: {
		width: 50,
		height: 20,
	},
	Header: {
		marginBottom: 20
	}
});

//export default LandingPage;
