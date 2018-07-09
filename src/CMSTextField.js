import React, { Component } from 'react';
import { StyleSheet, TextInput } from 'react-native';

export default class CMSTextField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      money: '',
      endEdit: true,
      disabled: true,
      placeholder: 'enter Amount',
    };
  }

    getvalue = () => this.fmoney(this.state.money, 2);

  enable = () => {
    this.setState({
      disabled: true,
    });
  };
  /**
   * disable the component
   */
  disable = () => {
    console.log('disable');
    this.setState({
      disabled: false,
    });
  };
  /**
   * formatting the money value
   * @param s
   * @param n
   * @returns {*}
   */
  fmoney = (s, n) => {
    let header;
    let tail;
    let retvalue = s;
    switch (retvalue.length) {
      case 0:
        retvalue = '0.00';
        break;
      case 1:
        retvalue = `0.0${retvalue}`;
        break;
      case 2:
        retvalue = `0.${retvalue}`;
        break;
      default:
        header = retvalue.substring(0, retvalue.length - n);
        tail = retvalue.substring(retvalue.length - n);
        return `${header}.${tail}`;
    }
    return retvalue;
  }
  render() {
    const refstr = 'amountinput';
    return (
      <TextInput
        ref={refstr}
        editable={this.state.disabled}
        style={styles.fieldstyle}
        placeholder={this.state.placeholder}
        value={this.state.endEdit ? this.fmoney(this.state.money, 2) : `${this.state.money}`}
        onChangeText={(text) => {
                    this.setState({ money: text });
                }}
        onFocus={() => {
                    this.setState({ endEdit: false, money: '' });
                }}
        onEndEditing={(event) => {
                    console.log(event);
                    this.setState({ endEdit: true });
                }}
      />
    );
  }
}

const styles = StyleSheet.create({
  fieldstyle: {
    height: 40,
    width: 200,
    justifyContent: 'flex-start',
  },
});
