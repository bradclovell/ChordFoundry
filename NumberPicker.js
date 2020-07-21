import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Dimensions,
  Picker
} from 'react-native';

const COLORS = require('./color_palette.json')

export default class NoteInput extends Component {

  constructor (props){
    super(props)

  }



  render(){

    let pickerItems = [];
    for (var i = this.props.min; i <= this.props.max; i++){
      pickerItems.push( <Picker.Item label={i.toString()} value={i} key={i} /> );
    }


    return(
      <Picker
        selectedValue={this.props.value}
        style={{ flex: 1, borderTopWidth: 1, borderBottomWidth: 1 }}
        itemStyle={{ color: COLORS.obsidian_black, backgroundColor: COLORS.hot_red, height: 68, fontSize: 13 }} // This is 68 to compensate for top/bottom border width
        onValueChange={(itemValue, itemIndex) => {this.props.updateNumber(itemValue)} }>

        {pickerItems}
        
      </Picker>
    );
  }

}