import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useGlobalState} from '../../GlobalState.js';
import { Menu, MenuItem } from 'react-native-material-menu';

export default function Friends(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [globalState, updateGlobalState] = useGlobalState();

  const [filteredFriends, setFilteredFriends] = useState(globalState.friends);

  const handleSearch = (text) => {
    setSearchTerm(text);
    setFilteredFriends(
      globalState.friends.filter((friend) => friend.email.includes(text))
    );
  };

  const [visible, setVisible] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);

  let menu = null;

  const showMenu = () => {
    setMenuVisible(true);
  };

  const hideMenu = () => {
    setMenuVisible(false);
  };

  // const handleBlockFriend = async (current_user_id, friend_object_id, accessToken) => {
  //   try {
  //     const response = await fetch(`/users/${current_user_id}/blocked/add/${friend_object_id}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`,
  //       },
  //     });
  //     const data = await response.json();
  //     console.log(data); // output: the updated userA object
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleBlockFriend = () => {
    Alert.alert('Blocked', 'Your friend has been blocked', [{ text: 'OK' }]);
    hideMenu();
  };


  // const handleDeleteFriend = async (current_user_id, friend_object_id, accessToken) => {
  //   try {
  //     const response = await fetch(`/users/${current_user_id}/friends/remove/${friend_object_id}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`,
  //       },
  //     });
  //   const data = await response.json();
  //   console.log(data.message); // output: `${userA.firstName} and ${userB.firstName} are no longer friends`
  //   } catch (error) {
  //     console.error(error);
  // }

  const handleDeleteFriend = () => {
    
    Alert.alert('Deleted', 'Your friend has been deleted', [{ text: 'OK' }]);
    hideMenu();
  };

  
  const handleAddFriend = () => {
    hideMenu();
    Alert.alert('Invitation sent', 'Your invitation has been sent to your friend', [{ text: 'OK' }]);
  };

  // const addFriendRequest = async (A_id, B_id) => {
  //   const url = `API_Instance.post("users/{$current_user_id}/invites/add")`;
  
  //   try {
  //     const response = await fetch(url, { method: 'PATCH' });
  //     const data = await response.json();
  
  //     console.log(data);
  //     Alert.alert('Friend request sent!');
  //   } catch (error) {
  //     if (error.status === 497) {
  //       Alert.alert('Blocked user');
  //     } else if (error.status === 496 && error.message === 'Already friends') {
  //       Alert.alert('Already friends');
  //     } else if (error.status === 496 && error.message === 'Already requested') {
  //       Alert.alert('Already requested');
  //     } else if (error.status === 498) {
  //       Alert.alert(`User ${error.message} does not exist`);
  //     } else {
  //       Alert.alert('An unknown error occurred');
  //     }
  //   }
  // };
  
  return  (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}
            bounces={false}>
            <Text style={styles.Title}>Friends</Text>
            
            <TextInput 
              style={styles.searchBar}
              placeholder="Search by email"
              value={searchTerm}
              onChangeText={handleSearch}
            />
            {/* <Text style={styles.Title}></Text> */}
            <ScrollView contentContainerStyle={styles.CardContainer}
              bounces={true}>


        {filteredFriends.length > 0 ? ( 
          filteredFriends.map((friend, index) => (
            <View key={index} style={styles.card}>
              <View key={index} style={styles.newcard}>
              <Menu visible={menuVisible} anchor={
                <TouchableOpacity onPress={showMenu} style={{ position: 'absolute', right: 0, top: 5}}>
                <Image source={require('../../assets/menu.png')} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
              } onRequestClose={hideMenu}>
                <MenuItem onPress={handleBlockFriend}>Block Friend</MenuItem>
                <MenuItem onPress={handleDeleteFriend}>Delete Friend</MenuItem>
              </Menu>
              </View>
              <Text style={styles.name}>
                {friend.firstName} {friend.lastName}
              </Text>
              <Text>{friend.email}</Text>
            </View>
          ))
        ) : (
          <>
          {searchTerm.length == 0 ? (
          <Text style={styles.Normal}>No friend added {'\n'}To add a friend search by their email address</Text>
          ) : ( 
            <Text style={styles.name}> </Text>
            )}
          </>
        )}

        {filteredFriends.length === 0 && searchTerm.length != 0 &&(
          <TouchableOpacity  style={styles.iconButton} onPress={handleAddFriend}>
                  <Text style={styles.addFriend}>Add friend: {searchTerm.toLowerCase()}</Text>
          </TouchableOpacity>
        )}

          </ScrollView>
          <View style={{borderColor: 'black', borderWidth: '0px'}}/>
          </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    Normal:{
        fontFamily: 'HelveticaNeue',
        color: '#2B2B2B',
        fontSize: 15,
        textAlign: 'left',
        paddingLeft: 20,
        paddingVertical: 5
    },
    Title:{
        fontFamily: 'HelveticaNeue-Bold',
        color: '#2B2B2B',
        fontSize: 24,
        textAlign: 'left',
        paddingLeft: 20,
        paddingVertical: 5
    },
    Heading:{
        fontFamily: 'HelveticaNeue-Bold',
        color: '#2B2B2B',
        fontSize: 18,
        textAlign: 'left',
        paddingLeft: 20,
        marginVertical: 5
    },
    CardContainer:{
      borderColor: 'black',
      borderWidth: '0px',
      flex: 0.95,
      width: '95%',
      alignSelf: 'center'
    },
    searchBar: {
      height: 40,
      padding: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    card:{
      backgroundColor: '#DDF2FF',
      padding: 20,
      marginBottom: 0,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      borderRadius: 15,
    },
    newcard:{
      backgroundColor: '#DDF2FF',
      padding: 0,
      marginBottom: 0,
      // shadowColor: '#000',
      // shadowOpacity: 0.2,
      // shadowRadius: 5,
      // shadowOffset: { width: 0, height: 2 },
      borderRadius: 0,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    email: {
      fontSize: 16,
      color: '#999',
      marginTop: 10,
    },
    container:{
      backgroundColor: 'white',
      flex:1,
      flexDirection:'column',
    },
    searchContainer:{
      width: '100%',
      alignItems: 'center'
    },
    inputstyle:{
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#C4C4C4',
        width: '80%',
        padding:8,
        marginVertical:10,
        borderRadius: '10rem',
        alignSelf:'center'
    },
    addFriendContainer:{
      flex:0.1,
      width: '95%',
      alignSelf:'center',
      marginBottom: 30
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    iconButton: {
      backgroundColor: '#F7F7F7',
      borderRadius: 50,
      padding: 10,
      marginLeft: 10,
      alignContent: 'center',
    },
    addFriend: {
      padding: 10,
      alignContent: 'center',
    },
});

