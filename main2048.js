var board = new Array();
var score = 0;
var hasConflicted = new Array();


var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile(){

    //如果屏幕像素大于500，还是使用绝对赋值的方式
    if (documentWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }


    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字(2,4)
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for (var i = 0; i < 4; i ++)
        for (var j = 0; j < 4; j ++){
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }

    for (var i = 0; i < 4; i ++){
        //将board声明成二维数组
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j ++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;
    updateScore(score);
}

function updateBoardView(){

    $(".number-cell").remove();

    //遍历board元素，设定新的number-cell的值
    for (var i = 0; i < 4; i ++)
        for (var j = 0; j < 4; j ++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $("#number-cell-"+i+"-"+j);

            if (board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top', getPosTop(i,j) + cellSideLength / 2);
                theNumberCell.css('left', getPosLeft(i,j) + cellSideLength / 2);
            }
            else {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }

    //重新定义number-cell的大小
    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.45 * cellSideLength + 'px');
}

function generateOneNumber(){

    if (nospace(board))
        return false;

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    //使用死循环的方式会造成一种情况：当最后数字的格子只剩一个的时候，会需要很长时间才计算出这个格子的位置
    //解决方法是只给计算机50次机会去随机
    var times = 0;
    while (times < 50){
        if (board[randx][randy] == 0)
            break;

        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
    }
    //如果超过了50次，那就人工找一个空格子
    if (times == 50){
        for (var i = 0; i < 4; i ++)
            for (var j = 0; j < 4; j ++){
                if (board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }

    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber)

    return true;
}

$(document).keydown(function (event){

    //阻挡所有原本默认效果
    //event.preventDefault();
    switch (event.keyCode){
        case 37: //left
            event.preventDefault();
            if (moveLeft()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 38: //up
            event.preventDefault();
            if (moveUp()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39: //right
            event.preventDefault();
            if (moveRight()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40: //down
            event.preventDefault();
            if (moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }
            break;
        default: //default
            break;
    }
});

//防止touchEvent不被触发
$('body').on('touchmove', function (event){
    event.preventDefault();
}, { passive: false });

document.addEventListener('touchstart', function (event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
}, {passive: false });

document.addEventListener('touchend', function (event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if (Math.abs(deltax) < 0.2 * documentWidth && Math.abs(deltay) < 0.1 * documentWidth)
        return;

    //x
    if (Math.abs(deltax) >= Math.abs(deltay)){

        if (deltax > 0){
            //move right
            if (moveRight()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }

        }
        else {
            //move left
            if (moveLeft()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
    }
    //y
    else {

        if (deltay > 0){
            //屏幕坐标中y轴的正方向是向下的
            //move down
            if (moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }
        }
        else {
            //move up
            if (moveUp()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
    }
}, {passive: false });


function isgameover(){

    if (nospace(board) && nomove(board)){
        gameover();
    }
}

function gameover(){
    alert('GameOver!');
}

function moveLeft(){

    if (!canMoveLeft(board))
        return false;

    //moveLeft
    for (var i = 0; i < 4; i ++)
        for (var j = 1; j < 4; j ++){
            if (board[i][j] != 0){

                for (var k = 0; k < j; k ++){
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)){
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                        //break;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                        //break;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){

    if (!canMoveUp(board))
        return false;

    for (var j = 0; j < 4; j ++)
        for (var i = 1; i < 4; i ++){
            if (board[i][j] != 0){

                for (var k = 0; k < i; k ++){
                    if (board[k][j] == 0 && noBlockVertical(k, i, j, board)){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                        //break;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(k, i, j, board) && !hasConflicted[k][j]){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                        //break;
                    }
                }

            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight(){
    if (!canMoveRight(board))
        return false;

    for (var i = 0; i < 4; i ++)
        for (var j = 2; j >= 0; j --){
            if (board[i][j] != 0){

                for (var k = 3; k > j; k --){
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)){
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                        //break;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]){

                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                        //break;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown(){
    if (!canMoveDown(board))
        return false;

    for (var j = 0; j < 4; j ++)
        for (var i = 2; i >= 0; i --){
            if (board[i][j] != 0){

                for (var k = 3; k > i; k --){
                    if (board[k][j] == 0 && noBlockVertical(i, k, j, board)){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                        //break;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j]){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                        //break;
                    }
                }
            }

        }

    setTimeout("updateBoardView()", 200);

    return true;
}