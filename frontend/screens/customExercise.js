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
	Pressable,
} from "react-native";
import React, {useState, useRef} from "react";
import reactDom from "react-dom";
import API_Instance from "../../backend/axios_instance";
import config from "../../config";
import { useGlobalState } from "../GlobalState.js";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-screens";
import WorkOuts from "../component/workout";
import HomeNav from "../navigation/homeNav";
import * as ImagePicker from "expo-image-picker";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Dropdown } from "react-native-element-dropdown";
import Modal from "react-native-modal";

export default function CustomExercise(props) {

	const navigation = useNavigation();
	const [globalState, updateGlobalState] = useGlobalState();
	// const [modalVisible, setModalVisible] = useState(false);
	const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions(ImagePicker.PermissionStatus.UNDETERMINED);
	const [photoStatus, requestPhotoLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
	const exercise = {
		title:"",
		description:"",
		muscleGroups: [],
		exerciseType: [],
		image: null,
		imageId: "",
	};
	const [currType, setCurrType] = useState('SETSXREPS');
	const [imageUri, setImageUri] = useState(null);
	const muscleGroups = [
		{ label: 'Chest', value: 'Chest' },
		{ label: 'Biceps', value: 'Biceps' },
		{ label: 'Lats', value: 'Lats' },
		{ label: 'Traps', value: 'Traps' },
		{ label: 'Triceps', value: 'Triceps' },
		{ label: 'Quads', value: 'Quads' },
		{ label: 'Hamstrings', value: 'Hamstrings' },
		{ label: 'Calves', value: 'Calves' },
		{ label: 'Forearms', value: 'Forearms' },
		{ label: 'Glutes', value: 'Glutes' },
		{ label: 'Shoulders', value: 'Shoulders' },
		{ label: 'Abs', value: 'Abs' },
		{ label: 'Legs', value: 'Legs' },
		{ label: 'Upper Body', value: 'Upper Body' },
		// { label: 'Lower Body', value: 'Lower Body' },
	];
	const equipment = [
		{ label: 'BodyWeight/None', value: 'BodyWeight/None' },
		{ label: 'Dumbbells', value: 'Dumbbells' },
		{ label: 'Barbell', value: 'Barbell' },
		{ label: 'Kettlebell', value: 'Kettlebell' },
		{ label: 'Bench', value: 'Bench' },
		{ label: 'Machines', value: 'Machines' },
		{ label: 'Cables', value: 'Cables' },
		{ label: 'Pull-Up Bar', value: 'Pull-Up Bar' },
		{ label: 'Resistance Bands', value: 'Resistance Bands' },
	];
	const exerciseType = [
		{ label: 'Cardio', value: 'CARDIO' },
		{ label: 'As many reps as possible', value: 'AMRAP' },
		{label: 'Sets and Reps', value: 'SETSXREPS'},
	]
	const [equipmentSelected, setEquipment] = useState([]);
	const [selected, setSelected] = useState([]);
	const formData = new FormData();
	const [isVisible, setIsVisible] = useState(false);

	function createExercise() {

		if(exercise.title == ""){
			Alert.alert("Please Name the Exercise");
		} else if(exercise.description == ""){
			Alert.alert("Please Give Your Exercise a Description");
		} else if(selected.length === 0){
			Alert.alert("Make sure to list what muscles this exercise targets");
		} else {
			formData.append('title', exercise.title);
			formData.append('description', exercise.description);
			
			if (imageUri !== null) {
				let filename = imageUri.split('/').pop();
				let match = /\.(\w+)$/.exec(filename);
				let type = match ? `image/${match[1]}` : `image`;
				formData.append('image', { uri: imageUri, name: filename, type });
			}

			formData.append('muscleGroups', selected);

			formData.append('tags', equipmentSelected);
                
			formData.append('owner', globalState.user._id);

			formData.append('exerciseType', currType);

			API_Instance.post("exercises/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': `BEARER ${globalState.authToken}`
                  }
			})
			.then((response) => {
				if (response.status == 200) {
                    Alert.alert('Success!', 'Exercise created', [
                        {text: 'OK', onPress: () => {}},
					]);
					globalState.workout[0].exercises.push(response.data);
					navigation.navigate("exerciseSearch");
				}
			}).catch((e) => {
                Alert.alert('Error!', 'Exercise not created', [
                    {text: 'OK', onPress: () => {}},
                ]);
				console.log(e);
			});
		}
	}

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

	const renderItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.selectedTextStyle}>{item.label}</Text>
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        </View>
      );
    };

    return(
		<SafeAreaView style={styles.container}>
			
			<Text style={styles.TitleText}>What is the name of the exercise?</Text>
			
			<TextInput style={styles.TextInputBox} onChangeText={(text) => { exercise.title = text }} />
			
			<Text style={styles.TitleText}>Can you give a description of the exercise?</Text>
			
			<TextInput style={styles.TextInputBox} onChangeText={(text) => { exercise.description = text }} multiline />

			<Text style={styles.TitleText}>Upload an image demonstrating the exercise if possible.</Text>
			{ imageUri && <Image source={{ uri: imageUri }} style={styles.ImageStyle} />}
                    { !imageUri && <Button title = "Choose File"
                    onPress={async () => {
						// setImageUri(await getPhotoForExercise());
						// setImageUri(await takePhotoForExercise());

						setIsVisible(true);
					}} />}
                    { imageUri && <Button title = "Clear"
                    onPress={async () => {
                        setImageUri(null);
				}} />}
			
			{/* <Modal
			isVisible={isVisible}
			swipeDirection="down"
			style={{ justifyContent: 'flex-end', margin: 0 }}>
				<View style={{ backgroundColor: '#fff', height: Dimensions.get('screen').height / 1.5 }}>
					<Text>bottom half</Text>
					<Button title="Hide modal" onPress={setIsVisible(false)} />
				</View>
      		</Modal> */}

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
			
			<Text style={styles.TitleText}>What muscles does this exercise workout?</Text>

			<MultiSelect
				style={styles.dropdown}
				placeholderStyle={styles.placeholderStyle}
				selectedTextStyle={styles.selectedTextStyle}
				inputSearchStyle={styles.inputSearchStyle}
				iconStyle={styles.iconStyle}
				search
				data={muscleGroups}
				searchPlaceholder="Search..."
				placeholder="Select Muscle Groups"
				labelField="label"
				valueField="value"
				value={selected}
				onChange={val => {
					setSelected(val);
				}}
				renderLeftIcon={() => (
					<AntDesign
					style={styles.icon}
					color="black"
					name="search1"
					size={20}
					/>
				)}
				renderItem={renderItem}
				renderSelectedItem={(item, unSelect) => (
					<TouchableOpacity onPress={() => unSelect && unSelect(item)}>
					<View style={styles.selectedStyle}>
						<Text style={styles.textSelectedStyle}>{item.label}</Text>
						<AntDesign color="black" name="delete" size={17} />
					</View>
					</TouchableOpacity>
          		)}
			/>
			
			<Text style={styles.TitleText}>What equipment does this exercise possibly use?</Text>

			<MultiSelect
				style={styles.dropdown}
				placeholderStyle={styles.placeholderStyle}
				selectedTextStyle={styles.selectedTextStyle}
				inputSearchStyle={styles.inputSearchStyle}
				iconStyle={styles.iconStyle}
				search
				data={equipment}
				searchPlaceholder="Search..."
				placeholder="Select Equipment"
				labelField="label"
				valueField="value"
				value={equipmentSelected}
				onChange={val => {
					setEquipment(val);
				}}
				renderLeftIcon={() => (
					<AntDesign
					style={styles.icon}
					color="black"
					name="search1"
					size={20}
					/>
				)}
				renderItem={renderItem}
				renderSelectedItem={(item, unSelect) => (
					<TouchableOpacity onPress={() => unSelect && unSelect(item)}>
					<View style={styles.selectedStyle}>
						<Text style={styles.textSelectedStyle}>{item.label}</Text>
						<AntDesign color="black" name="delete" size={17} />
					</View>
					</TouchableOpacity>
          		)}
			/>
			<Text style={styles.TitleText}>What type of exercise is this?</Text>
			<Dropdown
				style={styles.dropdown}
				data={exerciseType}
				labelField="label"
				valueField="value"
				value={currType}
				onChange={(val) => {
					// console.log(val.value);
					setCurrType(val.value);
				}}
			/>

			<Button title="Create Exercise" onPress={() => {
				createExercise();
			}} />
			
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
		borderRadius: 20,
		// flex: 0.5,
		// shadowOpacity: 2
	},
	DescriptionBox: {
		backgroundColor: "#F1F3FA",
		margin: 10,
		padding: 15,
		borderRadius: 20,
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
	ImageStyle: {
		width: 200,
		height: 150,
		borderRadius: 10,
		position: "relative",
		justifyContent: "center",
		right:-100,
		// flex: .30,
	},
	dropdown: {
      height: 50,
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 14,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    icon: {
      marginRight: 5,
    },
    item: {
      padding: 17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectedStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 14,
      backgroundColor: 'white',
      shadowColor: '#000',
      marginTop: 8,
      marginRight: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
    },
    textSelectedStyle: {
      marginRight: 5,
      fontSize: 16,
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