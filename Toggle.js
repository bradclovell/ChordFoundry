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

const buttonHeight = 70;

export default class NoteInput extends Component {

  constructor (props){
    super(props)

  }

  // props: isEnabled, onPress(), onLongPress(), text

  render(){

    return(
      <TouchableOpacity style={{backgroundColor: this.props.isEnabled == true ? COLORS.hot_red : COLORS.middle_gray, flex: 1, height: buttonHeight, position: "relative",
        alignItems: "center", justifyContent: "center", borderWidth: 1, margin: 0, borderRadius: 3}}

        onPress={() => this.props.onPress()}
        onLongPress={() => this.props.onLongPress()}>

        
        <Text numberOfLines={5} style={{textAlign: "center", color: COLORS.obsidian_black}}>{this.props.text}</Text>
      </TouchableOpacity>
    )
  }

}