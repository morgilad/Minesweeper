game.Board = function Board(width, height){
    var self = this;
    var _board, _width, _height;
    
    init();
    
    // region privates
    function init(){
        var id;
        _board = [];
        _width = width;
        _height = height;
        
        for (var y = 0; y < _height; y++){
            
            _board.push([]);
            
            for (var x = 0; x < _width; x++){
                
                _board[y].push({
                    cell: new game.Cell(x, y),
                    adjacentMines: 0
                })
            }
        }
    }
    
    function checkBounds(x, y){

        if (x < 0 || x > _width - 1)
            throw new Error('out of bounds');
        
        if (y < 0 || y > _height - 1)
            throw new Error('out of bounds');
        
        return true;
    }
    // endregion
    
    // region priviledged
    this.getNeighbours = function(centerX, centerY){
        var neighbours = [];
        var curCell;
        
        for (var y = centerY - 1; y <= centerY + 1; y++)      
            for (var x = centerX - 1; x <= centerX + 1; x++){
                
                if (x == centerX && y == centerY)       // ignore center cell 
                    continue;
                
                curCell = self.getBoardCell(x, y);
                
                if (curCell)
                    neighbours.push(curCell);
            }
        
        return neighbours;
    }
    
    // this function can be called with an id or with a location object
    this.getBoardCell = function (x, y){
        try{
            checkBounds(x, y);    
        }
        catch (e) {
            return null;
        }

        return _board[y][x].cell;
        
    }
    
    // set the adjacent mines on the cell and return the value
    this.setAdjacentMines = function (x, y, adjacentMinesCount){
        
        checkBounds(x, y);
        
        if (_(adjacentMinesCount).isNumber() && adjacentMinesCount >= 0)
            _board[y][x].adjacentMines = adjacentMinesCount;
        else
            throw new Error('adjacent mines must be positive');
        
        return _board[y][x].adjacentMines;
    }
    
    this.getAdjacentMines = function (x, y){
        try{
            checkBounds(x, y);    
        }
        catch (e) {
            return null;
        }

        return _board[y][x].adjacentMines;
    }
    
    this.width = function(){
        return _width;
    }

    this.height = function(){
        return _height;
    } 
    // endregion
}

