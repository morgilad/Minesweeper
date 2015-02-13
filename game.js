var game = {};

game.logic = function(){
    var _board, _flagsLeft, _state, _firstMove, _totalFlags, _openCells, _boardSize;
    var self = this;

    // region privates
    function mineTheBoard(ignoreCell, mines){

        var minesLeft = _flagsLeft;
        var randX, randY, curCell;

        while (minesLeft){

            randX = Math.floor(Math.random() * _board.width());
            randY = Math.floor(Math.random() * _board.height());
            
            curCell = _board.getBoardCell(randX, randY);
            
            if (curCell && !curCell.isMined() && (curCell.x() != ignoreCell.x() || curCell.y() != ignoreCell.y())){
                curCell.isMined(true);
                minesLeft--;
            }

        }

    }
    // endregion

    // region priviledged
    this.init = function(level){
        _board = new game.Board(level.width, level.height);
        _flagsLeft = _totalFlags = level.mines;
        _boardSize = level.width * level.height;
        _openCells = 0;
        _state = game.STATES.ALIVE;
        _firstMove = true;
    }

    this.exposeCell = function exposeCell(x, y){

        var cell = _board.getBoardCell(x, y);
        
        // mine the board in the first move - first selected cell CANOT be mined
        if (_firstMove){
            mineTheBoard(cell)
            _firstMove = false;
        }

        // do nothing in case the cell is already opened or flagged
        if (cell.state() == game.Cell.STATES.OPEN || cell.state() == game.Cell.STATES.FLAGGED)
            return;

        // open the cell
        cell.state(game.Cell.STATES.OPEN);
        _openCells++;
        
        // losing the game in case the selected cell is mined
        if (cell.isMined()){
            _state = game.STATES.LOSE;
            return;
        }
        
        // count the amount of mines around the selected cell
        var neighbours = _board.getNeighbours(cell.x(), cell.y());
        var minesCount = 0;
        _(neighbours).each(function (neighbour){
            if (neighbour.isMined())
                minesCount++;
        });

        // if there are mines - set the amount
        if (minesCount)
            _board.setAdjacentMines(cell.x(), cell.y(), minesCount);
        // if there are no mines - open all the neighbours cells
        else {
            _(neighbours).each(function (neighbour){
                self.exposeCell(neighbour.x(), neighbour.y());
            });
        }
        
        if (_openCells + _totalFlags == _boardSize){
            _state = game.STATES.WIN;
        }

        return;
    }
    
    this.flagCell = function flagCell(x, y){

        var cell = _board.getBoardCell(x, y);
        
        switch (cell.state()){
                case game.Cell.STATES.OPEN:
                    return;
                    break;
                case game.Cell.STATES.CLOSED:
                    cell.state(game.Cell.STATES.FLAGGED);
                    _flagsLeft--;
                    break;
                case game.Cell.STATES.FLAGGED:
                    cell.state(game.Cell.STATES.QMARKED);
                    _flagsLeft++;
                    break;
                case game.Cell.STATES.QMARKED:
                    cell.state(game.Cell.STATES.CLOSED);
                    break;
            }

        return;
    }

    this.board = function(){
        return _board;   
    }
    
    this.state = function(){
        return _state;
    }
    
    this.flagsLeft = function(){
        return _flagsLeft;
    }
    // endregion
}

game.LEVELS = {
    BEGINNER: {width: 8, height: 8, mines: 10},
    INTERMEDIATE: {width: 16, height: 16, mines: 40},
    EXPERT: {width: 30, height: 16, mines: 99}
}

game.STATES = {
    WIN: 1,
    LOSE: 2,
    ALIVE: 3
}