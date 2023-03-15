import {
	StyleSheet,
	Button,
	Text,
	Image,
    TextInput,
	View,
    TouchableOpacity,
    Alert
} from "react-native";
import React, { useState, useRef } from "react";
import { Icon } from 'react-native-elements'
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance";
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../AuthProvider';

const text_field_width = '40%';


// TO DO: resetting states onclick
export default function SettingsPage({ navigation }) 
{
    const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);
    const [globalState, updateGlobalState] = useGlobalState();
    const [editFirstName, setEditFirstName] = useState(false);
    const [editLastName, setEditLastName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    
    

    function updateFirstName() 
    {
        if (firstName == globalState.user.firstName || firstName == '')
            return;
        
        API_Instance
        .patch(`users/${globalState.user._id}/contact`, {
            firstName: firstName
        },
        {
          headers: {
            Authorization : `Bearer ${globalState.authToken}`,
          },
        })
        .then((response) => 
        {
            if (response.status == 200) {
                setEditFirstName(false);     
                updateGlobalState("user", response.data);
            }
        })
        .catch((error) => {
            Alert.alert('An error occurred');
        });
    }

    function updateLastName()
    {
        if (lastName == globalState.user.lastName)
            return;

        API_Instance
        .patch(`users/${globalState.user._id}/contact`, {
            lastName: lastName
        },
        {
          headers: {
            Authorization : `Bearer ${globalState.authToken}`,
          },
        })
        .then((response) => 
        {
            if (response.status == 200) {
                setEditLastName(false);     
                updateGlobalState("user", response.data);
            }
        })
        .catch((error) => {
            Alert.alert('An error occurred');
        });
    }

    function updateEmail()
    {
        // TO-DO
    }

    function handleResetPassword()
    {
        // TO-DO
    }

    function deleteAccount()
    {
        API_Instance
        .delete(`users/${globalState.user._id}`,{
          headers: {
            Authorization : `Bearer ${globalState.authToken}`,
          },
        })
        .then((response) => 
        {
            if (response.status == 200) {
                updateGlobalState("authToken", null);
                updateGlobalState("user", null);
                SecureStore.deleteItemAsync("authKey");
                SecureStore.deleteItemAsync("userId");
                setIsLoggedIn(false);
            }
        })
        .catch((error) => {
            console.log(error)
            console.log(error.response);
            Alert.alert('An error occurred');
        });
    }

    function handleDeleteAccount()
    {
        Alert.alert( 'Are you sure?','',
        [{
            text: 'Yes',
            onPress: () => {
                deleteAccount();
            },
        },
        {
            text: 'No',
        }],
        { cancelable: false});
    }

    if (globalState.user == null)
    {
        return (<></>);
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
                    onChangeText={(text) => setFirstName(text)}
                    />}
                    <TouchableOpacity
                        onPress={() => {
                            if (editFirstName) { updateFirstName(); }
                            setEditFirstName(!editFirstName)
                        }}>
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
                    onChangeText={(text) => setLastName(text)}
                    />}
                    <TouchableOpacity
                        onPress={() => {
                            if (editLastName) { updateLastName() }
                            setEditLastName(!editLastName)
                        }}>
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
                    onChangeText={(text) => setEmail(text)}
                    />}
                    <TouchableOpacity
                        onPress={() => {
                            if (editEmail) { updateEmail() }
                            setEditEmail(!editEmail)
                            }}>
                        {!editEmail && <Icon
                            name='edit'
                            type='material'/>}
                        {editEmail && <Icon
                            name='done'
                            type='material'/>}
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 30}}>
                    <Button
                        title="Reset Password"
                        onPress={() => handleResetPassword()}
                    />
                </View>
            </View>
            <View style={styles.bottomView}>
                <Button 
                    color = "red"
                    title="Delete Account"
                    style={styles.deleteButton}
                    onPress={() => handleDeleteAccount()}/>
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
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderBottomColor:'black',
        borderBottomWidth: .4,
        marginLeft: 30,
        marginRight: 30
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
        width: text_field_width
    },
    inputfield: {
		borderWidth: 1,
		borderColor: "#C4C4C4",
		width: text_field_width,
		paddingVertical: 8,
        paddingLeft: 5,
		marginVertical: 2,
        marginRight: 10
    },
    bottomView: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 100
    }
});