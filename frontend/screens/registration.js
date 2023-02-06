import { StyleSheet, Button, Text, Image, View, SafeAreaView, TextInput, Pressable } from 'react-native';
import React, {useState, useRef} from 'react';
import {ScrollView, KeyboardAvoidingView} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import config from '../../config';
import {useGlobalState} from '../../GlobalState.js';

const baserUrl = config.API_URL + config.PORT + '/';
const allGood = true;

//class Register extends React.Component{
  /*constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      error: ''
    }
    this.firstNameRef = React.createRef();
    this.lastNameRef = React.createRef();
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
    this.passwordConfirmRef = React.createRef();
    this.registerHandler = this.registerHandler.bind(this);
  }*/
export default function Register(props) {
  // defining state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [error, setError] = useState('');
  const [globalState, updateGlobalState] = useGlobalState();

  // defining refs
  const firstNameRef = useRef(0);
  const lastNameRef = useRef(0);
  const emailRef = useRef(0);
  const passwordRef = useRef(0);
  const passwordConfRef = useRef(0);

  const registerHandler = () => {
    //const emptyFirstname = this.state.firstName === '';
    //const emptyLastname = this.state.lastName === '';
    //const emptyEmail = this.state.email === '';
    //const emptyPassword = this.state.password === '';
    //const emptyPasswordConf = this.state.passwordConfirmation === '';

    const emptyFirstname = firstName === '';
    const emptyLastname = lastName === '';
    const emptyEmail = email === '';
    const emptyPassword = password === '';
    const emptyPasswordConf = passwordConf === '';

    // if all empty fields, one message is sufficient
    if(emptyFirstname && emptyLastname && emptyEmail && emptyPassword && emptyPasswordConf){
      //this.firstNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      //this.lastNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      //this.emailRef.current.setNativeProps({style: styles.inputerrorstyle});
      //this.passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
      //this.passwordConfirmRef.current.setNativeProps({style: styles.inputerrorstyle});

      firstNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      lastNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      emailRef.current.setNativeProps({style: styles.inputerrorstyle});
      passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
      passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});

      //this.setState({error: "Please enter all fields!"});
      setError("Please enter all fields!");
      return;
    }

    let tempError = '';

    // -----first name -----//
    if (emptyFirstname){
      //this.firstNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      firstNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      tempError += '- Please provide a first name!\n';
    }
    else firstNameRef.current.setNativeProps({style: styles.inputstyle});
    //else this.firstNameRef.current.setNativeProps({style: styles.inputstyle});

    // -----last name -----//
    if (emptyLastname) {
      //this.lastNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      lastNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      tempError += "- Please provide a last name!\n";
    }
    else lastNameRef.current.setNativeProps({style: styles.inputstyle});
    //else this.lastNameRef.current.setNativeProps({style: styles.inputstyle});

    // -------email----------//
    if (emptyEmail){
      //this.emailRef.current.setNativeProps({style: styles.inputerrorstyle});
      emailRef.current.setNativeProps({style: styles.inputerrorstyle});
      tempError += "- Please provide an email address!\n";
    }
    // make sure email field matches a regex
    else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email/*this.state.email*/)){
      //this.emailRef.current.setNativeProps({style: styles.inputerrorstyle});
      emailRef.current.setNativeProps({style: styles.inputerrorstyle});
      tempError += '- Email is not in proper format!\n'
    }
    else emailRef.current.setNativeProps({style: styles.inputstyle});
    //else this.emailRef.current.setNativeProps({style: styles.inputstyle});

    //----password and confirmation------//
    //this.passwordRef.current.setNativeProps({style: styles.inputstyle});
    //this.passwordConfirmRef.current.setNativeProps({style: styles.inputstyle});
    passwordRef.current.setNativeProps({style: styles.inputstyle});
    passwordConfRef.current.setNativeProps({style: styles.inputstyle});

    if(emptyPassword && emptyPasswordConf){
      //this.passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
      passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
      //this.passwordConfirmRef.current.setNativeProps({style: styles.inputerrorstyle});
      passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});
      tempError += '- Please provide both a password and password confirmation!\n';
    }
    else if (emptyPassword) {
      //this.passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
      passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
      tempError += "- Please provide a password!\n";
    }
    else if (emptyPasswordConf) 
    {
        //this.passwordConfirmRef.current.setNativeProps({style: styles.inputerrorstyle});
        passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});
        tempError += '- Please enter the confirmed password!\n';
    }
    else if (password !== passwordConf/*this.state.password !== this.state.passwordConfirmation*/)
    {
        //this.passwordConfirmRef.current.setNativeProps({style: styles.inputerrorstyle});
        passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});
        tempError += '- Passwords do not match!\n';
    }
    else if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password/*this.state.password*/))
    {
        //this.passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
        passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
        //this.passwordConfirmRef.current.setNativeProps({style: styles.inputerrorstyle});
        passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});
        tempError += '- Passwords must be at least 8 characters and have at least one uppercase letter, one lowercase letter, and one number.';
    }

    // if every test passes, error is none
    if(tempError != ''){
      //this.setState({error: error});
      setError(tempError)
      return;
    }else{
      //this.setState({error: ''});
      setError('');
    }

    axios.post(baserUrl + 'users/register', {
        //firstName: this.state.firstName,
        //lastName: this.state.lastName,
        //email: this.state.email,
        //password: this.state.password
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    })
    .then((response) => {
        if (response.status == 200)
        {
            //this.setState({error: ''});
            setError('');
            //this.props.navigation.navigate("home", {user: response.data});
            updateGlobalState("user", response.data);

            props.navigation.navigate("home");
        }
    })
    .catch((e) => {
        if (e.response) setError(e.response.data.Error)//this.setState({error: e.response.data.Error});
        if (e.response.status == 501)
        {
            //this.passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
            passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
            //this.passwordConfirmRef.current.setNativeProps({style: styles.inputerrorstyle});
            passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});
        }
        else if(e.response.status == 502)
        {
            //this.emailRef.current.setNativeProps({style: styles.inputerrorstyle});
            emailRef.current.setNativeProps({style: styles.inputerrorstyle});
        }
    });
  }

  //render(){
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
            ref={firstNameRef}
            keyboardType="next"
            onSubmitEditing={() => {lastNameRef.current.focus();}}
            onChangeText={(text)=> setFirstName(text)}/>
            
            <Text style={styles.text}>Last Name</Text>
            <TextInput style={styles.inputstyle} 
            placeholder="Smith"
            returnKeyType="next"
            ref={lastNameRef}
            onSubmitEditing={() => {emailRef.current.focus();}}
            onChangeText={(text)=>setLastName(text)}/>

            <Text style={styles.text}>Email Address</Text>
            <TextInput style={styles.inputstyle} 
            placeholder="user@server.com"
            returnKeyType="next"
            ref={emailRef}
            onSubmitEditing={() => {passwordRef.current.focus();}}
            onChangeText={(text)=> setEmail(text)}/>

            <Text style={styles.text}>Password</Text>
            <TextInput style={styles.inputstyle} 
            placeholder="***"
            secureTextEntry={true}
            returnKeyType="next"
            autoCapitalize='none'
            ref={passwordRef}
            onSubmitEditing={() => {passwordConfRef.current.focus();}}
            onChangeText={(text)=> setPassword(text)}/>

            <Text style={styles.text}>Confirm Password</Text>
            <TextInput style={styles.inputstyle} 
            placeholder="***"
            secureTextEntry={true}
            returnKeyType="done"
            autoCapitalize='none'
            ref={passwordConfRef}
            onChangeText={(text)=> setPasswordConf(text)}/>
          </View>

          <View style={{
            width:'90%',
            alignSelf: 'center'
            }}>
            <Text style={styles.error}>{error}</Text>
          </View>
          
          <View style={styles.buttoncontainer}>
            <Pressable
              style={styles.button}
              onPress={()=>{registerHandler()}}>
              <Text style={styles.buttontext}>Register</Text>
            </Pressable>
            <View style ={{margin:5}}>
              <Button 
                title="Back to Login"
                color="#C4C4C4"
                accessibilityLabel="Back to Login"
                onPress={() => {
                  props.navigation.navigate("login")
              }}/>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  //}
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
  inputerrorstyle:{
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#fb9357',
    width: '70%',
    padding:8,
    marginVertical:10,
    borderRadius: '10rem'
},
  form:{
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

//export default Register; 
