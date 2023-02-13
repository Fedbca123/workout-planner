import {
	StyleSheet,
	Button,
	Text,
	Image,
	View,
	TextInput,
	KeyboardAvoidingView,
	ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState, useRef } from "react";
import axios from "axios";
import config from "../../config";
import { useGlobalState } from "../../GlobalState.js";
import { SafeAreaView } from "react-native-safe-area-context";
const baseUrl = config.API_URL + config.PORT + "/";

export default function Login(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [globalState, updateGlobalState] = useGlobalState();
	const passwordRef = useRef(0);

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
					if (response.data.isAdmin) {
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
					if (response.data.isAdmin) {
						props.navigation.navigate("admin");
					} else {
						props.navigation.navigate("home");
					}

					if (response.data.isAdmin) {
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
			<View style={styles.buttoncontainer}>
				<Button
					title="BACKDOOR"
					onPress={() =>
						backDoorHandler("Test@gmail.com", "password")
					}
				/>
				{/* <Button
                title="ADMIN BACKDOOR"
                onPress={() => backDoorHandler("Admin@gmail.com", "password")}
            /> */}
				<Text style={styles.error}> {error} </Text>
				<TextInput
					style={styles.inputstyle}
					placeholder="Email"
					returnKeyType="next"
					onSubmitEditing={() => {
						passwordRef.current.focus();
					}}
					blurOnSubmit={false}
					keyboardType="email-address"
					onChangeText={(text) => emailInputHandler(text)}
				/>
				<TextInput
					style={styles.inputstyle}
					placeholder="Password"
					returnKeyType="go"
					autoCapitalize="none"
					ref={passwordRef}
					secureTextEntry
					onChangeText={(text) => {
						passwordInputHandler(text);
					}}
					onSubmitEditing={() => {
						passwordRef.current.blur();
						loginHandler();
					}}
				/>
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
		flex: 0.3,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
		width: "90%",
	},
	buttoncontainer: {
		flex: 1,
		alignItems: "center",
		paddingTop: 10,
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
		marginBottom: 0,
	},
	login: {
		backgroundColor: "#10B9F1",
	},
	inputstyle: {
		textAlign: "center",
		borderWidth: 1,
		borderColor: "#C4C4C4",
		width: "70%",
		padding: 8,
		marginVertical: 2,
	},
	error: {
		textAlign: "center",
		color: "#fb9357",
		fontSize: 16,
	},
});
