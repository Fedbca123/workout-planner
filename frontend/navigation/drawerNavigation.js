import React from 'react';
import { Alert, Settings} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useGlobalState } from '../GlobalState.js';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../AuthProvider';
import MainNav from './mainNav.js';
import SettingsPage from '../screens/settingsPage.js';
import DrawerHeader from '../component/drawerHeader.js';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const [ globalState, updateGlobalState ] = useGlobalState();
    const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);
    const onLogoutButton = () => {
        Alert.alert( 'Are you sure?','',
        [{
            text: 'Yes',
            onPress: () => {
                updateGlobalState("authToken", null);
                updateGlobalState("user", null);
                SecureStore.deleteItemAsync("authKey");
                SecureStore.deleteItemAsync("userId");
                setIsLoggedIn(false);
            },
        },
        {
            text: 'No',
        }],
        { cancelable: false});
    }

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
                label="Logout"
                onPress={onLogoutButton}
            />
        </DrawerContentScrollView>
    );
}

export default function DrawerNav (props) {
    return (
        <Drawer.Navigator
        drawerContent={CustomDrawerContent}
        screenOptions={{swipeEnabled: false,
                        drawerStyle: {
                            width: "40%"
                        }}}>
            <Drawer.Screen 
                name="Main" 
                component={ MainNav }
                options={{ headerShown: false }} />
            <Drawer.Screen
                name="Settings"
                component={SettingsPage}
                options={{ header: DrawerHeader }}/>
        </Drawer.Navigator>
    )
}