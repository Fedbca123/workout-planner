import {
	StyleSheet,
	Button,
	Text,
	Image,
    TextInput,
    FlatList,
	View,
    TouchableOpacity,
    Alert
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {useGlobalState} from '../GlobalState.js';
import { useIsFocused } from '@react-navigation/native';
import API_Instance from "../../backend/axios_instance";

export default function Inbox({ navigation }) {
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [globalState, updateGlobalState] = useGlobalState();
    const isFocused = useIsFocused();
    
    const fetchFriendRequests = async () => {
      try {
        const response = await API_Instance.get(`users/${globalState.user._id}/invites/all`, {
          headers: {
            'authorization': `Bearer ${globalState.authToken}`,
          },
        });
        // console.log(response.data.friendInvites);
        const friendRequests = response.data.friendInvites || [];
        
        setFilteredFriends(friendRequests);
      } catch (error) {
        console.error(error);
        // console.log(error);
        if (error.response?.status === 403) {
          Alert.alert('Failed to authenticate you');
        }
      }
    };
  
    useEffect(() => {
      if (isFocused) {
        fetchFriendRequests();
      }
    }, [isFocused]);

    const handleAcceptFriendRequest = async (acceptNewFriendId) => {
        try {
          const id = acceptNewFriendId;
          const response = await API_Instance.patch(`users/${globalState.user._id}/invites/accept/${id}`, null, {
            headers: {
              'authorization': `Bearer ${globalState.authToken}`,
            }
          });
          
          let temp = {...globalState.user};
          temp.friends = temp.friends.push(id);
          updateGlobalState("user", temp);

          fetchFriendRequests(); 
        } catch (error) {
          console.error(error);
          throw error;
        }
    };
  
    const handleDeclineFriendRequest = async (deleteNewFriendId) => {
        const deleteid = deleteNewFriendId;
        try {
          const response = await API_Instance.patch(`users/${globalState.user._id}/invites/reject/${deleteid}`, null, {
            headers: {
              'authorization': `Bearer ${globalState.authToken}`,
            },
          });
          fetchFriendRequests();
        } catch (error) {
          console.error(error);
          throw error;
        }
    };

    return (
      <View style={styles.container(globalState.theme.colorBackground)}>
        <Text style={styles.headerText(globalState.theme.colorText)}>Incoming friend requests</Text>
        {filteredFriends.length > 0 ? (
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.friendRequestContainer(globalState.theme.color1)}>
                <Text style={styles.friendName(globalState.theme.colorText)}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.friendEmail}>{item.email}</Text>
                <Text style={styles.friendRequestText(globalState.theme.colorText)}>
                  wants to be your friend!
                </Text>
                <View style={styles.friendRequestButtons}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAcceptFriendRequest(item._id)}
                  >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleDeclineFriendRequest(item._id)}
                  >
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noRequestText(globalState.theme.colorText)}>You have no friend requests!</Text>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: (color) => {
      return {
        flex: 1,
        backgroundColor: color,
      }
    },
    headerText: (color) => {
      return {
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'flex-start',
        marginTop: 40,
        marginLeft: 20,
        color: color
      }
    },
    friendRequestContainer: (backgroundColor) => {
      return {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: backgroundColor,
        borderRadius: 5,
        marginHorizontal: 10,
        marginTop: 10,
      }
    },
    friendName: (color) => {
      return {
        fontSize: 18,
        fontWeight: 'bold',
        color: color,
      }
    },
    friendEmail: {
      fontSize: 14,
      color: '#888',
    },
    friendRequestText: (color) => {
      return {
        fontSize: 16,
        marginTop: 2,
        color: color,
      }
      
    },
    friendRequestButtons: {
      flexDirection: 'row',
      marginTop: 10,
    },
    acceptButton: {
      backgroundColor: '#4CAF50',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    acceptButtonText: {
      ...Platform.select({
      ios: {
        fontFamily: 'HelveticaNeue-Bold'
      },
      android: {
        fontFamily: "Roboto"
      },
    }),
      // fontFamily: 'HelveticaNeue-Bold',
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    declineButton: {
      backgroundColor: '#F44336',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    declineButtonText: {
      ...Platform.select({
      ios: {
        fontFamily: 'HelveticaNeue-Bold'
      },
      android: {
        fontFamily: "Roboto"
      },
    }),
      // fontFamily: 'HelveticaNeue-Bold',
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    noRequestText: (color) => {
      return {
        fontSize: 15,
        alignSelf: 'flex-start',
        marginTop: 5,
        marginLeft: 20,
        color: color
      }
    },
  });