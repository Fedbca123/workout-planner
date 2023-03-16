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
import React, { useEffect, useState } from "react";
import reactDom from "react-dom";
import API_Instance from "../../backend/axios_instance";
import { useGlobalState } from "../GlobalState.js";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectBox from "react-native-multi-selectbox";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";

export default function FinalizedContinued() {

	const navigation = useNavigation();
	const [globalState, updateGlobalState] = useGlobalState();
	// const [modalVisible, setModalVisible] = useState(false);
	const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions(ImagePicker.PermissionStatus.UNDETERMINED);
	const defaultImage = globalState.workout[0].image;
	const [photoStatus, requestPhotoLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
	const [imageUri, setImageUri] = useState(defaultImage);
	const [exercises, updateExercises] = useState(globalState.workout[0].exercises);
	const exerciseTypes = [
	{label: 'Cardio', value: "CARDIO"},
	{label: 'Sets and Reps', value: "SETSXREPS"},
	{label: 'As many reps as possible', value: "AMRAP"},
	];
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

		console.log(cameraStatus.status);

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
			
			let filename = imageUri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
			formData.append('image', { uri: imageUri, name: filename, type });

			formData.append('owner', globalState.user._id);
			formData.append('location', globalState.workout[0].location);
			formData.append('duration', globalState.workout[0].duration);

			exercisesArr = exercises.split(',').map(item => item.trim());
                for (let k = 0; k < exercisesArr.length; k++)
					formData.append('exerciseIds[]', exercisesArr[k]);
			
			for (let i = 0; i < exercises.length; i++){
				
			}
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.TitleText}>Upload an Image here if you wish to change the workout image.</Text>
			<Image source={{ uri: imageUri }} style={styles.ImageStyle} />
			{imageUri == defaultImage && <Button title = "Change Image"
                    onPress={async () => {
						setImageUri(await getPhotoForExercise());
						// setImageUri(await takePhotoForExercise());
						// picChooser();
				}} />}
			{imageUri != defaultImage &&<Button title = "Reset"
                    onPress={async () => {
                        setImageUri(defaultImage);
				}} />}
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
							<View>
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
								{(item.exerciseType === "SETSXREPS"  || item.exerciseType === "AMRAP")&& <TextInput onChangeText={(val) => { item.sets = val }} placeholder="sets" keyboardType="number-pad"/>}
								{item.exerciseType === "SETSXREPS" && <TextInput onChangeText={(val) => { item.reps = val }} placeholder="reps" keyboardType="number-pad"/>}
								{(item.exerciseType === "SETSXREPS" || item.exerciseType === "AMRAP") && <TextInput onChangeText={(val) => { item.weight = val }} placeholder="weight" keyboardType="number-pad"/>}
								{(item.exerciseType === "CARDIO"  || item.exerciseType === "AMRAP") && <TextInput onChangeText={(val) => { item.time = val }} placeholder="time" keyboardType="number-pad"/>}
							</View>
						</Text>
						
					</View>
				)}
			/>
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