
```markdown
# React Native Pedometer Module

This is a React Native module for tracking step count using the device's pedometer functionality. It provides a simple API to start and stop pedometer updates and handle step counting seamlessly across both Android and iOS platforms.

## Installation

1. **Install the package:**

   Use npm or yarn to install the `react-native-pedometer` package:

   ```bash
   npm install react-native-pedometer
   ```

   or

   ```bash
   yarn add react-native-pedometer
   ```

2. **Link the package (if necessary):**

   If you are using React Native version below 0.60, you need to link the package manually:

   ```bash
   react-native link react-native-pedometer
   ```

3. **For iOS:**

   After installing the package, navigate to the `ios` directory and install the CocoaPods dependencies:

   ```bash
   cd ios
   pod install
   cd ..
   ```

## Usage

Here is a sample implementation of how to use the `react-native-pedometer` in your app.

### `App.tsx`

```javascript
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
      console.log({ steps }); // sensor in Android devices provides a cumulative count of all steps taken since the last reboot
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
```

## Permissions

### Android Permissions

For Android, you need to request the following permissions in your app:

- **BODY_SENSORS**: Required to access the step counter.
- **ACTIVITY_RECOGNITION**: Required for devices running Android 10 (API level 29) and above to track physical activity.

Add the following permissions to your `AndroidManifest.xml` file:

```xml
<uses-permission android:name="android.permission.BODY_SENSORS" />
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
```

### iOS Permissions

On iOS, no explicit permissions are required for accessing the step count feature as it is handled internally by the Core Motion framework. However, make sure your app's privacy policy reflects the usage of health data.

## Conclusion

You are now set up to use the React Native Pedometer module in your application! If you encounter any issues or have questions, feel free to open an issue in the repository.

```

### Notes

- Ensure that the instructions match your project's structure and configurations.
- Feel free to customize any sections to better fit your project's needs or specifics.
- Don't forget to include any additional setup instructions if necessary for the iOS or Android configurations.
