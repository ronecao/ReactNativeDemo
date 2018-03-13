/**
 * styled button class
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  NativeModules,
    TouchableOpacity,
  View
} from 'react-native';

export default class Button extends Component{
 

  static defaultProps = {
    title: 'item',
    age:18
};

// @flow
    constructor(props) {
        super(props);
        this.state = {
          disabled: false
      };
      }

      enable = () => {
        this.setState({
            disabled: true
        })
    };
     disable = () => {
       console.log('disable');
        this.setState({
            disabled: true
        })
    };
    render() {
        return (
          

            <TouchableOpacity
            style={this.props.style}
            onPress={this.props.onPress} //onpress event function as properties 
            ><View>
                <Text style={{textAlign:'center'}}>{this.props.title}</Text></View>
            </TouchableOpacity>
              
        );
  }
}


const styles = StyleSheet.create({
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