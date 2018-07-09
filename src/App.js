/**
 * MobileSDK RectNative
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  DeviceEventEmitter,
  TextInput,
  View,
} from 'react-native';

import CMSFramework from './CMSFramework';
import Button from './Button';// Button Class
import Record from './RecordOpt';// for store transaction
import TransListView from './TransListView';// for display stored transactions

const st = new Record();
const framework = new CMSFramework();

/**
 * transaction types constant
 * @type {string}
 */
const SALE = 'SALE';
const AUTH = 'AUTH';
const RETURN = 'RETURN';
const CAPTURE = 'CAPTURE';
const VOID = 'VOID';

/**
 * transaction storage name
 * @type {string}
 */
const STSALE = 'SALE';
const STAUTH = 'AUTH';
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      numberOfLines: 1,
      transtype: '',
      amountText: '',
      curlistmode: '',
      curStorage: '',
    };
  }
  componentWillMount() {
    console.log('componentWillMount');
    // remove listeners
    if (this.framworkListenter !== undefined) {
      this.framworkListenter.remove();
    }
    if (this.popupListener !== undefined) {
      this.popupListener.remove();
    }
  }
  componentDidMount() {
    console.log('componentDidMount');
    this.disablebutton();
    this.popupListener = DeviceEventEmitter.addListener('ItemSelected', this.popuplistenerfunc);
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(`${nextProps}${nextState}`);
    return true;
  }
  getpinpads = () => {
    CMSFramework.getDeviceList();
  };
  getDevicelistcompleted = (value) => {
    console.log('getDevicelistcompleted');
    if (typeof (value.DeviceList) === 'string') {
      console.log(typeof (value));
      this.updateinfoLable(`getDevicelistcompleted${value}`);
      console.log('return');
      return;
    }
    this.tranlistview.changeDatasource(value);
    this.setState({
      curlistmode: 'module',
    });
    this.tranlistview.visible();
  };
  selectAID = (value) => {
    console.log('selectAID');
    if (typeof (value) === 'string') {
      console.log(typeof (value));
      this.updateinfoLable(`selectAID${value}`);
      console.log('return');
      return;
    }
    console.log(value[0]);
    CMSFramework.selectAID(value[0]);
    this.updateinfoLable(`selectAID${value[0]}`);
  };

  clearstorage = () => {
    st.removeall();
  };
  thisinitCompleted = (value) => {
    console.log('thisinitCompleted');
    console.log(value);
    CMSFramework.getVersion();
    this.enablebutton();
    this.updateinfoLable(`initCompleted：${value}`);
  };
  processSale = () => {
    let amtvalue = this.state.amountText;
    amtvalue = amtvalue.replace('.', '');
    const saledict = {
      Amount: amtvalue,
      Tender: 'credit',
    };
    const strdict = JSON.stringify(saledict);
    this.setState({ transtype: SALE });
    CMSFramework.processSale(strdict);
  };
  processAuth = () => {
    let amtvalue = this.state.amountText;
    amtvalue = amtvalue.replace('.', '');
    const saledict = { Amount: amtvalue };
    const strdict = JSON.stringify(saledict);
    this.setState({ transtype: AUTH });
    CMSFramework.processAuth(strdict);
  };
  processReturn = () => {
    this.setState({ transtype: RETURN });
    this.showTrans(STSALE);
  };
  startCapture = () => {
    this.setState({ transtype: CAPTURE });
    this.showTrans(STAUTH);
  };
  startVoid = () => {
    this.setState({ transtype: VOID });
    this.showTrans(STSALE);
  };
  /**
   * Call back function, value is the pinpadConnection result
   * @param value
   */
  deviceConnectionCompleted = (value) => {
    console.log('deviceConnectionCompleted');
    this.updateinfoLable(`deviceConnectionCompleted****${value}`);
  };
  captureSignature = () => {
    console.log('captureSignature');
    this.updateinfoLable('captureSignature****');
    console.log('signatureCaptured');
    CMSFramework.signatureCaptured(true);
  };
  transactionSaleCompleted = (value) => {
    console.log(`transactionSaleCompleted${value}`);
    this.updateinfoLable('transactionSaleCompleted');
    this.updateinfoLable(JSON.parse(value).status);
    const resJson = JSON.parse(value);
    if (typeof (resJson.Module) === 'undefined') {
      console.log(value.toString());
      return;
    }
    console.log(resJson.Module);
    this.addTransaction(value, STSALE);
  };
  transAuthorizationCompleted = (value) => {
    console.log(`transAuthorizationCompleted ${value.toString()}`);
    this.updateinfoLable('transAuthorizationCompleted****');
    this.updateinfoLable(JSON.parse(value).status);
    const resJson = JSON.parse(value);
    if (typeof (resJson.Module) === 'undefined') {
      console.log(resJson.error);
      return;
    }
    this.addTransaction(value, STAUTH);
  };
  transactionCaptureCompleted = (value) => {
    console.log(`transactionCaptureCompleted ${value.error}`);
    console.log(`transactionCaptureCompleted ${value.toString()}`);
    this.updateinfoLable('transactionCaptureCompleted:');
    // this.updateinfoLable(`sataus ${JSON.parse(value).status}`);
    this.addTransaction(value, STSALE);
  };
  transactionVoidCompleted = (value) => {
    console.log(`transactionVoidCompleted ${value.toString()}`);
    this.updateinfoLable('transactionVoidCompleted:');
    this.updateinfoLable(JSON.parse(value).status);
  };
  transactionReturnCompleted = (value) => {
    console.log(`transactionReturnCompleted ${value.toString()}`);
    this.updateinfoLable('transactionReturnCompleted:');
    this.updateinfoLable(JSON.parse(value).status);
  };
  transactionMessageUpdate = (value) => {
    this.updateinfoLable(value);
  };
  frameworkversion = (value) => {
    console.log(`current native version ${value}`);
  };
  deviceDisattached = () => {
    console.log('deviceDisattached');
  };
  connectPinPad = () => {
    CMSFramework.connectPinpad();
  };
  /**
   * process after user select item
   * @param value
   */
  popuplistenerfunc = (value) => {
    console.log(`app itemselected ${value}`);
    if (this.state.curlistmode === 'trans') {
      st.findRecord(value, this.state.curStorage).then((result) => {
        this.processlistenerfuncresult(result);
      });
    }
    if (this.state.curlistmode === 'module') {
      console.log(`selected mdouel ${value}`);
      console.log(value);
      CMSFramework.connectDevice(value);
      this.updateinfoLable(`getDevicelistcompleted${value}`);
    }
  };
  processlistenerfuncresult = (result) => {
    const { transtype } = this.state;
    let amtvalue = this.state.amountText;
    amtvalue = amtvalue.replace('.', '');
    console.log(transtype);
    switch (transtype) {
      case 'RETURN': {
        const refnumber = result.Reference;
        const cardinfo = result.Cardinfo;
        const returnDict = {
          Amount: amtvalue,
          Reference: refnumber,
          Tender: 'credit',
          Cardinfo: cardinfo,
        };
        const returnstr = JSON.stringify(returnDict);
        console.log(returnstr);
        CMSFramework.processReturn(returnstr);
        break;
      }
      case 'CAPTURE': {
        console.log(result);
        console.log(result.Cardinfo);
        const cardinfo = result.Cardinfo;
        console.log(typeof (cardinfo));
        const refnumber = result.Reference;
        const capDict = {
          Amount: amtvalue,
          Reference: refnumber,
          Cardinfo: cardinfo,
        };
        console.log(capDict);
        const capstr = JSON.stringify(capDict);
        console.log(capstr);
        CMSFramework.processCapture(capstr);
        break;
      }
      case 'VOID': {
        console.log(result);
        const cardinfo = result.Cardinfo;
        console.log(typeof (cardinfo));
        const refnumber = result.Reference;
        const voidDict = {
          Amount: amtvalue,
          Reference: refnumber,
          Cardinfo: cardinfo,
        };
        console.log(voidDict);
        const voidstr = JSON.stringify(voidDict);
        console.log(voidstr);
        CMSFramework.processVoid(voidstr);
        break;
      }
      default: {
        console.log('no transtype');
        break;
      }
    }
  };
  /**
   * update alert screen data source
   * 1, get trans list
   * 2, get Authcode of transaction
   * 3, generate an array and set the datasource
   */
  updatepopupcontent = (curStorage) => {
    console.log('get recordlist');
    this.setState({
      curlistmode: 'trans',
      curStorage,
    });
    st.getRecordlist(curStorage).then((readresult) => {
      const translist = readresult;
      console.log('translist');
      console.log(translist);
      const dsv = [];
      for (let i = 0; i < translist.length; i += 1) {
        console.log(`translist ${translist[i].AuthCode}`);
        dsv.push(`AuthCode\n${translist[i].AuthCode}`);
      }
      if (this.tranlistview !== null) {
        this.tranlistview.changeDatasource(dsv);
        this.tranlistview.visible();
      }
    });
  }
  /**
   * insert record in to storage
   * @param value transresult JSON String
   * @returns {Promise<void>}
   */
  addTransaction = async (value, curStorage) => {
    console.log(`storage name ${curStorage}`);
    await st.addRecord(value, curStorage).then((addres) => { console.log(`record result${addres}`); });
  }
  updateinfoLable = (value) => {
    if (this.state.numberOfLines <= 10) {
      this.setState({
        text: `${this.state.text}${value}\n`,
        numberOfLines: this.state.numberOfLines + 1,
      });
    } else {
      this.setState({
        text: `${value}\n`,
        numberOfLines: 1,
      });
    }
  };
  disablebutton = () => {
    if (this.salbtn !== null) {
      this.salbtn.disable();
    }
    if (this.getpinpadbtn !== null) {
      this.getpinpadbtn.disable();
    }
    if (this.authbtn !== null) {
      this.authbtn.disable();
    }
    if (this.capbtn !== null) {
      this.capbtn.disable();
    }
    if (this.voidbtn !== null) {
      this.voidbtn.disable();
    }
    if (this.returnbtn !== null) {
      this.returnbtn.disable();
    }
  };
  enablebutton = () => {
    if (this.salbtn !== null) {
      this.salbtn.enable();
    }
    if (this.getpinpadbtn !== null) {
      this.getpinpadbtn.enable();
    }
    if (this.authbtn !== null) {
      this.authbtn.enable();
    }
    if (this.capbtn !== null) {
      this.capbtn.enable();
    }
    if (this.voidbtn !== null) {
      this.voidbtn.enable();
    }
    if (this.returnbtn !== null) {
      this.returnbtn.enable();
    }
  };
  showTrans = (storage) => {
    this.updatepopupcontent(storage);
  };
  initFramework = () => {
    // CMSFramework.testing();
    // CMSFramework.initFramework('vno1tqMPFUjsDngozHpyLPQPbKeUB89Z');
    CMSFramework.initFramework('3fyl02KZBOERy7yEd6SkWqbuYmGqHQ2T');
    framework.initCompleted = this.thisinitCompleted;
    framework.getDevicelistcompleted = this.getDevicelistcompleted;
    framework.captureSignature = this.captureSignature;
    framework.deviceConnectionCompleted = this.deviceConnectionCompleted;
    framework.deviceDisattached = this.deviceDisattached;
    framework.frameworkversion = this.frameworkversion;
    framework.transactionCaptureCompleted = this.transactionCaptureCompleted;
    framework.transactionMessageUpdate = this.transactionMessageUpdate;
    framework.transactionReturnCompleted = this.transactionReturnCompleted;
    framework.transactionSaleCompleted = this.transactionSaleCompleted;
    framework.transactionVoidCompleted = this.transactionVoidCompleted;
    framework.transAuthorizationCompleted = this.transAuthorizationCompleted;
  };
  render() {
    return (
      <View style={styles.container} >
        <TransListView ref={(ref) => { this.tranlistview = ref; }} meranderRow={(e) => { console.log(`renderding function${e}`); return (`title${e}`); }} />
        <View style={styles.lines} >
          <Text>Home Screen</Text>
        </View>
        <View style={styles.lines2}>
          <TextInput onChangeText={value => this.setState({ amountText: value })} value={this.state.amountText} placeholder="Please Enter Amount" />
        </View>
        <View style={styles.lines} >
          <Button setDisabled={false} onPress={this.initFramework} title="init" />
          <Button ref={(ref) => { this.getpinpadbtn = ref; }} style={styles.button} onPress={this.getpinpads} title="connectDevice" />
        </View>
        <View style={styles.lines} >
          <Button style={styles.button} ref={(ref) => { this.salbtn = ref; }} onPress={this.processSale} title="Sale" />
          <Button style={styles.button} ref={(ref) => { this.authbtn = ref; }} onPress={this.processAuth} title="Auth" />
          <Button style={styles.button} ref={(ref) => { this.capbtn = ref; }} onPress={this.startCapture} title="Capture" />
        </View>
        <View style={styles.lines} >
          <Button style={styles.button} ref={(ref) => { this.voidbtn = ref; }} onPress={this.startVoid} title="Void" />
          <Button style={styles.button} ref={(ref) => { this.returnbtn = ref; }} onPress={this.processReturn} title="Return" />
          <Button style={styles.button} setDisabled={false} onPress={this.clearstorage} title="clear storage" />
        </View>
        <Text style={styles.textStyle} numberOfLines={this.state.numberOfLines} >
          {this.state.text.toString()}
        </Text>
      </View>);
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  lines: {
    width: '100%',
    backgroundColor: 'powderblue',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lines2: {
    width: '100%',
    backgroundColor: 'powderblue',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    height: 50,
    width: 100,
    borderRadius: 20,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignContent: 'center',
    overflow: 'hidden',
  },

});

export default HomeScreen;
