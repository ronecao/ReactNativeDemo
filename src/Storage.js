import React,{AsyncStorage,Component,TouchableOpacity,View,Text,AppRegistry} from 'react-native';

// data storage key
const STORAGE_KEY = 'I_AM_KEY';
const MUIRA_SALE ='MUIRA_SALE';
const MP200_SALE ='MP200_SALE';
const MP200_AUTH ='MP200_AUTH';
//const MUIRA_SALE ='MUIRA_SALE';
//const MUIRA_SALE ='MUIRA_SALE';
 class Storage {

    // get data from storage
    async _get(storage) {
        console.log('Demo._get() storage:'+storage);
        try {// try catch aysnc operation
            var value = await AsyncStorage.getItem(storage);
            if (value !== null){
                console.log('_get() success: ' ,value);
                return value;
            } else {
                console.log('_get() no data');
                return null;
            }
        } catch (error) {
            console.log('_get() error: ',error.message);
            return null
        }
    }

    // save data to storage
    async _save(value,storage) {
        console.log('Demo._save()');
        try {
            await AsyncStorage.setItem(storage, value);
            console.log('_save success: ',value);
            return "success"
        } catch (error) {
            console.log('_save error: ',error.message);
            return error;
        }
    }
    //add record
     async addRecord(values,storage) {
        let jsonV;
       try{
           await this._get(storage).then((value)=>{jsonV=value;});
           if (jsonV==null)
           {
               jsonV="{\"Record\":[{\"AuthCode\":\"first\"}]}"
           }
            let jsonobj= JSON.parse(jsonV);
          let arr= jsonobj.Record;
           let retresult;
          arr.push(JSON.parse(values));
           jsonobj.Record=arr;
           console.log(JSON.stringify(jsonobj));

         await  this._save(JSON.stringify(jsonobj),storage).then((saveres)=>{retresult=saveres; console.log(retresult)});
         return retresult

       }
       catch (error)
       {
           console.log(error);
           return error;
       }
    }

     /**
      * find record the values is AuthCode Value
      * @param values
      * @param storage
      * @returns {Promise<*>}
      */
     async findRecord(values,storage) {
         let jsonV;
         try{
             await this._get(storage).then((value)=>{jsonV=value;});
             if (jsonV==null)
             {
                 console.log(arr);
                 return "no data"
             }
             let jsonobj= JSON.parse(jsonV);
             let arr= jsonobj.Record;
             console.log("array value");
             console.log(arr);
             for(let i=0;i<arr.length;i++)
             {
                 if (arr[i].AuthCode==values)
                 {
                     console.log(JSON.stringify(arr[i]));
                     return arr[i]
                 }
             }

             return undefined

         }
         catch (error)
         {
             console.log(error);
             return error;
         }
     }

     /**
      * get records from storage
      * @param storage string name
      * @returns {Promise<*>} if success return JSON string else return null
      */
     async getRecordlist(storage) {
         let jsonV;
         try{
             await this._get(storage).then((value)=>{jsonV=value;});
             if (jsonV==null)
             {
                 jsonV="{\"Record\":[{\"AuthCode\":\"loading data\"}]}"
             }
             let jsonobj= JSON.parse(jsonV);
             let arr= jsonobj.Record;
            return arr

         }
         catch (error)
         {
             console.log(error);
             return null;
         }
     }

     /**
      * delete storage
      * @param storage
      * @returns {Promise<void>}
      * @private
      */
    async _remove(storage) {
        console.log('Demo._remove()');
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            console.log('_remove() success');
        } catch (error) {
            console.log('_remove() error: ', error.message);
        }
    }

     /**
      * delete all data
      * @returns {Promise<void>}
      */
     async removeall() {
         console.log('Demo._remove()');
         try {
             await AsyncStorage.removeItem(STORAGE_KEY);
             console.log('_remove() success');
         } catch (error) {
             console.log('_remove() error: ', error.message);
         }

         try {
             await AsyncStorage.removeItem(MUIRA_SALE);
             console.log('_remove() success');
         } catch (error) {
             console.log('_remove() error: ', error.message);
         }

         try {
             await AsyncStorage.removeItem(MP200_SALE);
             console.log('_remove() success');
         } catch (error) {
             console.log('_remove() error: ', error.message);
         }

         try {
             await AsyncStorage.removeItem(MP200_AUTH);
             console.log('_remove() success');
         } catch (error) {
             console.log('_remove() error: ', error.message);
         }
     }

}
export{ Storage as default}

