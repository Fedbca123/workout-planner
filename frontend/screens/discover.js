import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {Image, Switch, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import {Card, Title} from 'react-native-paper';
import { SearchBar } from 'react-native-elements';
import Toggle from "react-native-toggle-element";
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import Modal from "react-native-modal";
// import config from "../../backend/config";
//import API_Instance from '../../backend/axios_instance';
import SelectBox from 'react-native-multi-selectbox';
import {xorBy} from 'lodash';
import { RFC_2822 } from 'moment';
import { useWindowDimensions } from 'react-native';

// const baseUrl = config.API_URL + config.PORT + '/';
// const router = require('express').Router();

// //exercises = axios.get(baseUrl + "exercises/search")
// router.route('/').get((req,res) => {
//   Exercise.find()
//     .then(exercises => res.json(exercises))
//     .catch(err => res.status(401).json('Error: ' + err));
// });

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
  {item: 'Cardio', id: '1'},
  {item: 'SETSXREPS', id: '2'},
  {item: 'AMRAP', id: '3'}
];

const exerciseData = [
  {Name: 'Top Exercise', id: 1, Sets: 2, Reps: 3},
  {Name: 'Benchpress', id: 2, Sets: 3, Reps: 5},
  {Name: 'Lunges', id: 3, Sets: 5, Reps: 5},
  {Name: 'Deadlift', id: 4, Sets: 1, Reps: 3},
  {Name: 'Skullcrusher', id: 5, Sets: 4, Reps: 3},
  {Name: 'Squats', id: 6, Sets: 2, Reps: 3},
  {Name: 'Benchpress', id: 7, Sets: 3, Reps: 5},
  {Name: 'Lunges', id: 8, Sets: 5, Reps: 5},
  {Name: 'Deadlift', id: 9, Sets: 1, Reps: 3},
  {Name: 'Skullcrusher', id: 10, Sets: 4, Reps: 3},
  {Name: 'Squats', id: 11, Sets: 2, Reps: 3},
  {Name: 'Benchpress', id: 12, Sets: 3, Reps: 5},
  {Name: 'Lunges', id: 13, Sets: 5, Reps: 5},
  {Name: 'Deadlift', id: 14, Sets: 1, Reps: 3},
  {Name: 'Bottom Exercise', id: 15, Sets: 4, Reps: 3},
];
const workoutData = [
  {Name: 'Top Workout', id: 1, Exercises: 5},
  {Name: 'Legs', id: 2, Exercises: 6},
  {Name: 'Full Body', id: 3, Exercises: 11},
  {Name: 'Arms', id: 4, Exercises: 5},
  {Name: 'Legs', id: 5, Exercises: 6},
  {Name: 'Full Body', id: 6, Exercises: 11},
  {Name: 'Arms', id: 7, Exercises: 5},
  {Name: 'Legs', id: 8, Exercises: 6},
  {Name: 'Full Body', id: 9, Exercises: 11},
  {Name: 'Bottom Workout', id: 10, Exercises: 5},
];

