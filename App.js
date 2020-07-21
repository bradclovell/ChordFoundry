import React, { Component } from 'react';

import getChordShapes from './chords_finder_new'
import sounds from './sounds.js'
import {getAbsNoteName, getNoteName} from './note_tools.js'

import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import Canvas from 'react-native-canvas';
import { Audio } from 'expo-av';


// I don't think I use this stylesheet
const styles = StyleSheet.create({
  defaultText: {
    fontSize: 22,
    padding: 4,
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
    color: 'navy'
  },
  container: {
    backgroundColor: "#DDD",
    flexDirection: "row",
    justifyContent: "space-evenly"
  }
})

const CHORDS = require('./chord_vectors.json');
import NoteTools from './note_tools.js'

const COLORS = require('./color_palette.json');


import ChordDisplay from './ChordDisplay'
import NoteInput from './NoteInput'
import ChordVector from './ChordVector'
import TuningInput from './TuningInput'
import ChordOverlay from './ChordOverlay'
import NumberPicker from './NumberPicker'
import Toggle from './Toggle'

export default class App extends Component {

  MAJOR_CHORD = [true, false, false, false, true, false, false, true, false, false, false, false];

  constructor(props){
    super(props);

    this.state = {rootNote: 0, chordVector: this.MAJOR_CHORD, maxFret: 16, tuning: [2*12+4, 2*12+9, 3*12+2, 3*12+7, 3*12+11, 4*12+4], frettings: [], currFrettingIndex: 0, // currFretting not yet active
      chordOverlayActive: false, optionsObject: {startsWithRoot: true, numSkippableStrings: 1}};
    
    let initialFrettings = getChordShapes(this.state.rootNote, this.state.chordVector, this.state.tuning, this.state.maxFret, this.state.optionsObject);

    this.state.frettings = initialFrettings;
  }

  updateRootNote(newRoot){
    let newFrettings = getChordShapes(newRoot, this.state.chordVector, this.state.tuning, this.state.maxFret, this.state.optionsObject);

    this.setState({rootNote: newRoot, frettings: newFrettings, currFrettingIndex: 0});
  }

  updateChordVector(newVector){
    let newFrettings = getChordShapes(this.state.rootNote, newVector, this.state.tuning, this.state.maxFret, this.state.optionsObject);

    this.setState({chordVector: newVector, frettings: newFrettings, chordOverlayActive: false, currFrettingIndex: 0});
  }

  updateTuning(newTuning){
    let newFrettings = getChordShapes(this.state.rootNote, this.state.chordVector, newTuning, this.state.maxFret, this.state.optionsObject);

    this.setState({tuning: newTuning, frettings: newFrettings, currFrettingIndex: 0});
  }

  updateMaxFret(newMaxFret){
    let newFrettings = getChordShapes(this.state.rootNote, this.state.chordVector, this.state.tuning, newMaxFret, this.state.optionsObject);

    this.setState({maxFret: newMaxFret, frettings: newFrettings, currFrettingIndex: 0})
  }

  updateStartsWithRoot(newValue){
    this.state.optionsObject.startsWithRoot = newValue;
    let newFrettings = getChordShapes(this.state.rootNote, this.state.chordVector, this.state.tuning, this.state.maxFret, this.state.optionsObject);

    this.setState({optionsObject: this.state.optionsObject, frettings: newFrettings, currFrettingIndex: 0});
  }

  updateNumSkippableStrings(newNumber){
    this.state.optionsObject.numSkippableStrings = newNumber;
    let newFrettings = getChordShapes(this.state.rootNote, this.state.chordVector, this.state.tuning, this.state.maxFret, this.state.optionsObject);

    this.setState({optionsObject: this.state.optionsObject, frettings: newFrettings, currFrettingIndex: 0});
  }

  activateOverlay(){
    this.setState({chordOverlayActive: true});
  }

  removeString(){
    this.updateTuning(this.state.tuning.slice(0,Math.max(this.state.tuning.length-1, 2))); // Minimum of 2 strings
  }

  addString(){
    if (this.state.tuning.length >= 10){return;}

    let newTuning = this.state.tuning.slice();
    newTuning.push(12*3+0); // New string has default tuning of "C3"

    this.updateTuning(newTuning);
  }

  updateCurrFrettingIndex(newIndex){
    this.setState({currFrettingIndex: newIndex});
  }

  getChordName(chordVector){

    let ent = Object.entries(CHORDS);

    for (let i = 0; i < ent.length; i++){
      if (ent[i][1] == chordVector.toString()){
        return ent[i][0].slice(1);
      }
    }

    return "Custom";
  }

  tone = null;
  first = true;

  async playNote(noteName){

    if (this.first){
      this.tone = await Audio.Sound.createAsync(sounds[noteName], {shouldPlay: false});
      this.first = false;
      return;
    }

    try {
      this.tone.sound.replayAsync();
      // Your sound is playing!
    } catch (error) {
      alert(error)
    }

  }

