//Create variables here
var dog,happyDog;
var dogImg,happyDogImg;
var dataBase;
var foodS,foodStock;

var database;

var feedButton, addButton;
var lastFed;
var foodObj;

var readState,changeState;

var bedroomImg,gardenImg,washroomImg;

function preload(){
  //load images here
  dogImg = loadImage('images/Dog.png');
  happyDogImg = loadImage('images/happydog.png')

  bedroomImg = loadImage("images/Bed Room.png")
  gardenImg = loadImage("images/Garden.png")
  washroomImg = loadImage("images/Wash Room.png")
}

function setup() {
  var canvas = createCanvas(windowWidth-30, windowHeight-30);
  database = firebase.database();

  dog = createSprite(1000,350,10,10);
  dog.addImage(dogImg)
  dog.scale = 0.3;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  feedButton = createButton("Feed Dog");
  addButton = createButton("Add Food");

  feedButton.position(900,50);
  addButton.position(800,50);

  feedButton.mousePressed(feedDog);
  addButton.mousePressed(addFood);

  foodObj = new Food();

  //game state code
  readState = database.ref('gameState');
  readState.on('value',function(data){
    gameState=data.val();
  })

  
}


function draw() {  
  background(46, 139, 87);
  
  //add styles here
  fill(255);
  text(mouseX + ":" + mouseY,20,20);

  database.ref('FeedTime').on("value",readTime);

  foodObj.display();

  drawSprites();

  fill(255);
  textSize(20);
  text("Food Remaining: "+foodS,500,150);

  if(lastFed>=12){
  text("Last Fed: "+lastFed%12 + " PM",500,60);
  }else if(lastFed===0){
    text("Last Fed: 12AM",500,60);
  }else{
    text("Last Fed: "+lastFed + "AM",500,60);
  }



  currentTime =hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  } else if(currentTime==(lastFed+2)){
    update("Sleeping")
    foodObj.bedroom();
  } else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  } else {
    update("Hungry");
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feedButton.hide();
    addButton.hide();
    dog.remove();
  }else{
    feedButton.show();
    addButton.show();
    dog.addImage(dogImg);
  }

  console.log(gameState);

}




//function to read and write food stock from database
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function readTime(data){
  lastFed = data.val();
}

//function to write values in database

function feedDog(){

  dog.addImage(happyDogImg);

  if(foodS<=0){
    foodS=0;
    }else{
      foodS = foodS-1;
    }
  
  database.ref('/').update({
    FeedTime:hour(),
    Food:foodS
  })
}

function addFood(){

  foodS = foodS+1;

  database.ref('/').update({
    Food:foodS
  })

}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}

  