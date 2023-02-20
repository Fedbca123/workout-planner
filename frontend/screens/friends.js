import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useGlobalState} from '../../GlobalState.js';

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

  const handleAddFriend = () => {
    Alert.alert('Invitation sent', 'Your invitation has been sent to the email address', [{ text: 'OK' }]);
  };

  return  (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}
            bounces={false}>
            <Text style={styles.Title}>Friends</Text>
            <TextInput 
              style={styles.searchBar}
              placeholder="Search by email..."
              value={searchTerm}
              onChangeText={handleSearch}
            />
            {/* <Text style={styles.Title}></Text> */}
            <ScrollView contentContainerStyle={styles.CardContainer}
              bounces={true}>
        {filteredFriends.map((friend, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.name}>
              {friend.firstName} {friend.lastName}
            </Text>
            <Text>{friend.email}</Text>
          </View>
        ))}
        {filteredFriends.length === 0 && (
          <TouchableOpacity onPress={handleAddFriend}>
            <Text style={styles.name}>Add friend</Text>
          </TouchableOpacity>

        )}
          </ScrollView>
          <View style={{borderColor: 'black', borderWidth: '0px'}}/>
          </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
      //borderColor: 'black',
      //borderWidth: '1px',
      width: '95%',
      alignSelf:'center',
      marginBottom: 30
    }

});
