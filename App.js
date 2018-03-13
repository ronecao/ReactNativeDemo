/**
 * MobileSDK RectNative
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter,
  View,
  PlatformIOS
} from 'react-native';
//import { StackNavigator } from 'react-navigation';

import CMSFramework from './CMSFramework.js';
import Button from './src/Button.js';//Button Class
import CMSTextField from './src/CMSTextField.js';//customized Field class
import  Storage from './src/Storage';//for store transaction
import TransListView from "./src/TransListView";//for display stored transactions

var st= new Storage();
/**
 * transaction types constant
 * @type {string}
 */
const SALE='SALE';
const AUTH='AUTH';
const RETURN='RETURN';
const CAPTURE='CAPTURE';
const VOID ='VOID';

/**
 * transaction storage name
 * @type {string}
 */
const MUIRA_SALE ='MUIRA_SALE';
const MP200_SALE ='MP200_SALE';
const MP200_AUTH ='MP200_AUTH';
var curStorage;
var curModule;
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}

class HomeScreen extends React.Component{
  static navigationOptions = {
    title: 'Home',
  };
  constructor(props) {
    super(props);
    this.state = {text: '',
                  numberOfLines:20,
                  transtype:''
                };
    
  }
  disablebutton=()=>{
    this.refs.button.disable();
    //this.refs.amountText.disable();
   
    this.setState({text:this.state.text+"ok\n",
                    numberOfLines:this.state.numberOfLines+1})
    
  };

  updateinfoLable=(value)=>{
    this.setState({text:this.state.text+ value+ "\n",
    numberOfLines:this.state.numberOfLines+1})
  };

    /**
     * insert record in to storage
     * @param value transresult JSON String
     * @returns {Promise<void>}
     */
    async addTransaction (value){
      console.log('storage name'+curStorage);
      await st.addRecord(value,curStorage).then((addres)=>{console.log('record result'+addres)})



  }

    /**
     * update alert screen data source
     * 1, get trans list
     * 2, get Authcode of transaction
     * 3, generate an array and set the datasource
     */
  updatepopupcontent(){
       st.getRecordlist(curStorage).then((readresult)=>{
          translist=readresult;
          console.log(translist);
          var dsv= [];
          for(var i=0;i<translist.length;i++)
          {
              console.log(translist[i].AuthCode);

              dsv.push(translist[i].AuthCode)
          }
          this.refs.listvi.changeDatasource(dsv);
      })
  }


  initFramework=()=>{

    let fw = new CMSFramework();

    CMSFramework.testing();
    CMSFramework.initFramework('teiU6f4zf6dBx9oGDKx4bBxOqmADhAWG');
    //CMSFramework.initFramework('1FgJZnjTAfBVi3fWysrnPpxIdGxTfNls');
    //
    this.addCMSListeners();


  };
  getpinpads=()=>{
 
    CMSFramework.getBTList();
  };
  showTrans=()=>{

      this.updatepopupcontent();
      this.refs.listvi.visible();
  };

  clearstorage=()=>{
      st.removeall();
  };
  onLayout=()=>{

    console.log("onLayout");
   
  };
  thisinitCompleted=(value)=>{
    console.log("thisinitCompleted");
    console.log(value);
    console.log(value.initCompleted);
      CMSFramework.getVersion();
    this.updateinfoLable("initCompleted");
    
  };
  getpinpadlistcompleted=(value)=>{
    console.log("getpinpadlistcompleted");
    if(typeof(value.pinpads)=="string")
    {
        console.log(typeof(value.pinpads));
        this.updateinfoLable("getpinpadlistcompleted"+value.pinpads);
        console.log("return");
        return;
    }
    console.log(value.pinpads[0]);
    CMSFramework.selectPinpad(value.pinpads[0]);

    //this.updateinfoLable("getpinpadlistcompleted");
    this.updateinfoLable("getpinpadlistcompleted"+value.pinpads[0]);
   curModule=value.pinpads[0];

  };

