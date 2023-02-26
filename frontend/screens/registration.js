import {
  StyleSheet,
  Button,
  Text,
  View,
  //TextInput,
  Pressable } from 'react-native';
import React, {useState, useRef} from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import config from '../../config';
import {useGlobalState} from '../../GlobalState.js';
import {TextInput} from 'react-native-paper';

const baserUrl = config.API_URL + config.PORT + '/';
const allGood = true;

export default function Register(props) {
  // defining state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [error, setError] = useState('');
  const [showPW1, setShowPW1] = useState(true);
  const [showPW2, setShowPW2] = useState(true);
  const [globalState, updateGlobalState] = useGlobalState();
  // error states
  const [FNError, setFNError] = useState(false);
  const [LNError, setLNError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [PW1Error, setPW1Error] = useState(false);
  const [PW2Error, setPW2Error] = useState(false);
  // defining refs
  const firstNameRef = useRef(0);
  const lastNameRef = useRef(0);
  const emailRef = useRef(0);
  const passwordRef = useRef(0);
  const passwordConfRef = useRef(0);

  const registerHandler = () => {
    const emptyFirstname = firstName === '';
    const emptyLastname = lastName === '';
    const emptyEmail = email === '';
    const emptyPassword = password === '';
    const emptyPasswordConf = passwordConf === '';

    // if all empty fields, one message is sufficient
    if(emptyFirstname && emptyLastname && emptyEmail && emptyPassword && emptyPasswordConf){

      //firstNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      //lastNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      //emailRef.current.setNativeProps({style: styles.inputerrorstyle});
      //passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
      //passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});
      setFNError(true);
      setLNError(true);
      setEmailError(true);
      setPW1Error(true);
      setPW2Error(true);

      setError("Please enter all fields!");
      return;
    }

    let tempError = '';

    // -----first name -----//
    if (emptyFirstname){
      //firstNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      setFNError(true);
      tempError += '- Please provide a first name!\n';
    }
    else setFNError(false)//firstNameRef.current.setNativeProps({style: styles.inputstyle});

    // -----last name -----//
    if (emptyLastname) {
      //lastNameRef.current.setNativeProps({style: styles.inputerrorstyle});
      setLNError(true);
      tempError += "- Please provide a last name!\n";
    }
    else setLNError(false)//lastNameRef.current.setNativeProps({style: styles.inputstyle});

    // -------email----------//
    if (emptyEmail){
      //emailRef.current.setNativeProps({style: styles.inputerrorstyle});
      setEmailError(true);
      tempError += "- Please provide an email address!\n";
    }
    // make sure email field matches a regex
    else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      //emailRef.current.setNativeProps({style: styles.inputerrorstyle});
      setEmailError(true);
      tempError += '- Email is not in proper format!\n'
    }
    else setEmailError(false)//emailRef.current.setNativeProps({style: styles.inputstyle});

    //----password and confirmation------//
    //passwordRef.current.setNativeProps({style: styles.inputstyle});
    //passwordConfRef.current.setNativeProps({style: styles.inputstyle});
    setPW1Error(false);
    setPW2Error(false);

    if(emptyPassword && emptyPasswordConf){
        setPW1Error(true)//passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
        setPW2Error(true)//passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});
        tempError += '- Please provide both a password\nand password confirmation!\n';
    }
    else if (emptyPassword) {
        setPW1Error(true)//passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
        tempError += "- Please provide a password!\n";
    }
    else if (emptyPasswordConf) 
    {
        setPW2Error(true)//passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});
        tempError += '- Please enter the confirmed password!\n';
    }
    else if (password !== passwordConf)
    {
        setPW2Error(true)//passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});
        tempError += '- Passwords do not match!\n';
    }
    else if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password))
    {
        setPW1Error(true)//passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
        setPW2Error(true)//passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});
        tempError += '- Passwords must be at least 8 characters\nand have at least one uppercase letter,\none lowercase letter, and one number.';
    }

    // if every test passes, error is none
    if(tempError != ''){
      setError(tempError)
      return;
    }else{
      setError('');
    }

    axios.post(baserUrl + 'users/register', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    })
    .then((response) => {
        if (response.status == 200)
        {
            setError('');
            updateGlobalState("user", response.data);
            // no need for friends state to render bc itll be empty on account creation

            props.navigation.navigate("home");
        }
    })
    .catch((e) => {
        if (e.response) setError(e.response.data.Error)
        if (e.response.status == 501)
        {
            setPW1Error(true)//passwordRef.current.setNativeProps({style: styles.inputerrorstyle});
            setPW2Error(true)//passwordConfRef.current.setNativeProps({style: styles.inputerrorstyle});
        }
        else if(e.response.status == 502)
        {
            setEmailError(true)//emailRef.current.setNativeProps({style: styles.inputerrorstyle});
        }
    });
  }

  //render(){
    return  (
      <KeyboardAwareScrollView 
        extraHeight={100}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"  
        bounces={false}
      >
        <View style={{flex:1}}>
          <Text style={styles.heading} >Tell us a little about yourself</Text>
          <View style={styles.form}>
            <Text style={styles.text}>First Name</Text>
            <TextInput style={styles.inputstyle} 
            mode="outlined"
            dense={true}
            activeOutlineColor='#10B9F1'
            outlineColor={FNError == true ? '#fb9357' : '#C4C4C4'}
            placeholder="John"
            returnKeyType="next"
            ref={firstNameRef}
            keyboardType="next"
            onSubmitEditing={() => {lastNameRef.current.focus();}}
            onChangeText={(text)=> setFirstName(text)}/>
            
            <Text style={styles.text}>Last Name</Text>
            <TextInput style={styles.inputstyle} 
            mode="outlined"
            dense={true}
            activeOutlineColor='#10B9F1'
            outlineColor={LNError == true ? '#fb9357' : '#C4C4C4'}
            placeholder="Smith"
            returnKeyType="next"
            ref={lastNameRef}
            onSubmitEditing={() => {emailRef.current.focus();}}
            onChangeText={(text)=>setLastName(text)}/>

            <Text style={styles.text}>Email Address</Text>
            <TextInput style={styles.inputstyle} 
            mode="outlined"
            dense={true}
            activeOutlineColor='#10B9F1'
            outlineColor={emailError == true ? '#fb9357' : '#C4C4C4'}
            placeholder="user@server.com"
            returnKeyType="next"
            ref={emailRef}
            onSubmitEditing={() => {passwordRef.current.focus();}}
            onChangeText={(text)=> setEmail(text)}/>

            <Text style={styles.text}>Password</Text>
            <TextInput style={styles.inputstyle} 
            mode="outlined"
            dense={true}
            activeOutlineColor='#10B9F1'
            outlineColor={PW1Error == true ? '#fb9357' : '#C4C4C4'}
            placeholder="***"
            secureTextEntry={showPW1}
            right={ showPW1 ? 
              <TextInput.Icon icon="eye" onPress={()=>setShowPW1(!showPW1)} />
              :
              <TextInput.Icon icon="eye-off" onPress={()=>setShowPW1(!showPW1)} />
            }
            left={<TextInput.Icon />}
            returnKeyType="next"
            autoCapitalize='none'
            ref={passwordRef}
            onSubmitEditing={() => {passwordConfRef.current.focus();}}
            onChangeText={(text)=> setPassword(text)}/>

            <Text style={styles.text}>Confirm Password</Text>
            <TextInput style={styles.inputstyle} 
            mode="outlined"
            dense={true}
            activeOutlineColor='#10B9F1'
            outlineColor={PW2Error == true ? '#fb9357' : '#C4C4C4'}
            placeholder="***"
            secureTextEntry={showPW2}
            right={ showPW2 ? 
              <TextInput.Icon icon="eye" onPress={()=>setShowPW2(!showPW2)} />
              :
              <TextInput.Icon icon="eye-off" onPress={()=>setShowPW2(!showPW2)} />
            }
            left={<TextInput.Icon />}
            returnKeyType="done"
            autoCapitalize='none'
            ref={passwordConfRef}
            onChangeText={(text)=> setPasswordConf(text)}/>
          </View>

          <View style={{
            width:'90%',
            alignSelf: 'center',
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
      flex:1
  },
  heading:{
      color: '#2B2B2B',
      fontFamily: 'HelveticaNeue-Bold',
      fontSize: 36,
      textAlign: 'center',
      paddingVertical: 10,
      marginTop: 60
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
      //borderWidth: 1,
      //borderColor: '#C4C4C4',
      width: '70%',
      padding:8,
      marginVertical:5,
      borderRadius: '10rem'
  },
  inputerrorstyle:{
    textAlign: 'center',
    //borderWidth: 1,
    //borderColor: '#fb9357',
    width: '70%',
    padding:8,
    marginVertical:5,
    borderRadius: '10rem'
},
  form:{
    margin: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: 'column',
    alignItems: 'center',
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
