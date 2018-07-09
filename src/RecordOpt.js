import { AsyncStorage } from 'react-native';
import Storage from './util/Storage';

export default class RecordOpt {
    /**
   * find record the values is AuthCode Value
   * @param values
   * @param storage
   * @returns {Promise<*>}
   */
  findRecord = async (values, storage) => {
    let jsonV;
    const keystr = values.replace('AuthCode\n', '');
    try {
      await Storage.fetchValue(storage).then((value) => {
        jsonV = value;
      });
      if (jsonV === null) {
        return 'no data';
      }
      const jsonobj = JSON.parse(jsonV);
      const arr = jsonobj.Record;
      console.log('array value');
      console.log(arr);
      for (let i = 0; i < arr.length; i += 1) {
        console.log(`${arr[i].AuthCode}\n${keystr}`);
        if (arr[i].AuthCode === keystr) {
          console.log(JSON.stringify(arr[i]));
          return arr[i];
        }
      }
      return undefined;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  /**
   * get records from storage
   * @param storage string name
   * @returns {Promise<*>} if success return JSON string else return null
   */
  getRecordlist = async (storage) => {
    let jsonV;
    try {
      await Storage.fetchValue(storage).then((value) => { jsonV = value; });
      if (jsonV === null) {
        jsonV = '{"Record":[{"AuthCode":"loading data"}]}';
      }
      const jsonobj = JSON.parse(jsonV);
      const arr = jsonobj.Record;
      return arr;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  // add record
  addRecord = async (values, storage) => {
    let jsonV;
    try {
      await Storage.fetchValue(storage).then((value) => { jsonV = value; });
      if (jsonV == null) {
        const records = `{"Record":[${values}] }`;
        await Storage.saveValue(records, storage).then((saveres) => { retresult = saveres; });
        return retresult;
      }
      const jsonobj = JSON.parse(jsonV);
      const arr = jsonobj.Record;
      let retresult;
      arr.push(JSON.parse(values));
      jsonobj.Record = arr;
      console.log(JSON.stringify(jsonobj));
      const storevalue = JSON.stringify(jsonobj);
      await Storage.saveValue(storevalue, storage).then((saveres) => { retresult = saveres; });
      return retresult;
    } catch (error) {
      console.log(`addRecord error ${error}`);
      return error;
    }
  };
  /**
   * delete all data
   * @returns {Promise<void>}
   */
  removeall = async () => {
    console.log('Demo._remove()');
    try {
      await AsyncStorage.removeItem('SALE');
      console.log('_remove() success');
    } catch (error) {
      console.log('_remove() error: ', error.message);
    }

    try {
      await AsyncStorage.removeItem('AUTH');
      console.log('_remove() success');
    } catch (error) {
      console.log('_remove() error: ', error.message);
    }
  };
}
