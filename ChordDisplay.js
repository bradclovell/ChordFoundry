import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

import {GLView} from 'expo-gl';

const COLORS = require('./color_palette.json')

const screenWidth  = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

var triangleVertexBufferObject;

export default class ChordDisplay extends Component {

  constructor(props){
    super(props)

  }

  handlePress(isLeft){
    if (isLeft){
      this.props.updateCurrFrettingIndex(Math.max(this.props.currFrettingIndex-1, 0));
    }
    else {
      this.props.updateCurrFrettingIndex(Math.min(this.props.currFrettingIndex+1, this.props.frettings.length-1));
    }
  }

  render(){

    //this.props.currFrettingIndex = 0;

    return (
      <View>

        <GLView style={{ width: screenWidth, height: screenHeight/3 , borderBottomWidth: 1 }}
          onContextCreate={this._onContextCreate}>
        </GLView>

        <View style={{position: 'absolute', flexDirection: "row"}}>
          <TouchableOpacity style={{width: screenWidth/3, flex: 1, height: screenHeight/3 }} onPress={() => this.handlePress(true)} />
          <TouchableOpacity style={{width: screenWidth/3, flex: 1, height: screenHeight/3 }} onPress={() => this.props.playChord()} />
          <TouchableOpacity style={{width: screenWidth/3, flex: 1, height: screenHeight/3 }} onPress={() => this.handlePress(false)} />
        </View>

      </View>
    )
  }
  
  // This program creates the shader and starts the animation.
  _onContextCreate = (webgl) => {
    if (_initialized) {
      return;
    }

    gl = webgl;


    //
    // Create shaders
    //

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertSrc);
    gl.shaderSource(fragmentShader, fragSrc);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    // Watch out for compilation errors.

    graphicsProgram = gl.createProgram();
    gl.attachShader(graphicsProgram, vertexShader);
    gl.attachShader(graphicsProgram, fragmentShader);
    gl.linkProgram(graphicsProgram);
    // Watch out for linker errors, I guess?
    // gl.validateProgram(graphicsProgram) is a thing, in case there's trouble.
    
    triangleVertexBufferObject = gl.createBuffer();


    _initialized = true;

