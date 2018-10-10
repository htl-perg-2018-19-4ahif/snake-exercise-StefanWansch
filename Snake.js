process.stdout.write('\x1Bc');
process.stdout.write('\x1B[?25l');

var ansi = require('ansi');
var keypress = require('keypress');

keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

var width=30, height=15;
var startWidth=1,startHeight=1;
var posY=Math.ceil(height/2), posX=Math.ceil(width/2);
var dir=1;
var posA, posB;
var points=0;
var speed=5;

process.stdin.on('keypress', changeDirection);
buildField();
drawSnake();
drawApple();
game();

function buildField(){
    
    cursor = ansi(process.stdout)
    cursor.bg.grey();
    for(var i=startWidth;i<width+startWidth;i++){
        if(i===startWidth || i===width){
            for(var j=startHeight;j<height+startHeight;j++){
                cursor.goto(i, j).write(' ');
            }
        }else{
            cursor.goto(i, startHeight).write(' ');
            cursor.goto(i,height).write(' ');
        }
    }
    cursor.bg.reset();
}
function drawSnake(){
    cursor.bg.green();
    cursor.goto(posX,posY).write(' ');
    cursor.bg.reset();
}
function drawApple(){
    posA= Math.ceil(Math.random()*(width-3))+(1+startWidth);
    posB= Math.ceil(Math.random()*(height-3))+(1+startHeight);
    cursor.bg.red();
    cursor.goto(posA,posB).write(' ');
    cursor.bg.reset();

    cursor.goto(1,height+3).write('Punkte: ' +points.toString());
    cursor.goto(1,height+4).write('Speed: ' +speed.toString());

}
function snakeOnApple(){
    if(posX==posA && posY==posB){
        points++;
        speed++;
        drawApple();
    }
}
function changeDirection(chunk, key){
    switch(key.name){
        case 'right': 
            dir=1;
            break;
        case 'up':
            dir=2;
            break;
        case 'down':
            dir=3;
            break;
        case 'left':
            dir=4;
            break;
        case 'q':
            quitGame();
    }  
}
function moveSnake(){
    switch(dir){
        case 1:
            posX++;
            break;
        case 2:
            posY--;
            break;
        case 3:
            posY++;
            break;
        case 4:
            posX--;
    }   
}
function hitWall(){
    if(posX===startWidth || posX===width || posY===startHeight || posY===height){
        cursor.red()
        cursor.bg.white();
        cursor.goto(1,height+1).write('GAME OVER');
        quitGame();
    }
}
function quitGame(){
    cursor.bg.reset();
    cursor.reset();
    cursor.goto(1,height+5);
    process.exit();
}
function game(){
    removeSnake();
    moveSnake()
    hitWall();
    snakeOnApple();
    drawSnake();
    setTimeout(game, 1000 / speed);
}
function removeSnake(){
    cursor.bg.black();
    cursor.goto(posX,posY).write(' ');
    cursor.bg.reset;
}
