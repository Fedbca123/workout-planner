import React from 'react';
import homeNav from './homeNav.js';
import HomeHeader from "../component/homeHeader.js";
import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Input } from 'react-native-elements';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {

    const onLogout = () => {
        //props.navigation.closeDrawer();
        //props.navigation.goBack();
    }

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <View style = {styles.container}>
               <Button title='Logout'></Button> 
            </View>
        </DrawerContentScrollView>
    );
}

export default function DrawerNav (props) {
    return (
        <Drawer.Navigator drawerContent={CustomDrawerContent}>
            <Drawer.Screen 
                name="Home" 
                component={homeNav}
                options={{ header: HomeHeader }} />
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        marginLeft: 5,
        height: 100,
        flexDirection: 'row',
        alignItems: 'flex-end',
    }
});