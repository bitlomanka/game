
$(document).ready(function(){
    
    
    function namePlayer(){
        
        function modalWindow(){
            
            $.ajax({
                url: 'namePlayer.html',
            })
            .done(function(html) {
                $('.wrapper').append(html);
            });
            
        }
        modalWindow();
        
        
        $('.wrapper').on('click', '.modal__close', modalClose);
        $('.wrapper').on('click', '.modal__save', saveName);
            
        function modalClose(){
            $('.modal-container').remove();
        }
        
        function saveName(){
            var elem = $('.modal__name_active'),
                val = elem.val(),
                player = '';
            
            if(elem.hasClass('modal__name-player_1')){
                player = 1;
                
                elem.removeClass('modal__name_active');
                $('.modal__name-player_2').addClass('modal__name_active');
                
            }else{
               player = 2; 
            }
            
            if (val == ''){
                val = 'Игрок ' + player;
            }
            
            recordName(val, player);
        }
        
        function recordName(name, player){
            
            if(player == 1){
                $('.scoreboard__player-name_player-1').text(name).addClass('scoreboard__player_active');
            }else{
                $('.scoreboard__player-name_player-2').text(name);
                $('.modal-container').remove();
            }
        }
	
    }
    
    $('.game__list').on('click', '.game__item', clickFunc);
    
    function clickFunc(e){
        var target = $(e.target);
        
        
        
        if(target.is('.game__dot') == false){
            
            if($('.scoreboard__player_active').hasClass('scoreboard__player-name_player-1')){
                target.append('<span class="game__dot game__dot_player-1"></span>');
            }else{
                target.append('<span class="game__dot game__dot_player-2"></span>');
            }
            
            saveLocalStorage(target);
            toggleClassFunc();
            
        }
        checkFunc();
    }
    
    function saveLocalStorage(elem){
        var gameObj = localStorage.getItem('game'),
            idx = elem.index(),
            player = elem.find('.game__dot').hasClass('game__dot_player-1') ? 'player-1' : 'player-2';
         
        if(gameObj == null){
            gameObj = {};
        }else{
            gameObj = stringInObj(gameObj);
        }
        
        if(gameObj[player] == undefined){
            gameObj[player] = [];
        }

        for(var key in gameObj){
            if(key == player){
                gameObj[key].push(idx);
            }
        }
        
        gameObj = objInString(gameObj);
        localStorage.setItem('game', gameObj);
    }
    
    function collectObject(){
        
    }
    
    function stringInObj(obj){
        obj = JSON.parse(obj);
        return obj;
    }
    
    function objInString(obj){
        obj = JSON.stringify(obj);
        return obj;
    }

    function checkLocalStorage(){
        var gameObj = localStorage.getItem('game'),
            numberTurnsPayer1 = 0,
            numberTurnsPayer2 = 0;
        gameObj = stringInObj(gameObj); 
        
        if(gameObj != null){
            
            for(var key in gameObj){
                
                var arr = gameObj[key];
                
                for(var i = 0; i < arr.length; i++){
                    
                    var idx = arr[i],
                        classSpan = '';

                    if(key == 'player-1'){
                        numberTurnsPayer1 = arr.length;
                        classSpan = 'game__dot_player-1';
                    }else{
                        numberTurnsPayer2 = arr.length;
                        classSpan = 'game__dot_player-2';
                    }
                    $('.game__item').eq(idx).append('<span class="game__dot ' + classSpan + '"></span>');
                }
            }
            
            if(numberTurnsPayer1 >= numberTurnsPayer2){
                toggleClassFunc('player-2');
            }else{
                toggleClassFunc('player-1');
            }
        }else{
            namePlayer();
        }
    }
    checkLocalStorage();
    
    function checkFunc(){
        var player1 = $('.game__dot_player-1'),
            player2 = $('.game__dot_player-2');
        
        formArr(player1);
        formArr(player2);
        
        function formArr(elems){
            var arr = [];
            elems.each(function(){

                var i = $(this).parent().index();

                arr.push(i);
            })
            
            checkHorizontale(elems, arr);
            checkVertikal(elems, arr);
            checkDiagonal(elems, arr);
        }
        
        
        
    }
    
    function checkHorizontale(elems, arr){
        var max = 15;
        
        elems.each(function(){
            var idx = $(this).parent().index();
            var lastIdx = idx + 5,
                res = idx;
            
            for(var c = 0; c < arr.length; c++){
                
                
                if(res == arr[c]){
                    res++;
                    
                    if(arr[c] == max){
                        break;
                    }
                    
                    if(lastIdx == res){
                        
                        console.log('Выиграл горизонтально');
                        determineWinner($(this));
                        return;
                    }
                }
                
            }
        })
        
    }
    
    
    function checkVertikal(elems, arr){
            
        elems.each(function(){
            var idx = $(this).parent().index();
            var lastIdx = idx + 15 * 5,
                res = idx;
            
            for(var c = 0; c < arr.length; c++){
                
                if(res == arr[c]){
                    res = res + 15;
                    
                    if(lastIdx == res){
                        console.log('Выиграл вертикально');
                        determineWinner($(this));
                        return;
                    }
                }
                
            }
        })
    }
    
    function checkDiagonal(elems, arr){
        
        elems.each(function(){
            var idx = $(this).parent().index();
            var lastIdx = idx + (16 * 5),
                res = idx;
            
            for(var c = 0; c < arr.length; c++){
                
                if(res == arr[c]){
                    res = res + 16;
                    
                    if(lastIdx == res){
                         
                        console.log('Выиграл диагонально 1');
                        determineWinner($(this));
                        return;
                    }
                }
                
            }
        })
        
        elems.each(function(){
            var idx = $(this).parent().index();
            var lastIdx = idx + (14 * 5),
                res = idx;
            
            for(var c = 0; c < arr.length; c++){
                
                if(res == arr[c]){
                    res = res + 14;
                    
                    if(lastIdx == res){
                        console.log('Выиграл диагонально 2');
                        determineWinner($(this));
                        return;
                    }
                }
                
            }
        })
    }
    
    function determineWinner(elem){
        if(elem.hasClass('game__dot_player-1')){
            var winner = $('.scoreboard__player-name_player-1').text();
        }else{
            var winner = $('.scoreboard__player-name_player-2').text();
        }
        modalResults(winner);
    }
    
    function modalResults(winner){
        
        $.ajax({
            url: 'game-results.html',
        })
        .done(function(html) {
            $('.wrapper').append(html);
            showWinner(winner);
        });
        
        localStorage.clear();
    }
    
    $('.wrapper').on('click', '.new-game', newGame);
    
    function showWinner(winner){
        var winnerBlock = $('.wrapper').find('.result__player');
        winnerBlock.text(winner);
    }
    
    
    function toggleClassFunc(flag){
        
        var scoreboardPlayer1 = $('.scoreboard__player-name_player-1'),
            scoreboardPlayer2 = $('.scoreboard__player-name_player-2');
        
        if(scoreboardPlayer1.hasClass('scoreboard__player_active') || flag == 'player-2'){
            
            scoreboardPlayer1.removeClass('scoreboard__player_active');
            scoreboardPlayer2.addClass('scoreboard__player_active');
            
        }else{
            scoreboardPlayer2.removeClass('scoreboard__player_active');
            scoreboardPlayer1.addClass('scoreboard__player_active');
        }
        
    }
    
    
    function newGame(){
        $('.modal-container').remove();
        $('.game__dot').remove();
    }
    
    
    
//    localStorage.clear();
    console.log(localStorage.getItem('game'))
});






