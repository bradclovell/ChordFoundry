import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Dimensions
} from 'react-native';

import NoteInput from './NoteInput'
import AbsoluteToneInput from './AbsoluteToneInput'

export default class TuningInput extends Component {

  constructor (props){
    super(props)
  }
  
  updateTuning(index, note){
    let newTuning = this.props.tuning.slice();
    newTuning[index] = note;
    this.props.updateTuning(newTuning);
  }

  render(){
    let inputArray = []
    let i = 0;
    this.props.tuning.forEach((e) => {
      inputArray.push(<AbsoluteToneInput note={this.props.tuning[i]} index={i} updateTuning={(index, note) => this.updateTuning(index, note)} key={i} />);
      i++;
    });

    return(
      <View style={{flexDirection: "row", borderBottomWidth: 1}}>
        {inputArray}
      </View>
    )
  }

}