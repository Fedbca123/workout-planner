import {
	StyleSheet,
	Button,
	Text,
	Image,
	View,
  Dimensions
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState, useRef } from "react";
import { useGlobalState } from "../GlobalState.js";
import {TextInput} from 'react-native-paper';
import API_Instance from "../../backend/axios_instance";
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../AuthProvider';

export default function Login({navigation}) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);
	const [globalState, updateGlobalState] = useGlobalState();
	const passwordRef = useRef(0);
	const { setIsLoggedIn } = React.useContext(AuthContext);

  const imageWidth = Dimensions.get('window').width;

	// functions
  	const emailInputHandler = (enteredEmail) => {
		setEmail(enteredEmail);
	};

	const passwordInputHandler = (enteredPassword) => {
		setPassword(enteredPassword);
	};

	React.useEffect(() => {
		const fetchData = async () => {
			if (globalState.authToken)
				await SecureStore.setItemAsync("authKey", globalState.authToken);
			if (globalState.user)
				await SecureStore.setItemAsync("userId", globalState.user._id);
		}
		fetchData();
	}, [globalState])

	const loginHandler = () => {
		API_Instance
			.post("users/login", {
				email: email,
				password: password,
			})
			.then((response) => {
		
				if (response.status == 200) {
					setError("");
					updateGlobalState("user", response.data.user);
          			updateGlobalState("authToken", response.data.authToken);
					if (response.data.user.isAdmin) {
						navigation.navigate("admin");
					} else {
						setIsLoggedIn(true);
					}
				}
			})
			.catch((e) => {
				if (e.response) setError(e.response.data.Error);
			});
	};
	
	const backDoorHandler = (e, p) => {
		API_Instance
			.post("users/login", {
				email: e,
				password: p,
			})
			.then((response) => {
				if (response.status == 200) {
					updateGlobalState("user", response.data.user);
          			updateGlobalState("authToken", response.data.authToken);
					setError("");
					if (response.data.user.isAdmin)
						navigation.navigate("admin");
					else
						setIsLoggedIn(true);
				}
			})
			.catch((e) => {
				if (e.response) setError(e.response.data.Error);
			});
	};

	return (
		<KeyboardAwareScrollView
			extraHeight={100}
			contentContainerStyle={styles.container(globalState.theme.colorBackground)}
			keyboardShouldPersistTaps="handled"
			bounces={false}>
			<Image
				style={[styles.image, {width: imageWidth, flex: .8}]}
				source={require("../../assets/workout.png")}
      />

		<View style={{flex:1, alignItems: 'center', width: '100%'}}>
			<View style={styles.textcontainer}>
				<Text style={styles.heading(globalState.theme.colorText)}> Welcome! </Text>
				<Text style={styles.text}>
					{" "}
					You will have everything you need to reach your personal
					fitness goals - for free!{" "}
				</Text>
			</View>
      
        <Button
        title="BACKDOOR"
        onPress={() =>
          backDoorHandler("Test@gmail.com", "Password1")}/>
       
      {/*code will break at the end to home bc name can't be rendered}
      */}
      
	<View style={styles.buttoncontainer}>
      <Text style={styles.error}> {error} </Text>
        <View style={{display: 'flex',height:60, width: '70%', marginVertical: 2}}>
        <TextInput
				  	mode='outlined'
            			autoCapitalize="none"
				  	outlineColor="black"
				  	activeOutlineColor="#10B9F1"
            			autoComplete='off'
            			dense={true}
            			autoCorrect={false}
				  	style={styles.inputstyle}
				  	theme={{ colors: { onSurfaceVariant: '#C4C4C4'} }}
				  	placeholder="username@server.com"
				  	label="Email"
				  	returnKeyType="next"
				  	onSubmitEditing={() => {
				  		passwordRef.current.focus();
				  	}}
				  	right={email != "" ? <TextInput.Icon /> : null}
				  	blurOnSubmit={false}
				  	keyboardType="email-address"
				  	onChangeText={(text) => emailInputHandler(text)}/>
        </View>
				
				<View style={{display: 'flex',height:60, width:'70%', marginVertical: 2}}>
        <TextInput
					mode='outlined'
          			dense={true}
					outlineColor="black"
					activeOutlineColor="#10B9F1"
          			autoComplete='off'
            		autoCorrect={false}
					style={styles.inputstyle}
					theme={{ colors: { onSurfaceVariant: '#C4C4C4'} }}
					label="Password"
					placeholder="***"
					returnKeyType="go"
					autoCapitalize="none"
					ref={passwordRef}
					//onFocus={()=>setPWFocus(true)}
					//onBlur={()=>setPWFocus(false)}
					secureTextEntry={showPassword}
					value={password}
					onChangeText={(text) => {
					passwordInputHandler(text);
					}}
					onSubmitEditing={() => {
						passwordRef.current.blur();
						loginHandler();
					}}
					right={showPassword ? 
						<TextInput.Icon icon="eye" onPress={()=>setShowPassword(!showPassword)}/>
						:
						<TextInput.Icon icon="eye-off" onPress={()=>setShowPassword(!showPassword)}/>
				}/>
        </View>
				
        
			</View>

	<View style={{flexDirection: 'column',width: '50%', flex: .8}}>
		<View style={{}}>
          <Button
			title="Login"
			color="#10B9F1"
			onPress={() => loginHandler()}
		/>
        </View>

        <View style={{}}>
          <Button
			title="Create an account"
			color="#C4C4C4"
			accessibilityLabel="Create an account"
			onPress={() => {
				setError("");
				navigation.navigate("registration");
			}}/>
        </View>
				
        <View style={{}}>
          <Button
			title="Forgot Password?"
			color="#10B9F1"
			accessibilityLabel="Forgot Password?"
			onPress={() => {
			navigation.navigate("forgot-password");
			}}/>
        </View>
			</View>
		</View>
	</KeyboardAwareScrollView>
	);
}

const styles = StyleSheet.create({
	container: (color) => {
    return {
      flexDirection: "column",
		  flex: 1,
		  alignItems: "center",
		  justifyContent: "center",
		  backgroundColor: color,
    }
		
	},
	textcontainer: {
		flex: 0.45,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
		width: "90%",
		//borderWidth: 1,
	},
	buttoncontainer: {
    	//marginBottom: 15,
		alignItems: "center",
		justifyContent: 'flex-start',
		//paddingTop: 5,
		width: "100%",
    //borderWidth:1
	},
	heading: (color) => {
    return {
      color: color,
      ...Platform.select({
        ios: {
          fontFamily: 'HelveticaNeue-Bold'
        },
        android: {
          fontFamily: "Roboto"
        },
        
      }),
		  fontSize: 36,
		  textAlign: "center",
    }
  },
	text: {
		...Platform.select({
      ios: {
        fontFamily: 'HelveticaNeue'
      },
      android: {
        fontFamily: "Roboto"
      },
    }),
		// fontFamily: "HelveticaNeue",
		fontWeight: 400,
		fontSize: 16,
		fontWeight: "normal",
		color: "#C4C4C4",
		textAlign: "center",
	},
	image: {
		top: 0,
    	marginBottom: 5,
	},
	login: {
		backgroundColor: "#10B9F1",
	},
	inputstyle: {
		//display: 'flex',
		//height: 40,
		//textAlign: "center",
		//width: "70%",
		padding: 8,
		justifyContent: 'center',
		textAlign:'auto'
	},
	error: {
		textAlign: "center",
		color: "#fb9357",
		fontSize: 16,
	},
});
