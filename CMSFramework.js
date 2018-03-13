/**
 * CMSFramework class interacting with native library
 */
import { NativeModules } from 'react-native';

export default class CMSFramework  {
    
    
    
    constructor() {
        console.log("class CMSFramework ");

        
    }
    
    //NativeModules.CMSFrameworkModule
    static testing(){
        console.log("testing code");
    }

    /**
     * initialize the library by the token
     * it will connect to CMS server
     * @param API server Token
     */
   static initFramework=(token)=>{
        CMSFramework.testing();
        NativeModules.CMSFrameworkModule.initFramework(token);
        
    };
    /**
     * get version inform
     */
   static getVersion=()=>{
        NativeModules.CMSFrameworkModule.getVersion();
   }
    /**
     * get BTList
     */
    static getBTList=()=>{

        NativeModules.CMSFrameworkModule.getBTList();
    };
    /**
     * select Pinpad, the name is string variable
     * @param name
     */
    static selectPinpad=(name)=>{
        NativeModules.CMSFrameworkModule.selectDevice(name);

    };
    /**
     * connect to pinpad
     */
    static connectPinpad=()=>{
        NativeModules.CMSFrameworkModule.connectPinpad();
    };
    /**
     * start void process. the strdict is a JSON String requires
     * 'Amount' field  the Amount value without decimal point
     * 'Reference' field the Reference value from original
     * 'Tender' field with value 'Credit'
     * @param strdict
     */
    static processSale=(strdict)=>{
        NativeModules.CMSFrameworkModule.processSale(strdict);
    };
    /**
     * start void process. the strdict is a JSON String requires
     * 'Amount' field  the Amount value without decimal point
     * 'Reference' field the Reference value from original
     * 'Tender' field with value 'Credit'
     * @param strdict
     */
    static processReturn=(strdict)=>{
        NativeModules.CMSFrameworkModule.processReturn(strdict);
    };
    /**
     * start void process. the strdict is a JSON String requires
     * 'Amount' field  the Amount value without decimal point
     * 'Reference' field the Reference value from original
     * @param strdict
     */
    static processVoid=(strdict)=>{
        NativeModules.CMSFrameworkModule.processVoid(strdict);
    };
    /**
     * start Capture process. the strdict is a JSON String requires
     * 'Amount' field  the Amount value without decimal point
     * 'Reference' field the Reference value from original
     * @param strdict
     */
    static processCapture=(strdict)=>{
        NativeModules.CMSFrameworkModule.processCapture(strdict);
    };
    /**
     * start Authorization process. the strdict is a JSON String requires
     * 'Amount' field  the Amount value without decimal point
     * @param strdict
     */
    static processAuth=(strdict)=>{
        NativeModules.CMSFrameworkModule.processAuth(strdict);
    };
    /**
     * processing TMS update
     */
    static tmsupdate=()=>{
        NativeModules.CMSFrameworkModule.tmsupdate();
    };
    /**
     * used when Library requires signature verification, to notify library signature verification result
     * @param verified signature  verification result
     */
    static signatureVerified =(verified)=>{
        NativeModules.CMSFrameworkModule.signatureVerified(verified);
    }

    static phoneReferral=(result)=>{
        NativeModules.CMSFrameworkModule.phoneReferral(result);
    }
    
}
