

export function getNoteName(index){
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


export function getAbsNoteName(midiNumber, sharpsOnly){
  if (sharpsOnly == undefined){sharpsOnly = false;}


  let noteName;
  switch (midiNumber%12){
    case 0:
      noteName = "C";
      break;
    case 1:
      noteName = sharpsOnly ? "C#" : "C"+SHARP+"/D"+FLAT;
      break;
    case 2:
      noteName = "D";
      break;
    case 3:
      noteName = sharpsOnly ? "D#" : "D"+SHARP+"/E"+FLAT;
      break;
    case 4:
      noteName = "E";
      break;
    case 5:
      noteName = "F";
      break;
    case 6:
      noteName = sharpsOnly ? "F#" : "F"+SHARP+"/G"+FLAT;
      break;
    case 7:
      noteName = "G";
      break;
    case 8:
      noteName = sharpsOnly ? "G#" : "G"+SHARP+"/A"+FLAT;
      break;
    case 9:
      noteName = "A";
      break;
    case 10:
      noteName = sharpsOnly ? "A#" : "A"+SHARP+"/B"+FLAT;
      break;
    case 11:
      noteName = "B";
      break;
    default:
      break;
  }

  noteName += "_";

  noteName += (midiNumber-midiNumber%12)/12;

  return noteName;
}

