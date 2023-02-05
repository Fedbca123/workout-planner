import { 
    StyleSheet, 
    Button, 
    Text, 
    Image, 
    View, 
    TextInput,
    KeyboardAvoidingView,
    ScrollView
  } from 'react-native';
import React, {useState, useRef} from 'react';
import axios from 'axios';
import config from '../../config';
import {useGlobalState} from '../../GlobalState.js';
const baseUrl = config.API_URL + config.PORT + '/';

export default function App(props) {
//class Login extends React.Component {
    //constructor (state and such)
    //constructor(props) {
    //    super(props)
    //    this.state = {
    //        email: '',
    //        password: '',
    //        error: '',
    //    }
    //    this.passwordRef = React.createRef();
    //    // bind all functions to class
    //    this.emailInputHandler = this.emailInputHandler.bind(this);
    //    this.passwordInputHandler = this.passwordInputHandler.bind(this);
    //    this.loginHandler = this.loginHandler.bind(this);
    //}

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [globalState, updateGlobalState] = useGlobalState();
    const passwordRef = useRef(0);
      
    // functions
    const emailInputHandler = (enteredEmail) => {
        //this.setState({email: enteredEmail});
        setEmail(enteredEmail);
    }
      
    const passwordInputHandler = (enteredPassword) =>{
        //this.setState({password: enteredPassword});
        setPassword(enteredPassword);
      }

    const loginHandler = () => {
        axios.post(baseUrl + "users/login", {
            email: email,
            password: password  
          //email: this.state.email,
            //password: this.state.password
        })
        .then((response) => {
            if (response.status == 200)
            {
                //this.setState({error: ''});
                setError('');
                updateGlobalState("user", response.data)
                //this.props.navigation.navigate("home",{user: response.data});
                props.navigation.navigate("home",{user: response.data});
            }
        })
        .catch((e) => {
            //if (e.response) this.setState({error: e.response.data.Error});
            if (e.response) setError(e.response.data.Error);
          });
    }

    //render() {
        return (
            <ScrollView
                bounces={false}
                contentContainerStyle={styles.container}
                >
                <KeyboardAvoidingView
                    behavior = {"position"/*Platform.OS === "ios" ? "padding" : "height"*/}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 5}>
                    <Image style={styles.image}
                        source={require('../../assets/workout.png')} />
                    <View style={styles.textcontainer}>
                        <Text style = {styles.heading}> Welcome! </Text>
                        <Text style = {styles.text}> You will have everything you need to reach your personal fitness goals - for free! </Text>
                    </View>
    
                    <View style={styles.buttoncontainer}>
                        <Text style = {styles.error}> {error} </Text>

                        <TextInput style={styles.inputstyle} 
                            placeholder="Email"
                            returnKeyType="next"
                            onSubmitEditing={() => {passwordRef.current.focus();}}
                            blurOnSubmit={false}
                            keyboardType="email-address"
                            onChangeText={(text) => emailInputHandler(text)}/>
    
                        <TextInput style={styles.inputstyle} 
                            placeholder="Password"
                            returnKeyType="go"
                            autoCapitalize='none'
                            ref={passwordRef}
                            secureTextEntry
                            onChangeText={(text) => {passwordInputHandler(text)}}
                            onSubmitEditing={()=> {
                              passwordRef.current.blur()
                              loginHandler()
                            }}/>
    
                        <Button
                            title="Login"
                            color="#10B9F1"
                            // expecting line below to turn into authentication or page switching soon enough //
                            onPress={() => loginHandler()}
                            // onPress={() => {
                            //     this.state.error = '';
                            //     this.props.navigation.navigate("calendar");
                            //   }}
                            />
    
                        <Button 
                            title="Create an account"
                            color="#C4C4C4"
                            accessibilityLabel="Create an account"
                            onPress={() => {
                              //this.state.error = '';
                              setError('');
                              //this.props.navigation.navigate("registration");
                              props.navigation.navigate("registration");
                            }}/>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView> 
        )
    //}
}
      
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textcontainer: {
        flex: .8,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
    },
    buttoncontainer:{
        flex: 1,
        alignItems: 'center',
        paddingTop: 10,
        width: '100%'
    },
    heading:{
        color: '#2B2B2B',
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 36,
        textAlign: 'center',
        paddingBottom: 5,
    },
    text:{
        fontFamily: 'HelveticaNeue',
        fontWeight: 400,
        fontSize: 16,
        fontWeight: 'normal',
        color: '#C4C4C4',
        textAlign: 'center',
    },
    image: {
        top: 0,
        marginBottom: 0,
    },
    login: {
        backgroundColor: '#10B9F1',
    },
    inputstyle:{
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#C4C4C4',
        width: '70%',
        padding:8,
        marginVertical:2
    },
    error: {
        textAlign: 'center',
        color: '#fb9357',
        fontSize: 16,
    }
});
      
//export default Login;