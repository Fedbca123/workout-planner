import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function DiscoverPage(props) {
  return (
    
    <View style={styles.container}>
        <View>
            <Text>Discover New Exercises!</Text>
        </View>
        <View>
            <Text>Discover New Workouts!</Text>
        </View>
            {/* <StatusBar style= "auto" />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 500,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
});