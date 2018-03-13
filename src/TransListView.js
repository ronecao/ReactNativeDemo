import React, { Component } from 'react';
import {
    Modal,
    ListView,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    DeviceEventEmitter
} from 'react-native';
import Storage from './Storage'
import Button from './Button'

export  default class TransListView extends Component{
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        var jsonarr=['laoding data'];
        console.log(jsonarr);
        this.state = {modalVisible:false,
                        dataSource:ds.cloneWithRows(jsonarr)};
    }

    /**
     * show popup menu
     */
    visible = () => {
        this.setState({
            modalVisible: true
        })
    };
    /**
     * dismiss popup menu
     */
    invisible = () => {
        console.log('disable');
        this.setState({
            modalVisible: false
        })
    };
    /**
     * update datasource
     * @param arrayValue new data source
     */
    changeDatasource=(arrayValue)=>{
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.setState({dataSource: ds.cloneWithRows(arrayValue)})

    };
    rowslelecte(value){
        console.log(value)
    }
    componentDidMount(){
        console.log("listview mounted");
        var st= new Storage();
        // init data source here
       /* st.getRecordlist('MP200_SALE').then((arrv) => {
           // console.log(arrv[0].first)
            var dsv= new Array();
            if(arrv.length==1)
            {

                    dsv.push(arrv[i].AuthCode)
                    return dsv;

            }
            for(var i=0;i<arrv.length;i++)
            {
                if(i==0)
                {

                }else
                {
                    dsv.push(arrv[i].AuthCode)

                }



            }
            console.log(dsv)
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({dataSource: ds.cloneWithRows(dsv)})

        });*/

    }
    /*
    * send event to listener that the item has been seletected
    * */
    sendevent =(value)=>{
        this.invisible();
        console.log(value);
        DeviceEventEmitter.emit('ItemSelected',value);
    };
    renderRow(rowData, sectionId, rowId) {
        this.rowslelecte(rowId);
        let titles= `AuthCode\n${rowData}`;
        return(
            <Button ref="button" style={styles.button} setDisabled='true' onPress={
                ()=>this.sendevent(rowData)
            } title={titles} />)
    }

    render(){
        return(

                <Modal
                    visible={this.state.modalVisible}
                    animationType={'slide'}
                    onRequestClose={() => {this.invisible()}}
                    transparent={true}
                    style={styles.container}

                >
                    <View style={
                        {justifyContent: 'center',
                        alignItems: 'center'}}>
                    <View style={styles.body}>
                        <Text style={styles.Header}>TransList</Text>

                        <ListView style={styles.ListViewStyle}
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow.bind(this)}
                        />
                    </View>
                    </View>
                </Modal>

    );
    }

}


const styles = StyleSheet.create({
    body: {
        backgroundColor:'powderblue',
        width:'75%',
        height:'75%',
        borderRadius:20,
        borderStyle:'solid',
        borderColor:'black',
        borderWidth:1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    ListViewStyle:{
        width:'100%'
    },
    container:{
        justifyContent: 'center',
        alignItems: 'center',

    },
    button:{
        height:50,
        width:'100%',
        borderRadius:15,
        backgroundColor:'powderblue',
        justifyContent:'center',
        alignContent:'center',
        overflow:'hidden',
        borderWidth:0.5,
        borderColor:'white',
        marginTop:5
    },
    Header:{
        fontSize:25
    }
});