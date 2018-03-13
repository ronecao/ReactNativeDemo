package com.mobilesdkreactnative;


import android.Manifest;
import android.os.Build;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.cmsonline.framework.*;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.util.Map;

/**
 * ReactNative Core Code
 * Created by chris on 03/01/2018.
 */

public class AndroidFrameworkModule extends ReactContextBaseJavaModule implements EMVIOListener {
    private static EMVIOFramework mframework;
    private static final String CMSEVENT="CMSEVENT";
    @Override
    public String getName() {
        return "CMSFrameworkModule";
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public AndroidFrameworkModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @ReactMethod
    public void initFramework(String token)
    {
        mframework = new EMVIOFramework(getReactApplicationContext(),token,"",this);
        if(Build.VERSION.SDK_INT>=23) {

            getCurrentActivity().requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO,Manifest.permission.BLUETOOTH_ADMIN,Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.WRITE_EXTERNAL_STORAGE,Manifest.permission.READ_PHONE_STATE}, 0);
            //            this.b("android.permission.BLUETOOTH");

        }
    }
    @ReactMethod
    public void getBTList()
    {
        
     String[] pinpads=   mframework.getPinpads();
     WritableMap params = Arguments.createMap();
     WritableArray pinpadarray= Arguments.createArray();
     for(String v : pinpads)
     {
         pinpadarray.pushString(v);
     }

     params.putArray("pinpads",pinpadarray);
     sendEvent(getReactApplicationContext(),CMSEVENT,params);

    }
    @ReactMethod
    public void selectDevice(String name)
    {
        Log.v("TAG","selectDevice:");
        mframework.selectPinpad(name);
    }
    @ReactMethod
    public void connectPinpad()
    {
        Log.v("TAG","connectPinpad:");
        mframework.connectPinpad();
    }
    @ReactMethod
    public void tmsupdate()
    {
        Log.v("TAG","TMSupdate:");
        mframework.TMSupdate();
    }

    @Override
    public void initCompleted(String s) {
        Log.v("TAG","initCompleted:"+s);
        WritableMap params = Arguments.createMap();
        params.putString("initCompleted",s);
        //JSONObject json=EMVIOUtility.getJsonObject(s);
        //Map map=(Map)json;

        sendEvent(getReactApplicationContext(),"CMSEVENT",params);


    }
    @ReactMethod
    public void processSale(String s)
    {
        mframework.processSale(getReactApplicationContext(),s);
    }
    @ReactMethod
    public void processVoid(String s)
    {
        mframework.processVoid(getReactApplicationContext(),s);
    }
    @ReactMethod
    public void processReturn(String s)
    {
        mframework.processReturn(getReactApplicationContext(),s);
    }
    @ReactMethod
    public void processAuth(String s)
    {
        mframework.processAuthorization(getReactApplicationContext(),s);
    }
    @ReactMethod
    public void processCapture(String s)
    {
        Log.v("MSDKRN",s);
        mframework.processCapture(getReactApplicationContext(),s);
    }
    @ReactMethod
    public void signatureVerified(boolean s)
    {
        mframework.signatureVerified(s);
    }


    @Override
    public void pinPadConnectionCompleted(String s) {

        Log.v("TAG","pinPadConnectionCompleted:"+s);
        WritableMap params = Arguments.createMap();
        params.putString("pinPadConnectionCompleted",s);
        sendEvent(getReactApplicationContext(),"CMSEVENT",params);
    }

    @Override
    public void pinPadDisattached() {
        Log.v("TAG","pinPadDisattached:");
        WritableMap params = Arguments.createMap();
        params.putString("pinPadDisattached","true");
        sendEvent(getReactApplicationContext(),"CMSEVENT",params);
    }

    @Override
    public void transactionMessageUpdate(String s) {
        Log.v("TAG","transactionMessageUpdate:"+s);
        WritableMap params = Arguments.createMap();
        params.putString("transactionMessageUpdate",s);
        //sendEvent(getReactApplicationContext(),"CMSEVENT",params);

    }

    @Override
    public void confirmCardinfo(String s) {
        Log.v("TAG","confirmCardinfo:"+s);
        WritableMap params = Arguments.createMap();
        params.putString("confirmCardinfo",s);
        sendEvent(getReactApplicationContext(),"CMSEVENT",params);

    }

    @Override
    public void transactionSaleCompleted(String s) {
        Log.v("TAG","transactionSaleCompleted:"+s);
        WritableMap params = Arguments.createMap();
        params.putString("transactionSaleCompleted",s);
        sendEvent(getReactApplicationContext(),"CMSEVENT",params);
    }

    @Override
    public void transAuthorizationCompleted(String s) {
        Log.v("TAG","transAuthorizationCompleted:"+s);
        WritableMap params = Arguments.createMap();
        params.putString("transAuthorizationCompleted",s);
        sendEvent(getReactApplicationContext(),"CMSEVENT",params);
    }

    @Override
    public void selectAID(String[] strings) {

    }

    @Override
    public void transactionCaptureCompleted(String s) {
        Log.v("TAG","transactionCaptureCompleted:"+s);
        WritableMap params = Arguments.createMap();
        params.putString("transactionCaptureCompleted",s);
        sendEvent(getReactApplicationContext(),"CMSEVENT",params);

    }

    @Override
    public void transactionVoidCompleted(String s) {
        Log.v("TAG","transactionVoidCompleted:"+s);
        WritableMap params = Arguments.createMap();
        params.putString("transactionVoidCompleted",s);
        sendEvent(getReactApplicationContext(),"CMSEVENT",params);

    }

    @Override
    public void transactionReturnCompleted(String s) {
        Log.v("TAG","transactionReturnCompleted:"+s);
        WritableMap params = Arguments.createMap();
        params.putString("transactionReturnCompleted",s);
        sendEvent(getReactApplicationContext(),"CMSEVENT",params);

    }

    @Override
    public void TMSupdateCompleted(String s) {
        Log.v("TAG","TMSupdateCompleted:"+s);
        WritableMap params = Arguments.createMap();
        params.putString("TMSupdateCompleted",s);
        sendEvent(getReactApplicationContext(),"CMSEVENT",params);
    }

    @Override
    public void verifySignature(boolean b) {
        Log.v("TAG","verifySignature:"+b);
        WritableMap params = Arguments.createMap();
        params.putString("verifySignature",b+"");
        sendEvent(getReactApplicationContext(),"CMSEVENT",params);
    }

    @Override
    public void voiceRefferal(boolean b, String s) {
        Log.v("TAG","voiceRefferal:"+b);
        WritableMap params = Arguments.createMap();
        params.putString("voiceRefferal",b+"");
        sendEvent(getReactApplicationContext(),"CMSEVENT",params);
    }
    private void postEvent(String event,String value)
    {
        Log.v("TAG",event+":"+value);
        WritableMap params = Arguments.createMap();
        params.putString(event,value);
        //JSONObject json=EMVIOUtility.getJsonObject(s);
        //Map map=(Map)json;

        sendEvent(getReactApplicationContext(),"CMSEVENT",params);
    }
}
