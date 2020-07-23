import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const CHORDS = require('./chord_vectors.json')
const COLORS = require('./color_palette.json')
const MEASUREMENTS = require('./measurements.js')

export default class ChordOverlay extends Component {

  constructor (props){
    super(props)
  }

  

  render(){
    return(
      <View style={{flex: 1, flexDirection: "column"}}>
        <View flex={.3}></View>
        <TouchableOpacity style={{backgroundColor: COLORS["dark_red"], flex: 1,
          alignItems: "center", justifyContent: "center",
          borderWidth: MEASUREMENTS.getMediumHairlineWidth(), margin: 0, borderRadius: MEASUREMENTS.getMediumBorderRadius()}}
        onPress={() => this.props.setChord(this.props.chordCode)}>

          <Text style={{color: COLORS.ash_gray, fontSize: MEASUREMENTS.getMediumFontSize()}}>{this.props.chordDisplay}</Text>
          
        </TouchableOpacity>
        <View flex={.4}></View>
      </View>
    )
  }
}