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
  
        const friendRequests = response.data.friends || [];
        setFilteredFriends(friendRequests);
      } catch (error) {
        console.error(error);
        if (error.response?.status === 403) {
          Alert.alert('Failed to authenticate you');
        }
      }
    };
  
    useEffect(() => {
      fetchFriendRequests();
    }, []);
  
    const acceptFriendRequest = (friendId) => {
      // handle accepting friend request
    };
  
    const declineFriendRequest = (friendId) => {
      // handle declining friend request
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
                <Text>{item.username} wants to be your friend!</Text>
                <View style={styles.friendRequestButtons}>
                  <TouchableOpacity onPress={() => acceptFriendRequest(item._id)}>
                    <Text>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => declineFriendRequest(item._id)}>
                    <Text>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <Text>No friend requests</Text>
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
      flexDirection: 'row',
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