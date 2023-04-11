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
    Switch,
    Alert,
    Modal
} from "react-native";
import React, { useEffect, useState } from "react";
import Checkbox from 'expo-checkbox';
import reactDom, { render } from "react-dom";
import Workouts from "../workout.js";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalState } from "../../GlobalState.js";
import API_Instance from "../../../backend/axios_instance.js"
import { AntDesign } from "@expo/vector-icons";
import { Header, SearchBar } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { duration } from "moment";
import {TimePicker} from 'react-native-simple-time-picker';

export default function ScheduleWorkout({ workout, updateWorkout, setCurrState }) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    // const [save, setSave] = useState(workout[0].save ? workout[0].save : false);
    const [globalState, updateGlobalState] = useGlobalState();
    const [modalVisible, setModalVisible] = useState(false);
    const [timeVal, setTimeVal]= useState({
		hours: 0,
		minutes: 0,
		seconds: 0
	})
    // console.log("every render: ", workout[0].save);

    // const [isReoccurring, setReoccurring] = useState(false);
    // const toggleSwitch = () => setReoccurring(previousState => !previousState);

    useEffect(() => {
        let temp = {...workout[0]};
        temp.recurrence = temp.recurrence ? temp.recurrence : false;
        temp.save = temp.save ? temp.save : false;
        updateWorkout([ temp ]);
    }, [])

    // useEffect(() => {
    //     let temp = {...workout[0]};
    //     temp.save = save;
    //     console.log("save change to: ",temp.save);
    //     updateWorkout([temp]);
    // }, [save])

    const showDatePicker = () => {
    	setDatePickerVisibility(true);
  	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleConfirm = (date) => {
        let temp = new Date(date).toString();
        let tmpwrkout = { ...workout[0] };
        tmpwrkout.scheduledDate = temp;
        updateWorkout([tmpwrkout]);
        console.log(tmpwrkout.scheduledDate);
        // globalState.workout[0].scheduledDate = temp;
        

		hideDatePicker();
	};

    return (
        <View style={styles.container}>
           <View style={styles.navButtonContainer}>
                <View style={{ backgroundColor: "#FF8C4B", flex: 1}}>
                     <TouchableOpacity 
                        style={{ flex:1, alignItems:"center", justifyContent: "center"}} 
                        onPress={() => {
                            setCurrState("BeginFinalizing");
                        }}>
                        <AntDesign size={useWindowDimensions().height * 0.08} name="leftcircle" color={"white"}/>
                    </TouchableOpacity>
                </View>

                <View style={{ alignSelf: "center", flex:1}}>
                    <TouchableOpacity 
                        style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#10B9F1" }} 
                        onPress={() => {
                            console.log(workout[0].scheduledDate);
                            if (workout[0].duration === 0) {
                                Alert.alert("Please fill in how long this workout will take roughly");
                            } /*else if(workout[0].location === ""){
                                Alert.alert("Please list where this workout will be at");
                            }*/ else if (!workout[0].scheduledDate) {
                                Alert.alert("Please pick when this workout will happen");
                            } else {
                                setCurrState("FinalizeReview");   
                            }
                            
                    }}>
                        <AntDesign size={useWindowDimensions().height * 0.08} name="rightcircle" color={"white"}/>
                    </TouchableOpacity>  
                </View>
                
            </View>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            
            <KeyboardAwareScrollView contentContainerStyle={{ flex:1, alignItems: "center", justifyContent:"flex-start"}}>
                <View style={{width: "70%", marginVertical: "10%"}}>
                    <Text style={styles.text}>Location:</Text>
                    <TextInput
                        // keyboardType="numeric"
                        placeholder="Home"
                        placeholderTextColor={"#808080"}
                        defaultValue={workout[0].location ? workout[0].location : ""}
                        style={styles.inputfield}
                        onChangeText={(text) => {
							let temp = {...workout[0]}
							temp.location = text;
                            updateWorkout([temp]);
					}}/> 
                </View> 
                <View style={{width: "70%", marginBottom: "10%"}}>
                    <Text style={styles.text}>Estimated duration:</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setModalVisible(!modalVisible);
                            setTimeVal({
                                hours: Math.floor(workout[0].duration / 60),
                                minutes: workout[0].duration % 60,
                                seconds: 0,
                            })
                        }}>
                        <View pointerEvents="none">
                            <TextInput
                                editable={false}
                                keyboardType="numeric"
                                placeholder="1 h"
                                placeholderTextColor={"#808080"}
                                defaultValue={workout[0].duration ? `${Math.floor(workout[0].duration / 60)}h ${workout[0].duration % 60}m` : null}
                                style={styles.inputfield}
                                onChangeText={(text) => {
                                    let temp = {...workout[0]}
                                    temp.duration = text;
                                    updateWorkout([temp]);
                            }} /> 
                        </View>
                    </TouchableOpacity>
                </View> 
                <View style={{ marginBottom: "10%" }}>
                    
                    <Text style={[styles.text, {fontSize: 18}]}>
                        {/* { toString(new Date(workout[0].scheduledDate)) } */}
                        {
                            //workout[0].scheduledDate && (new Date(workout[0].scheduledDate).toDateString() + " " + new Date(workout[0].scheduledDate).toLocaleTimeString())
                            workout[0].scheduledDate && (new Date(workout[0].scheduledDate).toLocaleDateString('en-us',{
                              weekday: 'long',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric'
                            }))
                        }
                    </Text>
                   <Button title="Choose a Day and Time" onPress={showDatePicker} /> 
                </View>
                
                <Text style={styles.text}>Reccurring Weekly? {"\t"}
                    <Switch
                        value={workout[0].recurrence}
                        onValueChange={(val) => {
                            let temp = { ...workout[0] }
							temp.recurrence = val;
                            updateWorkout([temp]);
                        }}/>
                </Text>
                <View style={{flexDirection: 'row', marginTop: 40, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[styles.text, {marginRight: 10}]}>Save to Profile?</Text>
                    <Switch
                        value={workout[0].save}
                        onValueChange={(val) => {
                            let temp = { ...workout[0] }
							temp.save = val;
                            updateWorkout([temp]);
                        }}/> 
                </View>
            </KeyboardAwareScrollView>
            <Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
				Alert.alert('Modal has been closed.');
				setModalVisible(!modalVisible);
				}}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<TimePicker 
							value={timeVal} 
							onChange={(val) => {setTimeVal(val)}} 
							pickerShows={["hours", "minutes"]}
                            hoursUnit={"h"}
							minutesUnit={"m"}
                            minutesInterval={5}/>
						<TouchableOpacity
						style={[styles.button, styles.buttonClose]}
						onPress={() => {
							setModalVisible(!modalVisible);
							let temp = {...workout[0]};
							temp.duration = 60 * timeVal.hours + timeVal.minutes
							updateWorkout([temp]);
						}}>
						<Text style={styles.textStyle}>Done</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopWidth: 1.5,
        backgroundColor: 'white',
        flexDirection: 'column-reverse',
        // justifyContent:"space-between"
    },
    navButtonContainer: {
        height: '15%',
        display: "flex", 
        flexDirection: "row",
        borderWidth: 1, 
        justifyContent: "space-evenly"
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
        // width:"85%",
    },
    text: {
		fontSize: 20,
		fontWeight: 'bold'
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
    centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	  },
    modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
		  width: 0,
		  height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})