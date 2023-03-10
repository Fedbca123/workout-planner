import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert} from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function DrawerHeader ({navigation}) {
    return (
        <View style= {styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                onPress={() => { navigation.openDrawer() }}>
                    <Image
                        source={require('../../assets/menu-burger.png')}
                        style={styles.ImageIconStyle}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 80, 
        width: '100%',
        backgroundColor: "white",
    },
    buttonContainer: {
        height: 30,
        width: 40,
        marginLeft: 20,
        marginTop: 50,
        backgroundColor: "white"
    },
    ImageIconStyle: {
        width: 30,
        height: 30
    }
});