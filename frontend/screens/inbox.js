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
import API_Instance from "../../backend/axios_instance";

export default function Inbox({ navigation }) {
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [globalState, updateGlobalState] = useGlobalState();

    const fetchFriendRequests = async () => {
      try {
        const response = await API_Instance.get(`users/${globalState.user._id}/invites/all`, {
          headers: {
            'authorization': `Bearer ${globalState.authToken}`,
          },
        });
        console.log(response.data.friendInvites);
        const friendRequests = response.data.friendInvites || [];
        
        setFilteredFriends(friendRequests);
      } catch (error) {
        console.error(error);
        console.log(error);
        if (error.response?.status === 403) {
          Alert.alert('Failed to authenticate you');
        }
      }
    };
  
    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const handleAcceptFriendRequest = async (acceptNewFriendId) => {
        try {
          const id = acceptNewFriendId;
          const response = await API_Instance.patch(`users/${globalState.user._id}/invites/accept/${id}`, null, {
            headers: {
              'authorization': `Bearer ${globalState.authToken}`,
            }
          });
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
      <View style={styles.container}>
        <Text style={styles.headerText}>Incoming friend requests</Text>
        {filteredFriends.length > 0 ? (
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.friendRequestContainer}>
                <Text style={styles.friendName}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.friendEmail}>{item.email}</Text>
                <Text style={styles.friendRequestText}>
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
          <Text style={styles.noRequestText}>You have no friend requests!</Text>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    headerText: {
      fontWeight: "bold",
		  fontSize: 20,
		  alignSelf: "left",
		  marginTop: 40,
      marginLeft: 20,
    },
    friendRequestContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
      backgroundColor: "#F5F5F5",
      borderRadius: 5,
      marginHorizontal: 10,
      marginTop: 10,
    },
    friendName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    friendEmail: {
      fontSize: 14,
      color: "#777",
    },
    friendRequestText: {
      fontSize: 16,
      marginTop: 5,
      color: "#333",
    },
    friendRequestButtons: {
      flexDirection: "row",
      marginTop: 10,
    },
    acceptButton: {
      backgroundColor: "#4CAF50",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    acceptButtonText: {
      fontFamily: 'HelveticaNeue-Bold',
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    declineButton: {
      backgroundColor: "#F44336",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    declineButtonText: {
      fontFamily: 'HelveticaNeue-Bold',
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    friendRequestButtons: {
      flexDirection: 'row',
    },
    noRequestText: {
      fontWeight: "bold",
		  fontSize: 20,
		  alignSelf: "left",
		  marginTop: 40,
      marginLeft: 20,
    }
  });