import { NativeModules, NativeEventEmitter } from 'react-native';

const { ReactNativePedometer } = NativeModules;

const pedometerEventEmitter = new NativeEventEmitter(ReactNativePedometer);

const startPedometerUpdates = async () => {
  try {
    await ReactNativePedometer.startPedometerUpdates();
  } catch (error) {
    console.error('Failed to start pedometer updates:', error);
  }
};

const stopPedometerUpdates = () => {
  ReactNativePedometer.stopPedometerUpdates();
};

// Subscribe to pedometer updates (assuming you send updates from native code)
const subscribeToPedometerUpdates = (callback: any) => {
  const subscription = pedometerEventEmitter.addListener(
    'pedometerUpdate',
    callback
  );
  return () => subscription.remove(); // Clean up the subscription
};

export {
  startPedometerUpdates,
  stopPedometerUpdates,
  subscribeToPedometerUpdates,
};
