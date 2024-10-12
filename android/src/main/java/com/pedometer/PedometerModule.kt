package com.reactnativepedometer

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Promise

class ReactNativePedometerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), SensorEventListener {

  private var sensorManager: SensorManager? = null
  private var stepCounterSensor: Sensor? = null
  private var stepCount: Int = 0

  init {
    sensorManager = reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    stepCounterSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
  }

  override fun getName(): String {
    return "ReactNativePedometer"
  }

  @ReactMethod
  fun startPedometerUpdates(promise: Promise) {
    if (stepCounterSensor == null) {
      promise.reject("Pedometer Not Available", "This device does not support pedometer data")
      return
    }
    val registered = sensorManager?.registerListener(this, stepCounterSensor, SensorManager.SENSOR_DELAY_UI)
    if (registered == true) {
      promise.resolve("Pedometer started")
    } else {
      promise.reject("Sensor Error", "Failed to register step counter listener")
    }
  }

  @ReactMethod
  fun stopPedometerUpdates() {
    sensorManager?.unregisterListener(this)
  }

  override fun onSensorChanged(event: SensorEvent?) {
    if (event?.sensor?.type == Sensor.TYPE_STEP_COUNTER) {
      stepCount = event.values[0].toInt()
      
      // Emit step count data to JavaScript
      reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("pedometerUpdate", stepCount)
    }
  }

  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
    // Not used
  }

  // Required for EventEmitter in React Native
  @ReactMethod
  fun addListener(eventName: String) {}

  @ReactMethod
  fun removeListeners(count: Int) {}
}
