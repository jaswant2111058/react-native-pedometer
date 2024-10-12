#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ReactNativePedometer, NSObject)

RCT_EXTERN_METHOD(startPedometerUpdates:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(stopPedometerUpdates)

@end
