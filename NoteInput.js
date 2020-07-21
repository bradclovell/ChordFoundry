import React, { Component } from 'react';

import Picker, { WheelPicker } from 'react-native-wheel-picker-android'

import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Dimensions,
  //Picker
} from 'react-native';

const COLORS = require('./color_palette.json')

const FLAT = '\u266D'
const SHARP= '\u266F'

export default class NoteInput extends Component {

  constructor (props){
    super(props)

  }

  setNote(note){
    this.props.updateTuning(this.props.index, note);
  }


  

  // Android Version...
  render(){
    return(
      <WheelPicker selectedItem={this.props.selectedItem} />
    )
  }




  /* iOS Version...
  render(){

    return (
      <Picker
        selectedValue={this.props.note}
        style={{ flex: 1 }}
        itemStyle={{ color: COLORS.ash_gray, backgroundColor: COLORS.dark_red, height: 70, fontSize: 13 }}
        onValueChange={(itemValue, itemIndex) => {this.setNote(itemValue)} }>

        <Picker.Item label="C"                       value={ 0} />
        <Picker.Item label={"C"+SHARP+"/D"+FLAT}     value={ 1} />
        <Picker.Item label="D"                       value={ 2} />
        <Picker.Item label={"D"+SHARP+"/E"+FLAT}     value={ 3} />
        <Picker.Item label="E"                       value={ 4} />
        <Picker.Item label="F"                       value={ 5} />
        <Picker.Item label={"F"+SHARP+"/G"+FLAT}     value={ 6} />
        <Picker.Item label="G"                       value={ 7} />
        <Picker.Item label={"G"+SHARP+"/A"+FLAT}     value={ 8} />
        <Picker.Item label="A"                       value={ 9} />
        <Picker.Item label={"A"+SHARP+"/B"+FLAT}     value={10} />
        <Picker.Item label="B"                       value={11} />
        
      </Picker>
    )
  }*/


}