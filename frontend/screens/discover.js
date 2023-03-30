import { useFocusEffect } from '@react-navigation/native';
import React, {useState, useEffect, useCallback} from 'react';
import {Image, Switch, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList, Alert , Animated} from 'react-native';
import { SearchBar, ListItem} from 'react-native-elements';
import Toggle from "react-native-toggle-element";
import Modal from "react-native-modal";
import API_Instance from '../../backend/axios_instance';
import SelectBox from 'react-native-multi-selectbox';
import {xorBy} from 'lodash';
import { useGlobalState } from '../GlobalState.js';
import { useIsFocused } from '@react-navigation/native';

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

export default function DiscoverPage({navigation}) {

  const isFocused = useIsFocused();

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
  
  const [globalState, updateGlobalState] = useGlobalState();
  
  // For Exercise Info Page
  const [selectedExerciseTitle, setSelectedExerciseTitle] = useState();
  const [selectedExerciseDesc, setSelectedExerciseDesc] = useState();
  const [selectedExerciseMuscleGroups, setSelectedExerciseMuscleGroups] = useState();
  const [selectedExerciseImage, setSelectedExerciseImage] = useState();

  // All items resulting from search and filter
  const [filteredExerciseData, setFilteredExerciseData] = useState([]);
  // All items from DB from search with only ownerID
  const [masterExerciseData, setMasterExerciseData] = useState([]);
  
  // All items resulting from search and filter
  const [filteredWorkoutData, setFilteredWorkoutData] = useState([]);
  // All items from DB from search with only ownerID
  const [masterWorkoutData, setMasterWorkoutData] = useState([]);

  const [exerciseSearch, setExerciseSearch] = useState('');
  const [workoutSearch, setWorkoutSearch] = useState('');

  // will be used for Activity Indicator
  const [isExercisesLoading, setIsExercisesLoading] = useState(true);
  const [isWorkoutsLoading, setIsWorkoutsLoading] = useState(true);

  const [exerciseList, setExercises] = useState([]);
  const [workoutList, setWorkouts] = useState([]);

  useEffect(() => {
    if(isFocused){
      exercisesList();
      workoutsList();
    }
  }, [isFocused]);

  const ExerciseItem = ({title, description, type, muscleGroups, tags, image}) => (
    <View style={styles.exerciseItems}>
      <View style={styles.exerciseCardImageContainer}>
        <Image style={styles.exerciseCardImage} src = {image}/>
      </View> 
      <View style={styles.exerciseCardText}>
        <Text style={styles.exerciseCardTitle}>{title}</Text>
        {/* <Text style={styles.exerciseCardDescription}>{description}</Text> */}
        <Text style={styles.exerciseCardType}>Type: {type}</Text>
        {/* <Text style={styles.exerciseCardTags}>Tags: {tags.join(", ")}</Text> */}
        {/* <Text style={styles.exerciseCardMuscleGroups}>Muscle Groups: {muscleGroups.join(", ")}</Text> */}
      </View>
    </View>
  );

  const WorkoutItem = ({workout, title, description, muscleGroups, duration, exercises, image}) => {
    const [expanded, setExpanded] = useState(false);
    const handlePress = () => {
      setExpanded(!expanded);
    };
    function addWorkout(workout){
      // console.log("Adding Workout", workout.title);
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
                  workoutsList();
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
    <View style={styles.workoutItems}>
    <TouchableOpacity onPress={handlePress} activeOpacity=".4">
      <View style={styles.workoutHeader}>
        <View style={styles.workoutCardImageContainer}>
          <Image style={styles.workoutCardImage} src = {image}/>
        </View>
        <View style={styles.workoutCardTitleContainer}>
          <Text style={styles.workoutCardTitle}>{title}</Text>
        </View>
        <View style={styles.expandableIndicatorContainer}>
          <Image source ={ require("../../assets/expandable.png")}
                  style={[
                    styles.expandableIndicator,
                    expanded ? {transform: [{rotate: "180deg"}]} : {},
                    ]} />
        </View>
      </View>

        {expanded && 
          <View>
            <View style={styles.workoutCardText}>
              <Text style={styles.workoutCardDescription}>{description}</Text>
              <Text style={styles.workoutCardDuration}>Duration: {duration} min</Text>
              <Text style={styles.workoutCardMuscleGroups}>Muscle Groups: {muscleGroups.join(", ")}</Text>
            </View>
            <TouchableOpacity onPress={()=>
              addWorkout(workout)}>
              <View style={styles.scheduleWorkoutButton}>
                <Text style={styles.scheduleWorkoutText}>SCHEDULE WORKOUT</Text>
              </View>
            </TouchableOpacity>
          </View>
          }
      
        {expanded &&
            exercises.map((exercise) => (
              <View style = {styles.workoutExerciseCard} key={exercise._id}>
              <TouchableOpacity onPress={()=>{
                    // Commenting out openExerciseInfo doesn't break it 
                    openExerciseInfo(exercise);
                    setSelectedExerciseTitle(exercise.title);
                    setSelectedExerciseDesc(exercise.description);
                    setSelectedExerciseMuscleGroups(exercise.muscleGroups);
                    setSelectedExerciseImage(exercise.image);
                    showInfoModal();  
              }
              }>             
              <View style = {styles.workoutExerciseContainer}>
                <View style = {styles.workoutExerciseCardContent}>
                  <View style={styles.workoutExerciseCardImageContainer}>
                    <Image style={styles.workoutExerciseCardImage} src = {exercise.image}/>
                  </View> 
                  <View style={styles.workoutExerciseCardTextContainer}>
                    <Text style={styles.workoutExerciseCardTitle}>{exercise.title}</Text>
                    <Text>{exercise.exerciseType}</Text>
                    {/*{exercise.exerciseType === 'SETSXREPS' && (
                      <Text>
                        {exercise.sets} sets x {exercise.reps} reps
                      </Text>
                    )}
                    {exercise.exerciseType === 'AMRAP' && <Text>As many reps as possible in {exercise.time} seconds!</Text>}
                    {exercise.exerciseType === 'CARDIO' && <Text>Push for {exercise.duration} seconds!</Text>} */}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            </View>
            ))}

          {expanded && workout.owner == globalState.user._id &&
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

  const exercisesList = async()=> {
      API_Instance.post('exercises/search',
    {
      // muscleGroupsSrch: selectedMuscleGroupsFilter.map(a => a.item),
      // exerciseTypeSrch : selectedTypeFilter.map(a => a.item),
      // equipmentSrch : selectedEquipmentFilter.map(a => a.item),
      ownerId : globalState.user._id,
      // searchStr : exerciseSearch
    },   
    {
      headers: {
        'authorization': `BEARER ${globalState.authToken}`,
        'Content-Type':'multipart/form-data'
      }
    })
    .then((response) => {
      if (response.status == 200){
        setFilteredExerciseData(response.data);
        setMasterExerciseData(response.data);
        exercisesLoaded();
      }
    })
    .catch((e) => {
      console.log(e); 
    })
  }

  const workoutsList = async()=> {
    API_Instance.post('workouts/search',
    {
      // muscleGroupsStr: selectedMuscleGroupsFilter,
      // exerciseTypeSrch : selectedTypeFilter,
      // equipmentFilters : selectedEquipmentFilter
      ownerId: globalState.user._id
    },   
    {
      headers: {
        'authorization': `BEARER ${globalState.authToken}`,
        // 'Content-Type':'multipart/form-data'
      }
    })
    .then((response) => {
      if (response.status == 200) {
        // console.log(JSON.stringify(response.data, null, 2));
        setFilteredWorkoutData(response.data);
        setMasterWorkoutData(response.data);
        workoutsLoaded();
      }
    })
    .catch((e) => {
      console.log(e);  
    })
}

  const toggleFiltersShowing = () =>{
    setFiltersVisible(!areFiltersVisible);
    // filter on masterList
    if(areFiltersVisible){
      if(toggleValue){
        // we are in exercises
        setFilteredExerciseData(filterExercises(exerciseSearch));
      }else{
        setFilteredWorkoutData(filterWorkouts(workoutSearch));
      }
    }
  }

  const exercisesLoaded = async () => {
      setIsExercisesLoading(false);
      // console.log("Changing Exercises Activity Indicator");
  }
  
  const workoutsLoaded = async () => {
    setIsWorkoutsLoading(false);
    // console.log("Changing Workouts Activity Indicator");
  }

  function onMultiChangeEquipment() {
    return (item) => setEquipmentFilter(xorBy(selectedEquipmentFilter, [item], 'id'))
  }

  function onMultiChangeMuscleGroups() {
    return (item) => setMuscleGroupsFilter(xorBy(selectedMuscleGroupsFilter, [item], 'id'))
  }

  function onMultiChangeType() {
    return (item) => {setTypeFilter(xorBy(selectedTypeFilter, [item], 'id'));}
  }

  function exerciseTagFound(exTag, searchTags){
    for(const term of searchTags){
      if(exTag.toLowerCase().includes(term.toLowerCase())){
        //console.log(term, 'found in', exTag)
        return true;
      }
    }
    return false;
  }

  function tryFilterExercise(exercise, searchTags, equipmentTags, muscleGroupVals, selectedType){
    let success = true;

    // type
    if(selectedType.length > 0){
      //console.log(selectedType)
      let matches = false;

      for(const type of selectedType){
        if(type.toLowerCase() == exercise.exerciseType.toLowerCase()){
          matches = true;
          break;
        }
      }

      success = success && matches;
    }

    // for all muscle groups if they exist or are included
    if(success && muscleGroupVals.length > 0){
      let matches = false;
      for(const mg of exercise.muscleGroups){
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

    // equipment
    if(success && equipmentTags.length > 0){
      //console.log("et",equipmentTags)
      let matches = false;
      for(const tag of exercise.tags){
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
    // if no tags or search terms then return masterlist
    if(searchVals.length == 0 && equipmentTags.length == 0 && muscleGroupVals.length == 0 && selectedType.length == 0){
      //console.log('no filter but still ate');
      return masterExerciseData;
    }

    // for all exercises in masterlist
    for (const exercise of masterExerciseData)
    {
      if (tryFilterExercise(exercise, searchVals, equipmentTags, muscleGroupVals, selectedType)){
        retList.push(exercise);
      }
    }

    return retList;
  }

  function tryFilterWorkout(workout, searchVals, equipmentTags, muscleGroupVals){
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

  

  const filterWorkouts = (term) => {
    let retList = [];
    let searchVals =  term ? term.split(' ') : [];
    let equipmentTags = [...selectedEquipmentFilter.map(a=>a.item)];
    let muscleGroupVals = [...selectedMuscleGroupsFilter.map(a=>a.item)];
    // if no tags or search terms then return masterlist
    if(searchVals.length == 0 && equipmentTags.length == 0 && muscleGroupVals.length == 0){
      //console.log('no filter but still ate');
      return masterWorkoutData;
    }

    // for all exercises in masterlist
    for (const workout of masterWorkoutData)
    {
      if (tryFilterWorkout(workout, searchVals, equipmentTags, muscleGroupVals)){
        retList.push(workout);
      }
    }

    return retList;
  }

  const openExerciseInfo = (item) => {
    return (<View>
      <Text style={{fontSize: 20}}>title: {item.title}</Text>
    </View>)
  }

  function showInfoModal() {
    setInfoPageVisible(true);
  }

  function closeInfoModal() {
    setInfoPageVisible(false);
  }

return (
    <SafeAreaView style = {{flex: 1, backgroundColor: "white"}}>
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
                    leftComponent = {<Text style={styles.workoutTitle}>Workouts</Text>}
                    rightComponent = {<Text style={styles.exerciseTitle}>Exercises</Text>}
                    trackBar={{
                      width: 170,
                      height: 50,
                      //radius: 40,
                    //borderWidth: -1,
                    // borderColor: "black",
                    activeBackgroundColor: "#E5DAE7",
                    // activeBackgroundColor: "#FEE2CF",
                    inActiveBackgroundColor: "#88CAE7",
                    }}
                    trackBarStyle={{
                        borderColor: 'black',
                        borderWidth: 2.5,
                        height: 54,
                        width: 174
                  
                    }}
                    thumbButton={{
                      width: 77,
                      height: 50,
                      //radius: 30,
                      // borderWidth: 1,
                      activeBackgroundColor: "#34A5D5",
                      inActiveBackgroundColor: "#BFBCC8"
                      // inActiveBackgroundColor: "#FAD5A5"
                      }}
                      
                    />
              </View>
              <View style={styles.filters}>
                <TouchableOpacity onPress={toggleFiltersShowing}>
                  
                <View style={styles.modalContainer}></View>
                    <Image source = {require("../../assets/filter_icon.png")}
                      style={styles.filterImage}
                    />
                {/* <Text style={styles.openText}>Open Filters</Text> */}
                  <Modal 
                    isVisible = {areFiltersVisible}
                    coverScreen = {true}
                    //backdropOpacity = "1"
                    backdropColor = "white"
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
                data={toggleValue ? filteredExerciseData : workoutList} 
                lightTheme
                round
                // onChangeText={updateSearch}
                autoCorrect={false}
                autoCapitalize="none"
                autoComplete='off'

                // below line will make keyboard go away by
                // tapping away from the input only if it's in a scrollview
                keyboardShouldPersistTaps='handled'

                value={(toggleValue ? exerciseSearch : workoutSearch)}
                onChangeText = {(toggleValue ? 
                  (
                    (text) => {
                  setExerciseSearch(text);
                  setFilteredExerciseData(filterExercises(text));
                  // below is for filters
                  //setExerciseSearch(text);
                  }
                  ) :  (
                    (text) => {
                      setWorkoutSearch(text);
                      setFilteredWorkoutData(filterWorkouts(text));
                    }
                  )
                )}
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
      
              {toggleValue ? 
              //Exercises
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
                    openExerciseInfo(item);
                    setSelectedExerciseTitle(item.title)
                    setSelectedExerciseDesc(item.description);
                    setSelectedExerciseMuscleGroups(item.muscleGroups);
                    setSelectedExerciseImage(item.image);
                    showInfoModal();  
                }}>

                  <ExerciseItem title={item.title} 
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
              renderItem={({item,index}) => 
                (
                <TouchableOpacity onPress={()=>{
                    // setSelectedWorkoutTitle(item.title);
                    // setSelectedExerciseDuration(item.duration);
              }}>
                
                <WorkoutItem 
                workout={item}
                title={item.title} 
                description={item.description}
                location ={item.location} 
                muscleGroups={item.muscleGroups} 
                duration={item.duration} exercises={item.exercises}
                image={item.image} key={index}

                /></TouchableOpacity>
                )
              }

              />}
      </View>

      {/* <View style={styles.discoverContainer}>
              {toggleValue ? <FlatList
              data = {exerciseDummyData}
              style = {styles.boxContainer}
              renderItem = 
              {({item}) => <TouchableOpacity onPress={()=>
              Alert.alert(item.Name)}><Text style={styles.exerciseItems}>{item.id}{". "}{item.title}</Text></TouchableOpacity>}
              /> : <FlatList
              data = {workoutDummyData}
              style = {styles.boxContainer}
              renderItem = {({item}) => <TouchableOpacity onPress={()=>
              Alert.alert(item.Name)}><Text style={styles.workoutItems}>{item.id}{". "}{item.Name}</Text></TouchableOpacity>}
              />}
      </View> */}
      <View style={styles.infoModal}>
          <Modal 
            isVisible = {isInfoPageVisible}
            coverScreen = {true}
            //backdropOpacity = "1"
            backdropColor = "white"
            presentationStyle='fullScreen'
            transparent={false}
            >

            <SafeAreaView style={styles.exerciseInfoHeader}>
              <View style={styles.exerciseInfoTitleContainer}>
                <Text style={styles.exerciseInfoTitle}>{selectedExerciseTitle}</Text>
              </View>
              <View style={styles.exerciseInfoCardImageContainer}>
                <Image  style={styles.exerciseInfoImage} src ={selectedExerciseImage}/>
              </View>
            </SafeAreaView>

            <SafeAreaView style={styles.exerciseInfoBody}>

              <View style={styles.exerciseInfoDescriptionContainer}>
                <Text style={styles.exerciseInfoDescriptionTitle}>Description:</Text>
                <Text style={styles.exerciseInfoDescription}>{selectedExerciseDesc}</Text>
              </View>
              <View style={styles.exerciseInfoMuscleGroupsContainer}>
                <Text style={styles.exerciseInfoMuscleGroupsTitle}>Muscle Groups:</Text>
                <Text style={styles.exerciseInfoMuscleGroups}>{selectedExerciseMuscleGroups && selectedExerciseMuscleGroups.join(", ")}</Text> 
              </View>
            
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeInfoModal}>
                  <View style={styles.closeButtonContainer}>
                    <Text style={styles.closeText}>Close</Text>
                  </View>
                </TouchableOpacity>

            </SafeAreaView>
          </Modal>
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  exerciseInfoTitle:{
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  exerciseInfoDescription:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  exerciseInfoDescriptionTitle:{
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },

  exerciseInfoTagsTitle:{
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  exerciseInfoMuscleGroupsTitle:{
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  exerciseInfoDescriptionContainer:{
    marginBottom: 0,
    marginTop: 0,
    // flex: .5,
  },

  exerciseInfoMuscleGroupsContainer:{
    marginTop: 5
    // flex: .5
  },

  exerciseInfoTagsContainer:{
    marginBottom: 0,
    marginTop: 0,
    flex: .5
    },

  exerciseInfoMuscleGroups:{
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exerciseInfoTags:{
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exerciseInfoTitleContainer:{
    // borderColor: 'black',
    // borderRadius: "20rem",
    // backgroundColor: 'white',
    overflow: 'hidden',
    // borderWidth: 3,
    // bottom: -375,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 1,
    //width: "35%",
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    flex: .15,
    flexShrink: 1
  },
  exerciseInfoHeader:{
    flex: 1.5,
    alignItems: 'center',
  },
  exerciseInfoBody:{
    flex: 1,
    
    // alignItems: 'center',
  },
  
  exerciseInfoCardImageContainer:{
    // position: 'absolute',
    // borderColor: 'black',
    // borderWidth: 2,
    // borderRadius: 22,
    // marginTop: 0,
    width: "100%",
    flex: .78,
    marginTop: 10,
    // marginBottom: 10,
    // resizeMode: 'contain'
  },

  exerciseInfoImage:{
    width: "100%",
    height: "100%",
    resizeMode: 'contain',
    borderRadius: 22,
    borderWidth: 3,
    // borderRadius: 22,
  },
  exerciseCardImageContainer:{
    position: 'absolute',
    left: 10,
    //paddingVertical: 5,
    marginRight: 20,
    borderColor: 'black',
    borderWidth: 1.5,
    borderRadius: 20

  },
  exerciseCardImage:{
    width: 60,
    height: 60,
    resizeMode: 'stretch', // can be changed to contain if needed
    borderRadius: 20,
  },

  workoutCardImageContainer:{
    position: 'absolute',
    left: 10,
    top: 0,
    marginRight: 20,
    borderColor: 'black',
    borderWidth: 1.5,
    borderRadius: 20
  },


  workoutCardImage:{
    width: 90,
    height: 90,
    resizeMode: 'stretch', // can be changed to contain if needed
    borderRadius: 20,
  },

  workoutHeader:{
    // resizeMode: 'contain',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 30,
  },

  workoutExerciseCardImageContainer:{
    position: 'absolute',
    left: 10,
    marginRight: 20,
    borderColor: 'black',
    borderWidth: 1.5,
    borderRadius: 20
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
  toggleandfilters:{
    flexDirection: 'row'
  },
  modalCloseButton:{
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    bottom: "2%",
    width: "100%",
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
    borderRadius: 20,
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
    borderRadius: 15,
    flex: 1
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
    // paddingHorizontal: 8,
    //paddingVertical: 10,
    marginTop: 25,
    marginLeft: 5,
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

  filterLabels:{
    fontWeight: '500',
    fontSize: 18,
    color: 'black',
  },
  workoutItems:{
    backgroundColor: '#E5DAE7',
    // backgroundColor: "#FEE2CF",
    color: "#333",
    fontWeight: "500",
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 14,
    resizeMode: 'contain',
    //height: Dimensions.get('window') / numColumns,
    flex: 1,
    margin: 1,
    // overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 2
 },
 workoutExerciseCard:{
  backgroundColor: '#E5DAE7',
  color: "#333",
  fontWeight: "500",
  justifyContent: 'center',
  textAlign: 'center',
  padding: .5,
  resizeMode: 'contain',
  //height: Dimensions.get('window') / numColumns,
  flex: 1,
  margin: 1,
  // overflow: "hidden",
  // shadowColor: "#000",
  // shadowOffset: {width: 0, height: 0},
  // shadowOpacity: 1,
  // shadowRadius: 2
},
  exerciseItems:{
      backgroundColor: '#67BBE0',
      color: "#333",
      fontWeight: "500",
      // alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      // textAlign: 'center',
      paddingVertical: 12, 
      paddingHorizontal: 12,
      flex: 1,
      margin: 1.8,
      flexDirection: 'row',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 15,
      // Can delete below if wanted
      shadowColor: "#000",
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 1,
      shadowRadius: 2
   },
   exerciseCardText:{
    marginLeft: 100,
    width: "100%",
    // paddingLeft: 0,
    alignItems: 'center',
    alignContent: 'center',
    // justifyContent: 'center',
    // flex: 1,
    flexShrink: 1,
    
   },

  workoutExerciseCardTextContainer:{
    alignItems: 'center',
    // width: "100%",
    textAlign: 'center',
    alignContent: 'center',
    marginLeft: 100,
    // flex: 1,
    // flexShrink: 1,
    // flexWrap: 'wrap',

   },

   exerciseCardTitle:{
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },

   workoutExerciseCardTitle:{
    fontSize: 16,
    fontWeight: 'bold',
    // flexShrink: 1,
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

  workoutCardTitle:{
    fontSize: 18,
    fontWeight: 'bold',
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
  workoutCardMuscleGroups:{
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',     
    marginVertical: 5,
  },
   workoutTitle:{
      fontWeight: 'bold',
      fontSize: 13,
   },
   
   exerciseTitle:{
    fontWeight: 'bold',
    fontSize: 13,
 },
 
  workoutCardDescription:{
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 5,
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

  workoutCardDuration:{
    fontWeight: 'bold',
    fontSize: 12,
    // paddingBottom: 10,
    textAlign: 'center',
  
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
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    paddingVertical: 5,
    marginVertical: 5,
  },

  hidden:{
    opacity: 0,
  },

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
    backgroundColor: 'white',
    height: "72%",
    // flex: 2,
  },
  discoverHeaderContainer:{
    backgroundColor: 'white',
    //flex: 1,
  },
  workoutExerciseContainer:{
    backgroundColor: '#67BBE0',
    color: "#333",
    fontWeight: "500",
    // alignContent: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    // // width: "140%",
    // paddingTop: 12,
    paddingVertical: 15,
    // paddingHorizontal: 12, 
    //height: Dimensions.get('window') / numColumns,
    // flex: 1,
    // flexDirection: 'row',
    alignSelf: 'stretch',
    margin: 2,
    // flex: 1,
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 2
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
    // alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // textAlign: 'center',
    
    flex: 1,
    flexDirection: 'row',
  },
});
