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
	Alert,
	KeyboardAvoidingView,
	Modal
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import DraggableFlatList, {ScaleDecorator} from 'react-native-draggable-flatlist';
import {TimePicker} from 'react-native-simple-time-picker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import keyboardAwareDraggableFlatlist from "../keyboard-aware-draggable-flatlist";
import KeyboardAwareDraggableFlatlist from "../keyboard-aware-draggable-flatlist";
// import KeyboardSpacer from 'react-native-keyboard-spacer';

export default function ExerciseReview({setCurrState, workout, updateWorkout}) {
	// const [globalState, updateGlobalState] = useGlobalState();
	const [exercises, updateExercises] = useState(!workout[0].exercises ? [] : workout[0].exercises);
	const [modalVisible, setModalVisible] = useState(false);
	const [timeVal, setTimeVal]= useState({
		hours: 0,
		minutes: 0,
		seconds: 0
	})
	const [currentExIdx, setCurrExIdx] = useState(0);

	useEffect(() => {
		let temp = { ...workout };
		temp[0].exercises = exercises;
		updateWorkout(temp);
	}, [exercises]);

	function checkExercises() {
		
		for (let exercise of workout[0].exercises) {

			// console.log("sets: " + exercise.sets + " reps: " + exercise.reps + " weight: " + exercise.weight)
			
			if ((exercise.exerciseType === "SETSXREPS" || exercise.exerciseType === "AMRAP") && (exercise.sets === undefined || exercise.sets === 0)) {
				console.log(exercise.title);
				return false;
			} else if ((exercise.exerciseType === "SETSXREPS" || exercise.exerciseType === "AMRAP") && exercise.weight === undefined) {
				return false;
			} else if ((exercise.exerciseType === "CARDIO" || exercise.exerciseType === "AMRAP") && (exercise.time === undefined || exercise.time === 0)) {
				return false;
			} else if ((exercise.exerciseType === "SETSXREPS") && (exercise.reps === undefined || exercise.reps === 0)) {
				return false;
			} 
			
		}

		return true;
	}

	return (
		<View style={styles.Background}>
			<TouchableOpacity
				style={styles.addExerciseButton}
				onPress={() => {
					setCurrState("ExerciseSearch");
				}}
			>
				<Text
					style={{
						fontSize: 18,
						padding: 5,
						textAlign: "center",
						fontWeight: "bold",
					}}
				>
					Add an Exercise
				</Text>
			</TouchableOpacity>
			<KeyboardAwareDraggableFlatlist
				data={exercises}
				style={{ height: "75%" }}
				enableOnAndroid={true}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={
					<View
						style={{
							flex: 1,
							alignItems: "center",
							marginTop: "30%",
						}}
					>
						<Text style={{ fontWeight: "bold", fontSize: 18 }}>
							This workout currently has no exercises
						</Text>
					</View>
				}
				onDragEnd={({data}) => updateExercises(data)}
				renderItem={({ item, getIndex, drag, isActive }) => (
					<ScaleDecorator>
						<TouchableOpacity style={styles.ExerciseCard} onLongPress={drag} disabled={isActive}>
							<View style={styles.ExerciseCardTop}>
								<Image
									source={{ uri: item.image }}
									style={styles.ExerciseImage}
								/>
								<View style={{alignItems:'center'}}>
									<Text style={styles.ExerciseText}>
										{item.title}
									</Text>
									<Dropdown
									inverted={true}
									style={styles.dropdown}
									data={[
										{ label: "Cardio", value: "CARDIO" },
										{
											label: "Sets x Reps",
											value: "SETSXREPS",
										},
										{ label: "AMRAP", value: "AMRAP" },
									]}
									labelField="label"
									valueField="value"
									value={item.exerciseType}
									onChange={(val) => {
										let temp = [...exercises];
										temp[getIndex()].exerciseType = val.value;
										updateExercises(temp);
									}}
									/>
								</View>
								
								<TouchableOpacity
									onPress={() => {
										let temp = [...exercises];
										temp.splice(getIndex(), 1);
										updateExercises(temp);
									}}
								>
									<AntDesign
										style={styles.DeleteExerciseBttn}
										name="minus"
										size={20}
									/>
								</TouchableOpacity>
							</View>
							<View style={styles.ExerciseCardBottom}>
								{(item.exerciseType === "SETSXREPS" ||
									item.exerciseType === "AMRAP") && (
									<View style={styles.rowViewInputs}>
									<Text>Sets:</Text>
									<View style={styles.inputFieldView}>
										<TextInput
											style={styles.inputfield}
											keyboardType="numeric"
											placeholder={item.sets ? `${item.sets}` : "Sets"}
											placeholderTextColor="#808080"
											value={item.sets ? `${item.sets}` : ''}
											maxLength={2}
											// defaultValue={item.sets ? item.sets : undefined}
											onChangeText={(text) => {
												let temp = [...exercises];
												let str = text.split(".");
												// target.value = str[0];
												temp[getIndex()].sets = str[0];
												// console.log(temp[index].sets = str[0])
												updateExercises(temp);
											}}
										/>
									</View>
									</View>
									
								)}
								{item.exerciseType === "SETSXREPS" && (
									<View style={styles.rowViewInputs}>
										<Text>Reps:</Text>
										<View style={styles.inputFieldView}>
											<TextInput
												style={styles.inputfield}
												keyboardType="numeric"
												placeholder={item.reps ? `${item.reps}`  : "Reps"}
												placeholderTextColor="#808080"
												maxLength={3}
												value={item.reps ? `${item.reps}` : ''}
												// defaultValue={item.reps ? item.reps : undefined}
												onChangeText={(text) => {
													let temp = [...exercises];
													let str = text.split(".");
													temp[getIndex()].reps = str[0];
													updateExercises(temp);
											}}
											/>
										</View>
									</View>
									
								)}
								{(item.exerciseType === "SETSXREPS" ||
									item.exerciseType === "AMRAP") && (
									<View style={styles.rowViewInputs}>
										<Text>Weight:</Text>
										<View style={styles.inputFieldView}>
											<TextInput
												style={styles.inputfield}
												keyboardType="numeric"
												maxLength={3}
												placeholder={item.weight ? `${item.weight}`  : "Weight"}
												placeholderTextColor="#808080"
												value={item.weight ? `${item.weight}` : ""}
												// defaultValue={item.weight ? item.weight : undefined}
												onChangeText={(text) => {
													let temp = [...exercises];
													temp[getIndex()].weight = text;
													updateExercises(temp);
												}}
											/>
										</View>
									</View>
									
								)}
								{(item.exerciseType === "AMRAP" ||
									item.exerciseType === "CARDIO") && (
									<View style={styles.rowViewInputs}>
										<Text>Time:</Text>
										<View style={styles.inputFieldView}>
											<TouchableOpacity
												onPress={() => {
													setModalVisible(!modalVisible);
													setCurrExIdx(getIndex);
													setTimeVal({
														hours: 0,
														minutes: Math.floor(item.time / 60),
														seconds: item.time % 60
													})
												}}>
												<View pointerEvents="none">
													<TextInput
													style={styles.inputfield}
													editable={false}
													cursorColor={'transparent'}
													keyboardType="numeric"
													placeholder={item.time ? `${Math.floor(item.time / 60)}m ${item.time % 60}s` : "Time"}
													placeholderTextColor="#808080"
													value={item.time ? `${Math.floor(item.time / 60)}m ${item.time % 60}s` : ''}
													// defaultValue={item.time ? item.time : undefined}
													onChangeText={(text) => {
														let temp = [...exercises];
														temp[getIndex()].time = text;
														updateExercises(temp);
													}}
													/>
												</View>
											</TouchableOpacity>
										</View>
									</View>
									
								)}
							</View>
						</TouchableOpacity>
					</ScaleDecorator>
				)}
			/>

			{/* <KeyboardSpacer topSpacing={100}/> */}

			<View style={styles.navButtonContainer}>
				<View style={{ backgroundColor: "#FF8C4B", flex: 1 }}>
					<TouchableOpacity
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
						onPress={() => {
							setCurrState("chooseTemplate");
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
							if (workout[0].exercises.length === 0) {
								Alert.alert(
									"Love the enthusiasm, but you have to at least have one exercise if you wanna workout",
								);
							} else if(!checkExercises()){
								Alert.alert("Please fill all the appropriate fields for each exercise");
							} else {
								setCurrState("BeginFinalizing");
							}
						}}
					>
						<AntDesign
							size={useWindowDimensions().height * 0.08}
							name="rightcircle"
							color={"white"}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<TimePicker 
							value={timeVal} 
							onChange={(val) => {setTimeVal(val)}} 
							pickerShows={["minutes", "seconds"]}
							minutesUnit={"m"}
							secondsUnit={"s"}/>
						<TouchableOpacity
						style={[styles.button, styles.buttonClose]}
						onPress={() => {
							setModalVisible(!modalVisible);
							let temp = {...workout[0]};
							temp.exercises[currentExIdx].time = 3600 * timeVal.hours + 60 * (timeVal.minutes ? timeVal.minutes : 0) + (timeVal.seconds ? timeVal.seconds : 0);
							updateWorkout([temp]);
							setTimeVal({
								hours: 0,
								minutes: 0,
								seconds: 0
							});
							// console.log(temp.exercises[currentExIdx].time);
							// console.log(timeVal.minutes, " ", timeVal.seconds)
						}}>
						<Text style={styles.textStyle}>Done</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>	
	);
}

