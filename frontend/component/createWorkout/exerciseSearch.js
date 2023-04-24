import {
    StyleSheet,
    Button,
    TouchableOpacity,
    Text,
    Image,
    View,
    TextInput,
    FlatList,
    ScrollView,
    VirtualizedList,
    useWindowDimensions,
    Alert,
    ActivityIndicator
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
import SelectBox from 'react-native-multi-selectbox';
import {xorBy} from 'lodash';

export default function ExerciseSearch({ workout, updateWorkout, setCurrState }) {

    const [exercises, updateExercises] = useState([]);
    const [modalVisible, setModalVisibility] = useState(false);
    const [exercise, setExercise] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchResults, updateSearchResults] = useState([]);
    const [globalState, updateGlobalState] = useGlobalState();
    const isFocused = useIsFocused();
    const [areFiltersVisible, setFiltersVisible] = useState(false);
    const [isExercisesLoading, setIsExercisesLoading] = useState(true);
    const windowHeight = useWindowDimensions().height;
	  // Chosen Equipment Filters
	const [selectedEquipmentFilter, setEquipmentFilter] = useState([]);
	
	// Chosen Muscle Group Filters
	const [selectedMuscleGroupsFilter, setMuscleGroupsFilter] = useState([]);
	
	// Chosen Exercise Type Filters
	const [selectedTypeFilter, setTypeFilter] = useState([]);

	// Chosen Owner Type Filters
	const [selectedOwnerFilter, setOwnerFilter] = useState([]);

	const equipmentFilters = [
		{item: 'None', id: '1'},
		{item: 'Dumbbells', id: '2'},
		{item: 'Barbell', id: '3'},
		{item: 'Kettle Bell', id: '4'},
		{item: 'Bench', id: '5'},
		{item: 'Machine', id: '6'},
		{item: 'Resistance Bands', id: '7'},
		{item: 'Cables', id: '8'},
		{item: 'Pull-Up Bar', id: '9'},
	];

	const muscleGroupsFilters = [
		{item: 'Upper Body', id: '1'},
		{item: 'Lower Body', id: '2'},
		{item: 'Full Body', id: '3'},
		{item: 'Abs', id: '4'},
		{item: 'Shoulders', id: '5'},
		{item: 'Triceps', id: '6'},
		{item: 'Biceps', id: '7'},
		{item: 'Chest', id: '8'},
		{item: 'Back', id: '9'},
		{item: 'Hamstring', id: '10'},
		{item: 'Quads', id: '11'},
		{item: 'Calves', id: '12'},
		{item: 'Glutes', id: '13'},
		{item: 'Forearms', id: '14'},
		{item: 'Arms', id: '15'},
		{item: 'Legs', id: '16'},
	];

	const typeFilters = [
		{id: 0,item:'Cardio'},
		{id: 1,item: 'SETSXREPS'},
		{id: 2,item:'AMRAP'}
	];

	const ownerFilters = [
		{ id: 0, item: 'Public' },
		{ id: 1, item: 'Personal' },
		{ id: 2, item: 'Friends' }
	];

	function onMultiChangeEquipment() {
		return (item) => setEquipmentFilter(xorBy(selectedEquipmentFilter, [item], 'id'))
	}

  function onMultiChangeMuscleGroups() {
    return (item) => setMuscleGroupsFilter(xorBy(selectedMuscleGroupsFilter, [item], 'id'))
  }

  function onMultiChangeType() {
    return (item) => {setTypeFilter(xorBy(selectedTypeFilter, [item], 'id'));}
  }

  function onMultiChangeOwner(){
    return (item) => {setOwnerFilter(xorBy(selectedOwnerFilter, [item], 'id'));}
  }
    

	function loadExercises(){

		API_Instance.post("exercises/search", {
			ownerId: globalState.user._id,
      // if don't want friend exercises here, comment next line
      friendIDs : globalState.user.friends
		}, {
			headers: {
				'authorization': `BEARER ${globalState.authToken}`
			}
		}).then((response) => {
            if (response.status == 200) {
                updateExercises(response.data);
                updateSearchResults(response.data);
                setIsExercisesLoading(false);
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

    function tryFilterExercise(exercise, searchTags, equipmentTags, muscleGroupVals, selectedType, selectedOwner){
    let success = true;

    // type
    if(selectedType.length > 0){
      //console.log(selectedType)
      let matches = false;

      for(const type of selectedType){
        if(type && exercise && exercise.exerciseType && type.toLowerCase() == exercise.exerciseType.toLowerCase()){
          matches = true;
          break;
        }
      }

      success = success && matches;
    }

    // for owner types
    if(success && selectedOwner.length > 0){
      let matches = false;

      if(selectedOwner.includes('Public') && !exercise.owner){
        matches = true;
      }
      if(!matches && selectedOwner.includes('Personal') && exercise.owner == globalState.user?._id){
        matches = true;
      }
      if(!matches && selectedOwner.includes('Friends') && globalState.user.friends.includes(exercise.owner)){
        matches = true;
      }

      success = success && matches;
    }

    // for all muscle groups if they exist or are included
    if(success && muscleGroupVals.length > 0){
      let matches = false;
      for(const mg of exercise.muscleGroups){
        for(const tag of muscleGroupVals){
          if(mg && tag && mg.toLowerCase() == tag.toLowerCase()){
            matches = true;
            break;
          }
        }
        if(matches){
          break;
        }
      }
      success = success && matches;
    }

    // equipment
    if(success && equipmentTags.length > 0){
      //console.log("et",equipmentTags)
      let matches = false;
      for(const tag of exercise.tags){
        for(const eq of equipmentTags){
          if(tag && eq && tag.toLowerCase() == eq.toLowerCase()){
            matches = true;
            break;
          }
        }
        if(matches){
          break;
        }
      }
      success = success && matches;
    }

    // search
    if(success && searchTags.length > 0){
      //console.log("st",searchTags)
      let matches = false;
      for(const tag of exercise.tags){
        if(exerciseTagFound(tag, searchTags)){
          matches = true;
          break;
        }
      }
      success = success && matches;
    }

    return success;
  }

  const filterExercises = (term) => {
    let retList = [];
    let searchVals =  term ? term.split(' ') : [];
    let equipmentTags = [...selectedEquipmentFilter.map(a=>a.item)];
    let muscleGroupVals = [...selectedMuscleGroupsFilter.map(a=>a.item)];
    let selectedType = [...selectedTypeFilter.map(a=>a.item)];
    let selectedOwner = [...selectedOwnerFilter.map(a=>a.item)];

    // if no tags or search terms then return masterlist
    if(searchVals.length == 0 && equipmentTags.length == 0 && muscleGroupVals.length == 0 && selectedType.length == 0 && selectedOwner.length == 0){
      //console.log('no filter but still ate');
      return exercises;
    }

    // for all exercises in masterlist
    for (const ex of exercises)
    {
      if (tryFilterExercise(ex, searchVals, equipmentTags, muscleGroupVals, selectedType, selectedOwner)){
        retList.push(ex);
      }
    }

    return retList;
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

    const toggleFiltersShowing = () =>{
		setFiltersVisible(!areFiltersVisible);
		// filter on masterList
		if(areFiltersVisible){
			updateSearchResults(filterExercises(searchText));
		}
	}

    return (
    <View style={[styles.Background, { minHeight: windowHeight - (useWindowDimensions().height * 0.1) }]}>
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
            
            <View style={{ flex: .15, display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
				<View style={{flex:1,}}>
					<SearchBar
                        platform="default"
                        lightTheme={true}
                        containerStyle={{ backgroundColor: "white" }}
                        inputStyle={{ color: "black" }}
                        autoComplete='off'
                        autoCapitalize='none'
                        onChangeText={(val) => {
                            setSearchText(val);
                            updateSearchResults(filterExercises(val));
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
				</View>

				<View style={{}}>
				
                <TouchableOpacity onPress={toggleFiltersShowing} style={{}}>
                  
                <View style={styles.modalContainer}></View>
                    <Image source = {require("../../../assets/filter_icon.png")}
                      style={styles.filterImage}
                    />
                  {/* Filters Modal */}
                  <Modal 
                    isVisible = {areFiltersVisible}
                    coverScreen = {true}
                    //backdropOpacity = "1"
                    backdropColor = "white"
                    presentationStyle='fullScreen'
                    transparent={false}
                    >
                    <View style={styles.modalBackground}>
                        <View style={styles.filtersContainer}>
                          <View style={[styles.filterButtonContainer, {marginTop:40}]}>
                            <SelectBox
                              label="Equipment"
                              labelStyle={styles.filterLabels}
                              inputPlaceholder = "Add one or more Equipment"
                              listEmptyText='No Equipment Found'
                              searchInputProps = {{placeholder: "Search..."}}
                              inputFilterStyle={styles.filterSearch}
                              arrowIconColor = '#000000'
                              multiOptionContainerStyle = {styles.selectedFilterContainers}
                              multiOptionsLabelStyle = {styles.selectedFilterLabels}
                              
                              searchIconColor = "#000"
                              toggleIconColor = "#2193BC"

                              options = {equipmentFilters}
                              optionsLabelStyle = {styles.filterOptions}
                              
                              selectedValues = {selectedEquipmentFilter}
                              onMultiSelect = {onMultiChangeEquipment()}
                              onTapClose = {onMultiChangeEquipment()}
                              isMulti
                            />
                          </View>
                          <View style={styles.filterButtonContainer}>
                            <SelectBox
                              label="Muscle Groups"
                              labelStyle={styles.filterLabels}
                              inputPlaceholder = "Add one or more Muscle Groups"
                              listEmptyText='No Muscle Groups Found'
                              searchInputProps = {{placeholder: "Search..."}}
                              multiOptionsLabelStyle = {styles.selectedFilterLabels}
                              multiOptionContainerStyle = {styles.selectedFilterContainers}
                              options = {muscleGroupsFilters}
                              optionsLabelStyle = {styles.filterOptions}
                              arrowIconColor = '#000'

                              searchIconColor = "#000"
                              toggleIconColor = "#2193BC"
                              
                              selectedValues = {selectedMuscleGroupsFilter}
                              onMultiSelect = {onMultiChangeMuscleGroups()}
                              onTapClose = {onMultiChangeMuscleGroups()}
                              isMulti
                            />
                          </View>
                          <View style={styles.filterButtonContainer}>                      
                            <SelectBox
                              label="Exercise Types"
                              inputPlaceholder = "Add one or more Types"
                              labelStyle = {styles.filterLabels}
                              options = {typeFilters}
                              optionsLabelStyle = {styles.filterOptions}
                              hideInputFilter = 'true'
                              //containerStyle={{backgroundColor:"black"}}
                              toggleIconColor = "#2193BC"
                              arrowIconColor = '#000'
                              
                              multiOptionsLabelStyle={styles.selectedFilterLabels}
                              multiOptionContainerStyle={styles.selectedFilterContainers}
                              selectedValues = {selectedTypeFilter}
                              onMultiSelect = {onMultiChangeType()}
                              onTapClose = {onMultiChangeType()}
                              isMulti
                            />
                          </View>
                          <View style={styles.filterButtonContainer}>                      
                            <SelectBox
                              label="Owner Types"
                              inputPlaceholder = "Add one or more owner types"
                              labelStyle = {styles.filterLabels}
                              options = {ownerFilters}
                              optionsLabelStyle = {styles.filterOptions}
                              hideInputFilter = 'true'
                              //containerStyle={{backgroundColor:"black"}}
                              toggleIconColor = "#2193BC"
                              arrowIconColor = '#000'
                              
                              multiOptionsLabelStyle={styles.selectedFilterLabels}
                              multiOptionContainerStyle={styles.selectedFilterContainers}
                              selectedValues = {selectedOwnerFilter}
                              onMultiSelect = {onMultiChangeOwner()}
                              onTapClose = {onMultiChangeOwner()}
                              isMulti
                            />
                          </View>
                      </View>
                      <View style={styles.modalCloseButton}>
                        <TouchableOpacity onPress={toggleFiltersShowing}>
                          <View style={styles.closeFiltersButtonContainer}>
                            <Text style={styles.closeText}>Close</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      
                    </View>
                  </Modal>
                  </TouchableOpacity>
              </View>
			</View>
            
            <View style={{ flex: 1.1, maxHeight: "80%" }}>
                {isExercisesLoading ?
                    <ActivityIndicator size={50} /> :
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item._id}
                        style={{ flex: 1, }}
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
                }
                
            </View>
      
        <Modal
			isVisible={modalVisible}
			coverScreen={true}
			backdropColor="white"
			backdropOpacity={1}
		>
		    <ExerciseInfo exercise={exercise} setModalVisbility={setModalVisibility}/>
		</Modal>
            <View style={{ flex: .25, backgroundColor: "#FF8C4B", justifyContent:"center", borderTopWidth: 2}}>
                    <TouchableOpacity style={{ flex:1, alignItems:"center", justifyContent: "center"}} onPress={() => {setCurrState("ExerciseReview")}}>
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
        borderTopWidth:1.5,
        display: "flex",
        justifyContent: 'space-between',
        // alignContent: "space-between",
        // alignItems: "flex-end",
	},
    ExerciseCard: {
        backgroundColor: "#F1F3FA",
        padding: 15,
        margin:5,
        // marginBottom: 0,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        borderRadius: 15,
        borderWidth: 1.5,
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
    filterImage:{
		width: 30,
		height: 30,
		// marginTop: 25,
		marginTop: "55%",
		marginLeft: 5,
	},
	modalBackground:{
		backgroundColor: "white",
		flex: 1,
		display: "flex",
		flexDirection:"column",
		justifyContent: "space-evenly",
	},
	filtersContainer:{
		// height: "50%",
		flex: 1
	},
	filterButtonContainer:{
		backgroundColor: "#CDCDCD",
		borderColor: "black",
		borderWidth: 1.5,
		borderRadius: 20,
		paddingHorizontal: 10,
		marginHorizontal: 5,
		paddingVertical: 5,
		marginVertical: 15,
		// flex: 1,
	},
	filterLabels:{
		fontWeight: '500',
		fontSize: 18,
		color: 'black',
	},
	selectedFilterContainers:{
		// backgroundColor: '#4bccdd',
		backgroundColor: '#2193BC'
	},
	selectedFilterLabels: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 12,
	},
	filterOptions:{
		color: '#000',
		flex: 3,
	},
	hidden:{
		opacity: 0,
		display: 'none'
	},
	modalCloseButton:{
		alignItems: 'center',
	},
	closeFiltersButtonContainer:{
		backgroundColor: 'white',
		borderColor: "black",
		overflow: 'hidden',
		borderWidth: 3,
		borderRadius: 20,
		alignItems: 'center',
		paddingHorizontal: 10,
		margin: 10,
  },
  closeText: {
		fontWeight: 'bold',
        color: 'black',
        fontSize: 30,
        paddingHorizontal: 8,
	}

})