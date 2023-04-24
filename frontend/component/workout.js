import {
	StyleSheet,
	Button,
	TouchableOpacity,
	Text,
	Image,
	View,
	SafeAreaView,
	TextInput,
	FlatList,
	useWindowDimensions,
	Platform,
} from "react-native";
import React from "react";
import { useState } from "react";
import reactDom from "react-dom";
import Collapsible from "react-native-collapsible";
import Accordion from "react-native-collapsible/Accordion";
import { useNavigation } from "@react-navigation/native";
import { useGlobalState } from "../GlobalState.js";
import { AntDesign } from "@expo/vector-icons";
// import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import ExerciseInfo from "./exerciseInfo.js";
import { Icon } from "react-native-elements";

export default function WorkOuts({ data, showButton, showInput, startButton, setCurrState, passData, currWorkout, setCurrWorkout, setCreateNew, navigation}) {
	const [globalState, updateGlobalState] = useGlobalState();
	const [activeSections, setActiveSections] = useState([]);
	const [modalVisible, setModalVisibility] = useState(false);
	const [exercise, setExercise] = useState({});
	// const navigation = useNavigation();

	// function renderSectionTitle(section) {
	// 	return (
	// 		<View>
	// 			<Text>Section Title: {section.title}</Text>
	// 		</View>
	// 	);
	// }

	function renderHeader(sections) {
		if (showButton) {
			return (
				<View style={{ display: "flex", justifyContent: 'space-between', flexDirection: "row", alignItems: 'center'}}>
					
					<Image source={{ uri: sections.image }} style={styles.ImageStyle} />

					<View style={{ display: "flex", justifyContent: "space-evenly", flexDirection: "column", flex:1}}>
						
						<Text style={styles.TitleText}>{sections.title}</Text>

					</View>

						<TouchableOpacity style={styles.addButton} onPress={() => {
							passData(data);
							setCurrWorkout(data);
							setCreateNew(false);
							setCurrState("ExerciseReview");
						}}>

							<Ionicons name="arrow-forward-circle-outline" size={34} style={{alignSelf: "center" }}  color="black" />
							
						</TouchableOpacity>

							
				</View>
			);
		} else if (startButton) {
			return (
				<View style={{ display: "flex", justifyContent: 'space-between', flexDirection: "row", alignItems: 'center' }}>
					
					<Image source={{ uri: sections.image }} style={styles.ImageStyle} />

					<View style={{ display: "flex", justifyContent: "space-evenly", flexDirection: "column", flex:1 }}>
						
						<Text style={styles.TitleText}>{sections.title}</Text>

					</View>

					<View style={{ display: "flex", justifyContent: "flex-end", flexDirection: "column",}}>
						
						<TouchableOpacity style={[styles.addButton,]} onPress={() =>{
							navigation.navigate("start", { workout: data[0] });
						}}>

							{/* <Text style={{ alignSelf: "center" }}>Start!</Text> */}
							<AntDesign name="playcircleo" size={34}/>
							
						</TouchableOpacity>

					</View>
					
					
				</View>
			)
		}else {
			return (
				<View style={{ display: "flex", justifyContent: "flex-start", flexDirection: "row" }}>

					<Image source={{ uri: sections.image }} style={styles.ImageStyle} />

					<View style={{ display: "flex", justifyContent: "space-evenly", flexDirection: "column", flex:1}}>
						
						<Text style={styles.TitleText}>{sections.title}</Text>

					</View>
					
				</View>
			);
		}
	}

	function renderContent(section) {

		function itemRender({ item, index }) {
			if (showInput) {
				return (
					<View style={{ display: "flex", justifyContent: "flex-start", flexDirection: "row" }}>

						{/* Image Component here */}
						<Image source={{ uri: item.image }} style={styles.ImageStyle} />

						<Text style={styles.headerText}>{item.title}</Text>

						<TextInput
							placeholder="sets"
							onChangeText={(val)=>{
								item.sets = val;
							}}
							style={styles.text}
						/>

						<TextInput
							placeholder="reps"
							onChangeText={(val)=>{
								item.reps = val;
							}}
							style={styles.text}
						/>

					</View>
				);
			}else{
				return (
					<View style={{ display: "flex", justifyContent: 'space-between', flexDirection: "row", marginTop: 10, alignItems: 'center'}}>
						
						{/* Image Component here */}
						<Image source={{ uri: item.image }} style={styles.ExerciseImage} />

						<Text style={styles.text}>{item.title}</Text>

						<TouchableOpacity onPress={() => {
							setExercise(item);
							setModalVisibility(true)
						}}>
						<AntDesign name="infocirlceo" style={{alignSelf: 'center'}} size={24} color="black" />
						</TouchableOpacity>

					</View>
				);
			}
		}

		return (
			<View>
				<FlatList
					data={section.exercises}
					renderItem={itemRender}
					initialNumToRender={3}
					style={{display:"flex"}}
				/>
			</View>
			// <View style={styles.content}>
			//     <Text>{section.content}</Text>
			// </View>
		);
	}

	return (
		<View >
			<Accordion
				// containerStyle={styles.Background}
				sections={data}
				renderContent={renderContent}
				renderHeader={renderHeader}
				activeSections={activeSections}
				onChange={setActiveSections}
				// keyExtractor={(item) => {
				// 	updateGlobalState("workout", item);
				// }}
				sectionContainerStyle={styles.collapsePill}
				containerStyle={styles.collapsedContent}
				underlayColor="transparent"
			/>

			<Modal
				isVisible={modalVisible}
				coverScreen={true}
				backdropColor="white"
				backdropOpacity={1}
			>
				<ExerciseInfo exercise={exercise} setModalVisbility={setModalVisibility}/>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	collapsePill: {
		margin: 5,
		// padding: 15,
		backgroundColor: "#F1F3FA",
		padding: 15,
		shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        borderRadius: 20,
		borderWidth: 2,
		width: "95%",
		// maxHeight: "90%",
		
	},
	text: {
		color: "black",
		//fontWeight: "bold",
		fontSize: 16,
		display: "flex",
		textAlignVertical: "center",
		alignContent: "center",
		flexDirection: "row",
		justifyContent:"space-around",
		flex: 1,
		textAlign: 'center',
		//marginHorizontal: 10
		// left: 5,
	},
	headerText: {
		color: "black",
		fontWeight: "bold",
		fontSize: 16,
		display: "flex",
		textAlignVertical: "center",
		alignContent: "center",
		flexDirection: "row",
		justifyContent:"space-around",
		// left: 5,
	},
	addButton: {
		// position: "relative",
		// fontSize: 28,
		display:"flex",
		justifyContent: "center",
		alignItems:"center",
		flexDirection: "row",
		//marginHorizontal: 8,
		//borderWidth:5,
	},
	Background: {
		backgroundColor: "#E5E5E5",
	},
	collapsedContent: {
		// flexDirection: "row",
		// backgroundColor: "#F1F3FA",
		// margin: 30,
		// padding: 15,
		// backgroundColor: "blue",
		// borderRadius: "30rem",
		...Platform.select({
			ios: {
				borderRadius: 30
			},
			android: {
				borderRadius: 30
			},
		}),
		// maxHeight: "10%",
	},
	TitleText: {
		color: "black",
		position:"relative",
		fontWeight: "bold",
		fontSize: 22,
		display: "flex",
		textAlignVertical: "center",
		alignContent: "center",
		flexDirection: "row",
		justifyContent:"space-around",
		left: 5,
		textAlign: 'center'
	},
	ImageStyle:{
		height: 50,
		width: 50,
		borderWidth: 1,
		// borderRadius: 10,
		...Platform.select({
			ios: {
				borderRadius: 10
			},
			android: {
				borderRadius: 10
			},
		}),
	},
	ExerciseImage: {
		height: 50,
		width: 50,
		borderWidth: 1,
		// borderRadius: 20,
		...Platform.select({
			ios: {
				borderRadius: 20
			},
			android: {
				borderRadius: 20
			},
   		 }),
		// marginTop: 10
	},
});
