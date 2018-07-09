/**
 * styled button class
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

export default class Cell extends Component {
  static defaultProps = {
    title: 'item',
    onPress: (e) => { console.log(`default onPRess:${e}`); },
  };
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    };
  }

  enable = () => {
    this.setState({
      disabled: false,
    });
  };
  disable = () => {
    console.log('disable');
    this.setState({
      disabled: true,
    });
  };
  render() {
    return (
      <TouchableOpacity
        style={styles.cell} // {this.props.style}
        onPress={this.props.onPress} // onpress event function as properties
        disabled={this.state.disabled}
      >
        <View>
          <Text style={{ textAlign: 'center' }}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
// proptype validation codes
Cell.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  cell: {
    height: 80,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignContent: 'center',
    overflow: 'hidden',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 0.2,
    padding: 20,
  },
});
