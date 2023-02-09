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

export default function WorkOuts({ props, data, showButton, showInput }) {
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
				<View style={styles.collapsePill}>
					<Text style={styles.TitleText}>{sections.title}</Text>
					<Button
						onPress={() => {
							navigation.navigate("dateTimeRepsPicker");
							updateGlobalState("workout", data);
						}}
						title="+"
					/>
				</View>
			);
		} else {
			return (
				<View style={styles.collapsePill}>
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
						<View style={styles.collapsedContent}>
							{/* Image Component here */}
							<Text style={styles.text}>{item.title}</Text>
							<TextInput
								placeholder="sets"
								style={styles.text}
							></TextInput>
							<TextInput
								placeholder="reps"
								style={styles.text}
							></TextInput>
						</View>
					</View>
				);
			} else {
				return (
					<View>
						<View style={styles.collapsedContent}>
							{/* Image Component here */}
							<Text style={styles.text}>{item.title}</Text>
						</View>
					</View>
				);
			}
		}

		return (
			<View>
				<FlatList data={section.content} renderItem={itemRender} />
			</View>
			// <View style={styles.content}>
			//     <Text>{section.content}</Text>
			// </View>
		);
	}

	return (
		<SafeAreaView style={styles.Background}>
			<Accordion
				// containerStyle={styles.Background}
				sections={data}
				renderContent={renderContent}
				renderHeader={renderHeader}
				// renderSectionTitle={renderSectionTitle}
				activeSections={activeSections}
				onChange={setActiveSections}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	collapsePill: {
		flexDirection: "row",
		backgroundColor: "#DDF2FF", //"#F1F3FA",
		margin: 30,
		padding: 15,
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
		flexDirection: "row",
		backgroundColor: "#DDF2FF", //"#F1F3FA",
		margin: 30,
		padding: 15,
	},
	TitleText: {
		color: "black",
		fontWeight: "bold",
		fontSize: 16,
	},
});
