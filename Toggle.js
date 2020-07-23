import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Dimensions,
  Button,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';

const COLORS = require('./color_palette.json')
const MEASUREMENTS = require('./measurements.js')

export default class NoteInput extends Component {

  constructor (props){
    super(props)

  }

  // props: isEnabled, onPress(), onLongPress(), text

  render(){

    return(
      <TouchableOpacity style={{backgroundColor: this.props.isEnabled == true ? COLORS.hot_red : COLORS.middle_gray, flex: 1, height: MEASUREMENTS.getMediumBlockHeight(),
        position: "relative", alignItems: "center", justifyContent: "center" }}
      onPress={() => this.props.onPress()}
      onLongPress={() => this.props.onLongPress()}>

        
        <Text numberOfLines={5} style={{textAlign: "center", color: COLORS.obsidian_black, fontSize: MEASUREMENTS.getMediumFontSize()}}>{this.props.text}</Text>
      </TouchableOpacity>
    )
  }

}