import * as React from 'react';
import Login from "../screens/login.js";
import Register from "../screens/registration.js";
import AdminPage from "../screens/adminPage.js";
import { AuthContext } from '../AuthProvider';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import SplashScreen from '../screens/splashScreen';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useGlobalState } from '../GlobalState';
import DrawerNav from './drawerNavigation.js';
import API_Instance from "../../backend/axios_instance";
import ForgotPassword from '../screens/forgotPassword.js';

const RootStack = createNativeStackNavigator();
export default function RootNav()
{
    const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);
    const [ checking, setIsChecking ] = React.useState(true);
    const [ globalState, updateGlobalState] = useGlobalState();
    

    React.useEffect(() => {
        const checkIfUserIsLoggedIn = async () => {
        const authToken = await SecureStore.getItemAsync("authKey");
        const id = await SecureStore.getItemAsync("userId");
    
          // user is logged in
          if (authToken !== null && id !== null) {
            setIsLoggedIn(true);
            API_Instance
                .get(`users/${id}`, {
                    headers: {
                        'authorization': `Bearer ${authToken}`
                    }
                })
                .then((response) => {
                    updateGlobalState("user", response.data);
          			updateGlobalState("authToken", authToken);
                })
                .catch((e) => {
                    console.log(e)
                    setIsLoggedIn(false);
                });
          }
          setTimeout(() => {
            setIsChecking(false);
          }, 2000)
          
        };
    
        checkIfUserIsLoggedIn();
    }, []);

    if (checking) {
        return (
          <SplashScreen/>
        );
    }

    return (
        <NavigationContainer>
            <RootStack.Navigator>
            {isLoggedIn ? (
                <>
                    <RootStack.Screen
                        name="Drawer"
                        component={DrawerNav}
                        options={{ headerShown: false }}
                    />
                </>
            ) : (
                <>
                    <RootStack.Screen
                        name="login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                    <RootStack.Screen
                        name="registration"
                        component={Register}
                        options={{ headerShown: false }}
                    />
                    <RootStack.Screen
                        name="admin"
                        component={AdminPage}
                        options={{ headerShown: false }}
                    />
                    <RootStack.Screen
                      name="forgot-password"
                      component={ForgotPassword}
                      options={{headerShown: false}}
                    />
                </>
            )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
}