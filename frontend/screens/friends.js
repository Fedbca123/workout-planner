import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert} from 'react-native';
import React, {useState} from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useGlobalState} from '../../GlobalState.js';

export default function Friends(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [globalState, updateGlobalState] = useGlobalState();
  //console.log('user in friends:',globalState.user);
  return  (
        <SafeAreaView style={styles.container}>
          <KeyboardAwareScrollView contentContainerStyle={styles.container}
            bounces={false}>
            <Text style={styles.Title}>Friends</Text>
            <TextInput style={styles.inputstyle}
              placeholder="Search..."
              returnKeyType="go"
              onChangeText={(newText) => {setSearchTerm(newText)}}
              //make the line below do something forreal
              onSubmitEditing={()=>{console.log('searching for',searchTerm)}}
              />
            <Text style={styles.Heading}>Workout Friends</Text>
            <ScrollView contentContainerStyle={styles.CardContainer}
              bounces={true}>
                <Image source={require('../../assets/calendarIcon.png')}/>
            </ScrollView>
            <View style={{borderColor: 'black', borderWidth: '1px'}}/>
            <Text style={styles.Heading}>Add a Friend Via Email</Text>
            <View style={styles.addFriendContainer}>
              <TextInput style={styles.inputstyle}
                placeholder="friend@email.com"
                returnKeyType="go"
                onChangeText={(newText) => {setFriendEmail(newText)}}
                value={friendEmail}
                onSubmitEditing={()=>{
                  // maybe we can try a quick handler here but here's an idea for how to handle the add friend functionality?
                  // still need to actually send invitiations and set up how those come into play
                  Alert.alert(`Sent a friend invitation to ${friendEmail}.`)
                  setFriendEmail('')
                }}
                />
            </View>
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
      borderWidth: '1px',
      flex: 0.95,
      width: '95%',
      alignSelf: 'center'
    },
    Card:{
        borderRadius: 15,
        backgroundColor: '#2B2B2B',
    },
    cardContent:{
        
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
