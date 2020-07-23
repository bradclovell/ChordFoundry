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

import ToneToggle from './ToneToggle'
import Separator from './Separator';

export default class NoteInput extends Component {

  constructor (props){
    super(props)
  }

  render(){
    return(
      <View>

        <View flexDirection="row">

          <ToneToggle toneName="P1" index={ 0} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
          <Separator isHorizontal={false} />
          <ToneToggle toneName="m2" index={ 1} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
          <Separator isHorizontal={false} />
          <ToneToggle toneName="M2" index={ 2} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
          <Separator isHorizontal={false} />
          <ToneToggle toneName="m3" index={ 3} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
          <Separator isHorizontal={false} />
          <ToneToggle toneName="M3" index={ 4} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
          <Separator isHorizontal={false} />
          <ToneToggle toneName="P4" index={ 5} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
          <Separator isHorizontal={false} />
          <ToneToggle toneName="TT" index={ 6} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
          <Separator isHorizontal={false} />
          <ToneToggle toneName="P5" index={ 7} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
          <Separator isHorizontal={false} />
          <ToneToggle toneName="m6" index={ 8} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
          <Separator isHorizontal={false} />
          <ToneToggle toneName="M6" index={ 9} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
          <Separator isHorizontal={false} />
          <ToneToggle toneName="m7" index={10} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
          <Separator isHorizontal={false} />
          <ToneToggle toneName="M7" index={11} updateChordVector={this.props.updateChordVector} chordVector={this.props.chordVector} activateOverlay={() => this.props.activateOverlay()} />
        </View>

        
      </View>
    )
  }

  
}
