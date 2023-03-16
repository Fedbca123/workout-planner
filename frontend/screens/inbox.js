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
        <Text style={{ paddingLeft: 20 }}>Incoming friend requests</Text>
        {filteredFriends.length > 0 ? (
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.friendRequestContainer}>
                <Text>{item.email}</Text>
                <Text>{item.firstName} {item.lastName} wants to be your friend!</Text>
                <View style={styles.friendRequestButtons}>
                  <TouchableOpacity onPress={() => handleAcceptFriendRequest(item._id)}>
                    <Text style={{ paddingRight: 20 }}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeclineFriendRequest(item._id)}>
                    <Text>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={{ paddingLeft: 20 }}>No friend requests</Text>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    friendRequestContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgray',
    },
    friendRequestButtons: {
      flexDirection: 'row',
    },
  });