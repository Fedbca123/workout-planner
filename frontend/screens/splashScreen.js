import {
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

export default function SplashScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Getting token...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }