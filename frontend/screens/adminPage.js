import { 
    StyleSheet, 
    Button, 
    Text, 
    Image, 
    View, 
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
  } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, {useState, useRef} from 'react';
import API_Instance from '../../backend/axios_instance';
import config from '../../config';
import Toggle from "react-native-toggle-element";
import * as ImagePicker from 'expo-image-picker';
import { useGlobalState } from '../GlobalState';

const baseUrl = config.API_URL + config.PORT + '/';

export default function AdminPage({navigation}) {
    const [toggleValue, setToggleValue] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [exercises, setExercises] = useState('');
    const [duration, setDuration] = useState('');
    const [location, setLocation] = useState('');
    const [exerciseType, setExerciseType] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [time, setTime] = useState('');
    const [weight, setWeight] = useState('');
    const [restTime, setRestTime] = useState('');
    const [tags, setTags] = useState('');
    const [muscleGroups, setMuscleGroups] = useState('');
    const [owner, setOwner] = useState('');
    const [globalState, updateGlobalState] = useGlobalState();

    const imageSelect = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          console.log(result)
        console.log(result.uri)
        return result["uri"];
    }

    const submit = () => {
        let tagsArr = [];
        let muscleGroupsArr = [];
        let exercisesArr = [];
        const formData = new FormData();

        if (title)
            formData.append('title', title);
        if (description)
            formData.append('description', description);
        if (imageUri)
        {
            let filename = imageUri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            formData.append('image', { uri: imageUri, name: filename, type })
        }
        if (tags)
        {
            tagsArr = tags.split(',').map(item =>item.trim());
            for (let i = 0; i < tagsArr.length; i++)
                formData.append('tags[]', tagsArr[i]);
        }
        if (muscleGroups)
        {
            muscleGroupsArr = muscleGroups.split(',').map(item => item.trim());
            for (let j = 0; j < muscleGroupsArr.length; j++)
                formData.append('muscleGroups[]', muscleGroupsArr[j]);
        }
        if (owner)
            formData.append('owner', owner);

        // Handle Exercise
        if (!toggleValue) 
        {
            if (exerciseType)
                formData.append('exerciseType', exerciseType);
            if (sets) 
                formData.append('sets', +sets)
            if (reps)
                formData.append('reps', +reps)
            if (time)
                formData.append('time', +time);
            if (weight)
                formData.append('weight', +weight)
            if (restTime)
                formData.append('restTime', restTime)
              
            API_Instance.post("exercises/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': `BEARER ${globalState.authToken}`
                  }
			})
			.then((response) => {
				if (response.status == 200) {
					console.log(response.data);
                    Alert.alert('Success!', 'Exercise created', [
                        {text: 'OK', onPress: () => {}},
                    ]);
				}
			})
			.catch((e) => {
                Alert.alert('Error!', 'Exercise not created', [
                    {text: 'OK', onPress: () => {}},
                ]);
				console.log(e);
			});
        }
        else // Handle Workout
        {
            if (exercises)
            {
                exercisesArr = exercises.split(',').map(item => item.trim());
                for (let k = 0; k < exercisesArr.length; k++)
                    formData.append('exerciseIds[]', exercisesArr[k]);
            }
            if (duration)
                formData.append('duration', duration);
            if (location)
                formData.append('location', location);

            API_Instance.post("workouts/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': `BEARER ${globalState.authToken}`
                  },
			})
			.then((response) => {
				if (response.status == 200) {
                    Alert.alert('Success!', 'Exercise created', [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ]);
					console.log(response.data)
				}
			})
			.catch((e) => {
                Alert.alert('Error!', 'Workout not created', [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ]);
				console.log(e.response);
			});
        }
    }

    return (
        <KeyboardAwareScrollView
			extraHeight={100}
			keyboardShouldPersistTaps="handled"
			bounces={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                <Toggle 
                    value = {toggleValue}
                    onPress = {(newState) => setToggleValue(newState)}
                    disabledStyle = {{backgroundColor: "darkgray", opacity: 1}}
                    leftComponent = {< Text>Exercise</Text>}
                    rightComponent = {<Text>Workout</Text>}
                    trackBar={{
                        width: 170,
                        height: 50,
                        //radius: 40,
                        //borderWidth: -1,
                    }}
                    thumbButton={{
                        width: 80,
                        height: 50,
                        //radius: 30,
                        borderWidth: 1,
                    }}
                />
                </View>

                <View style={styles.inputContainer}>

                    <TextInput style={styles.inputfield}
                    placeholder="title"
                    placeholderTextColor={"#808080"}
                    onChangeText={(text) => setTitle(text)}/>

                    <TextInput style={styles.inputfield}
                    placeholder="description"
                    placeholderTextColor={"#808080"}
                    onChangeText={(text) => setDescription(text)}/>

                    { imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
                    { !imageUri && <Button title = "Choose File"
                    onPress={async () => {
                        setImageUri(await imageSelect());
                    }}/> }
                    { imageUri && <Button title = "Clear"
                    onPress={async () => {
                        setImageUri(null);
                    }}/>}

                    { !toggleValue && <TextInput style={styles.inputfield}
                    placeholder="AMRAP, SETSXREPS, or CARDIO"
                    placeholderTextColor={"#808080"}
                    onChangeText={(text) => setExerciseType(text)}/> }

                    {!toggleValue && <TextInput style={styles.inputfield}
                    placeholder="sets"
                    placeholderTextColor={"#808080"}
                    onChangeText={(text) => setSets(text)}/>}

                    {!toggleValue && <TextInput style={styles.inputfield}
                    placeholder="reps"
                    placeholderTextColor={"#808080"}
                    onChangeText={(text) => setReps(text)}/>}

                    {!toggleValue && <TextInput style={styles.inputfield}
                    placeholder="time"
                    placeholderTextColor={"#808080"}
                    onChangeText={(text) => setTime(text)}/>}

                    {!toggleValue && <TextInput style={styles.inputfield}
                    placeholder="weight"
                    placeholderTextColor={"#808080"}
                    onChangeText={(text) => setWeight(text)}/>}

                    {!toggleValue && <TextInput style={styles.inputfield}
                    placeholder="restTime"
                    placeholderTextColor={"#808080"}
                    onChangeText={(text) => setRestTime(text)}/>}

                    {toggleValue && <TextInput style={styles.inputfield}
                    placeholder={"exercises - List of ObjecId's \nseperate by comma"}
                    placeholderTextColor={"#808080"}
                    multiline = {true}
                    numberOfLines = {4}
                    minHeight = {80}
                    maxHeight = {80}
                    onChangeText={(text) => setExercises(text)}/>}

                    {toggleValue && <TextInput style={styles.inputfield}
                    placeholder="duration"
                    placeholderTextColor={"#808080"}
                    onChangeText={(text) => setDuration(text)}/>}

                    {toggleValue && <TextInput style={styles.inputfield}
                    placeholder="location"
                    placeholderTextColor={"#808080"}
                    onChangeText={(text) => setLocation(text)}/>}
                    
                    <TextInput style={styles.inputfield}
                    multiline = {true}
                    numberOfLines = {4}
                    minHeight = {80}
                    maxHeight = {80}
                    placeholder = {"Tags - Seperate By Comma"}
                    placeholderTextColor={"#808080"}
                    onChangeText = {(text) => setTags(text)} />

                    <TextInput style={styles.inputfield}
                    multiline = {true}
                    numberOfLines = {4}
                    minHeight = {80}
                    maxHeight = {80}
                    placeholder= {"Muscle Groups - Seperate By Comma"}
                    placeholderTextColor={"#808080"}
                    onChangeText = {(text) => setMuscleGroups(text)}/>

                    <TextInput style={styles.inputfield}
                    placeholder= {"Owner (Public if empty)"}
                    placeholderTextColor={"#808080"}
                    
                    onChangeText = {(text) => setOwner(text)}/>

                    <View style={styles.submitButtonContainerStyle}>
                        <Button 
                        color = "black"
                        title = "Submit"
                        onPress={() => submit()}/>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 70
    },
    header: {
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10
    },
    inputfield: {
		borderWidth: 1,
		borderColor: "#C4C4C4",
		width: "70%",
		padding: 8,
		marginVertical: 2,
    },
    submitButtonContainerStyle: {
        marginTop: 20,
        marginBottom: 70,
        backgroundColor: 'lightgray',
        borderWidth: 1,
        width: '30%'
    }
});