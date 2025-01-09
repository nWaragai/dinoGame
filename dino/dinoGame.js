const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const imageNames = ['dino','cactus','bird'];

//gameオブジェクト
const game ={
  bgm1: new Audio('sound/fieldSong.mp3'),
  bgm2: new Audio('sound/jump.mp3'),
  counter: 0,
  enemys: [],
  image:{},
  state: 'loading',
  score: 0,
  timer:null,
}

game.bgm1.loop = true;


let imageLoadCounter = 0;
for(const imageName of imageNames){
  const imagePath =`img/${imageName}.png`;
  game.image[imageName] = new Image();
  game.image[imageName].src = imagePath;
  game.image[imageName].onload = () =>{
    imageLoadCounter += 1;
    if (imageLoadCounter === imageNames.length){
      init();
    }
  }
}

//初期化
function init(){
  game.counter = 0;
  game.enemys = [];
  
  game.score = 0;
  game.state = 'init';
  ctx.clearRect(0,0,canvas.width, canvas.height);
  createDino();
  drawDino();

  ctx.fillStyle = 'black';
  ctx.font ='bold 60px serif';
  ctx.fillText('Press Space key',60,150);
  ctx.fillText('to start',150, 230);

  createDino();
  
}

function start(){
  game.state ='gaming';
  game.bgm1.play();
  game.timer = setInterval(ticker, 30);
}

//main
function ticker(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  enemy.create();
  
  moveDino();
  enemy.move();


  drawDino();
  enemy.draw();
  drawScore();

  hitCheck();

  game.score ++
  game.counter = (game.counter+1)%1000000;
};

//Dino
function createDino(){
  game.dino = {
    x: game.image.dino.width / 2,
    y: canvas.height -game.image.dino.height /2,
    dy: 0,
    width: game.image.dino.width,
    height: game.image.dino.height,
    image: game.image.dino,
  }
}

function moveDino(){
  game.dino.y += game.dino.dy;
  if (game.dino.y >= canvas.height - game.dino.height / 2){
    game.dino.y = canvas.height - game.dino.height / 2;
    game.dino.dy = 0;
  } else {
    game.dino.dy += 3;
  }
}

function drawDino(){
  ctx.drawImage(game.image.dino, game.dino.x -game.dino.width /2, game.dino.y - game.dino.height /2);
}

//enemy
const enemy ={
  create:function(){
    if(Math.floor(Math.random()*(100 - game.score /100)) === 0){
      createCactus();
    };
    if(Math.floor(Math.random()*(100 - game.score / 100)) === 0){
      createBird();
    }
    },

  move: function(){
    for(i of game.enemys){
      i.x += i.moveX;
    }
    game.enemys = game.enemys.filter(i => i.x > -i.width);
  },

  draw: function(){
    for(const i of game.enemys){
      ctx.drawImage(i.image, i.x -i.width/2, i.y-i.height/2);
    }
  },
}



function createCactus() {
    game.enemys.push({
        x: canvas.width + game.image.cactus.width / 2,
        y: canvas.height - game.image.cactus.height / 2,
        width: game.image.cactus.width,
        height: game.image.cactus.height,
        moveX: -10,
        image: game.image.cactus
    });
}

function createBird() {
    const birdY = Math.random() * (300 - game.image.bird.height) + 150;
    game.enemys.push({
        x: canvas.width + game.image.bird.width / 2,
        y: birdY,
        width: game.image.bird.width,
        height: game.image.bird.height,
        moveX: -15,
        image: game.image.bird
    });
}


//当たり判定処理
function hitCheck(){
  let ratio = 0.8 /2
  for (const i of game.enemys){
    if(Math.abs(game.dino.x - i.x) < game.dino.width * ratio + i.width*ratio && Math.abs(game.dino.y - i.y) < game.dino.height * ratio + i.height*ratio){
      game.state = 'gameover';
      game.bgm1.pause();
      ctx.font = 'bold 100px serif';
      ctx.fillText('Game Over!', 150, 200);
      clearInterval(game.timer);
    }
  }
}


function drawScore(){
  ctx.font = '24px serif';
  ctx.fillText(`score:${game.score}`,0,30);
}





//キーが押されたら
document.onkeydown = function(e) {
  if(e.key === ' ' && game.state === 'init'){
    start();
  }

  if(e.key === ' ' && game.dino.dy === 0 && game.state === 'gaming'){
    game.dino.dy = -41;
    game.bgm2.play();
  }

  if(e.key === 'Enter' && game.state === 'gameover'){
    init();
  }
};