const styles = StyleSheet.create({
	Background: {
		backgroundColor: "white",
		flex: 1,
		borderTopWidth:1.5,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignContent: "space-between",
		// alignItems: "flex-end",
	},
	ExerciseCard: {
		backgroundColor: "#F1F3FA",
		padding: 15,
		margin: 5,
		// marginBottom: 0,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
		borderRadius: 15,
		alignItems: "center",
		borderWidth: .7,
	},
	ExerciseCardTop: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
		// borderWidth: 2,
	},
	ExerciseCardBottom: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignContent: "center",
		marginTop: 8,
		// borderWidth: 2,
	},
	rowViewInputs: {
		flexDirection: "column", 
		alignItems: 'center',
		// borderWidth: 1,
		width: '33%'
	},
	inputFieldView: {
		// borderWidth: 1, 
		width: '80%'
	},
	inputfield: {
		flex: 1,
		textAlign: "center",
		borderWidth: 0.5,
		shadowColor: "rgba(0,0,0, .4)", // IOS
		shadowOffset: { height: 1, width: 1 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		backgroundColor: "white",
	},
	ExerciseImage: {
		height: 60,
		aspectRatio: 1,
		borderWidth: 1,
		borderRadius: 20,
		// marginTop: 10
	},
	ExerciseText: {
		fontSize: 14,
		fontWeight: "bold",
		left: 5,
		// top: 30,
		// marginVertical: "auto"
		textAlignVertical: "bottom",
		// flex:0.5
	},
	DeleteExerciseBttn: {
		padding: 10,
		borderWidth: 2,
		borderRadius: 100,
	},
	BttnText: {
		color: "white",
		fontSize: 20,
	},
	addExerciseButton: {
		borderWidth: 0.5,
		width: "60%",
		alignSelf: "center",
		marginVertical: 15,
		backgroundColor: "#DDF2FF",
		borderRadius: 8,
		shadowColor: "rgba(0,0,0, .4)", // IOS
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		elevation: 2,
	},
	dropdown: {
		width: 120,
		borderBottomWidth: 0.5,
	},
	navButtonContainer: {
		height: "15%",
		display: "flex",
		flexDirection: "row",
		borderTopWidth: .5,
		justifyContent: "space-between",
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	  },
	  modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
		  width: 0,
		  height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	  },
	  button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	  },
	  buttonClose: {
		backgroundColor: '#2196F3',
	  },
	  textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	  },
	  modalText: {
		marginBottom: 15,
		textAlign: 'center',
	  },
});
