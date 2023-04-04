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
	KeyboardAvoidingView
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import reactDom, { render } from "react-dom";
import Workouts from "../workout.js";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalState } from "../../GlobalState.js";
import API_Instance from "../../../backend/axios_instance.js"
import { Header, SearchBar } from "react-native-elements";
import Modal from "react-native-modal";
import AntDesign from "@expo/vector-icons/AntDesign";
import config from "../../../backend/config.js"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function BeginFinalizeWorkout({workout, updateWorkout, setCurrState}) {
	const [imageUri, setImageUri] = useState(workout[0].image || config.DEFAULTWORKIMAGE);
	const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions(ImagePicker.PermissionStatus.UNDETERMINED);
	const [photoStatus, requestPhotoLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		let temp = {...workout[0]};
		if (imageUri !== config.DEFAULTWORKIMAGE)
		{
			// let filename = imageUri.split('/').pop();
			// let match = /\.(\w+)$/.exec(filename);
			// let type = match ? `image/${match[1]}` : `image`;
			temp.image = imageUri;	
		}
		else{
			temp.image = null;
		}
		updateWorkout([temp]);
	}, [imageUri])

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
				return config.DEFAULTWORKIMAGE;
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
				return config.DEFAULTWORKIMAGE;
			}
		}	
	}

    return (
		<KeyboardAwareScrollView contentContainerStyle={styles.container}>
			<View style={styles.imageContainer}>
				<Image source={{ uri: imageUri }} style={styles.imageStyle} />
				<Button title = "Choose image"
				onPress={async () => {
					setIsVisible(true);
				}}/> 
			</View>
			
			<View style={styles.inputContainer}>
				<View style={{width: '70%'}}>
					<Text style={styles.text}>Title</Text>
					<TextInput style={styles.inputfield}
						maxLength= {40}
						multiline = {false}
						minHeight = {40}
						maxHeight = {40}
						placeholder="Title"
						placeholderTextColor='#636362'
						autoComplete="off"
						defaultValue={workout[0].title}
						autoCorrect={false}
						onChangeText={(text) => {
							let temp = {...workout[0]}
							temp.title = text;
							updateWorkout([temp]);
					}}/>
				</View>
				
				<View style={{width: '70%'}}>
					<Text style={styles.text}>Description {"(optional)"}</Text>
					<TextInput style={styles.inputfield}
						maxLength= {200}
						multiline = {true}
						numberOfLines = {4}
						minHeight = {80}
						maxHeight = {80}
						placeholder="Description"
						placeholderTextColor='#636362'
						autoComplete="off"
						defaultValue={workout[0].description}
						autoCorrect={false}
						onChangeText={(text) => {
							let temp = {...workout[0]}
							temp.description = text;
							updateWorkout([temp]);
					}}/>
				</View>
			</View>

			<View style={styles.navButtonContainer}>
                <View style={{ backgroundColor: "#FF8C4B", flex: 1}}>
                     <TouchableOpacity 
					 	style={{ flex:1, alignItems:"center", justifyContent: "center"}}
						onPress={() => {
							setCurrState("ExerciseReview")
						}}>
                        <AntDesign size={useWindowDimensions().height * 0.08} name="leftcircle" color={"white"}/>
                    </TouchableOpacity>
                </View>

                <View style={{ alignSelf: "center", flex:1}}>
                    <TouchableOpacity 
						style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#10B9F1" }} 
						onPress={() => {
							if (workout[0].title === "") {
								Alert.alert("Please name your workout");
							} else {
								let temp = {...workout[0]};
								temp.recurrence = temp.recurrence ? temp.recurrence : false;
								temp.save = temp.save ? temp.save : false;
								updateWorkout([temp]);
								setCurrState("Schedule");  
							}	      
                    }}>
                        <AntDesign size={useWindowDimensions().height * 0.08} name="rightcircle" color={"white"}/>
                    </TouchableOpacity>  
                </View>
            </View>

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
		</KeyboardAwareScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		borderWidth:.5,
		// alignContent:"space-between",
		backgroundColor: 'white',
		justifyContent: "space-between",
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
	imageContainer: {
		alignItems: 'center',
		marginTop: '10%',
	},
	imageStyle: {
		width: '40%', 
		aspectRatio: 1,
		borderRadius: 20,
		borderWidth: 2,
	},
	inputContainer: {
		alignItems: 'center',
		// borderWidth: 2,
	},
	inputfield: {
        textAlign: 'center',
        borderWidth: .5,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
		shadowOffset: { height: 1, width: 1 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
        padding: 2,
        backgroundColor: 'white',
		marginVertical: 10,
		borderRadius: 15,
    },
	navButtonContainer: {
		height: '15%',
		display: "flex", 
		flexDirection: "row",
		borderWidth: 1, 
		justifyContent: "space-evenly",
		// alignSelf:"flex-end",
	},
	text: {
		fontSize: 16,
		fontWeight: 'bold'
	}
});