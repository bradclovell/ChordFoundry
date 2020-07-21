import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Dimensions,
  Picker,
  FlatList
} from 'react-native';

const COLORS = require('./color_palette.json')

const FLAT = '\u266D'
const SHARP= '\u266F'

export default class AbsoluteToneInput extends Component {

  constructor (props){
    super(props)

  }

  getNoteName(index){
    let noteName;
    switch (index){
      case 0:
        noteName = "C";
        break;
      case 1:
        noteName = "C"+SHARP+"/D"+FLAT;
        break;
      case 2:
        noteName = "D";
        break;
      case 3:
        noteName = "D"+SHARP+"/E"+FLAT;
        break;
      case 4:
        noteName = "E";
        break;
      case 5:
        noteName = "F";
        break;
      case 6:
        noteName = "F"+SHARP+"/G"+FLAT;
        break;
      case 7:
        noteName = "G";
        break;
      case 8:
        noteName = "G"+SHARP+"/A"+FLAT;
        break;
      case 9:
        noteName = "A";
        break;
      case 10:
        noteName = "A"+SHARP+"/B"+FLAT;
        break;
      case 11:
        noteName = "B";
        break;
      default:
        break;
    }
    return noteName;
  }

  setNote(absoluteNote){
    this.props.updateTuning(this.props.index, absoluteNote);
  }


  render(){

    let pickerItems = [];

    for (let octave = 2; octave <= 5; octave++){
      for (let noteIndex = 0; noteIndex < 12; noteIndex++){
        let noteName = this.getNoteName(noteIndex);

        noteName += octave;
        
        pickerItems.push(<Picker.Item label={noteName} value={octave*12+noteIndex} key={0} />) // value should be midi note number


      }
    }

    


    return (
      <Picker
        selectedValue={this.props.note}
        style={{ flex: 1 }}
        itemStyle={{ color: COLORS.obsidian_black, backgroundColor: COLORS.middle_gray, height: 70, fontSize: 13 }}
        onValueChange={(itemValue, itemIndex) => {this.setNote(itemValue)} }>

        {pickerItems}
        
      </Picker>
    )
  }
}

/*
<Picker.Item label="A"                       value={ 0} />
<Picker.Item label={"A"+SHARP+"/B"+FLAT}     value={ 1} />
<Picker.Item label="B"                       value={ 2} />
<Picker.Item label="C"                       value={ 3} />
<Picker.Item label={"C"+SHARP+"/D"+FLAT}     value={ 4} />
<Picker.Item label="D"                       value={ 5} />
<Picker.Item label={"D"+SHARP+"/E"+FLAT}     value={ 6} />
<Picker.Item label="E"                       value={ 7} />
<Picker.Item label="F"                       value={ 8} />
<Picker.Item label={"F"+SHARP+"/G"+FLAT}     value={ 9} />
<Picker.Item label="G"                       value={10} />
<Picker.Item label={"G"+SHARP+"/A"+FLAT}     value={11} />
*/