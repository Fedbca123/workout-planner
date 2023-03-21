import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect} from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useGlobalState} from '../GlobalState.js';
import API_Instance from "../../backend/axios_instance";

const FriendsScreen = () => {
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

  const handleDeleteFriend = (deleteFriendID) => {
    const deleteID = deleteFriendID;
    // console.log(deleteID);
    const sendDeleteFriend = async () => {
      try {
        const response = await API_Instance.patch(`users/${globalState.user._id}/friends/remove/${deleteID}`, null, {
          headers: {
            Authorization : `Bearer ${globalState.authToken}`,
          },
        });
        if (response.status == 200) {
          console.log(response.data);
          Alert.alert('Deleted', 'Your ex-friend has been deleted', [{ text: 'OK' }]);
        }
        fetchFriends();
      } catch (error) {
        if (error.status === 498) {
          Alert.alert(`User ${error.message} does not exist`);
        } else {
          console.error(error);
          Alert.alert('An unknown error occurred');
        }
      }
    };
    sendDeleteFriend();
  };

  const handleBlockFriend = (blockedFriendID) => {
    const blockID = blockedFriendID;
    // console.log(block);
    const sendBlockFriend = async () => {
      API_Instance
      .patch(`users/${globalState.user._id}/blocked/add/${blockID}`, null, {
        headers: {
          Authorization : `Bearer ${globalState.authToken}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          // console.log(response.data);
          Alert.alert('Blocked', 'Your ex-friend has been blocked', [{ text: 'OK' }]);
        }
        fetchFriends();
      })
      .catch((error) => {
        if (error.status === 497) {
          Alert.alert('Blocked user');
        } else if (error.status === 498) {
          Alert.alert(`User ${error.message} does not exist`);
        } else {
          console.error(error);
          Alert.alert('An unknown error occurred');
        }
      });
    };
    sendBlockFriend();
  };

  const handleAddFriend = () => {
    const email = searchTerm;

    const addFriendRequest = async () => {
      API_Instance
      .post(`users/${globalState.user._id}/invites/add`, {
        email: email
      }, {
        headers: {
          'authorization': `Bearer ${globalState.authToken}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          Alert.alert('Invitation sent', 'Your invitation has been sent to your friend', [{ text: 'OK' }]);
          setSearchTerm('');
        }
        if (response.status == 496) {
          console.log(response.data);
          Alert.alert('Already requested');
        }
      })
      .catch((error) => {
        console.log("Error is", error)
        console.log("Error status", error.status)
        if (error.response.status === 497) {
          Alert.alert('This user is blocked by you');
        } else if (error.response.status === 496) {
          Alert.alert('Already requested');
        }  else if (error.response.status === 498) {
          Alert.alert(`User ${error.message} does not exist`);
        } else if (error.response.status === 493) {
          Alert.alert('This email does not have a verified account');
        } else {
          console.error(error.response.status);
          Alert.alert('An unknown error occurred');
        }
      });
    };

    if(email == globalState.user.email){
      Alert.alert("Adding yourself as a friend is a kind gesture but not supported in this application. Sorry!");
      return;
    }else{
      addFriendRequest();
    }
  };

  const fetchFriends = async () => {
    API_Instance
    .get(`users/${globalState.user._id}/friends/all` ,{
      headers: {
        'authorization': `Bearer ${globalState.authToken}`,
      }
    })
    .then((response) => {
      // console.log("My real friends are", response.data.friends);
      setFilteredFriends(response.data.friends);
    })
    .catch((error) => {
      console.error(error);
      if (error.response.status === 403) {
        Alert.alert('Failed to authenticate you');
      } 
    });
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      fetchFriends();
    }
  }, [searchTerm]);

  return (
    <View>
      
      <TextInput
        style={styles.searchBar}
        placeholder="Search by email"
        value={searchTerm}
        onChangeText={handleSearch}
        keyboardType="email-address"
        autoCapitalize='none'
        autoComplete='off'
        autoCorrect={false}
      />
          
          
          <View >
            {filteredFriends.length === 0 && searchTerm.length === 0? (
              <Text>You have no friends added! Search by email to add a friend </Text>
            ) : (
            filteredFriends.map((user) => (
              <View key={user._id} style={styles.card}>

                {/* left side */}
                <View style={styles.info}>
                  <Text style={styles.name}>
                    {user.firstName} {user.lastName}</Text>
                  <Text>{user.email.toLowerCase()}</Text>
                </View>

                {/* right side */}
               <View style={styles.buttons}>
                <Button style = {styles.buttonslook}
                  title="Unfriend"
                  onPress={() => {
                    Alert.alert( `Are you sure you wish to unfriend ${user.firstName + " " + user.lastName}?`,'',
                      [{
                          text: 'Yes',
                          onPress: () => {
                            handleDeleteFriend(user._id)
                          },
                      },
                      {
                          text: 'No',
                      }],
                      { cancelable: false}
                    );
                    
                  }}
                />
                <Button style = {styles.buttonlook}
                  title="Block"
                  onPress={() => {
                    Alert.alert( `Are you sure you wish to block ${user.firstName + " " + user.lastName}?`,'',
                      [{
                          text: 'Yes',
                          onPress: () => {
                            handleBlockFriend(user._id)
                          },
                      },
                      {
                          text: 'No',
                      }],
                      { cancelable: false}
                    );
                    
                  }}
                />
               </View>

              </View>
              ))
            )}
          </View>

      {filteredFriends.length === 0 && searchTerm.length != 0 &&(
        <TouchableOpacity  style={styles.iconButton} onPress={handleAddFriend}>
                <Text style={styles.addFriend}>Add friend <Text style={styles.searchTerm}>{searchTerm.toLowerCase()}</Text></Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


const BlockFriendScreen = () => {
  const [filteredBlockFriends, setFilteredBlockFriends] = useState([]);
  const [globalState, updateGlobalState] = useGlobalState();

  const handleUnblockFriend = (unblockFriendID) => {
    const unblockID = unblockFriendID;
    console.log(unblockID);
    const sendunblockFriend = async () => {
      API_Instance
      .patch(`users/${globalState.user._id}/blocked/remove/${unblockID}`, null, {
        headers: {
          Authorization : `Bearer ${globalState.authToken}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          Alert.alert('Unblocked', 'Your blocked friend has been unblocked', [{ text: 'OK' }]);
        }
        fetchBlockedFriends();
      })
      .catch((error) => {
        if (error.status === 498) {
          Alert.alert(`User ${error.message} does not exist`);
        } else {
          console.error(error);
          Alert.alert('An unknown error occurred');
        }
      });
    };
    sendunblockFriend();
  };

  const fetchBlockedFriends = async () => {
    API_Instance
    .get(`users/${globalState.user._id}/blocked/all`,{
      headers: {
        'authorization': `Bearer ${globalState.authToken}`,
      }
    })
    .then((response) => {  
      setFilteredBlockFriends(response.data.blockedUsers);
      console.log("Blocked friends are", response.data.blockedUsers);
      return response.data.blockedUsers;
    })
    .catch((error) => {
      console.error(error);
      if (error.response.status === 403) {
        Alert.alert('Failed to authenticate you');
      } 
      return undefined;
    });
  };

    useEffect(() => {
    fetchBlockedFriends();
  }, []);
  
  return (
    <View>
      <Text style={styles.Heading}>The following are your blocked friends: </Text>
        
        {!filteredBlockFriends || filteredBlockFriends.length === 0 ? (
          <Text style={{ paddingLeft: 20 }}>You have no blocked friend!  </Text>
            ) : ( 
              filteredBlockFriends.map((user) => (
                <View key={user._id} style={styles.cardblock}>

                {/* left side */}
                <View style={styles.info}>
                  <Text style={styles.name}>
                    {user.firstName} {user.lastName}</Text>
                  <Text>{user.email.toLowerCase()}</Text>
                </View>

                {/* right side */}
               <View style={styles.buttons}>
                <Button style = {styles.buttonlook}
                  title="Unblock"
                  onPress={() => {
                    Alert.alert( `Are you sure you wish to unblock ${user.firstName + " " + user.lastName}?`,'',
                      [{
                          text: 'Yes',
                          onPress: () => {
                            handleUnblockFriend(user._id)
                          },
                      },
                      {
                          text: 'No',
                      }],
                      { cancelable: false}
                    );
                  }}
                />
               </View>

              </View>

      ))
    )}
    </View>
  );
};

export default function Friends() {
  const [globalState, updateGlobalState] = useGlobalState();
  const [activeScreen, setActiveScreen] = useState('Friends');
  
  const handleButtonPress = (button) => {
    setActiveScreen(button);
  };

  return  (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}
            bounces={false}>
            <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => handleButtonPress('Friends')}>
              <Text style={{ fontFamily: 'HelveticaNeue-Bold', fontSize: 24, paddingLeft: 20, color: activeScreen === 'Friends' ? '#24C8FE' : '#2B2B2B' }}>Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleButtonPress('BlockedFriends')}>
              <Text style={{ fontFamily: 'HelveticaNeue-Bold', fontSize: 24, color: activeScreen === 'BlockedFriends' ? '#FA7B34' : '#2B2B2B' }}>/Blocked Friends</Text>
            </TouchableOpacity>
      </View>
      {activeScreen === 'Friends' ? <FriendsScreen /> : <BlockFriendScreen />}
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
        paddingVertical: 5,
        paddingBottom: 20
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
      marginBottom: 5,
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
    cardblock:{
      backgroundColor: '#FEE2CF',
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
    container:{
      backgroundColor: 'white',
      flex:1,
      flexDirection:'column',
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
    searchTerm:{
      color: '#FA7B34',
    }
});
