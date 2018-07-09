import React, { Component } from 'react';
import {
  Modal,
  ListView,
  Text,
  StyleSheet,
  View,
  DeviceEventEmitter,
} from 'react-native';
import Cell from './Cell';


export default class TransListView extends Component {
  static defaultProps = {
    meranderRow: (e) => { console.log(`default meranderRow:${e}`); },
  };
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const jsonarr = ['laoding data'];
    console.log(jsonarr);
    this.state = {
      modalVisible: false,
      dataSource: ds.cloneWithRows(jsonarr),
    };
  }
  componentDidMount() {
    console.log('listview mounted');
  }
  /**
   * show popup menu
   */
  visible = () => {
    this.setState({
      modalVisible: true,
    });
  };
  /**
   * dismiss popup menu
   */
  invisible = () => {
    console.log('disable');
    this.setState({
      modalVisible: false,
    });
  };
  /**
   * update datasource
   * @param arrayValue new data source
   */
  changeDatasource = (arrayValue) => {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.setState({
      dataSource: ds.cloneWithRows(arrayValue),
    });
  };
  /**
   * send event to listener that the item has been seletected
   */
  sendevent = (value) => {
    this.invisible();
    console.log(value);
    DeviceEventEmitter.emit('ItemSelected', value);
  };
  renderRow(rowData, sectionId, rowId) {
    console.log(rowId);
    const refstr = 'button';
    return (
      <Cell
        ref={refstr}
        setDisabled="true"
        onPress={() => this.sendevent(rowData)}
        title={rowData}
      />);
  }
  render() {
    return (
      <Modal
        visible={this.state.modalVisible}
        animationType="slide"
        onRequestClose={() => { this.invisible(); }}
        transparent={true}
        style={styles.container}
      >
        <View
          style={styles.container}
        >
          <View
            style={styles.body}
          >
            <Text
              style={styles.Header}
            >
              TransList
            </Text>
            <ListView
              style={styles.ListViewStyle}
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
    backgroundColor: 'powderblue',
    width: '75%',
    height: '75%',
    borderRadius: 20,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ListViewStyle: {
    width: '100%',
    padding: 20,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  Header: {
    fontSize: 25,
  },
});
