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

import ChordButton from './ChordButton'

export default class ChordOverlay extends Component {

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
        <View style={{ position: "relative", justifyContent: "center", alignItems: "center", height: (SCREEN_HEIGHT * .6), width: (SCREEN_WIDTH * .9), backgroundColor: COLORS["hot_red"], flexDirection: "column" }}>

          <View style={{flex: 1, width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <View flex={.1}></View>
            <ChordButton chordDisplay="maj" chordCode="_maj" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
            <ChordButton chordDisplay="maj6" chordCode="_maj6" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
            <ChordButton chordDisplay="7" chordCode="_7" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
            <ChordButton chordDisplay="maj7" chordCode="_maj7" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
          </View>

          <View style={{flex: 1, width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <View flex={.1}></View>
            <ChordButton chordDisplay="min" chordCode="_min" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
            <ChordButton chordDisplay="min6" chordCode="_min6" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
            <ChordButton chordDisplay="min7" chordCode="_min7" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
            <ChordButton chordDisplay="min maj7" chordCode="_minmaj7" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
          </View>

          <View style={{flex: 1, width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <View flex={.1}></View>
            <ChordButton chordDisplay="aug" chordCode="_aug" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
            <ChordButton chordDisplay="aug7" chordCode="_aug7" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
          </View>

          <View style={{flex: 1, width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <View flex={.1}></View>
            <ChordButton chordDisplay="dim" chordCode="_dim" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
            <ChordButton chordDisplay="dim7" chordCode="_dim7" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
            <ChordButton chordDisplay="half dim7" chordCode="_halfdim7" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
          </View>

          <View style={{flex: 1, width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <View flex={.1}></View>
            <ChordButton chordDisplay="5" chordCode="_5" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
            <ChordButton chordDisplay="9" chordCode="_9" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
            <ChordButton chordDisplay="11" chordCode="_11" setChord={(chordCode) => this.setChord(chordCode)} />
            <View flex={.1}></View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}