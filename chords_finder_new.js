import {defaultSort} from './fretting_sorting'

var validFrets = null;

var chordShapes = null;

function getValidFrets(rootNote,toneVector,tuning,highestFret){
  var validFrets = [];
  var absoluteVector = [
    /* 0*/false,
    /* 1*/false,
    /* 2*/false,
    /* 3*/false,
    /* 4*/false,
    /* 5*/false,
    /* 6*/false,
    /* 7*/false,
    /* 8*/false,
    /* 9*/false,
    /*10*/false,
    /*11*/false
  ]
  for (var i = 0; i < 12; i++){
    absoluteVector[(i+rootNote)%12] = toneVector[i];
  }
  
  
  // For each string...
  for (var stringNum = 0; stringNum < tuning.length; stringNum++){
    validFrets.push([]);
    // Add each valid fret.
    for (var fretNum = 0; fretNum <= highestFret; fretNum++){
      if (absoluteVector[(tuning[stringNum] + fretNum) % 12] === true){
        validFrets[stringNum].push(fretNum);
      }
    }
  }
  // validFrets is an array with each string
  // for each string, there is an array of all valid fret numbers on that string
  return validFrets;
}

function getBlankOptionsObject(){
  return {
    startsWithRoot: false,
    numSkippableStrings: 0,
  };
}

export default function getChordShapes(rootNote,toneVector,tuning,highestFret,optionsObject){

  if (optionsObject === undefined){optionsObject = getBlankOptionsObject()}

  // Vector of notes in absolute terms (0 is A, 1 is A# etc.)
  var absoluteVector = [
    /* 0*/false,
    /* 1*/false,
    /* 2*/false,
    /* 3*/false,
    /* 4*/false,
    /* 5*/false,
    /* 6*/false,
    /* 7*/false,
    /* 8*/false,
    /* 9*/false,
    /*10*/false,
    /*11*/false
  ]
  for (var i = 0; i < 12; i++){
    absoluteVector[(i+rootNote)%12] = toneVector[i];
  }
  
  // Default fretting is open [0, 0, 0, ...]
  var fretting = [];
  for (var i = 0; i < tuning.length; i++){
    fretting.push(0);
  }
  
  // chordShapes will contain all the frettings that satisfy the requirements and be returned at the end.
  chordShapes = [];
  // Add open strum if open tuning forms the chord.
  if (isChord(rootNote, absoluteVector, tuning, fretting, optionsObject)){
    chordShapes.push(fretting);
  }
  
  // Each element of validFrets is for a string, which has a list of all the valid frets for that string
  validFrets = getValidFrets(rootNote,toneVector,tuning,highestFret);
  // validFrets is a global variable that is accessed later.
  

  // This function ultimately populates all the chord shapes.
  getFirstChordShapes(rootNote,fretting,absoluteVector,tuning,optionsObject);
  
  // Sort the chords. Default sort is currently the only one.
  chordShapes = defaultSort(chordShapes);
  
  return chordShapes;
}


// Find and permute all the cases where the first finger is added.
function getFirstChordShapes(rootNote,baseFretting,absoluteVector,tuning,optionsObject){
  
  var newFretting;
  
  // [stringNum, fret]
  var startPos = [0,0];

  // maxPos is the position the highest finger is at [stringNum, fret]
  // Highest in terms of fret, then string number. New fingers can only be placed at a more advanced position.
  var maxPos;
  
  // SEARCH FOR NEW CHORDS

  // Essentially, we will try to place the first finger in every valid place.

  // For each string...
  for(var stringNum = 0; stringNum < validFrets.length; stringNum++){

    // For each valid-fret index.
    for(var fretIndex = 0; fretIndex < validFrets[stringNum].length; fretIndex++){

      // Note: stringNum and fretIndex combine to specify where we are trying to place the first finger

      // newFretting is a copy of the open fretting
      newFretting = baseFretting.slice();

      // maxPos is a copy of the starting position [0 string, 0 fret]
      maxPos = startPos.slice();

      // If the current fret number on the current string is less than the valid-fret number on the current string
      // Basically: if the finger can be placed on [stringNumber, valids[fretIndex]]
      if (newFretting[stringNum] < validFrets[stringNum][fretIndex]){

        // Place finger at specified spot and update maxPos to specified spot
        newFretting[stringNum] = validFrets[stringNum][fretIndex];
        maxPos = [stringNum, validFrets[stringNum][fretIndex]];
        
        // Push all variations of this new fretting that satisfy requirements
        pushValidSubfrettings(rootNote,absoluteVector,tuning,newFretting,optionsObject);
        
        // Use this permutation to call the second finger's function
        getNextChordShapes(rootNote,newFretting,absoluteVector,tuning,2,maxPos,optionsObject);
        


        // Try same fingering, but as a barre
        newFretting = baseFretting.slice();
        maxPos = startPos.slice();
        
        // Apply barre and update maxPos
        for(var k = stringNum; k < validFrets.length; k++){
          newFretting[k] = validFrets[stringNum][fretIndex];
        }
        maxPos = [validFrets.length-1,validFrets[stringNum][fretIndex]];
        
        // Push all variations of this new fretting that satisfy requirements
        pushValidSubfrettings(rootNote,absoluteVector,tuning,newFretting,optionsObject);
        
        // Use this permutation to call the second finger's function
        getNextChordShapes(rootNote,newFretting,absoluteVector,tuning,2,maxPos,optionsObject);
        
      }
    }
  }
}

