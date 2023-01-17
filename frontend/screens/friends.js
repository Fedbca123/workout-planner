import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon } from 'react-native';
import React from 'react';

const users = [
    {
       name: 'brynn',
       avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
    },
]

export default function Friends(props) {
    return  (
        <SafeAreaView style={styles.container}>
            <Text style={styles.Title}>Friends</Text>
            <Text style={styles.Heading}>Workout friends</Text>
            
            {/* Will put flat list here and turn them into cards */}
            
            <Text style={styles.Heading}>Add a friend</Text>
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
    },
    Heading:{
        fontFamily: 'HelveticaNeue',
        color: '#2B2B2B',
        fontSize: 18,
        textAlign: 'left',
        paddingLeft: 20,
    },
    Card:{
        borderRadius: 15,
        backgroundColor: '#2B2B2B',
    },
    cardContent:{
        
    }
});
