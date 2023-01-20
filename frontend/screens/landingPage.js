import { StyleSheet, Button, TouchableOpacity, Text, Image, View, SafeAreaView, TextInput } from 'react-native';
import React from 'react';
import reactDom from 'react-dom';
import axios from 'axios';
import config from '../../config';
const baseUrl = config.API_URL + config.PORT + '/';

//const LandingPage = (props) => {
class LandingPage extends React.Component{
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

    handleScratchPress(){
        console.log("Scratch Button Pressed");
        // Nav Link here
    }
    handleTemplatePress(){
        console.log("Template Button Pressed");
        // Nav Link here
    }
    
    loadCurrentDayWorkoutStatus(){
      // logic to define whether a workout exists today or not
      return "no workout scheduled today"
    }
    
    //componentWillMount(){
    // could do a call through axios to get user info for each render.
    // this would be a lot of API calls though I think.
    // either way this is something to consider and discuss but for now we have loaded info
    //}
    
    render(){
      return  (
        <View style={styles.HeaderContainer}>
          <Text style={styles.Text}>Hello, {this.state.firstName} {this.state.lastName}</Text>
          <Text style={styles.Text}>You have {this.loadCurrentDayWorkoutStatus()}</Text>
          <View>
              <Text style={styles.HeaderText}>Create a Workout From</Text>
          </View>
          <View style={styles.CreateWorkoutCntnr}>
            <View style={styles.CreateWorkoutBttnsContainer}>
              <TouchableOpacity onPress={this.handleScratchPress}>
                <Text style={styles.CreateWorkoutBttns}>Scratch</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.CreateWorkoutBttnsContainer}>
              <TouchableOpacity onPress={this.handleTemplatePress}>
                <Text style={styles.CreateWorkoutBttns}>Template</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.BodyContainer}>
            <Text style={styles.HeaderText}>Your Saved Workouts</Text>
            {/* Logic to define how to load the saved workouts */}
          </View>
        </View>    
    )
    }
    
    
}

const styles = StyleSheet.create({
    HeaderText:{
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 30,
    },
    CreateWorkoutCntnr:{
        flexDirection: 'row',
        
        //flex: 1,
        //paddingVertical: 12,
        //margin: 15,
        //justifyContent: 'space-between',
        //paddingHorizontal: 10,
        //alignItems: 'center',
        //paddingTop: 10,
        //width: '100%'
    },
    HeaderContainer:{
        flex: 1,
        marginTop: 10,
        //alignItems:"center",
        //justifyContent: "center",
        //backgroundColor: "white",
        //flexDirection: 'column',
       
    },
    BodyContainer:{
        flex: 1,
        //backgroundColor: "white",
        //flexDirection: 'column',
        //alignItems:"center",
        //justifyContent: "center"
    },
    Text:{
        fontSize: 20,
        textAlign: 'center',
    },
    BoldText:{
        fontWeight: 'bold',
    },
    CreateWorkoutBttns:{
        //flex: 1,
        //margin: 10,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 25,
        //paddingTop: 10,
    },
    CreateWorkoutBttnsContainer:{
        //flex: 1,
         flexDirection: 'row',
        backgroundColor: '#E0F0FE',
        margin: 30,
        padding: 15,
        
        //paddingHorizontal: 10,
        //alignItems: 'center',
        // paddingTop: 10,
        //width: '100%'
    },
    CreateWorkoutText:{
        fontFamily: 'HelveticaNeue',
        fontWeight: 400,
        fontSize: 12,
        fontWeight: 'normal',
        color: '#C4C4C4',
        textAlign: 'center',
    },
    space:{
        width: 50,
        height: 20,
    }
});

export default LandingPage; 