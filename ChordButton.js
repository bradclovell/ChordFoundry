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

export default class ChordOverlay extends Component {

  constructor (props){
    super(props)
  }

  

  render(){
    return(
      <View style={{flex: 1, flexDirection: "column"}}>
        <View flex={.3}></View>
        <TouchableOpacity style={{backgroundColor: COLORS["dark_red"], flex: 1, //height: 50,
        alignItems: "center", justifyContent: "center", borderWidth: 1, margin: 0, borderRadius: 3}}
        onPress={() => this.props.setChord(this.props.chordCode)}>

          <Text style={{color: COLORS["ash_gray"]}}>{this.props.chordDisplay}</Text>
          
        </TouchableOpacity>
        <View flex={.4}></View>
      </View>
    )
  }
}