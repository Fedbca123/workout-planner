import {
	StyleSheet,
	Button,
	Text,
	Image,
    TextInput,
	View,
    TouchableOpacity
} from "react-native";
import React, { useState, useRef } from "react";
import { Icon } from 'react-native-elements'
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance";

export default function SettingsPage({ navigation }) 
{
    const [globalState, updateGlobalState] = useGlobalState();
    const [editFirstName, setEditFirstName] = useState(false);
    const [editLastName, setEditLastName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    
    function updateFirstName() 
    {

    }

    return(
        <View style={styles.container}>
            <View style={styles.contentArea}>
                <View style={styles.rowView}>
                    <Text style={styles.text}>First Name:{"\t\t"}</Text>
                    {!editFirstName && 
                    <Text style={styles.text2}>{globalState.user.firstName}</Text>}
                    {editFirstName && 
                    <TextInput style={styles.inputfield}
                    placeholder={globalState.user.firstName}
                    />}
                    <TouchableOpacity
                        onPress={() => setEditFirstName(!editFirstName)}>
                        {!editFirstName && <Icon
                            name='edit'
                            type='material'/>}
                        {editFirstName && <Icon
                            name='done'
                            type='material'/>}
                    </TouchableOpacity>
                </View>
                <View style={styles.rowView}>
                    <Text style={styles.text}>Last Name:{"\t\t"}</Text>
                    {!editLastName && 
                    <Text style={styles.text2}>{globalState.user.lastName}</Text>}
                    {editLastName && 
                    <TextInput style={styles.inputfield}
                    placeholder={globalState.user.lastName}
                    />}
                    <TouchableOpacity
                        onPress={() => setEditLastName(!editLastName)}>
                        {!editLastName && <Icon
                            name='edit'
                            type='material'/>}
                        {editLastName && <Icon
                            name='done'
                            type='material'/>}
                    </TouchableOpacity>
                </View>
                <View style={styles.rowView}>
                    <Text style={styles.text}>Email: {"\t\t\t"}</Text>
                    {!editEmail && 
                    <Text style={styles.text2}>{globalState.user.email}</Text>}
                    {editEmail && 
                    <TextInput style={styles.inputfield}
                    placeholder={globalState.user.email}
                    />}
                    <TouchableOpacity
                        onPress={() => setEditEmail(!editEmail)}>
                        {!editEmail && <Icon
                            name='edit'
                            type='material'/>}
                        {editEmail && <Icon
                            name='done'
                            type='material'/>}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    rowView: {
        width: '100%',
        marginLeft: 50,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
    },
    contentArea: {
        marginTop: 80,
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        marginRight: 10,
    },
    text2: {
        fontSize: 16,
        marginRight: 10,
    },
    inputfield: {
		borderWidth: 1,
		borderColor: "#C4C4C4",
		width: "30%",
		paddingVertical: 8,
        paddingLeft: 5,
		marginVertical: 2,
        marginRight: 10
    },
});