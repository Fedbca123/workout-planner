import React, { useState, useEffect } from 'react';
import { SearchBar } from 'react-native-elements';
import Toggle from "react-native-toggle-element";
import Modal from "react-native-modal";
import API_Instance from '../../backend/axios_instance';
import SelectBox from 'react-native-multi-selectbox';
import { xorBy } from 'lodash';
import { useGlobalState } from '../GlobalState.js';
import { useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, View,
  TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';

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
  {id: 0, item:'Public'},
  {id: 1, item: 'Personal'},
  {id: 2, item: 'Friends'}
]

export default function DiscoverPage({navigation}) {

  const isFocused = useIsFocused();
  const [globalState, updateGlobalState] = useGlobalState();

  // Exercise or Workout List Toggle
  const [toggleValue, setToggleValue] = useState(false);

  // Filter Modal Popup Visibility
  const [areFiltersVisible, setFiltersVisible] = useState(false);

  // Exercise Info Page Visibility
  const [isInfoPageVisible, setInfoPageVisible] = useState(false);

  // Chosen Equipment Filters
  const [selectedEquipmentFilter, setEquipmentFilter] = useState([]);

  // Chosen Muscle Group Filters
  const [selectedMuscleGroupsFilter, setMuscleGroupsFilter] = useState([]);

  // Chosen Exercise Type Filters
  const [selectedTypeFilter, setTypeFilter] = useState([]);

  // Chosen Owner Type Filters
  const [selectedOwnerFilter, setOwnerFilter] = useState([]);


  // For Exercise Info Page
  const [selectedExercise, setSelectedExercise] = useState([]);
  const [selectedExerciseTitle, setSelectedExerciseTitle] = useState();
  const [selectedExerciseDesc, setSelectedExerciseDesc] = useState();
  const [selectedExerciseMuscleGroups, setSelectedExerciseMuscleGroups] = useState();
  const [selectedExerciseImage, setSelectedExerciseImage] = useState();
  const [selectedExerciseOwner, setSelectedExerciseOwner] = useState();

  // All items resulting from search and filter
  const [filteredExerciseData, setFilteredExerciseData] = useState([]);
  // All items from DB from search with only ownerID
  const [masterExerciseData, setMasterExerciseData] = useState([]);

  // All items resulting from search and filter
  const [filteredWorkoutData, setFilteredWorkoutData] = useState([]);
  // All items from DB from search with only ownerID
  const [masterWorkoutData, setMasterWorkoutData] = useState([]);

  // Search Bar Term
  const [searchTerm, setSearchTerm] = useState('');

  // Activity Indicator
  const [isExercisesLoading, setIsExercisesLoading] = useState(true);
  const [isWorkoutsLoading, setIsWorkoutsLoading] = useState(true);

  // Used to keep workout expanded
  const [expandedWorkoutId, setExpandedWorkoutId] = useState(null);

  useEffect(() => {
    if(isFocused){
      exercisesList();
      workoutsList();
    }
  }, [isFocused]);

  useEffect(() => {
    setFilteredWorkoutData(filterWorkouts(searchTerm));
  }, [masterWorkoutData]);

  useEffect(() => {
    setFilteredExerciseData(filterExercises(searchTerm));
  }, [masterExerciseData]);

  // Returns Public, You, or friend's name as workout owner
  const getWorkoutOwner = (exercise) => {
    if (!exercise.owner)
      return "Public";
    else if (exercise.owner === globalState.user?._id) {
      return "You";
    } else {
      return exercise.ownerName;
    }
  };

  // Delete Personal Custom Exercise
  function deleteExercise(){
    try{
      Alert.alert(`Are you sure you want to delete ${selectedExerciseTitle}?`,
      '',
      [{
          text: 'Yes',
          onPress: () => {
            API_Instance.delete(`exercises/${selectedExercise._id}`,
            {
              headers: {
                  'authorization': `BEARER ${globalState.authToken}`
                }
              }).then((response) => {
                Alert.alert(`${selectedExerciseTitle} deleted successfully!`);
                setFilteredExerciseData(filteredExerciseData.filter(item => item._id != selectedExercise._id));
                setMasterExerciseData(masterExerciseData.filter(item => item._id != selectedExercise._id));
                closeInfoModal();
              }).catch((e) => {
                Alert.alert(`${e}`);
                console.log(e);
              });
          },
      },
      {
          text: 'No',
      }],
      { cancelable: false});
    }catch(e){
      console.log(e);
    }
  }
  // Exercise Card
  const ExerciseItem = ({exercise, title, type, image}) => {

    return(
    <View style={styles.exerciseItems(globalState.theme)}>
      <View style={styles.exerciseCardImageContainer}>
        <Image style={styles.exerciseCardImage} src = {image}/>
      </View>
      <View style={styles.exerciseCardText}>
        <Text style={styles.exerciseCardTitle}>{title}</Text>
        <Text style={styles.exerciseCardType}>Type: {type}</Text>
      </View>
    </View>

    )}

  // Workout Card
  const WorkoutItem = ({workout, title, description, muscleGroups, duration, exercises, image, expandedWorkoutId, setExpandedWorkoutId}) => {
    const expanded = expandedWorkoutId === workout._id;
    const handlePress = () => {
      setExpandedWorkoutId((prevExpandedWorkoutId) =>
      prevExpandedWorkoutId === workout._id ? null : workout._id
    );
    };
    function addWorkout(workout){
      navigation.navigate("createWorkout", { workoutData: workout });
    }
    function deleteWorkout(workout){
      try{
        Alert.alert(`Are you sure you want to delete ${workout.title}?`,
        '',
        [{
            text: 'Yes',
            onPress: () => {
              API_Instance.delete(`workouts/${workout._id}`,
              {
                headers: {
                    'authorization': `BEARER ${globalState.authToken}`
                  }
                }).then((response) => {
                  Alert.alert(`${workout.title} deleted successfully!`);
                  setFilteredWorkoutData(filteredWorkoutData.filter(item => item._id != workout._id));
                  setMasterWorkoutData(masterWorkoutData.filter(item => item._id != workout._id));
                }).catch((e) => {
                  Alert.alert(`${e}`);
                  console.log(e);
                });
            },
        },
        {
            text: 'No',
        }],
        { cancelable: false});
      }catch(e){
        console.log(e);
      }
    }

    return(
      // Workout Cards
    <View style={styles.workoutItems(globalState.theme)}>
    <TouchableOpacity onPress={handlePress} activeOpacity=".4">
      <View style={styles.workoutHeader}>
        <View style={styles.workoutCardImageContainer(globalState.theme)}>
          <Image style={styles.workoutCardImage} src = {image}/>
        </View>
        <View style={styles.workoutCardTitleContainer}>
          <Text style={styles.workoutCardTitle(globalState.theme.colorText)}>{title}</Text>
        </View>
        <View style={styles.expandableIndicatorContainer}>
          <Image source ={ require("../../assets/expandable.png")}
                  style={[
                    styles.expandableIndicator,
                    expanded ? {transform: [{rotate: "180deg"}]} : {},
                    ]} />
        </View>
      </View>

        {/* Workout Header Info */}
        {expanded &&
          <View>
            <View style={styles.workoutCardText}>
              <Text style={styles.workoutCardDescription(globalState.theme.colorText)}>{description}</Text>
              <Text style={styles.workoutCardDuration(globalState.theme.colorText)}>Duration: {duration} min</Text>
              <Text style={styles.workoutCardMuscleGroups(globalState.theme.colorText)}>Muscle Groups: {muscleGroups.join(", ")}</Text>
              <Text style={styles.workoutCardOwner(globalState.theme.colorText)}>Workout Owner: {getWorkoutOwner(workout)} </Text>
            </View>
            <TouchableOpacity onPress={()=>
              addWorkout(workout)}>
              <View style={styles.scheduleWorkoutButton}>
                <Text style={styles.scheduleWorkoutText}>SCHEDULE WORKOUT</Text>
              </View>
            </TouchableOpacity>
          </View>
          }

        {/* Exercises in Workout */}
        {expanded &&
            exercises.map((exercise) => (
              <View style = {styles.workoutExerciseCard} key={exercise._id}>
              <TouchableOpacity onPress={()=>{
                    setSelectedExercise(exercise);
                    setSelectedExerciseTitle(exercise.title);
                    setSelectedExerciseDesc(exercise.description);
                    setSelectedExerciseMuscleGroups(exercise.muscleGroups);
                    setSelectedExerciseImage(exercise.image);
                    setSelectedExerciseOwner(exercise.owner);
                    showInfoModal();
              }
              }>
              <View style = {styles.workoutExerciseContainer(globalState.theme)}>
                <View style = {styles.workoutExerciseCardContent}>
                  <View style={styles.workoutExerciseCardImageContainer(globalState.theme)}>
                    <Image style={styles.workoutExerciseCardImage} src = {exercise.image}/>
                  </View>
                  <View style={styles.workoutExerciseCardTextContainer}>
                    <Text style={styles.workoutExerciseCardTitle}>{exercise.title}</Text>
                    <Text>{exercise.exerciseType}</Text>

                  </View>
                </View>
              </View>
            </TouchableOpacity>
            </View>
            ))}

          {/* Delete Custom Workout */}
          {expanded && workout.owner == globalState.user?._id &&
            <TouchableOpacity onPress={()=>
              deleteWorkout(workout)}>
              <View style={styles.deleteWorkoutButton}>
                <Text style={styles.deleteWorkoutText}>DELETE WORKOUT</Text>
              </View>
            </TouchableOpacity>}

      </TouchableOpacity>
    </View>
    );
  };

  // Exercise API Call
  const exercisesList = async()=> {
      API_Instance.post('exercises/search',
    {
      ownerId : globalState.user._id,
      friendIDs : globalState.user.friends
    },
    {
      headers: {
        'authorization': `BEARER ${globalState.authToken}`,
      }
    })
    .then((response) => {
      if (response.status == 200){
        setMasterExerciseData(response.data);
        setFilteredExerciseData(filterExercises(searchTerm));
        exercisesLoaded();
      }
    })
    .catch((e) => {
      console.log(e);
    })
  }

  // Workout API Call
  const workoutsList = async()=> {
    API_Instance.post('workouts/search',
    {
      ownerId: globalState.user._id,
      friendIDs : globalState.user.friends
    },
    {
      headers: {
        'authorization': `BEARER ${globalState.authToken}`,
      }
    })
    .then((response) => {
      if (response.status == 200) {
        setMasterWorkoutData(response.data);
        setFilteredWorkoutData(filterWorkouts(searchTerm));
        workoutsLoaded();
      }
    })
    .catch((e) => {
      console.log(e);
    })
}

  // Toggle Filter Modal
  const toggleFiltersShowing = () =>{
    setFiltersVisible(!areFiltersVisible);
    if(areFiltersVisible){
      if(toggleValue){
        // Exercises
        setFilteredExerciseData(filterExercises(searchTerm));
      }
      else {
        setFilteredWorkoutData(filterWorkouts(searchTerm));
      }
    }
  }

  // Activity Indicator
  const exercisesLoaded = async () => {
      setIsExercisesLoading(false);
  }
  // Activity Indicator
  const workoutsLoaded = async () => {
    setIsWorkoutsLoading(false);
  }

  // onMultiChange - filter adding
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

  function exerciseTagFound(exTag, searchTags){
    for(const term of searchTags){
      if(exTag && term.length > 0 && exTag.toLowerCase().includes(term.toLowerCase())){
        return true;
      }
    }
    return false;
  }

  function tryFilterExercise(exercise, searchTags, equipmentTags, muscleGroupVals, selectedType, selectedOwner){
    let success = true;

    // Exercise Type
    if(selectedType.length > 0){
      let matches = false;

      for(const type of selectedType){
        if(type && exercise && exercise.exerciseType && type.toLowerCase() == exercise.exerciseType.toLowerCase()){
          matches = true;
          break;
        }
      }

      success = success && matches;
    }

    // Owner Type
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

    // Muscle Groups
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

    // Equipment
    if(success && equipmentTags.length > 0){
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

    // SearchBar
    if(success && searchTags.length > 0){
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
      return masterExerciseData;
    }

    // for all exercises in masterlist
    for (const exercise of masterExerciseData)
    {
      if (tryFilterExercise(exercise, searchVals, equipmentTags, muscleGroupVals, selectedType, selectedOwner)){
        retList.push(exercise);
      }
    }

    return retList;
  }

  function tryFilterWorkout(workout, searchVals, equipmentTags, muscleGroupVals, selectedOwner){
    let success = true;
    // Muscle Groups
    if(muscleGroupVals.length > 0){
      let matches = false;
      for(const mg of workout.muscleGroups){
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

    // Owner Types
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

    // Equipment
    if(success && equipmentTags.length > 0){
      let matches = false;
      for(const tag of workout.tags){
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

    // SearchBar
    if(success && searchVals.length > 0){
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

  const filterWorkouts = (term) => {
    let retList = [];
    let searchVals =  term ? term.split(' ') : [];
    let equipmentTags = [...selectedEquipmentFilter.map(a=>a.item)];
    let muscleGroupVals = [...selectedMuscleGroupsFilter.map(a=>a.item)];
    let selectedOwner = [...selectedOwnerFilter.map(a=>a.item)];

    // if no tags or search terms then return masterlist
    if(searchVals.length == 0 && equipmentTags.length == 0 && muscleGroupVals.length == 0 && selectedOwner.length == 0){
      //console.log('no filter but still ate');
      return masterWorkoutData;
    }

    // for all exercises in masterlist
    for (const workout of masterWorkoutData)
    {
      if (tryFilterWorkout(workout, searchVals, equipmentTags, muscleGroupVals, selectedOwner)){
        retList.push(workout);
      }
    }

    return retList;
  }

  function showInfoModal() {
    setInfoPageVisible(true);
  }

  function closeInfoModal() {
    setInfoPageVisible(false);
  }

return (

  <View style={styles.container(globalState.theme)}>
      <View>
        <View style={styles.discoverHeader(globalState.theme.colorBackground)}>
          <Text style={styles.discoverTitle(globalState.theme.colorText)}>Discover</Text>
          <Text style={styles.discoverSubtitle}>Refresh your fitness knowledge or learn something new</Text>
          <View style={styles.buttonsContainer}>
            <View style={styles.toggleandfilters}>
              <View style={styles.toggleContainer}>
              {/* Workout/Exercise List Toggle */}
                <Toggle
                  value = {toggleValue}
                  onPress={(newState) => {
                    setToggleValue(newState);
                    if (newState) {
                      // We are in exercises
                      setFilteredExerciseData(filterExercises(searchTerm));
                    } else {
                      // We are in workouts
                      setFilteredWorkoutData(filterWorkouts(searchTerm));
                    }
                  }}
                  disabledStyle = {{backgroundColor: "darkgray", opacity: 1}}
                  leftComponent = {<Text style={styles.workoutTitle(globalState.theme)}>Workouts</Text>}
                  rightComponent = {<Text style={styles.exerciseTitle(globalState.theme)}>Exercises</Text>}
                  trackBar={{
                    width: 170,
                    height: 50,
                    activeBackgroundColor: globalState.theme.color1,
                    // activeBackgroundColor: "#FEE2CF",
                    inActiveBackgroundColor: globalState.theme.color1,
                  }}
                  trackBarStyle={{
                      borderColor: 'black',
                      borderWidth: 0,
                      height: 54,
                      width: 174
                  }}
                  thumbButton={{
                    width: 77,
                    height: 50,
                    activeBackgroundColor: globalState.theme.color3,
                    inActiveBackgroundColor: globalState.theme.color2
                    }}
                />
              </View>
              <View style={styles.filters}>
                <TouchableOpacity onPress={toggleFiltersShowing}>
                    <Image source = {globalState.theme.name == 'lightmode' ? require("../../assets/filter_icon.png") : require("../../assets/filter_icon_white.png")}
                      style={styles.filterImage}
                    />
                  {/* Filters Modal */}
                  <Modal
                    isVisible = {areFiltersVisible}
                    coverScreen = {true}
                    backdropColor = {globalState.theme.colorBackground}
                    presentationStyle='overFullScreen'
                    transparent={true}
                    animationType='fade'
                    >
                    <View style={styles.modalBackground(globalState.theme)}>
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
                          <View style={toggleValue ? styles.filterButtonContainer : styles.hidden}>
                            <SelectBox
                              label="Exercise Types"
                              inputPlaceholder = "Add one or more Types"
                              labelStyle = {styles.filterLabels}
                              options = {typeFilters}
                              optionsLabelStyle = {styles.filterOptions}
                              hideInputFilter = 'true'
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
            {/* Search Bar */}
            <View>
              <SearchBar
                placeholder="Search Here"
                placeholderTextColor={"#363636"}
                data={toggleValue ? filteredExerciseData : filteredWorkoutData}
                lightTheme
                round
                autoCorrect={false}
                autoCapitalize="none"
                autoComplete='off'

                // below line will make keyboard go away by
                // tapping away from the input only if it's in a scrollview
                keyboardShouldPersistTaps='handled'
                value = {searchTerm}
                onChangeText={(text) => {
                  setSearchTerm(text);
                  if (toggleValue) {
                    setFilteredExerciseData(filterExercises(text));
                  } else {
                    setFilteredWorkoutData(filterWorkouts(text));
                  }
                }}


                inputStyle={{
                    color: "black",
                  }}
                containerStyle = {{
                  marginTop: 5,
                  backgroundColor: globalState.theme.colorBackground,
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.discoverContainer(globalState.theme.colorBackground)}>

              {toggleValue ?
              // Exercises
              isExercisesLoading ?

              <ActivityIndicator size ="large"/>
              : (<FlatList
              data = {filteredExerciseData}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={{fontSize:20, alignItems: 'center'}}>
                  No Exercises Found
                  </Text>
                </View>
              }
              style = {styles.boxContainer}
              renderItem={({item}) =>
                <TouchableOpacity onPress={()=>{

                    setSelectedExercise(item);
                    setSelectedExerciseTitle(item.title)
                    setSelectedExerciseDesc(item.description);
                    setSelectedExerciseMuscleGroups(item.muscleGroups);
                    setSelectedExerciseImage(item.image);
                    setSelectedExerciseOwner(item.owner);
                    showInfoModal();
                }}>

                  <ExerciseItem
                  exercise = {item}
                  title={item.title}
                  description={item.description} muscleGroups={item.muscleGroups}
                  type={item.exerciseType} tags={item.tags} image={item.image}
                  />
                </TouchableOpacity>
              }
              keyExtractor={item => item._id}
              /> )
              : // Workouts
              isWorkoutsLoading ?
              <ActivityIndicator size = "large"/>
              :
              <FlatList
              data = {filteredWorkoutData}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={{fontSize:20, alignItems: 'center'}}>
                  No Workouts Found
                  </Text>
                </View>
              }
              style = {styles.boxContainer}
              renderItem={({item,index}) => (
              <WorkoutItem
                workout={item}
                title={item.title}
                description={item.description}
                location ={item.location}
                muscleGroups={item.muscleGroups}
                duration={item.duration} exercises={item.exercises}
                image={item.image} key={index}
                expandedWorkoutId = {expandedWorkoutId}
                setExpandedWorkoutId = {setExpandedWorkoutId}
              />)}
              />}
      </View>

      {/* Exercise Info Modal */}
      <View style={{flex: 1}}>
          <Modal
            isVisible = {isInfoPageVisible}
            coverScreen = {true}
            backdropColor = {globalState.theme.colorBackground}
            presentationStyle='fullScreen'
            transparent={false}
            >
            <View style={styles.exerciseInfoHeader}>
              <View style={styles.exerciseInfoTitleandDelete}>
              {selectedExerciseOwner == globalState.user?._id &&
                <View style={styles.exerciseInfoDeleteButton}>
                  {
                    // removes bug of delete icon showing even after deleting an exercise
                    masterExerciseData.some(exercise => exercise._id == selectedExercise._id) ? <TouchableOpacity onPress={deleteExercise}>
                      <AntDesign
                      name="delete"
                      size={30}
                      style={styles.deleteCustomExercise}
                      />
                    </TouchableOpacity> : null
                  }

                </View>
                }
                <View style={styles.exerciseInfoTitleContainer}>
                  <Text style={styles.exerciseInfoTitle(globalState.theme.colorText)}>{selectedExerciseTitle}</Text>
                </View>
              </View>
              <View style={styles.exerciseInfoCardImageContainer}>
                <Image  style={styles.exerciseInfoImage(globalState.theme.colorText)} src ={selectedExerciseImage}/>
              </View>
            </View>

            <View style={styles.exerciseInfoBody}>
              <ScrollView>
              <View style={styles.exerciseInfoDescriptionContainer}>
                <Text style={styles.exerciseInfoDescriptionTitle(globalState.theme.colorText)}>Description:</Text>
                <Text style={styles.exerciseInfoDescription(globalState.theme.colorText)}>{selectedExerciseDesc}</Text>
              </View>
              <View style={styles.exerciseInfoMuscleGroupsContainer}>
                <Text style={styles.exerciseInfoMuscleGroupsTitle(globalState.theme.colorText)}>Muscle Groups:</Text>
                <Text style={styles.exerciseInfoMuscleGroups(globalState.theme.colorText)}>{selectedExerciseMuscleGroups && selectedExerciseMuscleGroups.join(", ")}</Text>
              </View>

              <View style={styles.exerciseInfoOwnerContainer}>
                <Text style={styles.exerciseInfoOwnerTitle(globalState.theme.colorText)}>Exercise Owner:</Text>
                <Text style={styles.exerciseInfoOwner(globalState.theme.colorText)}>{getWorkoutOwner(selectedExercise)}
                </Text>
              </View>
              </ScrollView>
            </View>
              <View style={styles.modalCloseButton}>
                <TouchableOpacity  onPress={closeInfoModal}>
                  <View style={styles.closeInfoButtonContainer}>
                    <Text style={styles.closeText}>Close</Text>
                  </View>
                </TouchableOpacity>
              </View>
          </Modal>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: (theme) => {
    return {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      //borderColor: 'red',
      //borderWidth: '2px'
    }
  },
  discoverHeader: (color) => {
    return {
      backgroundColor: color
    }
  },
  exerciseInfoTitle:(color) => {
    return {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      textDecorationLine: 'underline',
      color: color
    }
  },
  exerciseInfoDescription:(color) => {
    return {
      color: color,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    }
  },

  exerciseInfoDescriptionTitle:(color) => {
    return {
      color: color,
      fontSize: 18,
      fontWeight: 'bold',
      textDecorationLine: 'underline'
    }
  },

  exerciseInfoTagsTitle:{
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  exerciseInfoMuscleGroupsTitle:(color)=>{
    return {
      fontSize: 18,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      color: color
    }
  },
  exerciseInfoOwnerTitle:(color) => {
    return {
      fontSize: 18,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      color: color
    }
  },
  exerciseInfoDescriptionContainer:{
    marginBottom: 0,
    marginTop: 0,
  },

  exerciseInfoMuscleGroupsContainer:{
    marginTop: 5
  },
  exerciseInfoOwnerContainer:{
    marginTop: 5
  },
  exerciseInfoTagsContainer:{
    marginBottom: 0,
    marginTop: 0,
    flex: .5
    },

  exerciseInfoMuscleGroups:(color) => {
    return {
      color: color,
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    }
  },
  exerciseInfoOwner:(color)=>{
    return {
      color: color,
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    }
  },
  exerciseInfoTags:{
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exerciseInfoTitleContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    flex: 1,
  },
  exerciseInfoHeader:{
    marginTop: "10%",
    flex: 1.5,
  },
  exerciseInfoTitleandDelete:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseInfoBody:{
    flex: 1.3,
    paddingTop: 20,
  },

  exerciseInfoCardImageContainer:{
    width: "100%",
    flex: 1,
    marginTop: 10,
  },

  exerciseInfoImage: (color) => {
    return {
      width: "100%",
      height: "100%",
      borderRadius: 22,
      borderWidth: 3,
      borderColor: color
    }
    
  },
  exerciseCardImageContainer:{
    position: 'absolute',
    left: 10,
    marginRight: 20,
    borderColor: 'black',
    borderWidth: .5,
    borderRadius: 20

  },

  exerciseInfoDeleteButton:{
    alignSelf: 'flex-start'
  },
  exerciseCardImage:{
    width: 60,
    height: 60,
    resizeMode: 'stretch', // can be changed to contain if needed
    borderRadius: 20,
  },
	deleteCustomExercise: {
		borderWidth: 2,
		borderRadius: 100,
	},
  workoutCardImageContainer: (theme) => {
    return {
      position: 'absolute',
      left: 10,
      top: 0,
      marginRight: 20,
      borderColor: theme.colorText,
      borderWidth: 1.5,
      borderRadius: 20
    }
  },


  workoutCardImage:{
    width: 90,
    height: 90,
    resizeMode: 'stretch', // can be changed to contain if needed
    borderRadius: 20,
  },

  workoutHeader:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 30,
  },

  workoutExerciseCardImageContainer: (theme) => {
    return {
      position: 'absolute',
      left: 10,
      marginRight: 20,
      borderColor: theme.colorBackground,
      borderWidth: 1.5,
      borderRadius: 20
    }
    
  },
  workoutExerciseCardImage:{
    width: 60,
    height: 60,
    resizeMode: 'stretch', // can be changed to contain if needed
    borderRadius: 20,
  },

  boxContainer:{
    flex: 1,
  },

  modalCloseButton:{
    alignItems: 'center',
  },

  closeInfoButtonContainer:{
    backgroundColor: 'white',
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 20,
    paddingHorizontal: 10,
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

  closeText:{
    fontWeight: 'bold',
    color: 'black',
    fontSize: 30,
    paddingHorizontal: 8,

  },
  openText:{
    fontWeight: 'bold',
    paddingTop: 30,
    paddingLeft: 10
  },
  modalBackground: (theme) => {
    return {
      backgroundColor: theme.colorBackground,
      flex: 1,
      justifyContent: 'space-between'
    }
  },
  expandableIndicatorContainer:{
    position: 'absolute',
    right: 10,
    bottom: 0,
  },
  expandableIndicator:{
    width: 15,
    height: 15,
  },
  filterOptions:{
    color: '#000',
    flex: 3,
  },
  filterImage:{
    width: 30,
    height: 30,
    marginTop: 25,
    marginLeft: 5,
  },

  selectedFilterLabels: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },

  selectedFilterContainers:{
    backgroundColor: '#2193BC'

  },

  filterLabels:{
    fontWeight: '500',
    fontSize: 18,
    color: 'black',
  },
  workoutItems: (theme) => {
    return {
      backgroundColor: theme.color2,
      color: "#333",
      fontWeight: "500",
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: 10,
      paddingBottom: 14,
      resizeMode: 'contain',
      flex: 1,
      margin: 1,
      shadowColor: "#000",
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 1,
      shadowRadius: 2
    }
    
 },
 workoutExerciseCard:(theme) => {
  return {
    backgroundColor: theme.color2,
    color: "#333",
    fontWeight: "500",
    justifyContent: 'center',
    textAlign: 'center',
    padding: .5,
    resizeMode: 'contain',
    flex: 1,
    margin: 1,
  }
},
  exerciseItems: (theme) => {
    return {
      backgroundColor: theme.color3,
      color: "#333",
      fontWeight: "500",
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      flex: 1,
      margin: 3,
      flexDirection: 'row',
      borderColor: 'black',
      borderWidth: .5,
      borderRadius: 15,
      // Can delete below if wanted
      shadowColor: "#000",
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 1,
      shadowRadius: 2
    }
   },
   exerciseCardText:{
    marginLeft: 100,
    width: "100%",
    alignItems: 'center',
    alignContent: 'center',
    flexShrink: 1,

   },

  workoutExerciseCardTextContainer:{
    alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
    marginLeft: 100,
   },

   exerciseCardTitle:{
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },

   workoutExerciseCardTitle:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
 },
   exerciseCardMuscleGroups:{
    fontSize: 12,
    fontWeight: 'bold',
    alignItems: 'center'
 },
  workoutCardText:{
    alignItems: 'center',
    marginLeft: 0,
    paddingTop: 15,
    textAlign: 'center',
  },

  workoutCardTitleContainer:{
    alignItems: 'center',
    marginLeft: 120,
    textAlign: 'center',
  },

  workoutCardTitle: (color) => {
    return {
      fontSize: 18,
      fontWeight: 'bold',
      color: color
    }    
 },

 scheduleWorkoutText:{
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',

},

deleteWorkoutText:{
  fontSize: 18,
  fontWeight: 'bold',
  alignItems: 'center',
  alignContent: 'center',
  textAlign: 'center',
  justifyContent: 'center'
},
   emptyList:{
    alignItems: 'center'
   },

  exerciseCardSets:{
    fontWeight: 'bold',
    fontSize: 13
  },
  workoutCardMuscleGroups: (color) => {
    return {
      fontWeight: 'bold',
      fontSize: 12,
      textAlign: 'center',
      marginVertical: 5,
      color: color
    }
  },
  workoutCardOwner: (color) => {
    return {
      fontWeight: 'bold',
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 5,
      color: color
    }
    
  },
   workoutTitle: (theme) => {
    return {
      fontWeight: 'bold',
      fontSize: 13,
      color: theme.colorText
    }
   },

   exerciseTitle:(theme) => {
    return {
      fontWeight: 'bold',
      fontSize: 13,
      color: theme.colorText
    }
 },

  workoutCardDescription: (color) => {
    return {
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
      marginVertical: 5,
      color: color
    }    
  },

   exerciseCardDescription:{
      fontWeight: 'bold',
      fontSize: 14
   },

   exerciseCardType:{
    fontWeight: 'bold',
    fontSize: 14
  },

  exerciseCardTags:{
    fontWeight: 'bold',
    fontSize: 12
  },

  workoutCardTags:{
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },

  workoutCardDuration: (color) => {
    return {
      fontWeight: 'bold',
      fontSize: 12,
      textAlign: 'center',
      color: color
    }
    

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
  },
  filtersContainer:{
    flex: 1,
    marginTop: "8%",
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
  },

  hidden:{
    opacity: 0,
    display: 'none'
  },

  discoverTitle:(color)=>{
    return {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 5,
      marginLeft: 10,
      color: color
    }
  },
  discoverSubtitle:{
    marginTop: 5,
    marginLeft: 10,
    color: 'gray'
  },
  discoverContainer: (color) => {
    return {
      backgroundColor: color,
      height: "72%",
    }
  },
  workoutExerciseContainer: (theme) => {
    return {
      backgroundColor: theme.color3,
      color: "#333",
      fontWeight: "500",
      paddingVertical: 15,
      alignSelf: 'stretch',
      margin: 2,
      flexDirection: 'row',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 15,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 1,
      shadowRadius: 2
    }
    
 },

 scheduleWorkoutButton:{
  backgroundColor: 'lightgreen',
  color: "#333",
  fontWeight: "500",
  paddingVertical: 15,
  alignSelf: 'stretch',
  margin: 2,
  borderColor: 'black',
  borderWidth: 2,
  borderRadius: 15,
  borderRadius: 20,
  shadowColor: "#000",
  shadowOffset: {width: 0, height: 0},
  shadowOpacity: 1,
  shadowRadius: 2
},


deleteWorkoutButton:{
  backgroundColor: 'red',
  color: "#333",
  fontWeight: "500",
  paddingVertical: 15,
  alignSelf: 'stretch',
  margin: 2,
  justifyContent: 'center',
  borderColor: 'black',
  borderWidth: 2,
  borderRadius: 15,
  borderRadius: 20,
  shadowColor: "#000",
  shadowOffset: {width: 0, height: 0},
  shadowOpacity: 1,
  shadowRadius: 2
},

  workoutExerciseCardContent:{
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
});
