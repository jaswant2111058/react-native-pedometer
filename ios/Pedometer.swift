import Foundation
import CoreMotion
import React

@objc(ReactNativePedometer)
class ReactNativePedometer: NSObject {
    
    private let pedometer = CMPedometer()
    
    // Create a bridge reference
    private var bridge: RCTBridge?

    // This method is called when the module is initialized
    @objc
    func setBridge(_ bridge: RCTBridge) {
        self.bridge = bridge
    }

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
                // Sending events to JavaScript
                self.sendPedometerData(pedometerData: pedometerData)
            }
        }
    }
    
    @objc(stopPedometerUpdates)
    func stopPedometerUpdates() {
        pedometer.stopUpdates()
    }
    
    private func sendPedometerData(pedometerData: [String: Any]) {
        // Check if bridge is available
        guard let bridge = bridge else {
            return
        }
        
        // Send event to JavaScript
        bridge.eventDispatcher().sendAppEvent(withName: "PedometerData", body: pedometerData)
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
