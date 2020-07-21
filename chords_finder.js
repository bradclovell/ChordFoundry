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

export default function getChordShapes(rootNote,toneVector,tuning,highestFret){

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
  if (isChord(rootNote, absoluteVector, tuning, fretting)){
    chordShapes.push(fretting);
  }
  
  // Each element of validFrets is for a string, which has a list of all the valid frets for that string
  validFrets = getValidFrets(rootNote,toneVector,tuning,highestFret);
  // validFrets is a global variable that is accessed later.
  

  // This function ultimately populates all the chord shapes.
  getFirstChordShapes(rootNote,fretting,absoluteVector,tuning);
  
  // Sort the chords. Default sort is currently the only one.
  chordShapes = defaultSort(chordShapes);
  
  return chordShapes;
}

function getFirstChordShapes(rootNote,baseFretting,absoluteVector,tuning){
  
  var newFretting;
  
  var startPos = [0,0];
  var maxPos;
  
  // Search for new chords.
  for(var stringNum = 0; stringNum < validFrets.length; stringNum++){
    for(var fretIndex = 0; fretIndex < validFrets[stringNum].length; fretIndex++){
      newFretting = baseFretting.slice();
      maxPos = startPos.slice();
      if (newFretting[stringNum] < validFrets[stringNum][fretIndex]){
        newFretting[stringNum] = validFrets[stringNum][fretIndex];
        maxPos = [stringNum, validFrets[stringNum][fretIndex]];
        
        if (isChord(rootNote,absoluteVector,tuning,newFretting)){
          chordShapes.push(newFretting);
        }
        
        getNextChordShapes(rootNote,newFretting,absoluteVector,tuning,2,maxPos);
        
        // Try same fingering, but as a barre
        newFretting = baseFretting.slice();
        maxPos = startPos.slice();
        
        for(var k = stringNum; k < validFrets.length; k++){
          newFretting[k] = validFrets[stringNum][fretIndex];
        }
        maxPos = [validFrets.length-1,validFrets[stringNum][fretIndex]];
        
        if (isChord(rootNote,absoluteVector,tuning,newFretting)){
          chordShapes.push(newFretting);
        }
        
        getNextChordShapes(rootNote,newFretting,absoluteVector,tuning,2,maxPos);
        
      }
    }
  }
}

function getNextChordShapes(rootNote,baseFretting,absoluteVector,tuning,fingerNum,maxPos){
  
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
      
      if (isChord(rootNote,absoluteVector,tuning,newFretting)){
        chordShapes.push(newFretting);
      }
      
      if (fingerNum < 4){
        getNextChordShapes(rootNote,newFretting,absoluteVector,tuning,fingerNum+1,newMaxPos);
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
  getNextChordShapes(rootNote,newFretting,absoluteVector,tuning,fingerNum+1,newMaxPos);
  
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

function isChord(rootNote, absoluteVector, tuning, fretting){
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
    satisfiedVector[(tuning[i] + fretting[i]) % 12] = true;
  }
  
  // Return whether the satisfied vector is the same as the
  // absolute vector.
  for(var i = 0; i < 12; i++){
    if (satisfiedVector[i] != absoluteVector[i]){
      return false;
    }
  }
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