  processSale=()=>{
    var amtvalue = this.refs.amountText.getvalue();
    amtvalue=amtvalue.replace('.','');
    var saledict = {Amount:amtvalue,Tender:"credit"};
    var strdict= JSON.stringify(saledict);
    this.setState({transtype:SALE});
    //alert(strdict);
    CMSFramework.processSale(strdict);
  };
  processAuth=()=>{
    var amtvalue = this.refs.amountText.getvalue();
      amtvalue=amtvalue.replace('.','');
    var saledict = {Amount:amtvalue};
    var strdict= JSON.stringify(saledict);
    this.setState({transtype:AUTH});

    CMSFramework.processAuth(strdict);
  };
  processReturn=()=>{
        var amtvalue = this.refs.amountText.getvalue();
      amtvalue=amtvalue.replace('.','');
        var saledict = {Amount:amtvalue};
        var strdict= JSON.stringify(saledict);
      this.setState({transtype:RETURN});
      this.getstoragename(RETURN);
    this.showTrans();
            //find authcode1 get list 2 search
        //alert(strdict);
            /**
             *      transDict=    "{\"Amount\":\"1.00\",\"AuthCode\":\""+mAuthcodeText.getText()+"\",";
                    transDict=transDict + "\"Tender\":\"Credit\"}";
             */

        //CMSFramework.processAuth(strdict);
  };

  processCapture=()=>{
        var amtvalue = this.refs.amountText.getvalue();
      amtvalue=amtvalue.replace('.','');
        var saledict = {Amount:amtvalue};
        var strdict= JSON.stringify(saledict);
        this.setState({transtype:CAPTURE});
      this.getstoragename(CAPTURE);
        this.showTrans();
        //find authcode1 get list 2 search
        //alert(strdict);
        /**
         *      transDict=    "{\"Amount\":\"1.00\",\"AuthCode\":\""+mAuthcodeText.getText()+"\",";
                    transDict=transDict + "\"Tender\":\"Credit\"}";
         */


    };
  processVoid=()=>{
        var amtvalue = this.refs.amountText.getvalue();
      amtvalue=amtvalue.replace('.','');
        var saledict = {Amount:amtvalue};
        var strdict= JSON.stringify(saledict);
        this.setState({transtype:VOID});
      this.getstoragename(VOID);
        this.showTrans();
        //find authcode1 get list 2 search
        //alert(strdict);
        /**
         *      transDict=    "{\"Amount\":\"1.00\",\"AuthCode\":\""+mAuthcodeText.getText()+"\",";
                    transDict=transDict + "\"Tender\":\"Credit\"}";
         */


    };

startCapture=()=>{
    this.setState({transtype:CAPTURE});
    this.getstoragename(CAPTURE);
    this.showTrans()
};
startVoid=()=>{
        this.setState({transtype:VOID});
        this.getstoragename(VOID);
        this.showTrans()
};

    /**
     * Call back function, value is the pinpadConnection result
     * @param value
     */
  pinPadConnectionCompleted=(value)=>{
    console.log("pinPadConnectionCompleted");
    this.updateinfoLable('pinPadConnectionCompleted****'+value.pinPadConnectionCompleted);
  };

  verifySignature=(value)=> {
      console.log("verifySignature");
      this.updateinfoLable('verifySignature****' + value.verifySignature);
      console.log("signatureVerified");
      CMSFramework.signatureVerified(true);
  };

