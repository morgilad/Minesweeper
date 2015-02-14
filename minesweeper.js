$(document).ready(function(){
    var logic = new game.logic();

    newGame();
    
    function newGame(){
        logic.init(game.LEVELS.EXPERT);
        initGame();
        renderGame();
        bindEvents();
    }
    
    function initGame(){
        
        var $game = $(document.createElement('div')).addClass('game');
        
        $('body').append($game);
        
        initStatusPanel();
        initBoard();
    }
    
    function renderGame(){
        
        renderBoard();
        renderStatusPanel();
    }
    
    function initStatusPanel(){
        
        var $mineCounter, $smily, $timer;
        var $statusPanel = $(document.createElement('div')).addClass('statusPanel');
        
        // mine counter
        $mineCounter = $(document.createElement('div')).addClass('counter minesCounter').text(logic.flagsLeft());
        $statusPanel.append($mineCounter);
        
        // mine counter
        $timer = $(document.createElement('div')).addClass('counter timer').text(0);
        $statusPanel.append($timer);
        
        // smily
        $smily = $(document.createElement('div')).addClass('smily happy');
        $statusPanel.append($smily);
        
        $('.game').append($statusPanel);
    }
    
    function renderStatusPanel(){
        
        $('.minesCounter').text(logic.flagsLeft());
    }

    function initBoard(){

        var $row, $cell;
        var $board = $(document.createElement('div')).addClass('board');
        var cellTemplate = _.template('<div data-x="<%= x %>" data-y="<%= y %>" class="cell"></div>');

        // add all the cells
        for (var y = 0; y < logic.board().height(); y++){

            $row = $(document.createElement('div'));
            $row.addClass('row');

            for (var x = 0; x < logic.board().width(); x++){

                var cell = logic.board().getBoardCell(x, y);

                $cell = $(cellTemplate({
                    x: cell.x(),
                    y: cell.y()
                }));

                $row.append($cell);
            }

            $board.append($row);
        }
        
        // disable context menu on the board
        $board.on('contextmenu', function() { return false; });

        $('.game').append($board);
    }

    function renderBoard(){

        $('.cell').each(function (index){
            var x = $(this).attr('data-x');
            var y = $(this).attr('data-y');
            var cell = logic.board().getBoardCell(x, y);

            // reset cell 
            $(this).removeClass().addClass('cell');

            // cell state
            switch (cell.state()){
                case game.Cell.STATES.OPEN:
                    renderOpenCell($(this), cell);
                    break;
                case game.Cell.STATES.CLOSED:
                    renderClosedCell($(this), cell);
                    break;
                case game.Cell.STATES.FLAGGED:
                    renderFlaggedCell($(this), cell);
                    break;
                case game.Cell.STATES.QMARKED:
                    renderQmarkedCell($(this), cell);
                    break;
            }

            // cell adjacent mines
            if (cell.state() == game.Cell.STATES.OPEN){
                adjacentMines = logic.board().getAdjacentMines(x, y);

                if (adjacentMines)
                    $(this).addClass('number' + adjacentMines).text(adjacentMines);
            }
        })

    }

    function bindEvents(){

        $('.cell').mousedown(function(e){

            $('.smily').removeClass().addClass('smily shocked');
            
            if (logic.state() == game.STATES.LOSE || logic.state() == game.STATES.WIN)
                return
            
            var x = $(this).attr('data-x');
            var y = $(this).attr('data-y');
            
            switch (e.which){
                case 1:
                    logic.exposeCell(x, y);
                    break;
                case 2:
                    break;
                case 3:
                    logic.flagCell(x, y);
                    break;
            };  
            
            
            renderGame();
            
        }).mouseup(function (){
            $('.smily').removeClass().addClass('smily happy');
            setSmily();
        }) 
        
        // new game
        $('.smily').on('click', function (){
            $('.game').remove();
            newGame();
        })
    }
    
    function setSmily(){
        if (logic.state() == game.STATES.LOSE)
            $('.smily').removeClass().addClass('smily sad');
        else if (logic.state() == game.STATES.WIN)
            $('.smily').removeClass().addClass('smily sunny');
    }

    function renderOpenCell($cell, cell){
        
        var adjacentMines = logic.board().getAdjacentMines(cell.x(), cell.y());
        
        $cell.addClass('open');
        if (adjacentMines)
            $cell.addClass('number' + adjacentMines).text(adjacentMines);
        if (cell.isMined())
            $cell.addClass('mine bomb');
    }
    
    function renderClosedCell($cell, cell){
        
        if (cell.isMined() && logic.state() == game.STATES.LOSE)
            $cell.addClass('open mine');
        else if (cell.isMined() && logic.state() == game.STATES.WIN)
            $cell.addClass('closed flag');
        else
            $cell.addClass('closed');
        
    }
    
    function renderQmarkedCell($cell, cell){
        
        if (cell.isMined() && logic.state() == game.STATES.LOSE)
            $cell.addClass('open mine');
        else if (cell.isMined() && logic.state() == game.STATES.WIN)
            $cell.addClass('closed flag');
        else
            $cell.addClass('closed qmark');
        
    }
    
    function renderFlaggedCell($cell, cell){
        
        if (!cell.isMined() && logic.state() == game.STATES.LOSE)
            $cell.addClass('open mine mistake');
        else
            $cell.addClass('closed flag');
        
    }
})
