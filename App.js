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
import { Audio } from 'expo-av';


const CHORDS = require('./chord_vectors.json');
import NoteTools from './note_tools.js'

const COLORS = require('./color_palette.json');
const MEASUREMENTS = require('./measurements.js');


import ChordDisplay from './ChordDisplay'
import NoteInput from './NoteInput'
import ChordVector from './ChordVector'
import TuningInput from './TuningInput'
import ChordOverlay from './ChordOverlay'
import HelpOverlay from './HelpOverlay'
import NumberPicker from './NumberPicker'
import Toggle from './Toggle'
import Separator from './Separator';
import { Alert } from 'react-native';

export default class App extends Component {

  MAJOR_CHORD = [true, false, false, false, true, false, false, true, false, false, false, false];

  constructor(props){
    super(props);

    this.state = {rootNote: 0, chordVector: this.MAJOR_CHORD, maxFret: 16, tuning: [2*12+4, 2*12+9, 3*12+2, 3*12+7, 3*12+11, 4*12+4], frettings: [], currFrettingIndex: 0, // currFretting not yet active
      chordOverlayActive: false, helpOverlayActive: false, optionsObject: {startsWithRoot: true, lowestIsRoot: true, numSkippableStrings: 1}};
    
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
    // Need to check if compatible with maxFret.
    let maxNote = Math.max(...newTuning) + this.state.maxFret;
    if (maxNote > sounds["maxNote"]){ this.tuningAndFretAlert(this.state.maxFret) }

    let newFrettings = getChordShapes(this.state.rootNote, this.state.chordVector, newTuning, this.state.maxFret, this.state.optionsObject);

    this.setState({tuning: newTuning, frettings: newFrettings, currFrettingIndex: 0});
  }

  updateMaxFret(newMaxFret){
    // Need to check if compatible with tuning.
    let maxNote = Math.max(...this.state.tuning) + newMaxFret;
    if (maxNote > sounds["maxNote"]){ this.tuningAndFretAlert(newMaxFret) }

    let newFrettings = getChordShapes(this.state.rootNote, this.state.chordVector, this.state.tuning, newMaxFret, this.state.optionsObject);

    this.setState({maxFret: newMaxFret, frettings: newFrettings, currFrettingIndex: 0})
  }

  tuningAndFretAlert(highestFret){
    Alert.alert("Alert", "Some chord frettings in this tuning with a highest fret of " + highestFret + " may have notes too high to be played in this app and will be silent.");
  }

  updateStartsWithRoot(newValue){
    this.state.optionsObject.startsWithRoot = newValue;
    let newFrettings = getChordShapes(this.state.rootNote, this.state.chordVector, this.state.tuning, this.state.maxFret, this.state.optionsObject);

    this.setState({optionsObject: this.state.optionsObject, frettings: newFrettings, currFrettingIndex: 0});
  }

