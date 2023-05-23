


function diagonals(board,color){
    var boardHeight = 6;
    
    // checking right-diagonals
    for(var i = 0; i < board.length-3; i++){
      for(var j = 0; j < 3; j++){
        
        let diagonalIndicesRight = [board[i][j],board[i+1][j+1],board[i+2][j+2],board[i+3][j+3]]
        console.log(diagonalIndicesRight + " " + diagonalIndicesRight.every((c) => c == color))
        
        if(diagonalIndicesRight.every((c) => c == color)){
          return true;
        }
        
      }
    }
    
    //checking left-diagonals
    for(var x = 3; x < board.length; x++){
      for(var y = 0; y < 3; y++){
        
        let diagonalIndicesLeft = [board[x][y],board[x-1][y+1],board[x-2][y+2],board[x-3][y+3]]
        console.log(diagonalIndicesLeft)
        
        if(diagonalIndicesLeft.every((c) => c === color)){
          return true;
        }
      }
    }
  
    return false;
}

function checkForWin(board,color){
    const boardHeight = 6;
    
    // up-down check
    for(let i = 0; i < board.length; i++){
      let countOfSameColor = 0;
      for(let j = 0; j < boardHeight; j++){
        if(board[i][j] != color){
          countOfSameColor = 0;
        } else {
          countOfSameColor++;
        }
        
        if(countOfSameColor >= 4){
          return true;
        }
      }
    }
    
    
    // left-right check
    for(let a = 0; a < boardHeight; a++){
      var countOfSameColor = 0;
      for(let b = 0; b < board.length; b++){
        if(board[b][a] != color){
          countOfSameColor = 0;
        } else {
          countOfSameColor++;
        }
        
        if(countOfSameColor >= 4){
          return true;
        }
      }
    }
  
    if(diagonals(board,color)){
      return true;
    }
    
    return false;
}

module.exports = checkForWin;