    window.requestAnimationFrame(this.glUpdate);
    
  };


  drawRect = (centerX, centerY, width, height, color) => {

    let aspectRatio = gl.drawingBufferWidth/gl.drawingBufferHeight;

    let proportionalHeight = height * aspectRatio;


    let proportionalCenterY = centerY * aspectRatio;


    // This draws a version of the shape that depends only on the width of the GLView
    // There will be no vertical warping
    this.drawGLRect(centerX, proportionalCenterY, width/2, proportionalHeight/2, color);
  }


  drawGLRect = (centerX, centerY, width, height, color) => {
    
    var triangleVertices = [
      centerX - width, centerY - height,
      centerX - width, centerY + height,
      centerX + width, centerY - height,

      centerX + width, centerY + height,
      centerX - width, centerY + height,
      centerX + width, centerY - height,
    ];
    
    gl.useProgram(graphicsProgram);

    
    // Bind this object to be the Active Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    
    // bufferData will put the data onto the Active Buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    
    // Feed buffered data into the vertPosition attribute
    var positionAttribLocation = gl.getAttribLocation(graphicsProgram, "vertPosition");
    gl.vertexAttribPointer(
      positionAttribLocation, // Attribute location
      2, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      gl.FALSE, // Is the data normalized?
      2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      0 // Offset from the beginning of a single vertex to this attribute
    );
    
    gl.enableVertexAttribArray(positionAttribLocation);


    // Set rect color
    var uColorLocation = gl.getUniformLocation(graphicsProgram, "uColor");
    gl.uniform4fv(uColorLocation, color);

    
    // Draw the rect
    gl.drawArrays(
      gl.TRIANGLES, // Mode of drawing
      0, // How many vertices to skip
      6  // Number of vertices to actually draw
    );

  }

  interpolateColors(color1, color2, amount){
    amount = Math.max(0, Math.min(1, amount)); // Clamp amount between 0 and 1
    let newColor = [];
    newColor.push(color1[0]*(1-amount)+color2[0]*amount);
    newColor.push(color1[1]*(1-amount)+color2[1]*amount);
    newColor.push(color1[2]*(1-amount)+color2[2]*amount);

    return newColor;
  }

  hexToColor(hex){
    hex = hex.replace('#','');
    let color = [];
    color.push(parseInt(hex.substring(0,2), 16)/255);
    color.push(parseInt(hex.substring(2,4), 16)/255);
    color.push(parseInt(hex.substring(4,6), 16)/255);

    return color;
  }


  prevFrettings = null;

  glUpdate = (timestamp) => {
    // Getting time in seconds.
    if (!startTime){startTime = timestamp;}
    let currTime = (timestamp - startTime)/1000;

    let interpAmount = (Math.sin( currTime*.7 )+1) / 2;


    let color1 = this.hexToColor(COLORS.hot_red);
    let color2 = this.hexToColor(COLORS.cool_gray);
    let bgColor = this.interpolateColors(color1,color2, interpAmount);
    


    // Clear the frame
    gl.clearColor(bgColor[0],bgColor[1],bgColor[2],1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    

    this.drawRect(0,0,.5,.5, [1,1,0,1]);
    
    this.drawRect(0,0,.2,.2, [1,0,0,1]);

    if (this.props.frettings.length <= 0){
      frettingToDraw = null;
    }
    else{
      frettingToDraw = this.props.frettings[this.props.currFrettingIndex];
    }

    numStrings = this.props.tuning.length;

    if (frettingToDraw !== null && frettingToDraw !== undefined){
      this.drawStrings(numStrings);
      this.drawChord(frettingToDraw);
    }
    else {
      this.drawStrings(numStrings);
    }
    
    
    gl.flush();
    gl.endFrameEXP();

    
    window.requestAnimationFrame(this.glUpdate);
  }


  getNutToFretDistance = (fretNumber) => {

    let adjustedLength = SCALE_LENGTH;

    let maxExactFretDist = adjustedLength-(adjustedLength/Math.pow(2, this.props.maxFret/12));

    let exactDist = adjustedLength-(adjustedLength/Math.pow(2, fretNumber/12));
    exactDist = exactDist / maxExactFretDist;
    exactDist *= 1.65;


    let maxEvenFretDist = this.props.maxFret/12 * adjustedLength;

    let evenDist = fretNumber/12 * adjustedLength;
    evenDist = evenDist / maxEvenFretDist;
    evenDist *= 1.65;

    let stylizedDist = exactDist*.45 + evenDist*.55;

    return stylizedDist;
  }


  drawStrings = (n) => {
    
    // Draw fretboard
    let fretboardColor = [.25,.25,.25,1];

    // Fretboard dimensions.
    let boardHeight = n * DIST_BETWEEN_STRINGS;

    this.drawRect(0, 0, BOARD_WIDTH, boardHeight, fretboardColor);

    

    // Draw frets
    let fretColor = [.75, .8, .8, 1];

    let fretHeight = boardHeight;

    
    // Draw each fret up to the maxFret
    for (var fretNumber = 0; fretNumber <= this.props.maxFret; fretNumber++){
      // Find distance between nut and fret
      let dist = this.getNutToFretDistance(fretNumber);

      this.drawRect(-BOARD_WIDTH/2 + dist, 0, .008, fretHeight, fretColor);
    }


    // Draw fret number markers
    for (let fretNumber = 1; fretNumber <= this.props.maxFret; fretNumber++){
      if (fretNumber % 12 ==  3){this.drawFretNumberMarker(fretNumber, 1)}
      if (fretNumber % 12 ==  5){this.drawFretNumberMarker(fretNumber, 1)}
      if (fretNumber % 12 ==  7){this.drawFretNumberMarker(fretNumber, 2)}
      if (fretNumber % 12 ==  9){this.drawFretNumberMarker(fretNumber, 1)}
      if (fretNumber % 12 ==  0){this.drawFretNumberMarker(fretNumber, 2)}
    }

    // Draw strings
    let stringColor = [.85, .65, .25, 1];

    let fretboardTopPosition = boardHeight/2;
    let distBetweenStrings = boardHeight/n;

    for (var stringNumber = 0; stringNumber < n; stringNumber++){
      this.drawRect(0, fretboardTopPosition - distBetweenStrings/2 - distBetweenStrings * stringNumber, BOARD_WIDTH, .015, stringColor);
    }

  }

  markFret = (string,fret) => {
  
    if (fret === null){
      return;
    }
    
    // Determine position
    //string--; // Allows input to be 1-indexed instead of 0-indexed
    string = numStrings-1 - string;


    var currFretPos  = this.getNutToFretDistance(fret);
    var lowerFretPos = this.getNutToFretDistance(fret - 1);
    var distFromNut = (currFretPos+lowerFretPos)/2;
    if (distFromNut < 0){distFromNut = -.07;} // Set distFromNut to a fixed amount left of the nut in case of open sounding string
    var xPos = -BOARD_WIDTH/2 + distFromNut;

    let boardHeight = numStrings * DIST_BETWEEN_STRINGS;

    let fretboardTopPosition = boardHeight/2;

    let yPos = fretboardTopPosition - DIST_BETWEEN_STRINGS/2 - DIST_BETWEEN_STRINGS * string;

    var markColor = [1, 1, 0, 1];
    
    this.drawRect(xPos, yPos, 1/32, 1/32, markColor);
  }

  drawFretNumberMarker = (fret, numberOfMarks) => {
  
    if (fret === null){
      return;
    }

    var currFretPos  = this.getNutToFretDistance(fret);
    var lowerFretPos = this.getNutToFretDistance(fret - 1);
    var distFromNut = (currFretPos+lowerFretPos)/2;
    var xPos = -BOARD_WIDTH/2 + distFromNut;

    let boardHeight = numStrings * DIST_BETWEEN_STRINGS;

    let fretboardTopPosition = boardHeight/2;

    let size = 1/36;
    let markColor = [.8, .8, .8, 1];

    if (numberOfMarks == 2){
      let yPos1 =  size;
      let yPos2 = -size;

      this.drawRect(xPos, yPos1, size, size*1.5, markColor);
      this.drawRect(xPos, yPos2, size, size*1.5, markColor);
    }
    else{
      let yPos = 0;
      
      this.drawRect(xPos, yPos, size, size*1.5, markColor);
    }

    
  }

  drawChord = (fretting) => {
    if (fretting === null){
      return;
    }
    for(var i = 0; i < fretting.length; i++){
      this.markFret(i,fretting[i],fretting.length);
    }
  }

}

var frettingToDraw = null; // This is the global var for fretting right now.

var numStrings = 6;
var startTime = null;

const BOARD_WIDTH = 13.5/8;
const SCALE_LENGTH = BOARD_WIDTH / 2 * 1.8;
const DIST_BETWEEN_STRINGS = .8/12;

var _initialized = false;

var gl;

var graphicsProgram;

const vertSrc = `

precision mediump float;

attribute vec2 vertPosition;
//attribute vec3 vertColor;
uniform vec4 uColor;

//varying vec3 fragColor;
// This is an output from the vertex shader!

void main(void) {
  gl_Position = vec4(vertPosition, 0.0, 1.0);
  //fragColor = vertColor;
}
`;

const fragSrc = `

precision mediump float;

uniform vec4 uColor;

//varying vec3 fragColor;

void main(void) {
  gl_FragColor = uColor;
}
`;