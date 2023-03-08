import * as React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from './AuthProvider';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import SplashScreen from './screens/splashScreen';
import AuthNav from './navigation/authNav';

const RootStack = createStackNavigator();
export default function Root()
{
    const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);
    const [checking, setIsChecking] = React.useState(true);
    

    React.useEffect(() => {
        const checkIfUserIsLoggedIn = async () => {
        const result = await SecureStore.getItemAsync("state");
    
          // user is logged in
          if (result !== null) {
            setIsLoggedIn(true);
          }
    
          setIsChecking(false);
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
            <Stack.Navigator>
            {isLoggedIn ? (
                <Stack.Screen name="authNav" component={AuthNav} />
            ) : (
                <>

                </>
            )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}