function getNextChordShapes(rootNote,baseFretting,absoluteVector,tuning,fingerNum,maxPos,optionsObject){
  
  var newFretting;
  var newMaxPos;
  
  // Search for new place to put finger.
  for(var i = 0; i < validFrets.length; i++){
    for(var j = 0; j < validFrets[i].length; j++){
      newFretting = baseFretting.slice();
      newMaxPos = maxPos.slice();
      
      // String already voiced at least as high.
      if (newFretting[i] >= validFrets[i][j]) {continue;}
      
      // String lower than max position ("crosses the fingers" so to speak)
      if (validFrets[i][j]  < maxPos[1]) {continue;}
      // Lower-numbered string than max position ("crosses the fingers" also)
      if (validFrets[i][j] == maxPos[1] && i <= maxPos[0]) {continue;}
      
      // Fret is too high to reach (too great a stretch)
      if (validFrets[i][j] - maxPos[1] > 1/*TODO: MAGIC NUMBER*/){continue;}
      
      newFretting[i] = validFrets[i][j];
      newMaxPos = [i,validFrets[i][j]];

      // Push all variations of this new fretting that satisfy requirements
      pushValidSubfrettings(rootNote,absoluteVector,tuning,newFretting,optionsObject);
      
      if (fingerNum < 4){
        getNextChordShapes(rootNote,newFretting,absoluteVector,tuning,fingerNum+1,newMaxPos,optionsObject);
      }
    }
  }
  
  // Consider not placing this finger.
  
  // Avoids an infinite loop:
  if (fingerNum >= 4){return;}
  
  newFretting = baseFretting.slice();
  newMaxPos = maxPos.slice();
  
  // Just increase the maxPos by one fret.
  newMaxPos = [tuning.length,maxPos[1]+1/*TODO: MAGIC NUMBER*/];
  getNextChordShapes(rootNote,newFretting,absoluteVector,tuning,fingerNum+1,newMaxPos,optionsObject);
  
}

function getMaxPosition(fretting){
  currMax = [0,0];
  for(var i = 0; i < fretting.length; i++){
    if (fretting[i] >= currMax[1]){
      currMax = [i,fretting[i]];
    }
  }
  return currMax;
}

function getAllSubfrettings(fretting, numSkippableStrings){
  let subfrettings = [];

  subfrettings.push(fretting);

  // Recursive end state.
  if (numSkippableStrings <= 0){return subfrettings;}

  /*
  // Get number of voiced strings to iterate over
  let numVoicedStrings = 0;
  for (var i = 0; i < fretting.length; i++){
    if (fretting[i] != null){numVoicedStrings++;}
  }*/

  for (var i = 0; i < fretting.length; i++){
    if (fretting[i] != null){
      let newFretting = fretting.slice();
      newFretting[i] = null;
      subfrettings = subfrettings.concat(getAllSubfrettings(newFretting, numSkippableStrings-1));
    }
  }

  return subfrettings;
}

function pushValidSubfrettings(rootNote, absoluteVector, tuning, fretting, optionsObject){

  let subfrettings = getAllSubfrettings(fretting, optionsObject.numSkippableStrings);

  subfrettings.forEach((f) => {
    if (isChord(rootNote,absoluteVector,tuning,f,optionsObject)){
      chordShapes.push(f);
    }
  });

}

function isChord(rootNote, absoluteVector, tuning, fretting, optionsObject){
  var satisfiedVector = [
    /* 0*/false,
    /* 1*/false,
    /* 2*/false,
    /* 3*/false,
    /* 4*/false,
    /* 5*/false,
    /* 6*/false,
    /* 7*/false,
    /* 8*/false,
    /* 9*/false,
    /*10*/false,
    /*11*/false
  ]
  
  // Set satisfied vector according to tuning and fretting
  for(var i = 0; i < tuning.length; i++){
    if (fretting[i] == null){continue;}
    satisfiedVector[(tuning[i] + fretting[i]) % 12] = true;
  }
  
  // Return false if the satisfied vector is different from the absolute vector.
  for(var i = 0; i < 12; i++){
    if (satisfiedVector[i] != absoluteVector[i]){
      return false;
    }
  }

  // Return false if the first strummed string is not the root IF startsWithRoot option is enabled.
  let firstNote = null;
  for (var i = 0; i < fretting.length; i++){
    if (fretting[i] != null){
      firstNote = (tuning[i] + fretting[i]) % 12;
      break;
    }
  }
  if (firstNote == null){return false;}

  if (optionsObject.startsWithRoot && firstNote != rootNote){return false;}

  return true;
}

//Populate chord shapes
//console.log(getChordShapes(rootNote,toneVector,tuning,highestFret));






// Notes:
/**
 * 2/21/2019:
 * 
 * The way I'm doing this is making it difficult to add chanterelle support 
 * Capo support, however, should be no problem.
 * 
 * Next should be stretch support and idle fingers.
 * 
 * But first... I have to make maxPos pass among fingers, not be calculated.
 * It should only change when a finger is actually placed.
 * I'm considering that there should maybe be a dummy string.
 * It's either that or complicate the data structure, also a good option.
 * 
 * 2/22/2019:
 * 
 * I have refactored so that the maximum position that a finger must be
 * higher than is only changed when a finger is actually placed (this not
 * only allows for chanterelle support, but also allows artificial inflation
 * of the maximum current finger placement position, which allows fingers
 * to be idle and not fretting any string.
 * 
 * The next thing to do is to allow the first finger to barre.
 * 
 * 
 * 
 */