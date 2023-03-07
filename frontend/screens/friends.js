import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useGlobalState} from '../../GlobalState.js';
import API_Instance from "../../backend/axios_instance";

// import { Menu, MenuItem } from 'react-native-material-menu';
// const [filteredFriends, setFilteredFriends] = useState(globalState.friends);
   
  //Alice Graveyard :) 
  // const [visible, setVisible] = useState(false);

  // const [menuVisible, setMenuVisible] = useState(false);

  // let menu = null;

  // const showMenu = () => {
  //   setMenuVisible(true);
  // };

  // const hideMenu = () => {
  //   setMenuVisible(false);
  // };
  

export default function Friends() {

  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [globalState, updateGlobalState] = useGlobalState();
  
  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = filteredFriends.filter((friend) =>
      friend.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFriends(filtered);
  };
  
  const handleDeleteFriend = () => {
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
  
    Alert.alert('Deleted', 'Your ex-friend has been deleted', [{ text: 'OK' }]);
  };

  const handleBlockFriend = () => {

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
    Alert.alert('Blocked', 'Your ex-friend has been blocked', [{ text: 'OK' }]);
  };

  const handleAddFriend = () => {
    
    // const addFriendRequest = async (B_id) => {
    //   API_Instance
    //   .get(`users/${globalState.user._id}/friends/all`, {
    //     headers: {
    //       authorization: `Bearer ${globalState.authToken}`,
    //     },
		// 	})
    //     try {
    //       const response = await fetch(url, { method: 'PATCH' });
    //       const data = await response.json();
      
    //       console.log(data);
    //       Alert.alert('Friend request sent!');
    //     } catch (error) {
    //       if (error.status === 497) {
    //         Alert.alert('Blocked user');
    //       } else if (error.status === 496 && error.message === 'Already friends') {
    //         Alert.alert('Already friends');
    //       } else if (error.status === 496 && error.message === 'Already requested') {
    //         Alert.alert('Already requested');
    //       } else if (error.status === 498) {
    //         Alert.alert(`User ${error.message} does not exist`);
    //       } else {
    //         Alert.alert('An unknown error occurred');
    //       }
    //     }
    // };

    Alert.alert('Invitation sent', 'Your invitation has been sent to your friend', [{ text: 'OK' }]);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      API_Instance
      .get(`users/${globalState.user._id}/friends/all`, {
        headers: {
          authorization: `Bearer ${globalState.authToken}`,
        },
			})
      .then((response) => {
        console.log(response.data.friends);
        setFilteredFriends(response.data.friends);
      })
      .catch((error) => {
        console.error(error);
      });
    };

  fetchFriends();

  }, []);

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
            
            <ScrollView contentContainerStyle={styles.CardContainer} bounces={true}>

            <View >
            {filteredFriends.length === 0 ? (
              <Text>Search for a friend</Text>
            ) : (
            filteredFriends.map((friend) => (
              <View key={friend._id} style={styles.card}>

                <View style={styles.info}>
                  <Text style={styles.name}>
                  {friend.firstName} {friend.lastName}</Text>
                  <Text>{friend.email}</Text>
                </View>

                <View style={styles.buttons}>
                  <Button style = {styles.buttonlook}
                    title="Block"
                    onPress={() => handleBlockFriend(friend._id)}
                  />
                  <Button style = {styles.buttonslook}
                    title="Delete"
                    onPress={() => handleDeleteFriend(friend._id)}
                  />
                 </View>

              </View>
              ))
            )}
            </View>

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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    buttons: {
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
    info: {
      alignContent: 'left',
    },
});

