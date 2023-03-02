import {
	StyleSheet,
	Button,
	Text,
	Image,
	View,
	//TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState, useRef } from "react";
import axios from "axios";
import config from "../../config";
import { useGlobalState } from "../../GlobalState.js";
import {TextInput} from 'react-native-paper';

const baseUrl = config.API_URL + config.PORT + "/";

export default function Login(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);
	const [globalState, updateGlobalState] = useGlobalState();
	const passwordRef = useRef(0);
  //const [pwFocus, setPWFocus] = useState(false);

	// functions
  const emailInputHandler = (enteredEmail) => {
		setEmail(enteredEmail);
	};

	const passwordInputHandler = (enteredPassword) => {
		setPassword(enteredPassword);
	};

	const loginHandler = () => {
		axios
			.post(baseUrl + "users/login", {
				email: email,
				password: password,
			})
			.then((response) => {
				if (response.status == 200) {
					setError("");
					updateGlobalState("user", response.data.user);
					updateGlobalState("friends", response.data.friends);
					if (response.data.user.isAdmin) {
						props.navigation.navigate("admin");
					} else {
						props.navigation.navigate("home");
					}
				}
			})
			.catch((e) => {
				if (e.response) setError(e.response.data.Error);
			});
	};
	const backDoorHandler = (e, p) => {
		axios
			.post(baseUrl + "users/login", {
				email: e,
				password: p,
			})
			.then((response) => {
				if (response.status == 200) {
					updateGlobalState("user", response.data.user);
					updateGlobalState("friends", response.data.friends);
					setError("");
					if (response.data.user.isAdmin)
						props.navigation.navigate("admin");
					else
						props.navigation.navigate("home");
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
			bounces={false}
		>
			<Image
				style={styles.image}
				source={require("../../assets/workout.png")}
			/>
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
          backDoorHandler("Test@gmail.com", "password")}/>
      <Button
        title="ADMIN BACKDOOR"
        onPress={() =>  backDoorHandler("admin@gmail.com", "password")}/>

      {/* <Button
        title="START WORKOUT BUTTON"
        onPress={() => props.navigation.navigate("start")}
            />
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
          //left={email != "" ? <TextInput.Icon /> : null}
					blurOnSubmit={false}
					keyboardType="email-address"
					onChangeText={(text) => emailInputHandler(text)}
				/>
        
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
          }
          //left={password != "" || pwFocus ? <TextInput.Icon /> : null}
				/>
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
					}}
				/>
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
