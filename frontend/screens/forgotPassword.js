import {
  StyleSheet,
  Button,
  Text,
  View,
  //TextInput,
  Pressable,
  Alert      } from 'react-native';
import React, {useState, useRef} from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import API_Instance from '../../backend/axios_instance';
import {useGlobalState} from '../GlobalState.js';
import {TextInput} from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';


export default function ForgotPassword({navigation}) {
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState('');

    const submitHandler = () => {
      if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        setError(true);
        setErrorMsg('Email must be of proper format before attempting to send reset password link.\n( username@domain.ext )\n');
        return;
      }else{
        setError(false);
        setErrorMsg('');
      }

      // need to use API to send email
      API_Instance.post('users/forgotpassword/email/send/to',
      {
        email: email
      }).catch((e)=>{
        console.log("email doesn't exist in DB");
      });

      Alert.alert("Reset Password Link Sent If Email Was Verified",`Please log in to ${email} and use the link sent to reset your password`,
  [{text:"Back to Login", onPress: () => navigation.goBack()}]);
    }

    return  (
      <KeyboardAwareScrollView 
        extraHeight={100}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"  
        bounces={false}
      >
        <View style={{flex:0.5, textAlign: "center", backgroundColor: "#10B9F1", width: "100%", paddingTop: '10%'}}>
          <Text style={styles.heading}>Password Reset</Text>
          <View style={styles.subHeader}>
            <Text style={styles.text}>Provide the email of your account so that we can send you the password reset link.</Text>
            <Text style={styles.text}>This process shouldn't take too long.</Text>
          </View>
        </View>

        <View style={{flex:1, paddingTop: '20%', width:'100%'}}>
          <Text style={styles.error}>{errorMsg}</Text>
          <TextInput
          placeholder="username@domain.ext"
          label="Email"
          style={styles.inputstyle}
          theme={{ colors: { onSurfaceVariant: '#C4C4C4'} }}
          mode="outlined"
          dense={true}
          activeOutlineColor='#10B9F1'
          returnKeyType="done"
          keyboardType="email-address"
          outlineColor={error == true ? '#fb9357' : '#C4C4C4'}
          onSubmitEditing={()=>submitHandler()}
          onChangeText={(text)=>setEmail(text.toLowerCase())}
          />
          <View style={styles.buttoncontainer}>
            <Pressable
              style={styles.button}
              onPress={()=>{submitHandler()}}>
              <Text style={styles.buttontext}>Reset Password</Text>
            </Pressable>
            <View style ={{margin:5}}>
              <Button 
                title="Back to Login"
                color="#C4C4C4"
                accessibilityLabel="Back to Login"
                onPress={() => {
                  navigation.goBack()
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
      paddingTop: '10%',
      width: '80%',
      alignSelf: 'center',
      flex:1
  },
  heading:{
      color: '#2B2B2B',
      fontFamily: 'HelveticaNeue-Bold',
      fontSize: 36,
      textAlign: 'center',
      paddingVertical: 10,
      marginTop: 60,
      color: 'white'
  },
  subHeader:{
    paddingTop: '10%'
  },
  text:{
      fontFamily: 'HelveticaNeue',
      fontWeight: 400,
      fontSize: 16,
      fontWeight: 'normal',
      color: 'black',
      textAlign: 'center',
      paddingVertical: 5,
      color:"white"
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
      width: '80%',
      padding:8,
      marginVertical:5,
      fontSize:16,
      alignSelf:'center',
      textAlign: 'center'
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
