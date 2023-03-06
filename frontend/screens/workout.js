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
} from "react-native";
import React from "react";
import { useState } from "react";
import reactDom from "react-dom";
import Collapsible from "react-native-collapsible";
import Accordion from "react-native-collapsible/Accordion";
import { useNavigation } from "@react-navigation/native";
import { useGlobalState } from "../../GlobalState.js";

export default function WorkOuts({ data, showButton, showInput}) {
	const [globalState, updateGlobalState] = useGlobalState();
	const [activeSections, setActiveSections] = useState([]);
	const navigation = useNavigation();

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
				<View >
					<Image source={sections.image} style={styles.ImageStyle} />
					<Text style={styles.TitleText}>{sections.title}</Text>
					
					<TouchableOpacity onPress={() =>{
						navigation.navigate("exerciseSearch");
						updateGlobalState("workout", data);
					}}>
						<Text>Choose Workout</Text>
					</TouchableOpacity>
				</View>
			);
		} else {
			return (
				<View>
					<Image source={sections.image} style={styles.ImageStyle} />
					<Text style={styles.TitleText}>{sections.title}</Text>
				</View>
			);
		}
	}

	function renderContent(section) {
		function itemRender({ item }) {
			if (showInput) {
				return (
					<View>
						{/* Image Component here */}
						<Text style={styles.text}>{item.title}</Text>
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
					<View >
						{/* Image Component here */}
						<Image source={item.image} style={styles.ImageStyle} />
						<Text style={styles.text}>{item.title}</Text>
					</View>
				);
			}
		}

		return (
			<View>
				<FlatList data={section.exercises} renderItem={itemRender} />
			</View>
			// <View style={styles.content}>
			//     <Text>{section.content}</Text>
			// </View>
		);
	}

	return (
		<SafeAreaView >
			<Accordion
				// containerStyle={styles.Background}
				// renderAsFlatList={true}
				sections={data}
				renderContent={renderContent}
				renderHeader={renderHeader}
				// renderSectionTitle={renderSectionTitle}
				activeSections={activeSections}
				onChange={setActiveSections}
				// keyExtractor={(item) => {
				// 	updateGlobalState("workout", item);
				// }}
				sectionContainerStyle={styles.collapsePill}
				containerStyle={styles.collapsedContent}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	collapsePill: {
		margin: 10,
		padding: 15,
		backgroundColor: "#F1F3FA",
		padding: 20,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 2 },
		// elevation: 2,
		borderRadius: "20rem",
		width: 390,
		left:-40,
	},
	text: {
		color: "black",
		fontWeight: "bold",
		fontSize: 12,
	},
	addButton: {
		position: "relative",
		width: 28,
		height: 28,
		left: 328,
		top: 26,
		fontSize: 28,
	},
	Background: {
		backgroundColor: "#E5E5E5",
	},
	collapsedContent: {
		// flexDirection: "row",
		// backgroundColor: "#F1F3FA",
		margin: 30,
		padding: 15,
		borderRadius:"30rem",
	},
	TitleText: {
		color: "black",
		fontWeight: "bold",
		fontSize: 20,
	},
	ImageStyle:{
		height: 75,
		width: 75,
		borderWidth: 1,
		borderRadius: "20rem",
	},
	ExerciseText: {
		fontSize: 20,
		fontWeight: 'bold',
		left: 10,
		textAlignVertical: "bottom",
	}
});