export default function DiscoverPage(props) {

  const [toggleValue, setToggleValue] = useState(false);
  const [search, setSearch] = useState("");
  const [areFiltersVisible, setFiltersVisible] = useState(false);
  const [selectedEquipmentFilter, setEquipmentFilter] = useState([]);
  const [selectedMuscleGroupsFilter, setMuscleGroupsFilter] = useState([]);
  const [selectedTypeFilter, setTypeFilter] = useState([]);
  const [isAFilterExpanded, closeExpandedFilters] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // const baseUrl = config.API_URL + config.PORT + "/";

  // const windowWidth = useWindowDimensions().width;
  // const windowHeight = useWindowDimensions().height;
  const {height, width} = useWindowDimensions();

  const toggleFiltersShowing = () =>{
    setFiltersVisible(!areFiltersVisible);
  }
  
  const updateSearch = (search) => {
    setSearch(search);
  }

  const handleTypePress = () => {
		console.log("Type Filter Pressed");
	};

  const closeOtherFilters = () => {
    
  }

  const WorkoutsList = [
		{
			title: "Leg Day",
			duration:45,
			location:"Gold's Gym",
			content: [
				{
					title: "Deadlift",
					ExerciseType: "SETSXREPS",
					sets: 3,
					reps: 10,
				},
				{
					title: "Front Squats",
					ExerciseType: "SETSXREPS",
					sets: 4,
					reps: 12,
				},
				{
					title: "Calf Raises",
					ExerciseType: "AMRAP",
					time: 60000,
				},
				{
					title: "Bulgarian Split Squats",
					ExerciseType: "SETSXREPS",
					sets: 3,
					reps: 10,
				},
				{
					title: "Leg Press",
					ExerciseType: "SETSXREPS",
					sets: 4,
					reps: 12,
				},
				{
					title: "Lunges",
					ExerciseType: "SETSXREPS",
					sets: 3,
					reps: 15,
				},
			],
		},
	];
  
  // function getWorkouts(){
  //   axios.get(baseUrl + "/").then((response) => {
	// 		if (response.status === 200) {
	// 			return <Workouts data={response.data} />;
	// 		}
	// 	});  
  // }

  // function getExercises(){

  // }

  // useEffect(() => {
  //   axios.get('https://reactnative.dev/movies.json')
  //     .then(({ data }) => {
  //       console.log("defaultApp -> data", data.movies)
  //       setData(data.movies)
  //     })
  //     .catch((error) => console.error(error))
  //     .finally(() => setLoading(false));
  // }, []);

  function onMultiChangeEquipment() {
    return (item) => setEquipmentFilter(xorBy(selectedEquipmentFilter, [item], 'id'))
  }
  function onMultiChangeMuscleGroups() {
    return (item) => setMuscleGroupsFilter(xorBy(selectedMuscleGroupsFilter, [item], 'id'))
  }
  function onMultiChangeType() {
    return (item) => setTypeFilter(xorBy(selectedTypeFilter, [item], 'id'))
  }



  function handleExercisePress() {
    console.log("Exercise button pressed");
  }

  function handleWorkoutPress() {
    console.log("Workout button pressed");
  }

  function showWorkout() {
      if (!isWorkoutVisible){
        setWorkoutVisible(true);
        setExerciseVisible(false);
      }
  }
  function showExercise() {
      if (!isExerciseVisible) {
        setExerciseVisible(true);
        setWorkoutVisible(false);
  }
}

return (
    <SafeAreaView style = {styles.page}>
      <View style = {styles.discoverHeaderContainer}>
        <View style={styles.discoveryPageHeader}>
          <Text style={styles.discoverTitle}>Discover</Text>
          <Text style={styles.discoverSubtitle}>Refresh your fitness knowledge or learn something new</Text>
          <View style={styles.buttonsContainer}>
            <View style={styles.toggleandfilters}>
              <View style={styles.toggleContainer}>
                  <Toggle
                    value = {toggleValue}
                    onPress = {(newState) => setToggleValue(newState)}
                    disabledStyle = {{backgroundColor: "darkgray", opacity: 1}}
                    leftComponent = <Text style={styles.workoutTitle}>Workouts</Text>
                    rightComponent = <Text style={styles.exerciseTitle}>Exercises</Text>
                    trackBar={{
                      width: 170,
                      height: 50,
                      //radius: 40,
                    //borderWidth: -1,
                    activeBackgroundColor: "#8EB4FA",
                    inActiveBackgroundColor: "#C38AF0"
                    }}
                    thumbButton={{
                      width: 80,
                      height: 50,
                      //radius: 30,
                      borderWidth: 1,
                      activeBackgroundColor: "#ddff33",
                      inActiveBackgroundColor: "#33ff9c"
                      }}
                    />
              </View>
              <View style={styles.filters}>
                <TouchableOpacity onPress={toggleFiltersShowing}>
                <View style={styles.modalContainer}></View>
                <Text style={styles.openText}>Open Filters</Text>
                  <Modal 
                    isVisible = {areFiltersVisible}
                    coverScreen = {true}
                    //backdropOpacity = "1"
                    backdropColor = "gray"
                    presentationStyle='fullScreen'
                    transparent={false}
                    >
                    <SafeAreaView style={styles.modalBackground}>
                      <SafeAreaView style={styles.filtersContainer}>
                        <SafeAreaView style={styles.filterButtonContainer}>
                        {/* <Text style={styles.filterLabels}>Select Equipments</Text> */}
                          <SelectBox
                            label="Equipment"
                            labelStyle={styles.filterLabels}
                            inputPlaceholder = "Show & Hide Equipment"
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
                        </SafeAreaView>
                        <SafeAreaView style={styles.filterButtonContainer}>
                          {/* <Text style={styles.filterLabels}>Select Muscle Groups</Text> */}
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
                        </SafeAreaView>
                        <SafeAreaView style={toggleValue ? styles.filterButtonContainer : styles.hidden}>                      
                          {/* <Text style={styles.filterLabels}>Select Exercise Types</Text> */}
                          <SelectBox
                            label="Exercise Types"
                            inputPlaceholder = "Show/Hide Types"
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
                        </SafeAreaView>
                      </SafeAreaView>
                      <TouchableOpacity style={styles.modalCloseButton} onPress={toggleFiltersShowing}>
                        <View style={styles.closeButtonContainer}>
                              <Text style={styles.closeText}>Close</Text>
                        </View>
                      </TouchableOpacity>
                    </SafeAreaView>
                  </Modal>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.searchBar}>
              <SearchBar
                placeholder="Search Here"
                placeholderTextColor={"#363636"}
                data={exerciseData} 
                lightTheme
                round
                onChangeText={updateSearch}
                autoCorrect={false}
                value={search}
                // searchIcon = {false}
                inputStyle={{
                    color: "black",
                  }}
                containerStyle = {{
                  marginTop: 5,
                  backgroundColor: "white",
                  // marginBottom: 5,
                }}
              />
            </View>
          </View>
        </View> 
      </View>
      <View style={styles.discoverContainer}>
              {toggleValue ? <FlatList
              data = {exerciseData}
              style = {styles.boxContainer}
              renderItem = 
              {({item}) => <TouchableOpacity onPress={()=>
              Alert.alert(item.Name)}><Text style={styles.exerciseItems}>{item.id}{". "}{item.Name}</Text></TouchableOpacity>}
              /> : <FlatList
              data = {workoutData}
              style = {styles.boxContainer}
              renderItem = {({item}) => <TouchableOpacity onPress={()=>
              Alert.alert(item.Name)}><Text style={styles.workoutItems}>{item.id}{". "}{item.Name}</Text></TouchableOpacity>}
              />}
      </View>

      {/* <View style={styles.discoverContainer}>
              {toggleValue ? <FlatList
              data = {exerciseData}
              style = {styles.boxContainer}
              renderItem = 
              {({item}) => <TouchableOpacity onPress={()=>
              Alert.alert(item.Name)}><Text style={styles.exerciseItems}>{item.id}{". "}{item.Name}</Text></TouchableOpacity>}
              /> : <FlatList
              data = {workoutData}
              style = {styles.boxContainer}
              renderItem = {({item}) => <TouchableOpacity onPress={()=>
              Alert.alert(item.Name)}><Text style={styles.workoutItems}>{item.id}{". "}{item.Name}</Text></TouchableOpacity>}
              />}
      </View> */}
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  boxContainer:{
    flex: 1,
  },
  toggleandfilters:{
    flexDirection: 'row'
  },
  modalCloseButton:{
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    bottom: "2%",
    width: "100%"
    // bottom: -375,
    // width: "90%",
    // justifyContent: 'center',
    // alignContent:'center',
    //width:"100%",
    //borderColor: "black"
    // right: -170,
    // backgroundColor: 'gray',
  },
  closeButtonContainer:{
    backgroundColor: 'white',
    borderColor: "black",
    overflow: 'hidden',
    borderWidth: 3,
    borderRadius: "20rem",
    // bottom: -375,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 1,
    //width: "35%",
    justifyContent: 'center',
    alignContent: 'center',
  },

  closeText:{
    fontWeight: 'bold',
    color: 'black',
    fontSize: 30,
    paddingHorizontal: 8,
    //borderRadius: "20rem",
    
  },
  openText:{
    fontWeight: 'bold',
    paddingTop: 30,
    paddingLeft: 10
  },
  modalBackground:{
    backgroundColor: "white",
    //height: "90%",
    borderRadius: "15rem",
    flex: 1
  },
  filterOptions:{
    color: '#000',
    flex: 3,
  },

  selectedFilterLabels: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },

  selectedFilterContainers:{
    // backgroundColor: '#4bccdd',
    backgroundColor: '#2193BC'
    
  },
  filterSearch:{
    //backgroundColor: 'pink'
  },

  filterLabels:{
    fontWeight: '500',
    fontSize: 18,
    color: 'black',
  },
  workoutItems:{
    backgroundColor: '#3377ff',
    color: "#33ff9c",
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10, 
    //height: Dimensions.get('window') / numColumns,
    flex: 1,
    margin: 1,
 },
  exerciseItems:{
      backgroundColor: '#8333ff',
      color: "#ddff33",
      justifyContent: 'center',
      textAlign: 'center',
      padding: 10, 
      //height: Dimensions.get('window') / numColumns,
      flex: 1,
      margin: 1,
   },
   workoutTitle:{
      fontWeight: 'bold',
      fontSize: 13,
   },

   exerciseTitle:{
      fontWeight: 'bold',
      fontSize: 13
   },

  discoveryPageHeader:{
    backgroundColor: 'white',
  },
  toggleandfilters:{
    justifyContent: 'center',
    flexDirection: 'row',
  },
  toggleContainer:{
    alignItems: 'center',
    paddingBottom: 5,
    paddingTop: 15,
  },
  buttonsContainer:{
    // paddingBottom: 5
  },
  filtersContainer:{
    //flexDirection: 'column',
    //alignItems: 'left',
    height: "50%",

  },
  filterButtonContainer:{
    //alignItems: "center",
    backgroundColor: "#CDCDCD",
    borderColor: "black",
    borderWidth: 1.5,
    borderRadius: "20rem",
    paddingHorizontal: 10,
    marginHorizontal: 5,
    paddingVertical: 5,
    marginVertical: 5,
  },

  hidden:{
    opacity: 0,
  },

  // workoutsBttnText:{
  //   color: '#12BEF6',
  //   fontWeight: 'bold',
  // },
  // exercisesBttnText:{
  //   color: '#FA7B34',
  //   fontWeight: 'bold',
  // },
  // discoverBttnsCntnr:{
  //   justifyContent: 'center',
  //   flexDirection: 'row',
  // },
  // discoverWorkoutsBttnsContainer:{
  //   backgroundColor: '#DCF1FE',
  //   margin: 30,
  //   padding: 15,
  //   borderRadius: '10rem',
  // },
  // discoverExercisesBttnsContainer:{
  //   backgroundColor: '#F8E1D2',
  //   margin: 30,
  //   padding: 15,
  //   borderRadius: '10rem',
  // },
  discoverTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 10
  },
  discoverSubtitle:{
    marginTop: 5,
    marginLeft: 10,
    opacity: .45,
  },
  discoverContainer:{
    backgroundColor: 'salmon',
    height: "75.5%",
    //flex: 2,
  },
  discoverHeaderContainer:{
    backgroundColor: 'white',
    //flex: 1,
  },
  page:{
    //height: 600,
  },
  container: {
  //  height: 700,
    //backgroundColor: '#fff',
    //alignItems: 'stretch',
    //justifyContent: 'space-evenly',
  },
});
