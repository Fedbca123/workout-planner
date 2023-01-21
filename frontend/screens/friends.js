import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView} from 'react-native';
import React, {useState} from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Friends(props) {
  //console.log("friends", props.route.params.user) -> works
  const [searchTerm, setSearchTerm] = useState('');
  const [friendEmail, setFriendEmail] = useState('');

  return  (
        <SafeAreaView style={styles.container}>
          <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <Text style={styles.Title}>Friends</Text>
            <TextInput style={styles.inputstyle}
              placeholder="Search..."
              returnKeyType="enter"
              onChangeText={(newText) => {setSearchTerm(newText)}}
              //make the line below do something forreal
              onSubmitEditing={()=>{console.log('searching for',searchTerm)}}
              />
            <Text style={styles.Heading}>Workout Friends</Text>
            <ScrollView contentContainerStyle={styles.CardContainer}>
              <Image source={require('../../assets/calendarIcon.png')}/>
            </ScrollView>
            <View style={styles.addFriendContainer}>
              <Text style={styles.Heading}>Add a Friend Via Email</Text>
              <TextInput style={styles.inputstyle}
                placeholder="friend@email.com"
                returnKeyType="enter"
                onChangeText={(newText) => {setFriendEmail(newText)}}
                //make the line below do something forreal
                onSubmitEditing={()=>{console.log('adding friend',friendEmail)}}
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
        paddingVertical: 10
    },
    Heading:{
        fontFamily: 'HelveticaNeue-Bold',
        color: '#2B2B2B',
        fontSize: 18,
        textAlign: 'left',
        paddingLeft: 20,
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
      flex:0.2,
      borderColor: 'black',
      borderWidth: '1px',
      width: '95%',
      alignSelf:'center',
      marginBottom: 30
    }

});
