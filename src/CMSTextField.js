import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

export default class CMSTextField extends Component{
    
   
     
   
       constructor(props) {
           super(props);
           this.state = {
            money:'',
            endEdit:true,
            disabled:true,
            
        };
        //this.fmoney = this.fmoney.bind(this);
           
         }

    /**
     * formatting the money value
     * @param s
     * @param n
     * @returns {*}
     */
    fmoney(s, n){  
        let header,tail; 
        switch(s.length)
        {
            case 0:
                s='0.00';
            break;
            case 1:
                s='0.0'+s;
            break;
            case 2:
                s='0.'+s;
            break;
            default:
                header=s.substring(0,s.length-2);
                tail=s.substring(s.length-2);
                
                return header+'.'+tail;
            break;
        }
        //this.setState({money:s})
        return s;
   } 
    enable = () => {
        this.setState({
            disabled: true
        })
    };
    /**
     * disable the component
     */
    disable = () => {
    console.log('disable');
        this.setState({
            disabled: false
        })
    };
    getvalue=()=>{
        return this.fmoney(this.state.money,2);
    };
         render() {
            return (
              
                <TextInput
                ref="amountinput"
                editable={this.state.disabled}
                style={{height: 40,width:200, justifyContent:'flex-start'}}
                placeholder={this.props.placeholder}
                value={this.state.endEdit?this.fmoney(this.state.money,2):this.state.money+''}
                onChangeText={(text)=>{
                    this.setState({money:text});    
                }}      
                onFocus={()=>{
                    // this.setState({endEdit:false});
                    this.setState({endEdit:false,money:''});
                }}
                onEndEditing={(event) => {
                    this.setState({endEdit:true});
                }}
              
                />
                
                
                
                


                  
            );
        }
}
   