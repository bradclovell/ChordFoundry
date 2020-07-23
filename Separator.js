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

export default class Separator extends Component {

  constructor (props){
    super(props)

  }

  // props: isHorizontal

  render(){

    if (this.props.isHorizontal){
      return(
        <View style={{height: MEASUREMENTS.getMediumHairlineWidth()}}></View>
      )
    }
    else{
      return(
        <View style={{width: MEASUREMENTS.getMediumHairlineWidth()}}></View>
      )
    }
    
  }

}