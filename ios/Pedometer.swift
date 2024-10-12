import Foundation
import CoreMotion
import React

@objc(ReactNativePedometer)
class ReactNativePedometer: NSObject {
  
  private let pedometer = CMPedometer()
  
  @objc(startPedometerUpdates:rejecter:)
  func startPedometerUpdates(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard CMPedometer.isStepCountingAvailable() else {
      reject("Pedometer Not Available", "This device does not support pedometer data", nil)
      return
    }
    
    pedometer.startUpdates(from: Date()) { (pedometerData, error) in
      if let error = error {
        reject("Pedometer Error", error.localizedDescription, error)
        return
      }
      
      if let data = pedometerData {
        let pedometerData: [String: Any] = [
          "steps": data.numberOfSteps.intValue,
          "distance": data.distance?.doubleValue ?? 0.0
        ]
        resolve(pedometerData)
      }
    }
  }
  
  @objc(stopPedometerUpdates)
  func stopPedometerUpdates() {
    pedometer.stopUpdates()
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
