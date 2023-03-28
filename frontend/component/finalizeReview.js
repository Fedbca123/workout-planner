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
	Animated,
	Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import reactDom, { render } from "react-dom";
import Workouts from "./workout.js";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance.js";
import { AntDesign } from "@expo/vector-icons";
import { Header, SearchBar } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import config from "../../backend/config.js"

export default function FinalizeReview({ workout, updateWorkout, setCurrState, navigation, }) {
	const [expanded, setExpanded] = useState(false);
	const [globalState, updateGlobalState] = useGlobalState();
	const spinValue = React.useState(new Animated.Value(0))[0]; // Makes animated value
	const handlePress = () => {
		setExpanded(!expanded);
	};

	// When button is pressed in, make spinValue go through and up to 1
	const onPressIn = () => {
		Animated.spring(spinValue, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	// When button is pressed out, make spinValue go through and down to 0
	const onPressOut = () => {
		Animated.spring(spinValue, {
			toValue: 0,
			useNativeDriver: true,
		}).start();
	};

	const spinDeg = spinValue.interpolate({
		useNativeDriver: true,
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	function scheduledWorkout() {

			let formData = new FormData();
			formData.append('title', workout[0].title);
			formData.append('description', workout[0].description);
			
			if (workout[0].image)
			{
				let filename = workout[0].image.split('/').pop();
				let match = /\.(\w+)$/.exec(filename);
				let type = match ? `image/${match[1]}` : `image`;
				formData.append('image', { uri: workout[0].image, name: filename, type });
			}

			formData.append('owner', globalState.user._id);
			formData.append('location', workout[0].location);
			formData.append('duration', workout[0].duration);
			formData.append('recurrence', workout[0].recurrence);
			formData.append('scheduledDate', workout[0].scheduledDate);

			let workoutTags = [];
			let muscleGroups = [];

			for (let i = 0; i < workout[0].exercises.length; i++){
				// console.log(exercises[i]);
				formData.append('exercises[]', JSON.stringify(workout[0].exercises[i]));
			}

			for (let i = 0; i < workout[0].exercises.length; i++){

				for (let j = 0; j < workout[0].exercises[i].tags.length; j++){
					if (!workoutTags.includes(workout[0].exercises[i].tags[j])) {
						workoutTags.push(workout[0].exercises[i].tags[j]);
						formData.append('tags[]', workout[0].exercises[i].tags[j])
					}
				}

				for (let j = 0; j < workout[0].exercises[i].muscleGroups.length; j++){
					if (!muscleGroups.includes(workout[0].exercises[i].muscleGroups[j])) {
						workoutTags.push(workout[0].exercises[i].muscleGroups[j]);
						formData.append('muscleGroups[]', workout[0].exercises[i].muscleGroups[j]);
					}
				}
			}

			API_Instance.post(`users/${globalState.user._id}/workouts/create/schedule`, formData, {
				headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': `BEARER ${globalState.authToken}`
                }
			}).then((response) => {
				if (response.status == 200) {
					// console.log(response.data);
                    Alert.alert('Success!', 'Workout scheduled!', [
                        {text: 'OK', onPress: () => {}},
					]);

					navigation.navigate("Home");
				}
			}).catch((e) => {
                Alert.alert('Error!', 'Workout not created', [
                    {text: 'OK', onPress: () => {}},
                ]);
				console.log(e);
			});
	}

	return (
		<View style={styles.container}>
			<View style={styles.navButtonContainer}>
				<View style={{ backgroundColor: "#FF8C4B", flex: 1 }}>
					<TouchableOpacity
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
						onPress={() => {
							setCurrState("Schedule");
						}}
					>
						<AntDesign
							size={useWindowDimensions().height * 0.08}
							name="leftcircle"
							color={"white"}
						/>
					</TouchableOpacity>
				</View>

				<View style={{ alignSelf: "center", flex: 1 }}>
					<TouchableOpacity
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#10B9F1",
						}}
						onPress={() => {
							scheduledWorkout();
						}}
					>
						<AntDesign
							size={useWindowDimensions().height * 0.08}
							name="checkcircle"
							color={"white"}
						/>
					</TouchableOpacity>
				</View>
			</View>

			<FlatList
				data={workout}
				renderItem={(item) => (
					<View style={styles.workoutItems}>
						<TouchableOpacity
							onPress={handlePress}
							activeOpacity="1"
						>
							<View style={styles.workoutHeader}>
								<View style={styles.workoutCardImageContainer}>
									<Image
										style={styles.workoutCardImage}
										src={(workout[0].image) ? (workout[0].image.uri || config.DEFAULTWORKIMAGE) : config.DEFAULTWORKIMAGE}
									/>
								</View>
								<View style={styles.workoutCardTitleContainer}>
									<Text style={styles.workoutCardTitle}>
										{workout[0].title}
									</Text>
								</View>
								<View
									style={styles.expandableIndicatorContainer}
								>
									<Image
										// source={require("../../assets/expandable.png")}
										source={null}
										style={[
											styles.expandableIndicator,
											expanded
												? {
														transform: [
															{
																rotate: "180deg",
															},
														],
												  }
												: {},
											,
											{
												height: 90,
												width: 90,
											},
										]}
									/>
								</View>
							</View>

							{true && (
								<View style={styles.workoutCardText}>
									<Text style={styles.workoutCardDescription}>
										{workout[0].description}
									</Text>
									<Text style={styles.workoutCardDuration}>
										Duration: {workout[0].duration} min
									</Text>
									{workout[0].location && (
										<Text
											style={styles.workoutCardDuration}
										>
											Location: {workout[0].location}
										</Text>
									)}
									<Text style={styles.workoutCardDuration}>
										Time:{" "}
										{new Date(
											workout[0].scheduledDate,
										).toDateString() +
											" " +
											new Date(
												workout[0].scheduledDate,
											).toLocaleTimeString()}
									</Text>
									<Text
										style={styles.workoutCardMuscleGroups}
									>
										Muscle Groups:{" "}
										{workout[0].muscleGroups.join(", ")}
									</Text>
								</View>
							)}

							{true &&
								workout[0].exercises.map((exercise) => (
									<View
										style={styles.workoutExerciseCard}
										key={exercise._id}
									>
										<TouchableOpacity
											activeOpacity={1}
											onPress={() => {
												// Commenting out openExerciseInfo doesn't break it
											}}
										>
											<View
												style={
													styles.workoutExerciseContainer
												}
											>
												<View
													style={
														styles.workoutExerciseCardContent
													}
												>
													<View
														style={
															styles.workoutExerciseCardImageContainer
														}
													>
														<Image
															style={
																styles.workoutExerciseCardImage
															}
															src={exercise.image}
														/>
													</View>
													<View
														style={
															styles.workoutExerciseCardTextContainer
														}
													>
														<Text
															style={
																styles.workoutExerciseCardTitle
															}
														>
															{exercise.title}
														</Text>
														<Text>
															{/* {exercise.exerciseType +
																"\t"} */}
															{exercise.exerciseType ===
																"SETSXREPS" &&
																exercise.sets +
																	" x " +
																	exercise.reps +
																	" with " +
																	exercise.weight +
																	"lbs"}
															{exercise.exerciseType ===
																"AMRAP" &&
																exercise.sets +
																	" sets with " +
																	exercise.weight +
																	"lbs for " +
																	exercise.time +
																	" seconds"}
															{exercise.exerciseType ===
																"CARDIO" &&
																exercise.time +
																	" seconds"}
														</Text>
													</View>
												</View>
											</View>
										</TouchableOpacity>
									</View>
								))}
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		flexDirection: "column-reverse",
		borderTopWidth: 1,
		// borderWidth: 1,
		// justifyContent:"space-between"
	},
	navButtonContainer: {
		height: "15%",
		display: "flex",
		flexDirection: "row",
		borderWidth: 1,
		justifyContent: "space-evenly",
	},
	workoutItems: {
		// backgroundColor: "#E5DAE7",
		// backgroundColor: "#FEE2CF",
		color: "#333",
		fontWeight: "500",
		justifyContent: "center",
		textAlign: "center",
		paddingTop: 10,
		paddingBottom: 14,
		resizeMode: "contain",
		flex: 1,
		margin: 1,
		// overflow: "hidden",
		// shadowColor: "#000",
		// shadowOffset: { width: 0, height: 0 },
		// shadowOpacity: 1,
		// shadowRadius: 2,
		// borderWidth: 2,
		// borderRadius: 15
	},
	workoutExerciseCard: {
		// backgroundColor: "#E5DAE7",
		// color: "#333",
		fontWeight: "500",
		justifyContent: "center",
		textAlign: "center",
		padding: 0.5,
		resizeMode: "contain",
		//height: Dimensions.get('window') / numColumns,
		flex: 1,
		margin: 1,
	},
	workoutExerciseCardTextContainer: {
		alignItems: "center",
		// width: "100%",
		textAlign: "center",
		alignContent: "center",
		marginLeft: 100,
		// flex: 1,
		// flexShrink: 1,
		// flexWrap: 'wrap',
	},
	workoutExerciseCardTitle: {
		fontSize: 16,
		fontWeight: "bold",
		// flexShrink: 1,
		textAlign: "center",
	},
	workoutCardText: {
		alignItems: "center",
		marginLeft: 0,
		paddingTop: 15,
		textAlign: "center",
	},
	workoutCardTitleContainer: {
		alignItems: "center",
		// marginLeft: 120,
		textAlign: "center",
	},
	workoutCardTitle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	exerciseCardSets: {
		fontWeight: "bold",
		fontSize: 13,
	},
	workoutCardMuscleGroups: {
		fontWeight: "bold",
		fontSize: 12,
		textAlign: "center",
		marginVertical: 5,
	},
	workoutTitle: {
		fontWeight: "bold",
		fontSize: 13,
	},
	workoutCardDescription: {
		fontWeight: "bold",
		fontSize: 14,
		textAlign: "center",
		marginVertical: 5,
	},
	workoutCardTags: {
		fontWeight: "bold",
		fontSize: 12,
		textAlign: "center",
	},

	workoutCardDuration: {
		fontWeight: "bold",
		fontSize: 12,
		// paddingBottom: 10,
		textAlign: "center",
	},
	workoutExerciseContainer: {
		backgroundColor: "#67BBE0",
		color: "#333",
		fontWeight: "500",
		// alignContent: 'center',
		// alignItems: 'center',
		// justifyContent: 'center',
		// textAlign: 'center',
		// // width: "140%",
		// paddingTop: 12,
		paddingVertical: 15,
		// paddingHorizontal: 12,
		//height: Dimensions.get('window') / numColumns,
		// flex: 1,
		// flexDirection: 'row',
		alignSelf: "stretch",
		margin: 2,
		// flex: 1,
		flexDirection: "row",
		borderColor: "black",
		borderWidth: 2,
		borderRadius: "15rem",
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 1,
		shadowRadius: 2,
	},
	workoutExerciseCardContent: {
		// alignContent: 'center',
		alignItems: "center",
		justifyContent: "center",
		// textAlign: 'center',
		flex: 1,
		flexDirection: "row",
	},
	expandableIndicatorContainer: {
		position: "absolute",
		right: 10,
		bottom: 0,
	},
	workoutCardImageContainer: {
		position: "absolute",
		left: 10,
		top: 0,
		marginRight: 20,
		borderColor: "black",
		borderWidth: 1.5,
		borderRadius: 20,
	},
	workoutCardImage: {
		width: 90,
		height: 90,
		resizeMode: "stretch", // can be changed to contain if needed
		borderRadius: 20,
	},
	workoutHeader: {
		// resizeMode: 'contain',
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-evenly",
		paddingVertical: 30,
	},
	expandableIndicator: {
		width: 15,
		height: 15,
	},
	workoutExerciseCardImageContainer: {
		position: "absolute",
		left: 10,
		marginRight: 20,
		borderColor: "black",
		borderWidth: 1.5,
		borderRadius: 20,
	},
	workoutExerciseCardImage: {
		width: 60,
		height: 60,
		resizeMode: "stretch", // can be changed to contain if needed
		borderRadius: 20,
	},
});
