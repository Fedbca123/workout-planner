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
import API_Instance from "../../../backend/axios_instance.js";
import { AntDesign } from "@expo/vector-icons";
import { useGlobalState } from "../../GlobalState.js";
import { useIsFocused } from '@react-navigation/native';
// import { Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import ExerciseInfo from "../exerciseInfo.js";
import { Header, SearchBar } from "react-native-elements";

export default function ExerciseSearch({ workout, updateWorkout, setCurrState }) {

    const [exercises, updateExercises] = useState([]);
    const [modalVisible, setModalVisibility] = useState(false);
    const [exercise, setExercise] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchResults, updateSearchResults] = useState([]);
    const [globalState, updateGlobalState] = useGlobalState();
    const isFocused = useIsFocused();
    

	function loadExercises(){

		API_Instance.post("exercises/search", {
			ownerId: globalState.user._id
		}, {
			headers: {
				'authorization': `BEARER ${globalState.authToken}`
			}
		}).then((response) => {
            if (response.status == 200) {
                updateExercises(response.data);
                updateSearchResults(response.data);
			} else {
				console.log(response.status);
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	useEffect(() => {
		loadExercises();
    }, [isFocused]);

    function TryFilterExercise(ex, searchVals){
    	let success = true;
    
		// search
		if(success && searchVals.length > 0){
		//console.log("st",searchTags)
		let matches = false;
		for(const tag of ex.tags){
			if(exerciseTagFound(tag, searchVals)){
			matches = true;
			break;
			}
		}
		success = success && matches;
		}

		return success;
    }

    function exerciseTagFound(exTag, searchTags){
        for (const term of searchTags) {
			if(exTag && exTag.toLowerCase().includes(term.toLowerCase())){
				//console.log(term, 'found in', exTag)
				return true;
			}
		}
		return false;
	}
    
    function handleSearch(str)
    {
        let retList = [];
		let searchVals = str ? str.split(' ') : [];
		
		if(searchVals.length == 0 ){
      		//console.log('no filter but still ate');
      		return exercises;
    	}

        for (const ex of exercises){
			if (TryFilterExercise(ex, searchVals)){
				retList.push(ex);
			}
		}

		return retList;
    }

    return (
    <View style={styles.Background}>
        <TouchableOpacity 
				style={styles.createButton}
				onPress={() => {
					setCurrState("CustomExercise");
				}}
			>
			<Text style={{fontSize: 18, padding: 5, textAlign: 'center', fontWeight: 'bold'}}>Create a custom exercise</Text>
		</TouchableOpacity>
			

		<Text style={{fontSize:20, textAlign:"center", fontWeight: 'bold'}}>-OR-</Text>

		<Text style={styles.HeaderText}>Select an Exercise:</Text>
        <SearchBar
				platform="default"
				lightTheme={true}
				containerStyle={{ backgroundColor: "white" }}
                inputStyle={{ color: "black" }}
                autoComplete='off'
                autoCapitalize='none'
				onChangeText={(val) => {
					setSearchText(val);
					updateSearchResults(handleSearch(val));
				}}
				round={true}
				value={searchText}
				cancelButtonTitle=""
                autoCorrect={false}
				onClear={() => {
					setSearchText("");
				}}
				onCancel={() => {
					setSearchText("");
				}}
				placeholder="Search exercises by name"
	    />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item._id}
        style={{ flex: 1 }}
        ListEmptyComponent={
        <View style={{alignItems: 'center'}}>
            <Text style={{fontSize:20, alignItems: 'center', paddingTop:"15%"}}>
                No Exercises Found
            </Text>
        </View>
        }
        renderItem={({ item }) => (
            <View>
                <TouchableOpacity style={styles.ExerciseCard}
                    onPress={() => {
                        if (workout[0].exercises.filter(a => (
                            a._id == item._id
                        )).length > 0) {
                            Alert.alert(`${item.title} is already in your workout`);
                        } else {
                            workout[0].exercises.push(item)
                            updateWorkout(workout);
                            setCurrState('ExerciseReview'); 
                        }
                    }}
                >
                    <Image source={{ uri: item.image }} style={styles.ExerciseImage} />
                    <Text style={styles.ExerciseText}>{item.title}</Text>
                    {/* Button to take user to page about info for the workout */}
                    <TouchableOpacity onPress={() => {
                        setExercise(item); 
                        setModalVisibility(true);
                    }}>
                    <AntDesign name="infocirlceo" style={{alignSelf: 'center'}} size={24} color="black" />
                </TouchableOpacity>
                </TouchableOpacity>
                
            </View>
        )}
        />
        <Modal
			isVisible={modalVisible}
			coverScreen={true}
			backdropColor="white"
			backdropOpacity={1}
		>
		    <ExerciseInfo exercise={exercise} setModalVisbility={setModalVisibility}/>
		</Modal>
            <View style={{ height: '15%', backgroundColor: "#FF8C4B"}}>
                    <TouchableOpacity style={{ flex:1, alignItems:"center", justifyContent: "center"}} onPress={() => {setCurrState("ExerciseReview")}}>
                    {/* <AntDesign size={useWindowDimensions().height * 0.08} name="leftcircle" color={"white"}/> */}
                    <Text style={styles.BttnText}>Return to Review</Text>
                </TouchableOpacity>
            </View>
    </View>
  )
}

const styles = StyleSheet.create({
    Background: {
		backgroundColor: "white",
        flex: 1,
        borderWidth:.5,
        display: "flex",
        justifyContent: 'space-between',
        // alignContent: "space-between",
        // alignItems: "flex-end",
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
        alignItems: "center",
        justifyContent: "space-between",
    },
    ExerciseImage: {
		height: 50,
		width: 50,
		borderWidth: 1,
		borderRadius: 20,
		// marginTop: 10
    },
    ExerciseText: {
		fontSize: 14,
		fontWeight: 'bold',
		left: 5,
		// top: 30,
		// marginVertical: "auto"
		textAlignVertical: "bottom",
        flex: 1,
        textAlign: 'center',
		// flex:0.5
    },
    DeleteExerciseBttn: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 100,
    },
    BttnText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    HeaderText: {
		fontSize: 20,
    	fontWeight: 'bold',
		marginLeft: 10
	},
	createButton: {
		borderWidth: .5, 
		width: '60%', 
		alignSelf: 'center',
		marginVertical: 15, 
		backgroundColor: '#DDF2FF',
		borderRadius: 8,
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		elevation: 2,
	},

})