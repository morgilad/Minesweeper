game.Cell = function Cell(x, y){
    var self = this;
    var _x = x;
    var _y = y;
    var _isMined;
    var _state = game.Cell.STATES.CLOSED;   
    
    // region privates
    function expose(){
        if (_state == game.Cell.STATES.FLAGGED) 
            throw new Error('cell is flagged');
        
        _state = game.Cell.STATES.OPEN;
    }
    
    function flag(){
        if (_state == game.Cell.STATES.OPEN) 
            throw new Error('cell is open');
        
        _state = game.Cell.STATES.FLAGGED;
    }
    
    function qmark(){
        if (_state == game.Cell.STATES.OPEN) 
            throw new Error('cell is open');
        
        _state = game.Cell.STATES.QMARKED;
    }
    
    function close(){
        if (_state == game.Cell.STATES.OPEN) 
            throw new Error('cell is open');
        
        _state = game.Cell.STATES.CLOSED;
    }
    // endregion
    
    // region priviledged
    this.isMined = function(mine){
        if (mine == void 0)
            return _isMined;
        
        if (_isMined)
            throw new Error('cell has already been set');
        
        _isMined = mine;
        
        return self;
    }
    
    this.state = function (newState){
        if (newState == void 0) 
            return _state;
        
        switch (newState){
                case game.Cell.STATES.OPEN:
                    expose();
                    break;
                case game.Cell.STATES.CLOSED:
                    close();
                    break;
                case game.Cell.STATES.FLAGGED:
                    flag();
                    break;
                case game.Cell.STATES.QMARKED:
                    qmark();
                    break;
        }
        
        return self;
    }
    
    this.x = function(){
        return _x;
    }
    
    this.y = function(){
        return _y;
    }
    // endregion
}

game.Cell.STATES = {
    OPEN: 1,
    CLOSED: 2,
    FLAGGED: 3,
    QMARKED: 4
}