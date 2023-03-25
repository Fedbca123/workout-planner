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
import React, { useState, useRef, useEffect } from "react";
import { Icon } from 'react-native-elements';
import { useGlobalState } from "../GlobalState.js";
import API_Instance from "../../backend/axios_instance";
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../AuthProvider';

const text_field_width = '41%';


// TO DO: Handle Various Naming Errors
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
    const [userMessage, setUserMessage] = useState("");

    useEffect(() => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setUserMessage("");
	}, [editFirstName, editLastName, editEmail])

    function updateFirstName() 
    {
        if (firstName == globalState.user.firstName || firstName == '')
        {
            return;
        }
        
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
            setUserMessage(error.response.data.errors.firstName.message);
        });
    }

    function updateLastName()
    {
        if (lastName == globalState.user.lastName || lastName == '')
        {
            return;
        }

        
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
                updateGlobalState("user", response.data);
            }
        })
        .catch((error) => {
            setUserMessage(error.response.data.errors.lastName.message);
        });
    }

    function updateEmail()
    {
        if (email == globalState.user.email || email == '')
        {
            return;
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        {
            Alert.alert('Email is not valid');
        }

        API_Instance
        .post(`users/emailreset/send/to`, {
            firstName: globalState.user.firstName,
            lastName: globalState.user.lastName,
            email: email,
            id: globalState.user._id
        }).then((result) => {
            Alert.alert(`An email is being sent to ${email}`); 
        }).catch((error) => {
            if (error.response.status === 502)
            {
                Alert.alert(`${email} Already has an account associated with it`);
                //setUserMessage('');
            }
            else if (error.response.status === 506)
            {
                Alert.alert(`Email could not send to ${email}`);
            }
        })


        setUserMessage(`A confirmation email has been sent to $asdf@asdf{email}`);
    }

    function handleResetPassword()
    {
        try
        {
            API_Instance
            .post(`users//forgotpassword/email/send/to`, {
                email: globalState.user.email,
            })
        }
        catch(error)
        {
            if (error.response.status === 502)
            {
                Alert.alert(`${globalState.user.email} Already has an account associated with it`);
                setUserMessage('');
            }
        } 

        setUserMessage(`A Password reset email has been sent to ${globalState.user.email}`);
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
                    autoComplete='off'
                    autoCorrect={false}
                    autoFocus
                    />}
                    {!editFirstName && <TouchableOpacity
                        onPress={() => {
                          setEditFirstName(true);
                        }}>
                        <Icon
                            name='edit'
                            type='material'/>
                    </TouchableOpacity>}
                    {editFirstName && <TouchableOpacity
                        onPress={() => {
                            updateFirstName();
                            setEditFirstName(false);
                        }}> 
                        <Icon
                            name='done'
                            type='material'/>
                    </TouchableOpacity>}
                    {editFirstName && <TouchableOpacity
                        onPress={() => setEditFirstName(!editFirstName)}>
                            <Icon
                            name='close'
                            type='material'/>
                    </TouchableOpacity>}
                </View>
                <View style={styles.rowView}>
                    <Text style={styles.text}>Last Name:{"\t\t"}</Text>
                    {!editLastName && 
                    <Text style={styles.text2}>{globalState.user.lastName}</Text>}
                    {editLastName && 
                    <TextInput style={styles.inputfield}
                    placeholder={globalState.user.lastName}
                    onChangeText={(text) => setLastName(text)}
                    autoComplete='off'
                    autoCorrect={false}
                    autoFocus
                    />}
                    {!editLastName && <TouchableOpacity
                        onPress={() => setEditLastName(true)}>
                        <Icon
                            name='edit'
                            type='material'/>
                    </TouchableOpacity>}
                    {editLastName && <TouchableOpacity
                        onPress={() => {
                             updateLastName();
                            setEditLastName(false);
                        }}> 
                        <Icon
                            name='done'
                            type='material'/>
                    </TouchableOpacity>}
                    {editLastName && <TouchableOpacity
                        onPress={() => setEditLastName(!editLastName)}>
                            <Icon
                            name='close'
                            type='material'/>
                    </TouchableOpacity>}
                </View>
                <View style={styles.rowView}>
                    <Text style={styles.text}>Email: {"\t\t\t"}</Text>
                    {!editEmail && 
                    <Text style={styles.text2}>{globalState.user.email}</Text>}
                    {editEmail && 
                    <TextInput style={styles.inputfield}
                    placeholder={globalState.user.email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize='none'
                    autoComplete='off'
                    autoCorrect={false}
                    autoFocus
                    />}
                    {!editEmail && <TouchableOpacity
                        onPress={() => setEditEmail(true)}>
                        <Icon
                            name='edit'
                            type='material'/>
                    </TouchableOpacity>}
                    {editEmail && <TouchableOpacity
                        onPress={() => {
                            updateEmail();
                            setEditEmail(false);
                        }}> 
                        <Icon
                            name='done'
                            type='material'/>
                    </TouchableOpacity>}
                    {editEmail && <TouchableOpacity
                        onPress={() => setEditEmail(!editEmail)}>
                            <Icon
                            name='close'
                            type='material'/>
                    </TouchableOpacity>}
                </View>
                <View style={styles.belowFieldView}>
                    <Text style={styles.text3}>{userMessage}</Text>
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
        fontWeight: 'bold',
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
    },
    belowFieldView: {
        marginTop: 10, 
        width: '100%',
        alignItems: 'center'
    },
    text3: {
        fontSize: 12
    }
});