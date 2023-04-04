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
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

export default function ExerciseReview({setCurrState, workout, updateWorkout}) {
	// const [globalState, updateGlobalState] = useGlobalState();
	const [exercises, updateExercises] = useState(!workout[0].exercises ? [] : workout[0].exercises);

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
			<KeyboardAwareFlatList
				data={exercises}
				
				style={{ height: "70%" }}
				enableOnAndroid={true}
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
				renderItem={({ item, index }) => (
					<View style={styles.ExerciseCard}>
						<View style={styles.ExerciseCardTop}>
							<Image
								source={{ uri: item.image }}
								style={styles.ExerciseImage}
							/>
							<Text style={styles.ExerciseText}>
								{item.title}
							</Text>
							<TouchableOpacity
								onPress={() => {
									let temp = [...exercises];
									temp.splice(index, 1);
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
						<View style={{ alignItems: "center" }}>
							<Dropdown
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
									temp[index].exerciseType = val.value;
									updateExercises(temp);
								}}
							/>
						</View>
						<View style={styles.ExerciseCardBottom}>
							{(item.exerciseType === "SETSXREPS" ||
								item.exerciseType === "AMRAP") && (
								<View style={{flexDirection: "column", alignItems: 'center'}}>
								<Text>Sets:</Text>
								<TextInput
									style={styles.inputfield}
									keyboardType="numeric"
									placeholder={item.sets ? `${item.sets}` : "Sets"}
									placeholderTextColor="#808080"
									// defaultValue={item.sets ? item.sets : undefined}
									onChangeText={(text) => {
										let temp = [...exercises];
										let str = text.split(".");
										// target.value = str[0];
										temp[index].sets = str[0];
										// console.log(temp[index].sets = str[0])
										updateExercises(temp);
									}}
								/>
								</View>
								
							)}
							{item.exerciseType === "SETSXREPS" && (
								<View style={{flexDirection: "column", alignItems: 'center'}}>
									<Text>Reps:</Text>
									<TextInput
										style={styles.inputfield}
										keyboardType="numeric"
										placeholder={item.reps ? `${item.reps}`  : "Reps"}
										placeholderTextColor="#808080"
										// defaultValue={item.reps ? item.reps : undefined}
										onChangeText={(text) => {
											let temp = [...exercises];
											let str = text.split(".");
											temp[index].reps = str[0];
											updateExercises(temp);
									}}
									/>
								</View>
								
							)}
							{(item.exerciseType === "SETSXREPS" ||
								item.exerciseType === "AMRAP") && (
								<View style={{flexDirection: "column", alignItems: 'center'}}>
									<Text>Weight:</Text>
									<TextInput
										style={styles.inputfield}
										keyboardType="numeric"
										placeholder={item.weight ? `${item.weight}`  : "Weight"}
										placeholderTextColor="#808080"
										// defaultValue={item.weight ? item.weight : undefined}
										onChangeText={(text) => {
											let temp = [...exercises];
											temp[index].weight = text;
											updateExercises(temp);
										}}
									/>
								</View>
								
							)}
							{(item.exerciseType === "AMRAP" ||
								item.exerciseType === "CARDIO") && (
								<View style={{flexDirection: "column", alignItems: 'center'}}>
									<Text>Time:</Text>
									<TextInput
									style={styles.inputfield}
									keyboardType="numeric"
									placeholder={item.time ? `${item.time}` : "Time"}
									placeholderTextColor="#808080"
									// defaultValue={item.time ? item.time : undefined}
									onChangeText={(text) => {
										let temp = [...exercises];
										temp[index].time = text;
										updateExercises(temp);
									}}
								/>
								</View>
								
							)}
						</View>
					</View>
				)}
			/>

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
		</View>
	);
}

const styles = StyleSheet.create({
	Background: {
		backgroundColor: "white",
		flex: 1,
		borderWidth:.5,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-evenly",
		alignContent: "space-between",
		// alignItems: "flex-end",
	},
	ExerciseCard: {
		backgroundColor: "#F1F3FA",
		padding: 20,
		margin: 10,
		// marginBottom: 0,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
		borderRadius: 15,
		alignItems: "center",
	},
	ExerciseCardTop: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
	},
	ExerciseCardBottom: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignContent: "center",
		marginTop: 20,
	},
	inputfield: {
		marginHorizontal: 50,
		width: "60%",
		textAlign: "center",
		borderWidth: 0.5,
		shadowColor: "rgba(0,0,0, .4)", // IOS
		shadowOffset: { height: 1, width: 1 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		padding: 4,
		backgroundColor: "white",
	},
	ExerciseImage: {
		height: 70,
		width: 70,
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
		borderWidth: 1,
		justifyContent: "space-evenly",
	},
});
