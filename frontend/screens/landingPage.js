import { StyleSheet, Button, TouchableOpacity, Text, Image, View, SafeAreaView, TextInput } from 'react-native';
import React from 'react';
import reactDom from 'react-dom';
import axios from 'axios';
import config from '../../config';
import {useGlobalState} from '../../GlobalState.js';

const baseUrl = config.API_URL + config.PORT + '/';

export default function LandingPage(props) {
//class LandingPage extends React.Component{
    /*
    constructor(props){
      super(props);
      this.state={
        firstName:props.route.params.user.firstName,
        lastName:props.route.params.user.lastName,
        scheduledWorkouts: props.route.params.user.scheduledWorkouts
      }
      this.handleScratchPress = this.handleScratchPress.bind(this);
      this.handleTemplatePress = this.handleTemplatePress.bind(this);
      this.loadCurrentDayWorkoutStatus = this.loadCurrentDayWorkoutStatus.bind(this);
    }
    */

    const [globalState, updateGlobalState] = useGlobalState();

    const handleScratchPress = () => {
        console.log("Scratch Button Pressed");
        // Nav Link here
    }
    const handleTemplatePress = () => {
        console.log("Template Button Pressed");
        // Nav Link here
    }
    
    const loadCurrentDayWorkoutStatus = () => {
      // logic to define whether a workout exists today or not
      return "no workout scheduled today"
    }
    
    //componentWillMount(){
    // could do a call through axios to get user info for each render.
    // this would be a lot of API calls though I think.
    // either way this is something to consider and discuss but for now we have loaded info
    //}
    
    //render(){
      return  (
        <View style={styles.container}>
          <View style={styles.Header}>
            <Text style={styles.HeaderText}>You have {loadCurrentDayWorkoutStatus()}</Text>
          </View>

          <View style={{marginTop: 30}}>
              <Text style={styles.bodyHeader}>Create a Workout from</Text>
          </View>

          <View style={styles.CreateWorkoutCntnr}>
            <TouchableOpacity onPress={this.handleScratchPress}>
              <View style={styles.CreateWorkoutBttnsContainer}>
                <Text style={styles.CreateWorkoutBttns}>Scratch</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleTemplatePress}>
              <View style={styles.CreateWorkoutBttnsContainer}>
                <Text style={styles.CreateWorkoutBttns}>Template</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.BodyContainer}>
            <Text style={styles.bodyHeader}>Your Saved Workouts</Text>
            {/* Logic to define how to load the saved workouts */}
            <View style={styles.workoutsContainer}>
            </View>
          </View>
        </View>    
    )
    //}
    
    
}

const styles = StyleSheet.create({
    HeaderText:{
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 40,
    },
    HeaderContainer:{
      alignItems: 'center'
    },
    CreateWorkoutCntnr:{
        flexDirection: 'row',
        alignSelf: 'center'
    },
    container:{
        flex: 1,
        backgroundColor: 'white'
    },
    bodyHeader:{
      fontSize: 18,
      fontWeight: 'bold',
      paddingLeft: 20
    },
    BodyContainer:{
        flex: 1,
    },
    Text:{
        fontSize: 20,
        textAlign: 'center',
    },
    BoldText:{
        fontWeight: 'bold',
    },
    CreateWorkoutBttns:{
        color: 'black',
        fontWeight: 'bold',
        fontSize: 23,
    },
    CreateWorkoutBttnsContainer:{
        alignItems: 'center',
        backgroundColor: '#E0F0FE',
        margin: 30,
        padding: 15,
        borderRadius: '10rem',
        //flex: 0.5,
    },
    CreateWorkoutText:{
        fontFamily: 'HelveticaNeue',
        fontWeight: 400,
        fontSize: 12,
        fontWeight: 'normal',
        color: '#C4C4C4',
        textAlign: 'center',
    },
    workoutsContainer:{
        backgroundColor: '#D8D8D8',
        marginTop: 5,
        borderRadius: '15rem',
        flex: 1,
    },
    space:{
        width: 50,
        height: 20,
    }
});

//export default LandingPage; 