  async getSoundObject(name){
    let newObj = await Audio.Sound.createAsync(sounds[name], {shouldPlay: false});
    newObj.sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish == true){newObj.sound.unloadAsync();} // I am not sure if this 100% fixed the memory leak, but it helped.
    });
    await Audio.setAudioModeAsync({playsInSilentModeIOS: true})
    return newObj;
  }

  // Play current chord.
  async playChord(){
    
    let currTuning = this.state.tuning.slice();

    let noteNames = [];
    // Populate noteNames
    for (let str = 0; str < currTuning.length; str++){
      currTuning[str] += this.state.frettings[this.state.currFrettingIndex][str];

      noteNames.push(getAbsNoteName(currTuning[str], true));
    }

    let toneObjects = [];

    let promises = [];

    for (var str = 0; str < noteNames.length; str++){
      promises.push(new Promise(async (resolve, reject) => {
        var tone = await this.getSoundObject(noteNames[str]);
        //await tone.sound.loadAsync(this.getSoundObject(noteNames[str]));
        resolve(tone);
      }));
    }

    Promise.all(promises).then((values) => {
      for(let i = 0; i < values.length; i++){
        values[i].sound.playFromPositionAsync(40);
      }
    });

    
  }

  

  render(){

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS["dark_gray"], justifyContent: "center"}}>
        <View>

          <StatusBar hidden={true} />

          <ChordDisplay tuning={this.state.tuning} frettings={this.state.frettings} currFrettingIndex={this.state.currFrettingIndex}
          updateCurrFrettingIndex={(newIndex) => this.updateCurrFrettingIndex(newIndex)} playChord={() => {this.playChord()}} maxFret={this.state.maxFret} />

          <TuningInput tuning={this.state.tuning} updateTuning={(newTuning) => this.updateTuning(newTuning)} />

          <View flexDirection="row">
            <NoteInput index={-1} note={this.state.rootNote} updateTuning={(index, rootNote) => this.updateRootNote(rootNote)} />

            <TouchableOpacity style={{backgroundColor: COLORS.dark_red, flex: 2, height: 70,
            alignItems: "center", justifyContent: "center", borderLeftWidth: 1, borderRightWidth: 1, margin: 0}}
            onPress={() => this.activateOverlay()}>
              
              <Text style={{color: COLORS.ash_gray}}>{this.getChordName(this.state.chordVector)}</Text>
            </TouchableOpacity>
            
            
            <TouchableOpacity onPress={() => this.removeString()}
            style={{flex: 1, justifyContent: "center", alignItems: "center", height: 70, backgroundColor: COLORS["dark_gray"]}}>
                
              <Text style={{color: COLORS["ash_gray"], textAlign: "center"}}>Remove{"\n"}String</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.addString() }
            style={{flex: 1, justifyContent: "center", alignItems: "center", height: 70, backgroundColor: COLORS.hot_red}}>
                
              <Text style={{color: COLORS["ash_gray"], textAlign: "center"}}>Add{"\n"}String</Text>
            </TouchableOpacity>
          </View>


          <ChordVector activateOverlay={() => this.activateOverlay()} updateChordVector={(index) => this.updateChordVector(index)} chordVector={this.state.chordVector} />


          <View flexDirection="row">
            <Toggle text="Starts with Root" onPress={() => this.updateStartsWithRoot(!this.state.optionsObject.startsWithRoot)} onLongPress={() => {}}
            isEnabled={this.state.optionsObject.startsWithRoot} />

            <View style={{backgroundColor: COLORS.middle_gray, flex: 1, height: 70, position: "relative",
            alignItems: "center", justifyContent: "center", borderWidth: 1, margin: 0}}>
              <Text numberOfLines={5} style={{textAlign: "center", color: COLORS.obsidian_black}}>Skippable Strings:</Text>
            </View>

            <NumberPicker min={0} max={this.state.tuning.length} value={this.state.optionsObject.numSkippableStrings} updateNumber={(newNumber) => this.updateNumSkippableStrings(newNumber)} />
          </View>
          

          <View flexDirection="row">

            <View style={{backgroundColor: COLORS.middle_gray, flex: 1, height: 70, position: "relative",
            alignItems: "center", justifyContent: "center", borderWidth: 1, margin: 0}}>
              <Text numberOfLines={5} style={{textAlign: "center", color: COLORS.obsidian_black}}>Highest Fret:</Text>
            </View>

            <NumberPicker min={5} max={20} value={this.state.maxFret} updateNumber={(newNumber) => this.updateMaxFret(newNumber)} />
          </View>

        </View>

        <ChordOverlay updateChordVector={(newVector) => this.updateChordVector(newVector)} isActive={this.state.chordOverlayActive} disableOverlay={() => this.setState({chordOverlayActive: false})} />
        
      </SafeAreaView>
    )
  }



  


}

