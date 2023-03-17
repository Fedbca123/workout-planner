import {
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import * as Progress from 'react-native-progress';

export default function SplashScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' , backgroundColor:'black'}}>
        {/*<ActivityIndicator size="large" />*/}
        <Progress.CircleSnail
          size={100}
          progress={0}
          spinDuration={500}
          duration={500}
          color={['#24C8FE','#FA7B34']}
          backgroundColor={"white"}
          fill={"white"}
        />
      </View>
    );
  }