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
	ScrollView,
	Alert,
} from "react-native";
import React, { useState } from "react";
import reactDom from "react-dom";
import API_Instance from "../../backend/axios_instance";
import { useGlobalState } from "../GlobalState.js";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectBox from "react-native-multi-selectbox";
import { Dropdown } from "react-native-element-dropdown";

export default function FinalizedContinued() {
    
}