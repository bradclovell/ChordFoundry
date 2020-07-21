/*var examp = [[0,0,0],[1,0,1],[1,0,1],[1,0,1],[2,2,1],[2,1,2],[2,1,2],[2,1,2],[2,1,2],[1,null,1],[0,0,0],[0,0,0],[1,0,1],
      [2,null,2],[null,1,1]];*/

// Works only for frettings
function fretboardSort(a,b){

  let inputMaxFret = 20; //TODO: magic number
  
  for(var i = 0; i < inputMaxFret+1; i++){
    // i is which fret we are currently on
    var aCount = 0;
    var bCount = 0;
    for(var j = 0; j < a.length; j++){
      if(a[j] == i){
        aCount++;
      }
      if(b[j] == i){
        bCount++;
      }
    }
    if (aCount != bCount){
      return bCount - aCount;
    }
  }
  // Same rankings...
  // return 0; would go here, but I must finish the sort
  
  
  
  
  // Second part of ranking:
  for(var i = 0; i < a.length; i++){
    if(a[i] != b[i]){
      if (a[i] == null){
        return -1;
      }
      if (b[i] == null){
        return 1;
      }
      return a[i] - b[i];
    }
  }
  return 0;
}

function removeConsecutiveDuplicates(array){
  // Note that this means array[i-1] will always exist inside the loop
  for(var i = array.length - 1; i >= 1; i--){
    var identical = true;
    for(var j = 0; j < array[i].length; j++){
      if (array[i][j] != array[i-1][j]){
        identical = false;
        break;
      }
    }
    if (identical){
      array.splice(i,1);
    }
  }
  return array;
}

/*examp.sort(fretboardSort);
removeConsecutiveDuplicates(examp);
console.log(examp);*/

export function defaultSort(array){
  array.sort(fretboardSort);
  removeConsecutiveDuplicates(array);
  return array;
}