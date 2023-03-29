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
} from 'react-native';
import React, { useEffect, useState } from "react";
import reactDom, { render } from "react-dom";
import API_Instance from "../../backend/axios_instance.js";
import { AntDesign } from "@expo/vector-icons";
import { useGlobalState } from "../GlobalState.js";
import { useIsFocused } from '@react-navigation/native';
import Modal from "react-native-modal";
import ExerciseInfo from "./exerciseInfo.js";
import { Header, SearchBar } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MultiSelect } from "react-native-element-dropdown";
import { Dropdown } from "react-native-element-dropdown";

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

export default function createExercise({workout, updateWorkout, setCurrState}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [selectedMuscleGroups, setMuscleGroups] = useState([]);
    const [selectedEquipment, setEquipment] = useState([]);
	const [imageUri, setImageUri] = useState(config.DEFAULTEXIMAGE);
	const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions(ImagePicker.PermissionStatus.UNDETERMINED);
	const [photoStatus, requestPhotoLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
	const [isVisible, setIsVisible] = useState(false);
    const [pageTwo, setPageTwo] = useState(false);
    const [globalState, updateGlobalState] = useGlobalState();

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
				return config.DEFAULTEXIMAGE;
			}
		}	
	}

    const renderItem = (item)=> {

        return (
          <View style={styles.item}>
            <Text style={styles.selectedTextStyle}>{item.label}</Text>
            {(selectedMuscleGroups.includes(item.value) || selectedEquipment.includes(item.value)) && (
            <AntDesign
              style={styles.icon}
              color="black"
              name="check"
              size={20}
            />
          )}
          </View>
        );
      };

    function createExercise() {
        let formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('exerciseType', type);
        formData.append('owner', globalState.user._id);
        // formData.append('muscleGroups', selectedMuscleGroups);

        for (let mg of selectedMuscleGroups) {
            formData.append("muscleGroups[]", mg);
        }

        // formData.append('tags', selectedEquipment);

        for (let eq of selectedEquipment) {
            formData.append("tags[]", eq);
        }

        if (imageUri !== config.DEFAULTEXIMAGE)
		{
            let filename = imageUri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            formData.append('image', { uri: imageUri, name: filename, type });
		}

        API_Instance
			.post("exercises/add", formData, {
				headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': `BEARER ${globalState.authToken}`
                }
            })
			.then((response) => {
				if (response.status == 200) {
                    Alert.alert("Exercise created succesfully!");
                    let temp = {...workout[0]};
                    temp.exercises.push(response.data);
                    updateWorkout([temp]);
                    setCurrState('ExerciseReview');
                }
			})
			.catch((e) => {
				if (e.response)
                {
                    Alert.alert("There was an error creating the exercise")
                };
			});
    }

    return (
		<KeyboardAwareScrollView contentContainerStyle={styles.container}>
            {!pageTwo &&
            <>
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
                            maxLength = {40}
                            multiline = {false}
                            minHeight = {40}
                            maxHeight = {40}
                            placeholder="Title"
                            placeholderTextColor='#636362'
                            autoComplete="off"
                            autoCorrect={false}
                            onChangeText={(text) => {
                                setTitle(text);
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
                            autoCorrect={false}
                            onChangeText={(text) => {
                                setDescription(text);
                        }}/>
                    </View>
                </View>
            </>}
                        
            {pageTwo &&
            <View style={{marginHorizontal: 10, marginTop: 40}}>
                <Text style={[styles.TitleText,{marginTop: 0}]}>Muscle Groups</Text>

                <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}     
                    inputSearchStyle={styles.inputSearchStyle}
                    // iconStyle={styles.iconStyle}
                    search
                    data={muscleGroups}
                    searchPlaceholder="Search..."
                    placeholder="Select Muscle Groups"
                    labelField="label"
                    valueField="value"
                    value={selectedMuscleGroups}
                    onChange={val => {
                        setMuscleGroups(val);
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

                <Text style={styles.TitleText}>Equipment</Text>

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
                    value={selectedEquipment}
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
                    value={type}
                    onChange={(val) => {
                        // console.log(val.value);
                        setType(val.value);
                    }}
                />
            </View>}

            <View style={{ height: '15%', flexDirection: 'row'}}>
                {pageTwo &&< TouchableOpacity 
                    style={{ flex:1, alignItems:"center", justifyContent: "center", backgroundColor: "#FF8C4B"}} 
                    onPress={() => {
                        setPageTwo(false);
                        }}>
                    {/* <AntDesign size={useWindowDimensions().height * 0.08} name="leftcircle" color={"white"}/> */}
                    <Text style={styles.BttnText}>Back</Text>
                </TouchableOpacity>}
                {!pageTwo && <TouchableOpacity 
                    style={{ flex:1, alignItems:"center", justifyContent: "center", backgroundColor: "#FF8C4B"}} 
                    onPress={() => {
                        setCurrState("ExerciseReview")
                        }}>
                    {/* <AntDesign size={useWindowDimensions().height * 0.08} name="leftcircle" color={"white"}/> */}
                    <Text style={styles.BttnText}>Cancel</Text>
                </TouchableOpacity>}
                {pageTwo && <TouchableOpacity 
                    style={{ flex:1, alignItems:"center", justifyContent: "center", backgroundColor: "#10B9F1"}} 
                    onPress={() => {
                        // console.log(selectedMuscleGroups);
                        if (selectedMuscleGroups.length === 0) {
                            Alert.alert("Even if it's cardio, it has to workout at least one muscle");
                        } else if (selectedEquipment.length === 0) { 
                            Alert.alert("Even if you're using no equipment, you're body counts as one");
                        } else if (type === '') { 
                            Alert.alert("Please pick an exercise type");
                        } else {
                            createExercise();
                        }       
                    }}>
                    {/* <AntDesign size={useWindowDimensions().height * 0.08} name="leftcircle" color={"white"}/> */}
                    <Text style={styles.BttnText}>Complete</Text>
                </TouchableOpacity>}
                {!pageTwo && <TouchableOpacity style={{ flex:1, alignItems:"center", justifyContent: "center", backgroundColor: "#10B9F1"}} onPress={() => {
                            if (title !== "") {
                                setPageTwo(true);  
                            } else {
                                Alert.alert("Please name the exercise");
                            }
                    }}>
                    {/* <AntDesign size={useWindowDimensions().height * 0.08} name="leftcircle" color={"white"}/> */}
                    <Text style={styles.BttnText}>Next</Text>
                </TouchableOpacity>}
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
        borderWidth:.5,
		flexDirection: "column",
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
	},
    BttnText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    TitleText:{
		fontSize: 20,
    	fontWeight: 'bold',
        marginTop: 50,
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
      marginVertical: 10,
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
		borderWidth: .5,
		alignItems: "center",
		justifyContent: "center",
	},
	modalText: {
		fontSize: 20,
		textAlign: "center"
	},
});