  transactionSaleCompleted=(value)=>{
    console.log("transactionSaleCompleted" +value.toString());
    this.updateinfoLable("transactionSaleCompleted****");
    this.updateinfoLable(value.transactionSaleCompleted);
    let resJson=JSON.parse(value.transactionSaleCompleted);
    if (typeof(resJson.Module)=="undefined")
    {
        console.log(value.transactionSaleCompleted.toString());
        return;
    }
    console.log(resJson.Module);
    switch (resJson.Module) {
        case 'MP200':
            curStorage=MP200_SALE;
            break;
        case 'M-10':
            curStorage=MUIRA_SALE;
            break;

    }
    this.addTransaction(value.transactionSaleCompleted)
  };
  transAuthorizationCompleted=(value)=>{
        console.log("transAuthorizationCompleted" +value.toString());
        this.updateinfoLable("transAuthorizationCompleted****");
        this.updateinfoLable(value.transAuthorizationCompleted);
      let resJson=JSON.parse(value.transAuthorizationCompleted);
      if (typeof(resJson.Module)=="undefined")
      {

          console.log(resJson.error);

          return;
      }

        switch (resJson.Module) {
              case 'MP200':
                  curStorage=MP200_AUTH;
                  break;

        }
        this.addTransaction(value.transAuthorizationCompleted)
  };
  transactionCaptureCompleted=(value)=>{
      console.log("transactionCaptureCompleted" +value.toString());
      this.updateinfoLable("transactionCaptureCompleted****");
      this.updateinfoLable(value.transactionCaptureCompleted);
      curStorage=MP200_SALE;
      this.addTransaction(value.transactionCaptureCompleted);
      console.log(this.state.text.toString())
    };
    transactionVoidCompleted=(value)=>{
        console.log("transactionVoidCompleted" +value.toString());
        console.log("transactionVoidCompleted" +value.transactionVoidCompleted);
    };
    transactionReturnCompleted=(value=>{
        console.log("transactionReturnCompleted" +value.toString());
        console.log("transactionReturnCompleted" +value.transactionReturnCompleted);
    });
  connectPinPad=()=>{
    CMSFramework.connectPinpad();
  };

  tmsUpdate=()=>{
      CMSFramework.tmsupdate();
  };
  TMSupdateCompleted =(value)=>{
        console.log("TMSupdateCompleted");
        this.updateinfoLable('TMSupdateCompleted****'+value);
  };

    /**
     * process after user select item
     * @param value
     */
  popuplistenerfunc=(value)=> {
      console.log(`app itemselected ${value}`);

      st.findRecord(value,curStorage).then((result)=>{this.processlistenerfuncresult(result)})

  };
  addCMSListeners=()=>{
      console.log('adding CMSEVENT');
      const CMSFrameworkModuleEmitter = new NativeEventEmitter(NativeModules.CMSFrameworkModule);

      const subscription = CMSFrameworkModuleEmitter.addListener(
          'CMSEVENT',
          (value) => {console.log('event value'+JSON.stringify(value));

              // handle event.
              if(typeof(value.initCompleted)!="undefined")
              {
                  this.thisinitCompleted(value);
              }

              if (typeof(value.pinpads)!="undefined")
              {
                  this.getpinpadlistcompleted(value);
              }
              if (typeof(value.pinPadConnectionCompleted)!="undefined")
              {
                  this.pinPadConnectionCompleted(value);
              }
              if (typeof(value.transactionSaleCompleted)!="undefined")
              {
                  this.transactionSaleCompleted(value);
              }
              if(typeof(value.verifySignature)!="undefined")
              {
                  this.verifySignature(value);
              }
              if(typeof(value.transAuthorizationCompleted)!="undefined")
              {
                  this.transAuthorizationCompleted(value);
              }
              if (typeof(value.transactionCaptureCompleted)!="undefined")
              {
                  this.transactionCaptureCompleted(value);
              }
              if(typeof(value.transactionVoidCompleted)!="undefined")
              {
                  this.transactionVoidCompleted(value);
              }
              if(typeof(value.transactionReturnCompleted)!="undefined")
              {
                  this.transactionReturnCompleted(value);
              }
              if(typeof (value.TMSupdateCompleted)!="undefined")
              {
                  this.TMSupdateCompleted(value)
              }
              if(typeof (value.transactionMessageUpdate)!="undefined"){
                  console.log('transactionMessageUpdate'+value.transactionMessageUpdate);
              }
              if(typeof (value.frameworkversion)!="undefined"){
                  console.log('version'+value.frameworkversion);
              }
              if (typeof (value.voiceReferral)!="undefined")
              {
                  let phoneres="{\"result\":\"true\",\"authcode\":\"abcdefg\"}"
                  CMSFramework.phoneReferral(phoneres);
              }



          }
      );
  }
  processlistenerfuncresult =(result)=>{
      let transtype= this.state.transtype;
      let refnumber='';
      let amtvalue='';
      let cardinfo='';
      let cardinfodict='';
      amtvalue = this.refs.amountText.getvalue();
      amtvalue=amtvalue.replace('.','');
      console.log(transtype);
      switch (transtype)
      {
          case RETURN:
              //console.log(result);

             // let jsonobj = JSON.parse(result);
               refnumber= result.Reference;
               cardinfo =result.Cardinfo;
              let returnDict = {Amount:amtvalue,Reference:refnumber,Tender:"credit",Cardinfo:cardinfo};
              let returnstr= JSON.stringify(returnDict);
              console.log(returnstr);
              CMSFramework.processReturn(returnstr);
              break;
          case CAPTURE:
              console.log(result);
              console.log(result.Cardinfo);
              cardinfo =result.Cardinfo;
              console.log(typeof (cardinfo));

              cardinfodict=JSON.parse(cardinfo);
              refnumber= result.Reference;
              let capDict={Amount:amtvalue,Reference:refnumber,Cardinfo:cardinfo};
              console.log(capDict);
              let capstr= JSON.stringify(capDict);
              console.log(capstr);
              CMSFramework.processCapture(capstr);
              break;
          case VOID:
              console.log(result);
              cardinfo =result.Cardinfo;
              console.log(typeof (cardinfo));

              cardinfodict=JSON.parse(cardinfo);
              refnumber= result.Reference;
              let voidDict={Amount:amtvalue,Reference:refnumber,Cardinfo:cardinfo};
              console.log(voidDict);
              let voidstr= JSON.stringify(voidDict);
              console.log(voidstr);
              CMSFramework.processVoid(voidstr);
              break;
          default:
              console.log('no transtype');
              break;
      }
  };

