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
	Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import reactDom from "react-dom";
import API_Instance from "../../backend/axios_instance";
import { useGlobalState } from "../GlobalState.js";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectBox from "react-native-multi-selectbox";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function FinalizedContinued() {

	const navigation = useNavigation();
	const [globalState, updateGlobalState] = useGlobalState();
	// const [modalVisible, setModalVisible] = useState(false);
	const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions(ImagePicker.PermissionStatus.UNDETERMINED);
	const [photoStatus, requestPhotoLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
	const [imageUri, setImageUri] = useState('');
	const [exercises, updateExercises] = useState(globalState.workout[0].exercises);
	const [isReoccurring, setReoccurring] = useState(false);
	const exerciseTypes = [
	{label: 'Cardio', value: "CARDIO"},
	{label: 'Sets and Reps', value: "SETSXREPS"},
	{label: 'As many reps as possible', value: "AMRAP"},
	];
	const toggleSwitch = () => setReoccurring(previousState => !previousState);
	const [isVisible, setIsVisible] = useState(false);
	// const [currType, setCurrType] = useState([]);
    
	const getPhotoForExercise = async () => {

		await requestPhotoLibraryPermission(ImagePicker.requestMediaLibraryPermissionsAsync);

		if (photoStatus.granted === false) {
			Alert.alert("You need to go to settings to allow Photo Gallery access");
		} else {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			if (!result.canceled) {
				setImageUri(result.assets[0].uri);
				return result.assets[0].uri;
			}
		}
		
	}

	const takePhotoForExercise = async () => {

		await requestCameraPermission(ImagePicker.requestCameraPermissionsAsync);
		// await Permissions.askAsync(Permissions.CAMERA_ROLL);

		// console.log(cameraStatus.status);

		if (cameraStatus.granted === false) {
			Alert.alert("You need to go to settings to allow camera access");
		} else {
			let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
			});

			if (!result.canceled) {
				setImageUri(result.assets[0].uri);
				return result.assets[0].uri;
			}
		}
		
		
	}

	function picChooser() {

	}

	function scheduledWorkout() {
		if (true) {

			let formData = new FormData();
			formData.append('title', globalState.workout[0].title);
			formData.append('description', globalState.workout[0].description);
			
			if (imageUri != '')
			{
				let filename = imageUri.split('/').pop();
				let match = /\.(\w+)$/.exec(filename);
				let type = match ? `image/${match[1]}` : `image`;
				formData.append('image', { uri: imageUri, name: filename, type });
			}

			formData.append('owner', globalState.user._id);
			formData.append('location', globalState.workout[0].location);
			formData.append('duration', globalState.workout[0].duration);
			formData.append('recurrence', isReoccurring);
			formData.append('scheduledDate', globalState.workout[0].scheduledDate);

			let workoutTags = [];
			let muscleGroups = [];

			for (let i = 0; i < exercises.length; i++){
				// console.log(exercises[i]);
				formData.append('exercises[]', JSON.stringify(exercises[i]));
			}

			for (let i = 0; i < exercises.length; i++){

				for (let j = 0; j < exercises[i].tags.length; j++){
					if (!workoutTags.includes(exercises[i].tags[j])) {
						workoutTags.push(exercises[i].tags[j]);
						formData.append('tags[]', exercises[i].tags[j])
					}
				}

				for (let j = 0; j < exercises[i].muscleGroups.length; j++){
					if (!muscleGroups.includes(exercises[i].muscleGroups[j])) {
						workoutTags.push(exercises[i].muscleGroups[j]);
						formData.append('muscleGroups[]', exercises[i].muscleGroups[j]);
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

					navigation.popToTop();
					navigation.navigate("Home");
				}
			}).catch((e) => {
                Alert.alert('Error!', 'Workout not created', [
                    {text: 'OK', onPress: () => {}},
                ]);
				console.log(e);
			});

		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.TitleText}>Upload an Image here if you wish to change the workout image.</Text>
			{imageUri != '' && <Image source={{ uri: imageUri }} style={styles.ImageStyle} />}
			{imageUri == '' && <Button title = "Change Image"
                    onPress={async () => {
						setIsVisible(true);
				}} />}
			{imageUri != '' &&<Button title = "Reset"
                    onPress={async () => {
                        setImageUri('');
				}} />}
			<Modal
				isVisible={isVisible}
				swipeDirection='down'
				style={{ justifyContent: 'flex-end', margin: 0 }}
				animationIn={"slideInUp"}
				animationOut={"slideOutDown"}
				onSwipeComplete={() => { setIsVisible(false) }}
				>
				<View style={{ backgroundColor: '#fff', height: 300 }}>
					<View style={{flex:.5}}>
						<Text style={styles.modalText}>Choose where to upload from:</Text>
					</View>
					
					<View style={{flex:1}}>
						<TouchableOpacity style={styles.modalButton} onPress={async () => {
						setImageUri(await getPhotoForExercise());
						setIsVisible(false);
						}}>

							<AntDesign name="picture" size={24}/>
							<Text style={styles.modalText}>Upload an Image from Library</Text>

						</TouchableOpacity>
					</View>
					

					<TouchableOpacity style={styles.modalButton} onPress={async () => {
						setImageUri(await takePhotoForExercise());
						setIsVisible(false);
					}}>

						<AntDesign name="camera" size={24}/>
						<Text style={styles.modalText}>Take a Photo</Text>

					</TouchableOpacity>

					<TouchableOpacity style={styles.modalButton} onPress={() => { setIsVisible(false); }}>

						<AntDesign name="close" size={24}/>
						<Text style={styles.modalText}>Cancel</Text>

					</TouchableOpacity>
   				</View>
			</Modal>
			<Text style={styles.TitleText}>Please choose the exercise type for each exercise and fill in the appropriate info for each.</Text>
			<FlatList
				initialNumToRender={1}
				style={{maxHeight:300}}
				data={exercises}
				renderItem={({ item, index}) => (
					<View style={styles.ExerciseCard}>
							{/* <Image source={{ uri: item.image }} style={styles.ImageStyle} /> */}
						<Text style={styles.ExerciseText}>
							{item.title}	
							<View style={{ display: "flex", flexDirection: "row"}}>
								<Dropdown
									style={styles.dropdown}
									data={exerciseTypes}
									labelField="label"
									valueField="value"
									value={item.exerciseType}
									onChange={(val) => {
										let exercisesCopy = [...exercises];
										exercisesCopy[index].exerciseType = val.value;
										updateExercises(exercisesCopy);
									}}
								/>

								{(item.exerciseType === "SETSXREPS" || item.exerciseType === "AMRAP") && <TextInput onChangeText={(val) => { item.sets = val }} placeholder="sets" keyboardType="number-pad" style={styles.exerciseInput} />}
								
								{item.exerciseType === "SETSXREPS" && <TextInput onChangeText={(val) => { item.reps = val }} placeholder="reps" keyboardType="number-pad" style={styles.exerciseInput} />}
								
								{(item.exerciseType === "SETSXREPS" || item.exerciseType === "AMRAP") && <TextInput onChangeText={(val) => { item.weight = val }} placeholder="weight" keyboardType="number-pad" style={styles.exerciseInput} />}
								
								{(item.exerciseType === "CARDIO" || item.exerciseType === "AMRAP") && <TextInput onChangeText={(val) => {
									item.time = val
								}} placeholder="time" keyboardType="number-pad" style={styles.exerciseInput} />}
							</View>
						</Text>	
					</View>
				)}
			/>

			<Text style={styles.TitleText}>Reoccurring?
				<Switch
					value={isReoccurring}
					onValueChange={toggleSwitch}
				/>
			</Text>
			
			<Button title="Continue" onPress={() => {
				scheduledWorkout();
				// updateGlobalState("workoutScheduled",globalState.workout);
				// navigation.popToTop();
				// navigation.navigate("Home");
				// navigation.push("finalizedContinued");
			}}/>
		</SafeAreaView>
	)
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
	exerciseInput: {
		padding: 10,
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
		width: 200,
		height: 150,
		borderRadius: 10,
		position: "relative",
		justifyContent: "center",
		right:-100,
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
		left: 0,
		// top: 30,
		// marginVertical: "auto"
		textAlignVertical: "bottom",
		// flex:0.5
	},
	dropdown: {
		width: 120,
    //   margin: 2,
    //   height: 50,
    //   borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
	},
	modalButton: {
		display: "flex",
		flexDirection: "row",
		flex: 1,
		borderWidth: 2,
	},
	modalText: {
		fontSize: 20,
		textAlign: "center"
	},
})