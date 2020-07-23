import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const CHORDS = require('./chord_vectors.json')
const COLORS = require('./color_palette.json')
const MEASUREMENTS = require('./measurements.js')

import ChordButton from './ChordButton'

const welcomeText =
"Welcome to Chord Foundry!"
;

const messageText =
"Tap the right and left sides of the fretboard window to see different frettings of the specified chord, " +
"and tap the middle to play a preview of that fretting." + '\n' + '\n' +
"Use the tuning selection wheels and the Add and Remove String buttons to set your instrument's tuning, " +
"and the highest fret selector to set its highest fret." + '\n' + '\n' +
"To specify a chord, set the root note and either tap the chord type, or activate the desired intervals below it. " +
"You can also specify whether the chord starts with the root as its bottom string, and whether the chord's lowest note should be the root." + '\n' + '\n' +
"Set the number of skippable strings to limit the number of strings the chord can skip. If it's set to 0, all strings are voiced."
;

export default class HelpOverlay extends Component {

  constructor (props){
    super(props)
  }

  setChord(chordCode){
    newVector = CHORDS[chordCode].slice();
    this.props.updateChordVector(newVector);
  }

  render(){
    
    if (!this.props.isActive){
      return <></>; 
    }


    return(
      <TouchableHighlight style={{ position: "absolute", justifyContent: "center", alignItems: "center", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#0008" }}
      onPress={() => this.props.disableOverlay()}
      onLongPress={() => this.props.disableOverlay()}
      underlayColor={"#0008"}
      activeOpacity={1}>
        <View style={{ position: "relative", justifyContent: "center", alignItems: "center",
        height: (SCREEN_HEIGHT * .6), width: (SCREEN_WIDTH * .9), backgroundColor: COLORS.dark_gray, flexDirection: "column" }}>

          <Text style={{textAlign: "center", color: COLORS.ash_gray, fontSize: MEASUREMENTS.getLargeFontSize()}}>{welcomeText}</Text>
          <Text style={{textAlign: "justify", margin: MEASUREMENTS.getMediumFontSize(), color: COLORS.ash_gray, fontSize: MEASUREMENTS.getMediumFontSize()}}>{messageText}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}