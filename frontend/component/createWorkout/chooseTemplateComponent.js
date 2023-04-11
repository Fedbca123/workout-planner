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
	useWindowDimensions
} from "react-native";
import React, { useEffect, useState } from "react";
import reactDom, { render } from "react-dom";
import Workouts from "../workout.js";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalState } from "../../GlobalState.js";
import API_Instance from "../../../backend/axios_instance.js"
import { Header, SearchBar } from "react-native-elements";
import Modal from "react-native-modal";
import SelectBox from 'react-native-multi-selectbox';
import {xorBy} from 'lodash';

export default function ChooseTemplateComponent({ setCurrState, setCurrWorkout, setCreateNew }) {
	const [globalState, updateGlobalState] = useGlobalState();
	const [allWorkouts, setAllWorkouts] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [searchResults, updateSearchResults] = useState([]);
	const isFocused = useIsFocused();
	const [areFiltersVisible, setFiltersVisible] = useState(false);
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


	function loadWorkouts() {

		API_Instance.post("workouts/search", {
			ownerId: globalState.user._id,
      // if we want friend workouts to appear in workout creation use line below
      friendIDs : globalState.user.friends
		}, {
			headers: {
				// 'Content-Type': 'multipart/form-data',
				'authorization': `BEARER ${globalState.authToken}`
			}
		}).then((response) => {

			if (response.status == 200) {

				setAllWorkouts(response.data);

				updateSearchResults(response.data);
				

			} else {
				console.log(response.status);
			}
		}).catch((e) => {
			console.log(e);
		});

	}

	function exerciseTagFound(exTag, searchTags){
		for(const term of searchTags){
			if(exTag && exTag.toLowerCase().includes(term.toLowerCase())){
				//console.log(term, 'found in', exTag)
				return true;
			}
		}
		return false;
	}

	function tryFilterWorkout(workout, searchVals, equipmentTags, muscleGroupVals, selectedOwner){
		let success = true;
		// for all muscle groups if they exist or are included
		if(muscleGroupVals.length > 0){
		let matches = false;
		for(const mg of workout.muscleGroups){
			for(const tag of muscleGroupVals){
			if(mg.toLowerCase() == tag.toLowerCase()){
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

		// for owner types
		if(success && selectedOwner.length > 0){
		let matches = false;

		if(selectedOwner.includes('Public') && !workout.owner){
			matches = true;
		}
		if(!matches && selectedOwner.includes('Personal') && workout.owner == globalState.user?._id){
			matches = true;
		}
		if(!matches && selectedOwner.includes('Friends') && globalState.user.friends.includes(workout.owner)){
			matches = true;
		}

		success = success && matches;
		}

		// equipment
		if(success && equipmentTags.length > 0){
		//console.log("et",equipmentTags)
		let matches = false;
		for(const tag of workout.tags){
			for(const eq of equipmentTags){
			if(tag.toLowerCase() == eq.toLowerCase()){
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
		if(success && searchVals.length > 0){
		//console.log("st",searchTags)
		let matches = false;
		for(const tag of workout.tags){
			if(exerciseTagFound(tag, searchVals)){
			matches = true;
			break;
			}
		}
		success = success && matches;
		}

		return success;
	}

	function handleSearch(str) {
		let retList = [];
		let searchVals = str ? str.split(' ') : [];
		
		if(searchVals.length == 0 ){
      		//console.log('no filter but still ate');
      		return allWorkouts;
    	}

		for (const workout of allWorkouts){
			if (tryFilterWorkout(workout, searchVals)){
				retList.push(workout);
			}
		}

		return retList;
	}

	const toggleFiltersShowing = () =>{
		setFiltersVisible(!areFiltersVisible);
		// filter on masterList
		if(areFiltersVisible){
			updateSearchResults(filterWorkouts(searchText));
		}
	}

	const filterWorkouts = (term) => {
		let retList = [];
		let searchVals =  term ? term.split(' ') : [];
		let equipmentTags = [...selectedEquipmentFilter.map(a=>a.item)];
		let muscleGroupVals = [...selectedMuscleGroupsFilter.map(a=>a.item)];
		let selectedOwner = [...selectedOwnerFilter.map(a=>a.item)];

		// if no tags or search terms then return masterlist
		if(searchVals.length == 0 && equipmentTags.length == 0 && muscleGroupVals.length == 0 && selectedOwner.length == 0){
		//console.log('no filter but still ate');
			return allWorkouts;
		}

		// for all exercises in masterlist
		for (const workout of allWorkouts)
		{
			if (tryFilterWorkout(workout, searchVals, equipmentTags, muscleGroupVals, selectedOwner)){
				retList.push(workout);
			}
		}

		return retList;
	}

	useEffect(() => {
		loadWorkouts();
	}, [isFocused]);

	const noTemplate = [
		{
			title: "My Custom Workout",
			duration: 0,
			description: "",
			exercises: [],
			location:"",
			scheduledDate: "",
			tags: [],
			muscleGroups: [],
		}
	];

	function comments(n) {
		console.log(typeof (n));
		console.log(JSON.stringify(n, null, 2));
	}

	// function checkOS() {
	// 	if (Platform.OS === "ios") {
	// 		return "ios";
	// 	} else if (Platform.OS === "android") {
	// 		return "android";
	// 	} else {
	// 		return "default";
	// 	}
	// }

	return (
		<View style={[styles.Background, { minHeight: Math.round(windowHeight) }]}>

			<TouchableOpacity 
				style={styles.createButton}
				onPress={() => {
					setCurrWorkout(noTemplate);
					setCreateNew(true);
					setCurrState("ExerciseReview");
				}}
			>
				<Text style={{fontSize: 18, padding: 5, textAlign: 'center', fontWeight: 'bold'}}>Create a custom workout</Text>
			</TouchableOpacity>
			

			<Text style={{fontSize:20, textAlign:"center", fontWeight: 'bold'}}>-OR-</Text>

			<Text style={styles.HeaderText}>Select a Workout:</Text>

			<View style={{ flex: .1, flexDirection: "row", justifyContent: "flex-start", borderTopWidth: .9,borderBottomWidth: .9, paddingBottom: 10}}>
				<View style={{flex:1, }}>
					<SearchBar
						platform='default'
						lightTheme={true}
						containerStyle={{ backgroundColor: "white",}}
						inputStyle={{ color: "black" }}
						// showLoading={true}
						onChangeText={(val) => {
							setSearchText(val);
							updateSearchResults(filterWorkouts(val));
						}}
						round={true}
						autoComplete='off'
						autoCorrect={false}
						autoCapitalize='none'
						value={searchText}
						// showLoading
						// cancelButtonTitle=""
						// showCancel={false}
						keyboardShouldPersistTaps='handled'
						onClear={() => {
							setSearchText("");
							// updateSearchResults(allWorkouts);
						}}
						onCancel={() => {
							setSearchText("");
							// updateSearchResults(allWorkouts);
						}}
						placeholder="Search workouts"
					/>
				</View>

				<View style={{ flex: .1}}>
				
                <TouchableOpacity onPress={toggleFiltersShowing}>
                  
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
                          <View style={styles.filterButtonContainer}>
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

			<View style={{flex:1,}}>
				<FlatList
					data={searchResults}
					style={styles.temp}
					// contentContainerStyle={{}}
					renderItem={(item) => (
						<View>
							{/* {comments(item.item)} */}
							<Workouts
								data={[item.item]}
								showButton={true}
								showInput={false}
								setCurrState={setCurrState}
								setCurrWorkout={setCurrWorkout}
								passData={setCurrWorkout}
								setCreateNew={setCreateNew}
							/>
						</View>
					)}
					ListEmptyComponent={
					<View style={{alignItems: 'center'}}>
						<Text style={{fontSize:20, alignItems: 'center', paddingTop:"15%"}}>
						No Workouts Found
						</Text>
					</View>
					}
					refreshing={true}
				/>
			</View>

			
		</View>
	);
}

const styles = StyleSheet.create({
	Background: {
		backgroundColor: "white",
		flex: 1,
		borderTopWidth:1.5,
		justifyContent: "space-evenly"
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
		// borderRadius: 8,
		...Platform.select({
			ios: {
				borderRadius: '8rem'
			},
			android: {
				borderRadius: 8
			},
		}),
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
		justifyContent: 'space-between'
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
		marginVertical: 5,
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
		marginHorizontal: 1,
		justifyContent: 'center',
		alignContent: 'center',
	},
	temp: {
		// maxHeight:"20%"
		flex: 1,
	}

});
