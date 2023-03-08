import React from 'react';

import HomeHeader from "../component/homeHeader.js";
import { StyleSheet, Button, ListItem, Text, Image, View, SafeAreaView, TextInput, Card, Icon, Pressable , ScrollView, Alert} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useGlobalState } from '../GlobalState.js';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../AuthProvider';
import MainNav from './mainNav.js';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {

    const [ globalState, updateGlobalState ] = useGlobalState();
    const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);
    const onLogout = () => {
        updateGlobalState("authToken", null);
        updateGlobalState("user", null);
        SecureStore.deleteItemAsync("authKey");
        SecureStore.deleteItemAsync("userId");
        setIsLoggedIn(false);
    }

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <View style = {styles.container}>
               <Button title='Logout' onPress={onLogout}></Button> 
            </View>
        </DrawerContentScrollView>
    );
}

export default function DrawerNav (props) {
    return (
        <Drawer.Navigator drawerContent={CustomDrawerContent}>
            <Drawer.Screen 
                name="Main" 
                component={ MainNav }
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