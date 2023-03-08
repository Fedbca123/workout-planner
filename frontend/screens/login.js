import {
	StyleSheet,
	Button,
	Text,
	Image,
	View
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
			contentContainerStyle={styles.container}
			keyboardShouldPersistTaps="handled"
			bounces={false}>
			<Image
				style={styles.image}
				source={require("../../assets/workout.png")}/>
			<View style={styles.textcontainer}>
				<Text style={styles.heading}> Welcome! </Text>
				<Text style={styles.text}>
					{" "}
					You will have everything you need to reach your personal
					fitness goals - for free!{" "}
				</Text>
			</View>
			
			<Button
        title="BACKDOOR"
        onPress={() =>
          backDoorHandler("Test@gmail.com", "password")
        }
      />
      
        
      {/* <Button
        title="ADMIN BACKDOOR"
        onPress={() => props.navigation.navigate("admin")}
            /> */}

       {/*this was added by Alice for the start workout screens, will move in the future}
	<Button
			{/*
        title="START WORKOUT BUTTON"
        onPress={() => props.navigation.navigate("start")}
            />
			*/}
      {/*code will break at the end to home bc name can't be rendered}
      */}
      
			<View style={styles.buttoncontainer}>
				<Text style={styles.error}> {error} </Text>
						
				<TextInput
					mode='outlined'
					outlineColor="black"
					activeOutlineColor="#10B9F1"
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
				
				<TextInput
					mode='outlined'
					outlineColor="black"
					activeOutlineColor="#10B9F1"
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

			<View style={{flex:1, marginTop: 50}}>
				<Button
					title="Login"
					color="#10B9F1"
					onPress={() => loginHandler()}
				/>
				<Button
					title="Create an account"
					color="#C4C4C4"
					accessibilityLabel="Create an account"
					onPress={() => {
						setError("");
						props.navigation.navigate("registration");
				}}/>
			</View>
		</KeyboardAwareScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
	},
	textcontainer: {
		flex: 0.5,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
		width: "90%",
	},
	buttoncontainer: {
		flex: 1,
		alignItems: "center",
		paddingTop: 10,
    marginBottom: 10,
		width: "100%",
	},
	heading: {
		color: "#2B2B2B",
		fontFamily: "HelveticaNeue-Bold",
		fontSize: 36,
		textAlign: "center",
		paddingBottom: 5,
	},
	text: {
		fontFamily: "HelveticaNeue",
		fontWeight: 400,
		fontSize: 16,
		fontWeight: "normal",
		color: "#C4C4C4",
		textAlign: "center",
	},
	image: {
		top: 0,
		marginBottom: 10,
	},
	login: {
		backgroundColor: "#10B9F1",
	},
	inputstyle: {
    display: 'inline-block',
		//textAlign: "center",
		width: "70%",
		padding: 8,
		marginVertical: 2,
    justifyContent: 'center',
	},
	error: {
		textAlign: "center",
		color: "#fb9357",
		fontSize: 16,
	},
});
