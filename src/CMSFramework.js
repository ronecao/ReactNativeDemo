/**
 * CMSFramework class interacting with native library
 */
import { NativeEventEmitter, NativeModules } from 'react-native';

export default class CMSFramework {
  constructor() {
    console.log('class CMSFramework');
    this.addCMSListeners();
  }
  // NativeModules.CMSFrameworkModule
  static testing() {
    console.log('testing code');
  }
  addCMSListeners = () => {
    console.log('adding CMSEVENT');
    const CMSFrameworkModuleEmitter = new NativeEventEmitter(NativeModules.SlycePayModule);
    CMSFrameworkModuleEmitter.addListener(
      'CMSEVENT',
      (value) => {
        console.log(`event value ${JSON.stringify(value)}`);
        // handle event.
        if (typeof (value.initCompleted) !== 'undefined') {
          this.initCompleted(value.initCompleted);
        }
        if (typeof (value.DeviceList) !== 'undefined') {
          this.getDevicelistcompleted(value.DeviceList);
        }
        if (typeof (value.selectAID) !== 'undefined') {
          this.selectAID(value.selectAID);
        }
        if (typeof (value.deviceConnectionCompleted) !== 'undefined') {
          this.deviceConnectionCompleted(value.deviceConnectionCompleted);
        }
        if (typeof (value.transactionSaleCompleted) !== 'undefined') {
          this.transactionSaleCompleted(value.transactionSaleCompleted);
        }
        if (typeof (value.transAuthorizationCompleted) !== 'undefined') {
          this.transAuthorizationCompleted(value.transAuthorizationCompleted);
        }
        if (typeof (value.transactionCaptureCompleted) !== 'undefined') {
          this.transactionCaptureCompleted(value.transactionCaptureCompleted);
        }
        if (typeof (value.transactionVoidCompleted) !== 'undefined') {
          this.transactionVoidCompleted(value.transactionVoidCompleted);
        }
        if (typeof (value.transactionReturnCompleted) !== 'undefined') {
          this.transactionReturnCompleted(value.transactionReturnCompleted);
        }
        if (typeof (value.transactionMessageUpdate) !== 'undefined') {
          this.transactionMessageUpdate(value.transactionMessageUpdate);
          console.log(`transactionMessageUpdate${value.transactionMessageUpdate}`);
        }
        if (typeof (value.frameworkversion) !== 'undefined') {
          this.frameworkversion(value.frameworkversion);
          console.log(`version${value.frameworkversion}`);
        }
        if (typeof (value.deviceDisattached) !== 'undefined') {
          this.deviceDisattached(value.deviceDisattached);
          console.log('deviceDisattached');
        }
        if (typeof (value.captureSignature) !== 'undefined') {
          this.captureSignature(value.captureSignature);
          console.log('captureSignature');
          this.captureSignature();
        }
      },
    );
  };
  /**
     * initialize the library by the token
     * it will connect to CMS server
     * @param API server Token
     */
   static initFramework = (token) => {
     CMSFramework.testing();
     NativeModules.SlycePayModule.initFramework(token);
   };
  /**
     * get version inform
     */
   static getVersion = () => {
     console.log('getversion');
     NativeModules.SlycePayModule.getVersion();
   }
    /**
     * get BTList
     */
    static getDeviceList = () => {
      NativeModules.SlycePayModule.getDeviceList();
    };
    /**
     * connect to pinpad
     */
    static connectDevice = (name) => {
      NativeModules.SlycePayModule.connectDevice(name);
    };
    /**
     * start void process. the strdict is a JSON String requires
     * 'Amount' field  the Amount value without decimal point
     * 'Reference' field the Reference value from original
     * 'Tender' field with value 'Credit'
     * @param strdict
     */
    static processSale = (strdict) => {
      NativeModules.SlycePayModule.processSale(strdict);
    };
    /**
     * start void process. the strdict is a JSON String requires
     * 'Amount' field  the Amount value without decimal point
     * 'Reference' field the Reference value from original
     * 'Tender' field with value 'Credit'
     * @param strdict
     */
    static processReturn = (strdict) => {
      NativeModules.SlycePayModule.processReturn(strdict);
    };
    /**
     * start void process. the strdict is a JSON String requires
     * 'Amount' field  the Amount value without decimal point
     * 'Reference' field the Reference value from original
     * @param strdict
     */
    static processVoid = (strdict) => {
      NativeModules.SlycePayModule.processVoid(strdict);
    };
    /**
     * start Capture process. the strdict is a JSON String requires
     * 'Amount' field  the Amount value without decimal point
     * 'Reference' field the Reference value from original
     * @param strdict
     */
    static processCapture = (strdict) => {
      NativeModules.SlycePayModule.processCapture(strdict);
    };
    /**
     * start Authorization process. the strdict is a JSON String requires
     * 'Amount' field  the Amount value without decimal point
     * @param strdict
     */
    static processAuth = (strdict) => {
      NativeModules.SlycePayModule.processAuth(strdict);
    };
    /**
     * used when Library requires signature verification,
     * to notify library signature verification result
     * @param verified signature  verification result
     */
    static signatureCaptured = (verified) => {
      NativeModules.SlycePayModule.signatureCaptured(verified);
    };
    static aidSelected = (value) => {
      NativeModules.SlycePayModule.aidSelected(value);
    };
    // delegate functions
    initCompleted = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
    getDevicelistcompleted = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${JSON.stringify(value)}`);
    };
    selectAID = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
    deviceConnectionCompleted = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
    transactionSaleCompleted = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
    transAuthorizationCompleted = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
    transactionCaptureCompleted = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
    transactionVoidCompleted = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
    transactionReturnCompleted = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
    transactionMessageUpdate = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
    frameworkversion = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
    deviceDisattached = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
    captureSignature = (value) => {
      console.log(`origional function, please replace it by assiging new functions ${value}`);
    };
}
