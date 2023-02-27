import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {Image, Switch, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import {Card, Title} from 'react-native-paper';
import { SearchBar } from 'react-native-elements';
import Toggle from "react-native-toggle-element";
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import Modal from "react-native-modal";
import config from "../../config";
import axios from "axios";
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';

const filters = [
  {label: 'Item 1', value: '1'},
  {label: 'Item 2', value: '2'},
  {label: 'Item 3', value: '3'},
  {label: 'Item 4', value: '4'},
  {label: 'Item 5', value: '5'},
  {label: 'Item 6', value: '6'},
  {label: 'Item 7', value: '7'},
  {label: 'Item 8', value: '8'},
];

//const [dropdown, setDropdown] = useState();
//const [selected, setSelected] = useState();

const _rendorItem = item => {
  return (
    <View>
      <Text>{item.label}</Text>
    </View>
  )
}

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

  // const [isWorkoutVisible, setWorkoutVisible] = useState(false);
  // const [isExerciseVisible, setExerciseVisible] = useState(false);

  // <View style={styles.filtersContainer}>
  //   <View style={styles.filterButtonContainer}>
  //     <TouchableOpacity onPress={handleTypePress}>
  //       <Text style={styles.filterButton}>Types</Text>
  //     </TouchableOpacity>
  //   </View>
  //   <View style={styles.filterButtonContainer}>
  //     <TouchableOpacity onPress={handleMuscleGroupPress}>
  //       <Text style={styles.filterButton}>Muscle Groups</Text>
  //     </TouchableOpacity>
  //   </View>
  //   <View style={styles.filterButtonContainer}>
  //     <TouchableOpacity onPress={handleTagPress}>
  //       <Text style={styles.filterButton}>Tags</Text>
  //     </TouchableOpacity>
  //   </View>
  // </View>

  const [toggleValue, setToggleValue] = useState(false);
  const [search, setSearch] = useState("");
  const [areFiltersVisible, setFiltersVisible] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const baseUrl = config.API_URL + config.PORT + "/";

  const toggleFiltersShowing = () =>{
    setFiltersVisible(!areFiltersVisible);
  }
  
  const updateSearch = (search) => {
    setSearch(search);
  }

  const handleTypePress = () => {
		console.log("Type Filter Pressed");
	};

  const handleTagPress = () => {
		console.log("Tags Filter Pressed");
	};
  const handleMuscleGroupPress = () => {
		console.log("Muscle Groups Filter Pressed");
	};

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

  useEffect(() => {
    axios.get('https://reactnative.dev/movies.json')
      .then(({ data }) => {
        console.log("defaultApp -> data", data.movies)
        setData(data.movies)
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

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
                    >
                    <View style={styles.modalBackground}>
                      <View style={styles.filtersContainer}>
                        <View style={styles.filterButtonContainer}>
                          <TouchableOpacity onPress={handleTypePress}>
                            <Text style={styles.filterButton}>Equipment</Text>
                          </TouchableOpacity>
                          {/* <MultiSelect
                            style = {styles.dropdown}
                            data = {filters}
                            labelField = "label"
                            valueField= "value"
                            label = "MultiSelect"
                            placeholder = "Pick me"
                            search
                            value = {selected}
                            onChange = {item => {
                              setSelected(item);
                              console.log('selected', item);
                            }}
                            renderItem = {item => _rendorItem(item)}
                          /> */}
                        </View>
                        <View style={styles.filterButtonContainer}>
                          <TouchableOpacity onPress={handleMuscleGroupPress}>
                            <Text style={styles.filterButton}>Muscle Groups</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={toggleValue ? styles.filterButtonContainer : styles.hidden}>
                          <TouchableOpacity onPress={handleTagPress}>
                            <Text style={styles.filterButton}>Type</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.modalCloseButton} onPress={toggleFiltersShowing}>
                          <Text style={styles.closeText}>Press to Close</Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.searchBar}>
              <SearchBar
                placeholder="Search Here"
                placeholderTextColor={"#363636"}
                data 
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
              {isLoading ? <FlatList
              data = {data}
              style = {styles.boxContainer}
              renderItem = 
              {({item}) => <TouchableOpacity onPress={()=>
              Alert.alert(item.Name)}><Text style={styles.exerciseItems}>{item.id}{". "}{item.Name}</Text></TouchableOpacity>}
              /> : <FlatList
              data = {data}
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
    top: 100,
  },
  closeText:{
    fontWeight: 'bold',
  },
  openText:{
    fontWeight: 'bold',
    paddingTop: 30,
    paddingLeft: 10
  },
  modalBackground:{
    backgroundColor: "white",
    height: "45%",
    borderRadius: "15rem",
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
    flexDirection: 'column',
    alignItems: 'left',
    height: "50%",

  },
  filterButtonContainer:{
    //alignItems: "center",
    backgroundColor: "#CDCDCD",
    borderColor: "black",
    borderWidth: 2.5,
    borderRadius: "15rem",
    paddingHorizontal: 10,
    marginHorizontal: 5,
    paddingVertical: 10,
    marginVertical: 10,
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
