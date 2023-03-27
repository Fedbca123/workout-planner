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
	Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import reactDom, { render } from "react-dom";
import Workouts from "./workout.js";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance.js"
import { Header, SearchBar } from "react-native-elements";
import Modal from "react-native-modal";
import AntDesign from "@expo/vector-icons/AntDesign";
import config from "../../backend/config.js"

export default function BeginFinalizeWorkout({workout, updateWorkout, setCurrState}) {
	const [imageUri, setImageUri] = useState(config.DEFAULTEXIMAGE);
	const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions(ImagePicker.PermissionStatus.UNDETERMINED);
	const [photoStatus, requestPhotoLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
	const [isVisible, setIsVisible] = useState(false);

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
				return result.assets[0].uri;
			}
			else{
				return config.DEFAULTEXIMAGE;
			}
		}
		
	}

	const takePhotoForExercise = async () => {

		await requestCameraPermission(ImagePicker.requestCameraPermissionsAsync);

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
				return result.assets[0].uri;
			}
			else{
				return config.DEFAULTEXIMAGE
			}
		}	
	}

    return (
		<View style={styles.container}>
			<Image source={{ uri: imageUri }} style={styles.imageStyle} />
			<Button title = "Choose image"
			onPress={async () => {
				setIsVisible(true);
			}}/> 

			<Modal
				isVisible={isVisible}
				swipeDirection='down'
				style={{ justifyContent: 'flex-end', margin: 0, borderRadius: 10}}
				animationIn={"slideInUp"}
				animationOut={"slideOutDown"}
				backdropOpacity={.6}
				onSwipeComplete={() => { setIsVisible(false) }}
				>
				<View style={{ backgroundColor: 'white', height: 300}}>
					<View style={{flex:.5, borderBottomWidth: .5}}>
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
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
	},
	modalButton: {
		display: "flex",
		flexDirection: "row",
		flex: 1,
		borderBottomWidth: 0.5,
		alignItems: "center",
		justifyContent: "center",
	},
	modalText: {
		fontSize: 20,
		textAlign: "center"
	},
	imageStyle: {
		width: 200, 
		height: 200,
		borderRadius: 20,
		borderWidth: 2,
		marginTop: 40
	}
});