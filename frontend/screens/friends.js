import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect} from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useGlobalState} from '../GlobalState.js';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import API_Instance from "../../backend/axios_instance";
import { useIsFocused } from '@react-navigation/native';
import { colors } from 'react-native-elements';


const FriendsScreen = () => {
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [globalState, updateGlobalState] = useGlobalState();
  const isFocused = useIsFocused();


  function removeItem(array, val){
    const index = array.indexOf(val);
    if(index > -1) {
      array.splice(index,1);
    }
    return array;
  }

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = filteredFriends.filter((friend) =>
      friend.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  const handleDeleteFriend = (deleteFriendID, deleteFirstName, deleteLastName) => {
    const deleteID = deleteFriendID;
    // console.log(deleteID);
    const sendDeleteFriend = async () => {
      try {
        const response = await API_Instance.patch(`users/${globalState.user._id}/friends/remove/${deleteID}`, null, {
          headers: {
            Authorization : `Bearer ${globalState.authToken}`,
          },
        });
        if (response.status === 200) {
          console.log(response.data);
          Alert.alert('Unfriended', `You have unfriended ${deleteFirstName} ${deleteLastName}`, [{ text: 'OK' }]);
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

  const handleBlockFriend = (blockedFriendID, blockedFirstName, blockedLastName) => {
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
          Alert.alert('Blocked', `${blockedFirstName} ${blockedLastName} has been blocked`, [{ text: 'OK' }]);
        }
        fetchFriends();

        let temp = {...globalState.user};
        temp.friends = removeItem(temp.friends, blockedFriendID);
        updateGlobalState("user", temp);

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
          Alert.alert('Invitation sent', `Your invitation has been sent to ${email}`, [{ text: 'OK' }]);
          setSearchTerm('');
        }
        if (response.status == 496) {
          console.log(response.data);
          Alert.alert('Already requested');
        }
      })
      .catch((error) => {
        //console.log("Error is", error)
        //console.log("Error status", error.status)
        if(error.response.status === 491){
          Alert.alert(`You have ${email} in your blocked list. Unblock them to be able to add them.`);
        } else if (error.response.status === 497) {
          Alert.alert(`You are blocked by ${email}`);
        } else if (error.response.status === 496) {
          Alert.alert(`Already requested a friendship from ${email}`);
        }  else if (error.response.status === 498) {
          Alert.alert(`User ${error.message} does not exist`);
        } else if (error.response.status === 493) {
          Alert.alert(`${email} does not have a verified account`);
        } else {
          console.error(error.response.status);
          Alert.alert('An unknown error occurred');
        }
      });
    };

    if(email.toLowerCase() == globalState.user.email.toLowerCase()){
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
    if(isFocused){
      //console.log('focused on friends');
      fetchFriends();
    }
    
  }, [isFocused]);

  useEffect(() => {
    if (searchTerm === '') {
      fetchFriends();
    }
  }, [searchTerm]);

  return (
    <View style={{backgroundColor: globalState.theme.colorBackground, flex:1}}>
      
      <TextInput
        style={styles.searchBar}
        placeholder="Search by email"
        placeholderTextColor={"#808080"}
        value={searchTerm}
        onChangeText={handleSearch}
        keyboardType="email-address"
        autoCapitalize='none'
        autoComplete='off'
        autoCorrect={false}
      />
          
          
          <View>
            {filteredFriends.length === 0 && searchTerm.length === 0? (
              <Text>You have no friends added! Search by email to add a friend </Text>
            ) : (
            filteredFriends.map((user) => (
              <View key={user._id} style={styles.card(globalState.theme.color1)}>

                {/* left side */}
                <View style={styles.info}>
                  <Text style={styles.name(globalState.theme.colorText)}>
                    {user.firstName} {user.lastName}</Text>
                  <Text style={styles.email(globalState.theme.colorText)}>{user.email.toLowerCase()}</Text>
                </View>

                {/* right side */}
                <View style={styles.buttons}>
                  <View>
                    <Button style = {styles.buttonslook}
                      title="Unfriend"
                      onPress={() => {
                        Alert.alert( `Are you sure you wish to unfriend ${user.firstName + " " + user.lastName}?`,'',
                          [{
                              text: 'Yes',
                              onPress: () => {
                                handleDeleteFriend(user._id, user.firstName, user.lastName)
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
                  
                  <View style={{marginLeft:5}}>
                    <Button style = {styles.buttonlook}
                      title="Block"
                      onPress={() => {
                        Alert.alert( `Are you sure you wish to block ${user.firstName + " " + user.lastName}?`,'',
                          [{
                              text: 'Yes',
                              onPress: () => {
                                handleBlockFriend(user._id, user.firstName, user.lastName)
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

              </View>
              ))
            )}
          </View>

      {filteredFriends.length === 0 && searchTerm.length != 0 &&(
        <TouchableOpacity  style={styles.iconButton(globalState.theme.colorText)} onPress={handleAddFriend}>
                <Text style={styles.addFriend}>Add friend <Text style={styles.searchTerm}>{searchTerm.toLowerCase()}</Text></Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


const BlockFriendScreen = () => {
  const [filteredBlockFriends, setFilteredBlockFriends] = useState([]);
  const [globalState, updateGlobalState] = useGlobalState();

  const handleUnblockFriend = (unblockFriendID, unblockedFirstName, unblockedLastName) => {
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
        if (response.status === 200) {
          console.log(response.data);
          Alert.alert('Unblocked', `${unblockedFirstName} ${unblockedLastName} has been unblocked`, [{ text: 'OK' }]);
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
      // console.log("Blocked friends are", response.data.blockedUsers);
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
    <View style={{backgroundColor: globalState.theme.colorBackground, flex:1}}>
      <Text style={(styles.Heading(globalState.theme.colorText))}>The following users are blocked by you: </Text>
        
        {!filteredBlockFriends || filteredBlockFriends.length === 0 ? (
          <Text style={{ paddingLeft: 20 }}>You have no users in your blocked list!  </Text>
            ) : ( 
              filteredBlockFriends.map((user) => (
                <View key={user._id} style={styles.cardblock(globalState.theme.color1)}>

                {/* left side */}
                <View style={styles.info}>
                  <Text style={styles.name(globalState.theme.colorText)}>
                    {user.firstName} {user.lastName}</Text>
                  <Text style={styles.email(globalState.theme.colorText)}>{user.email.toLowerCase()}</Text>
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
                            handleUnblockFriend(user._id, user.firstName, user.lastName)
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
  
  const handleButtonPress = (screen) => {
    setActiveScreen(screen);
  };

  return  (
    <SafeAreaView style={styles.container(globalState.theme.colorBackground)}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container(globalState.theme.colorBackground)} bounces={false}>
        <SegmentedControlTab
          values={['Friends', 'Blocked Users']}
          selectedIndex={activeScreen === 'Friends' ? 0 : 1}
          onTabPress={(index) => handleButtonPress(index === 0 ? 'Friends' : 'BlockedFriends')}
          tabsContainerStyle={styles.tabsContainerStyle}
          tabStyle={styles.tabStyle(globalState.theme.color1)}
          activeTabStyle={styles.activeTabStyle(globalState.theme.color4)}
          tabTextStyle={styles.tabTextStyle(globalState.theme.colorText)}
          activeTabTextStyle={styles.activeTabTextStyle(globalState.theme.colorText)}
        />
        {activeScreen === 'Friends' ? <FriendsScreen /> : <BlockFriendScreen />}
      </KeyboardAwareScrollView>
    </SafeAreaView>
    )
}


const styles = StyleSheet.create({
  Heading: (color) => {
    return {
      ...Platform.select({
        ios: {
          fontFamily: 'HelveticaNeue-Bold'
        },
        android: {
          fontFamily: "Roboto"
        },
      }),
      // fontFamily: 'HelveticaNeue-Bold',
      color: color,
      fontSize: 18,
      textAlign: 'left',
      paddingLeft: 20,
      marginVertical: 5
    }
  },
  searchBar: {
      height: 40,
      padding: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: "#d1cfcf"  
  },
  card: (color) => {
    return{
      backgroundColor: color,
      padding: 20,
      marginBottom: 5,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      borderRadius: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
  },
  cardblock: (color) => {
    return {
      backgroundColor: color,
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
    }
  },
  name: (color) => {

    return {
      fontSize: 18,
      fontWeight: 'bold',
      color: color
    }
  },
  email: (color) => {
    return {
      color: color
    }
  },
  container: (color) => {
    return{
      backgroundColor: color,
      flex: 1,
      flexDirection:'column'
    }
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-end",
    margin: 10,
    // borderWidth:20,
  },
  iconButton: (color) => {
    return{
      backgroundColor: color,
      borderRadius: 50,
      padding: 10,
      marginLeft: 10,
      alignContent: 'center',  
    }
  },
  addFriend: {
    padding: 10,
    alignContent: 'center',
  },
  info: {
    alignContent: 'flex-end',
  },
  searchTerm:{
    color: '#FA7B34',
  },
  activeTabStyle: (color) => {
    return {
      backgroundColor: color,
    }
  },
  tabTextStyle: (color) => {
    return {
      color: color,
    }
  },
  activeTabTextStyle: (color) => {
    return {
      color: color,
    }
  },
  tabsContainerStyle: {
      alignSelf: 'center',
      marginBottom: 5,
  },
  tabStyle: (color) => {
    return {
      backgroundColor: color,
      borderColor: '#ccc',
    }
  },
});
