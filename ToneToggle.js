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

const buttonHeight = 50;

export default class NoteInput extends Component {

  constructor (props){
    super(props)

  }

  toggleButton(){
    let newVector = this.props.chordVector;
    newVector[this.props.index] = !newVector[this.props.index];

    this.props.updateChordVector(newVector);
  }

  render(){

    return(
      <TouchableOpacity style={{backgroundColor: this.props.chordVector[this.props.index] == true ? COLORS.hot_red : COLORS.middle_gray, flex: 1, height: buttonHeight, position: "relative",
        alignItems: "center", justifyContent: "center", borderWidth: 1, margin: 0, borderRadius: 3}}

        onPress={() => this.toggleButton()}
        onLongPress={() => this.props.activateOverlay()}>

        
        <Text style={{color: COLORS.obsidian_black}}>{this.props.toneName}</Text>
        <Text style={{color: COLORS.obsidian_black}}>{this.props.index}</Text>
      </TouchableOpacity>
    )
  }

}