  getstoragename=(transtype)=>{
      console.log(curModule+' '+transtype);

      switch (transtype)
      {
          case SALE:
              if (curModule=='Miura 865')
              {
                  curStorage=MUIRA_SALE;
                  console.log(MUIRA_SALE)
              }
              if(curModule=='MP200')
              {
                  curStorage=MP200_SALE;
                  console.log(MP200_SALE)
              }
              break;
          case AUTH:

              if(curModule=='MP200')
              {
                  curStorage=MP200_AUTH;
                  console.log(MP200_AUTH)
              }
              break;
          case CAPTURE:

              if(curModule=='MP200')
              {
                  curStorage=MP200_AUTH;
                  console.log(MP200_AUTH)
              }
              break;
          case VOID:

              if(curModule=='MP200')
              {
                  curStorage=MP200_SALE;
                  console.log(MP200_SALE)
              }
              break;
          case RETURN:
              if (curModule=='Miura 865')
              {
                  curStorage=MUIRA_SALE;
                  console.log(MUIRA_SALE)
              }
              if(curModule=='MP200')
              {
                  curStorage=MP200_SALE;
                  console.log(MP200_SALE)
              }
              break;
          default:

              break;
      }
  };
  componentWillMount(){
        console.log("componentWillMount");

        //remove listeners
        if (this.framworkListenter!= undefined)
        {
            this.framworkListenter.remove();
        }
        if (this.popupListener!= undefined)
        {
            this.popupListener.remove();
        }

    }
  componentDidMount(){
    console.log("componentDidMount");
    this.disablebutton();


   /* this.framworkListenter= DeviceEventEmitter.addListener("CMSEVENT", (value)=> {

          console.log("event");
          console.log(value);
          // handle event.
          if(typeof(value.initCompleted)!="undefined")
          {
              this.thisinitCompleted(value);
          }

          if (typeof(value.pinpads)!="undefined")
          {
              this.getpinpadlistcompleted(value);
          }
          if (typeof(value.pinPadConnectionCompleted)!="undefined")
          {
              this.pinPadConnectionCompleted(value);
          }
          if (typeof(value.transactionSaleCompleted)!="undefined")
          {
              this.transactionSaleCompleted(value);
          }
          if(typeof(value.verifySignature)!="undefined")
          {
              this.verifySignature(value);
          }
        if(typeof(value.transAuthorizationCompleted)!="undefined")
        {
            this.transAuthorizationCompleted(value);
        }
        if (typeof(value.transactionCaptureCompleted)!="undefined")
        {
            this.transactionCaptureCompleted(value);
        }
        if(typeof(value.transactionVoidCompleted)!="undefined")
        {
            this.transactionVoidCompleted(value);
        }
        if(typeof(value.transactionReturnCompleted)!="undefined")
        {
            this.transactionReturnCompleted(value);
        }
        if(typeof (value.TMSupdateCompleted)!="undefined")
        {
            this.TMSupdateCompleted(value)
        }



      });*/
    this.popupListener=DeviceEventEmitter.addListener("ItemSelected",this.popuplistenerfunc)
  }
  shouldComponentUpdate(nextProps,nextState){
    //console.log("shouldComponentUpdate");
    return true
  }
  componentWillUpdate(nextProps,nextState){
    //console.log("componentWillUpdate");
  }
  componentDidUpdate(prevProps,prevState){
    //console.log("componentDidUpdate");
  }
  
