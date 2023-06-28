import React from 'react';
import { Alert, StyleSheet, Text} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useGlobalState } from '../GlobalState.js';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../AuthProvider';
import MainNav from './mainNav.js';
import SettingsPage from '../screens/settingsPage.js';
import SettingsHeader from '../component/settingsHeader.js';
import InboxHeader from '../component/inboxHeader.js';
import inbox from '../screens/inbox.js';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const [ globalState, updateGlobalState ] = useGlobalState();
    const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);
    const onLogoutButton = () => {
        Alert.alert( 'Are you sure you wish to log out?','',
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
        <DrawerContentScrollView {...props} bounces={false}>
            <DrawerItemList {...props} />
            <DrawerItem
                label={() => <Text>Logout</Text>}
                onPress={onLogoutButton}
                style={styles.logoutButton}
                
            />
        </DrawerContentScrollView>
    );
}

export default function DrawerNav (props) {
    const [ globalState, updateGlobalState ] = useGlobalState();
    return (
        <Drawer.Navigator
        drawerContent={CustomDrawerContent}
        screenOptions={{swipeEnabled: false,
                        drawerStyle: {
                            width: "40%",
                            backgroundColor: globalState.theme.color1
                        },
                        drawerLabelStyle: {
                            color: globalState.theme.colorText
                        },
                        drawerActiveBackgroundColor: globalState.theme.color2
                        }}>
            <Drawer.Screen 
                name="Main" 
                component={ MainNav }
                options={{ headerShown: false}} />
            <Drawer.Screen
                name="Inbox"
                component={inbox}
                options={{ header: (props) => <InboxHeader globalState={globalState} {...props}/> }}/>
            <Drawer.Screen
                name="Settings"
                component={SettingsPage}

                options={{header: (props) => <SettingsHeader globalState={globalState} {...props}/>}}/>
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({
    logoutButton: {
        marginTop: 80,
        backgroundColor: "#f25252",

    },
});