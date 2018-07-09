import { AsyncStorage } from 'react-native';

// data storage key
const STORAGE_KEY = 'I_AM_KEY';


class Storage {
  // get data from storage
  static async fetchValue(storagename) {
    let value;
    console.log(`Demo.fetchValue() storage:${storagename}`);
    if (storagename === null || typeof (storagename) === 'undefined') {
      console.log('invalid storagename');
      return null;
    }
    try { // try catch aysnc operation
      await AsyncStorage.getItem(storagename).then((content) => {
        console.log(`then  ${content}`);
        value = content;
        return value;
      }).catch(error => error);
      if (value !== null) {
        console.log('fetchValue() success: ', JSON.stringify(value));
        return value;
      }
      console.log('fetchValue() no data');
      return null;
    } catch (error) {
      console.log('fetchValue() error: ', error.message);
      return null;
    }
  }

  // save data to storage
  static async saveValue(value, storagename) {
    console.log('Demo.saveValue()');
    try {
      await AsyncStorage.setItem(storagename, value);
      console.log('saveValue success: ', value);
      return 'success';
    } catch (error) {
      console.log('saveValue error: ', error.message);
      return error;
    }
  } /**
      * delete storage
      * @param storage
      * @returns {Promise<void>}
      * @private
      */
      _remove = async () => {
        console.log('Demo._remove()');
        try {
          await AsyncStorage.removeItem(STORAGE_KEY);
          console.log('_remove() success');
        } catch (error) {
          console.log('_remove() error: ', error.message);
        }
      };
}
export { Storage as default };