  updateLowestIsRoot(newValue){
    this.state.optionsObject.lowestIsRoot = newValue;
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
    let newObj;
    try {
      newObj = await Audio.Sound.createAsync(sounds[name], {shouldPlay: false});
    }
    catch(error){
      return null;
    }
    
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
        
        if (tone == null){reject()}
        else {resolve(tone)}

      }));
    }

    Promise.all(promises).then((values) => {
      for(let i = 0; i < values.length; i++){
        values[i].sound.playFromPositionAsync(40);
      }
    }).catch((error) => { ;}); // Do nothing in case of rejected promise.

    
  }

  

  render(){

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS["dark_gray"], justifyContent: "center"}}>
        <View style={{backgroundColor: COLORS.obsidian_black }}>
          <Text style={{textAlign: "center", color: COLORS.hot_red, fontWeight: "bold", fontSize: MEASUREMENTS.getTitleFontSize()}}>CHORD FOUNDRY</Text>
        </View>
        <View>

          <StatusBar barStyle={"light-content"} />

          <ChordDisplay tuning={this.state.tuning} frettings={this.state.frettings} currFrettingIndex={this.state.currFrettingIndex}
          updateCurrFrettingIndex={(newIndex) => this.updateCurrFrettingIndex(newIndex)} playChord={() => {this.playChord()}} maxFret={this.state.maxFret} />

          <Separator isHorizontal={true} />

          <TuningInput tuning={this.state.tuning} updateTuning={(newTuning) => this.updateTuning(newTuning)} />

          <Separator isHorizontal={true} />

          <View flexDirection="row">
            <NoteInput index={-1} note={this.state.rootNote} updateTuning={(index, rootNote) => this.updateRootNote(rootNote)} />

            <Separator isHorizontal={false} />

            <TouchableOpacity style={{backgroundColor: COLORS.dark_red, flex: 2, height: MEASUREMENTS.getMediumBlockHeight(),
            alignItems: "center", justifyContent: "center", margin: 0}}
            onPress={() => this.activateOverlay()}>
              
              <Text style={{color: COLORS.ash_gray, fontSize: MEASUREMENTS.getMediumFontSize()}}>{this.getChordName(this.state.chordVector)}</Text>
            </TouchableOpacity>
            
            <Separator isHorizontal={false} />
            
            <TouchableOpacity onPress={() => this.removeString()}
            style={{flex: 1, justifyContent: "center", alignItems: "center", height: MEASUREMENTS.getMediumBlockHeight(), backgroundColor: COLORS.obsidian_black}}>
                
              <Text style={{color: COLORS.ash_gray, fontSize: MEASUREMENTS.getMediumFontSize(), textAlign: "center"}}>Remove{"\n"}String</Text>
            </TouchableOpacity>

            <Separator isHorizontal={false} />

            <TouchableOpacity onPress={() => this.addString() }
            style={{flex: 1, justifyContent: "center", alignItems: "center", height: MEASUREMENTS.getMediumBlockHeight(), backgroundColor: COLORS.hot_red}}>
                
              <Text style={{color: COLORS.ash_gray, fontSize: MEASUREMENTS.getMediumFontSize(), textAlign: "center"}}>Add{"\n"}String</Text>
            </TouchableOpacity>
          </View>
          
          <Separator isHorizontal={true} />

          <ChordVector activateOverlay={() => this.activateOverlay()} updateChordVector={(index) => this.updateChordVector(index)} chordVector={this.state.chordVector} />

          <Separator isHorizontal={true} />

          <View flexDirection="row">
            <Toggle text="Starts with Root" onPress={() => this.updateStartsWithRoot(!this.state.optionsObject.startsWithRoot)} onLongPress={() => {}}
            isEnabled={this.state.optionsObject.startsWithRoot} />

            <Separator isHorizontal={false} />

            <Toggle text="Lowest Note is Root" onPress={() => this.updateLowestIsRoot(!this.state.optionsObject.lowestIsRoot)} onLongPress={() => {}}
            isEnabled={this.state.optionsObject.lowestIsRoot} />

          </View>

          <Separator isHorizontal={true} />

          <View flexDirection="row">

            <View style={{backgroundColor: COLORS.cool_gray, flex: 1, height: MEASUREMENTS.getMediumBlockHeight(), position: "relative",
              alignItems: "center", justifyContent: "center", margin: 0}}>
              
              <Text numberOfLines={5} style={{textAlign: "center", color: COLORS.obsidian_black, fontSize: MEASUREMENTS.getMediumFontSize()}}>Skippable Strings:</Text>
            </View>

            <Separator isHorizontal={false} />

            <NumberPicker min={0} max={this.state.tuning.length} value={this.state.optionsObject.numSkippableStrings}
            updateNumber={(newNumber) => this.updateNumSkippableStrings(newNumber)} />

            <Separator isHorizontal={false} />

            <View style={{backgroundColor: COLORS.cool_gray, flex: 1, height: MEASUREMENTS.getMediumBlockHeight(), position: "relative",
            alignItems: "center", justifyContent: "center", margin: 0}}>
              <Text numberOfLines={5} style={{textAlign: "center", color: COLORS.obsidian_black, fontSize: MEASUREMENTS.getMediumFontSize()}}>Highest Fret:</Text>
            </View>

            <Separator isHorizontal={false} />

            <NumberPicker min={5} max={20} value={this.state.maxFret} updateNumber={(newNumber) => this.updateMaxFret(newNumber)} />
          </View>

          <Separator isHorizontal={true} />

          <TouchableOpacity onPress={() => this.setState({helpOverlayActive: true}) }
          style={{justifyContent: "center", alignItems: "center", height: MEASUREMENTS.getSmallBlockHeight(), backgroundColor: COLORS.obsidian_black}}>

            <Text style={{color: COLORS.ash_gray, fontSize: MEASUREMENTS.getMediumFontSize(), textAlign: "center"}}>Help</Text>
          </TouchableOpacity>

        </View>

        <ChordOverlay updateChordVector={(newVector) => this.updateChordVector(newVector)} isActive={this.state.chordOverlayActive}
        disableOverlay={() => this.setState({chordOverlayActive: false})} />

        <ChordOverlay updateChordVector={(newVector) => this.updateChordVector(newVector)} isActive={this.state.chordOverlayActive}
        disableOverlay={() => this.setState({chordOverlayActive: false})} />

        <HelpOverlay isActive={this.state.helpOverlayActive}
        disableOverlay={() => this.setState({helpOverlayActive: false})} />
        
      </SafeAreaView>
    )
  }



  


}

