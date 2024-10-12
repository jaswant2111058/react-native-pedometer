import { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform } from 'react-native';
import {
  startPedometerUpdates,
  stopPedometerUpdates,
  subscribeToPedometerUpdates,
} from 'react-native-pedometer';

const App = () => {
  const [stepCount, setStepCount] = useState(0);

  // Permission request function for Android
  const requestPedometerPermissions = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        const bodySensorsGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BODY_SENSORS,
          {
            title: 'Body Sensors Permission',
            message: 'This app needs access to your step counter.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        // Request ACTIVITY_RECOGNITION for Android 10 and above
        if (Platform.Version >= 29) {
          const activityRecognitionGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
            {
              title: 'Activity Recognition Permission',
              message: 'This app needs access to your physical activity data.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          return (
            bodySensorsGranted === PermissionsAndroid.RESULTS.GRANTED &&
            activityRecognitionGranted === PermissionsAndroid.RESULTS.GRANTED
          );
        }

        return bodySensorsGranted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const subscription = subscribeToPedometerUpdates((steps: number) => {
      console.log({ steps }); //  sensor in Android devices provides a cumulative count of all steps taken since the last reboot
      setStepCount(steps);
    });

    return () => {
      subscription(); // Clean up the subscription on unmount
      stopPedometerUpdates(); // Stop updates when the component unmounts
    };
  }, []);

  const handleStart = async () => {
    const hasPermission = await requestPedometerPermissions();
    if (hasPermission) {
      startPedometerUpdates();
    } else {
      console.log('Pedometer permissions were not granted.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Steps: {stepCount}</Text>
      <Button title="Start Pedometer" onPress={handleStart} />
    </View>
  );
};

export default App;
