import { StyleSheet, Button, Text, Image, View, SafeAreaView, TextInput, Pressable } from 'react-native';
import React from 'react';
import {ScrollView, KeyboardAvoidingView} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { API_URL, PORT } from "@env";
const baserUrl = API_URL + PORT + '/';

class Register extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      error: ''
    }
    this.lastNameRef = React.createRef();
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
    this.passwordConfirmRef = React.createRef();
    this.registerHandler = this.registerHandler.bind(this);
  }

  registerHandler () {
    if (this.state.password !== this.state.passwordConfirmation)
    {
        this.setState({error: 'Passwords do not match!'});
        return;
    }

    axios.post(baserUrl + 'users/register', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.lastName,
        password: this.state.password
    })
    .then((response) => {
        if (response.status == 200)
        {
            this.setState({error: ''});
            this.props.navigation.navigate("landingPage");
        }
    })
    .catch((e) => {
        if (e.response) this.setState({error: e.response.data.Error});
    });
  }

  render(){
    return  (
      <KeyboardAwareScrollView 
        extraHeight={100}
        contentContainerStyle={styles.container}>
        <View style={{flex:1}}>
          <Text style={styles.heading} >Tell us a little about yourself</Text>
          <View style={styles.form}>
            <Text style={styles.text}>First Name</Text>
            <TextInput style={styles.inputstyle} 
            placeholder="John"
            returnKeyType="next"
            keyboardType="email-address"
            onSubmitEditing={() => {this.lastNameRef.current.focus();}}
            onChangeText={(text)=>this.setState({firstName:text})}
            /*onChangeText={usernameInputHandler}*//>
            
            <Text style={styles.text}>Last Name</Text>
            <TextInput style={styles.inputstyle} 
            placeholder="Smith"
            returnKeyType="next"
            ref={this.lastNameRef}
            onSubmitEditing={() => {this.emailRef.current.focus();}}
            onChangeText={(text)=>this.setState({lastName:text})}/>

            <Text style={styles.text}>Email Address</Text>
            <TextInput style={styles.inputstyle} 
            placeholder="user@server.com"
            returnKeyType="next"
            ref={this.emailRef}
            onSubmitEditing={() => {this.passwordRef.current.focus();}}
            onChangeText={(text)=>this.setState({email:text})}/>

            <Text style={styles.text}>Password</Text>
            <TextInput style={styles.inputstyle} 
            placeholder="***"
            returnKeyType="next"
            ref={this.passwordRef}
            onSubmitEditing={() => {this.passwordConfirmRef.current.focus();}}
            onChangeText={(text)=>this.setState({password:text})}/>

            <Text style={styles.text}>Confirm Password</Text>
            <TextInput style={styles.inputstyle} 
            placeholder="***"
            returnKeyType="done"
            ref={this.passwordConfirmRef}
            onChangeText={(text)=>this.setState({passwordConfirmation:text})}/>
          </View>
          <Text style={styles.error}>{this.state.error}</Text>
          <View style={styles.buttoncontainer}>
            <Pressable
              style={styles.button}
              onPress={()=>{this.registerHandler()}}>
              <Text style={styles.buttontext}>Register</Text>
            </Pressable>
            <Button 
              title="Return to Login"
              color="#C4C4C4"
              accessibilityLabel="Return to Login"
              onPress={() => {
                this.props.navigation.navigate("login")
              }}/>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
  },
  textcontainer: {
      flex: .8,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
  },
  buttoncontainer:{
      alignItems: 'center',
      paddingTop: 10,
      width: '100%',
      alignSelf: 'center',
      //borderColor: 'black',
      //borderWidth: 1
  },
  heading:{
      color: '#2B2B2B',
      fontFamily: 'HelveticaNeue-Bold',
      fontSize: 36,
      textAlign: 'center',
      paddingVertical: 20,
      marginTop: 75
  },
  text:{
      fontFamily: 'HelveticaNeue',
      fontWeight: 400,
      fontSize: 16,
      fontWeight: 'normal',
      color: 'black',
      textAlign: 'center',
  },
  image: {
      top: 0,
      marginBottom: 0,
  },
  login: {
      borderWidth:1,
      borderColor: 'black',
      color: 'white'
  },
  inputstyle:{
      textAlign: 'center',
      borderWidth: 1,
      borderColor: '#C4C4C4',
      width: '70%',
      padding:8,
      marginVertical:10,
      borderRadius: '10rem'
  },
  form:{
    /*borderRadius: '10rem',
    borderWidth: 1,
    borderColor: 'black',*/
    margin: 'auto',
    paddingVertical: 20,
    paddingHorizontal: 5,
    flexDirection: 'column',
    alignItems: 'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: '10rem',
    elevation: 20,
    backgroundColor: "#10B9F1",
    width: '100%'
  },
  buttontext: {
    color: 'white',
    fontFamily: 'HelveticaNeue',
    fontWeight: 400,
    fontSize: 16,
    fontWeight: 'normal',
  },
  error: {
    textAlign: 'center',
    color: '#fb9357',
    fontSize: 16,
}
});

export default Register; 