  render(){
    
    return (
    <View style={styles.container} onLayout={this.onLayout()} >

            <TransListView ref="listvi"/>

          <View style={styles.lines} >
              <Text>Home Screen</Text>
          </View>
          <View style={styles.lines2}>

            <CMSTextField ref="amountText" placeholder = 'try me' />
          </View>
          <View style={styles.lines} >
          <Button setDisabled='false' style={styles.button} onPress={this.initFramework} title ='init'/>
          <Button ref="button" style={styles.button} onPress={() => {this.getpinpads()}} title="getPinpad" />
          <Button style={styles.button} onPress={() => {this.connectPinPad()}} title="connectPinPad" />
          </View>
          <View style={styles.lines} >
          <Button style={styles.button} setDisabled='false' onPress={()=>{this.processSale()}} title ='Sale'/>
          <Button style={styles.button} ref="button" onPress={this.processAuth} title="Auth" />
          <Button style={styles.button} onPress={this.startCapture} title="Capture" />
          </View>
          <View style={styles.lines} >
          <Button style={styles.button} setDisabled='false' onPress={()=>{this.startVoid()}} title ='Void'/>
          <Button style={styles.button} ref="button" onPress={() => {this.processReturn()}} title="Return" />
          <Button style={styles.button} setDisabled='false' onPress={this.tmsUpdate} title ='tmsupdate'/>
          </View>
            <View style={styles.lines}>
                <Button style={styles.button} setDisabled='false'  onPress={this.clearstorage} title="clear storage" />
            </View>

          <Text style={styles.textStyle} ref="lablelt" numberOfLines={this.state.numberOfLines} >{this.state.text.toString()}</Text>

        
    </View>);
  }



}
  

const DetailsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Details Screen</Text>
  </View>
);

/*const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'React-Native Demo',
    },
  },
  Details: {
    screen: DetailsScreen,
    navigationOptions: {
      headerTitle: 'Details',
    },
  },
});*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    
    
  },
  lines: {
    width: "100%", 
    backgroundColor: 'powderblue',
    alignItems: 'flex-start', 
    justifyContent: 'center', 
    flexDirection:'row',
    flexWrap:'wrap'
  },
  lines2: {
    width: "100%", 
    backgroundColor: 'powderblue',
  
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
    button:{
        height:50,
        width:100,
        borderRadius:20,
        backgroundColor:'gray',
        justifyContent:'center',
        alignContent:'center',
        overflow:'hidden',
    },

});

export default HomeScreen;