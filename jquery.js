//jquery.js
var playerStatus = false;
var score;
var lifeBar;
var velocity;
var action; //used for setInterval
var fruits = ['apple', 'banana', 'cherries', 'grapes', 'mango', 'orange', 'peach', 'pear', 'watermelon'];
$(function(){
    
//click on start reset button
    
$("#beginResetButton").click(function(){

    //we are playing
    if(playerStatus == true){

        //jquery reload page
        location.reload();
    }else{

        //we are not playing
        playerStatus = true; //game initiated

        
        //hide the game over sign from last round 
        $("#gameOverBox").hide();
        //reset button text
        $("#beginResetButton").html("Reset Game");

        score = 0; //set score to 0
        $("#keptScore").html(score);

        //lifebar reappear
        $("#lifeBar").show();
        lifeBar = 3;
        refreshLifeBar();

        //start sending fruits
        startAction();
    }
});

    

//hit the target with mouse    
$("#targetFruit").mouseover(function(){
    score=score+1;
    $("#keptScore").html(score); //update score
    
    
    document.getElementById("hitSoundEffect").play();
    //$("#hitSoundEffect")[0].play();//play sound
    
    //stop fruit
    clearInterval(action);
    
    //hide fruit
    $("#targetFruit").hide("explode", 500); //slice fruit explode jquery animation, we need to include jquery UI source not just jquery.
    
    // not work startAction();
    //send new fruit
    setTimeout(startAction, 800);   
    //wait after 800 milisecond to generate a new fruit. cuz 800>500 which is the time it takes to explode, other wise fruit will be hidden again
});
    
function refreshLifeBar(){
    $("#lifeBar").empty();
    for(i = 0; i < lifeBar; i++){
        $("#lifeBar").append('<img src="images/heart.png" class="life">');
    }
}


//function animating fruit falling
function startAction(){
    
    //generate a random fruit    
    generateFruit(); 
    $("#targetFruit").css({'left' : Math.round(550*Math.random()), 'top' : -50}); 
    //random position of x, fixed top position for y, the container is overflow layout essential, think why?
    $("#targetFruit").show(); //not hide anymore
    
    
    //generate a random velocity
    velocity = 1+ Math.round(5*Math.random()); // add 1 to avoid velocity is set to 0
    
    //animating fruit falling down
    action = setInterval(function(){
        
        //move fruit by one velocity
        $("#targetFruit").css('top', $("#targetFruit").position().top + velocity);                              
    
        //check if the fruit reach the end of the container
        if($("#targetFruit").position().top > $("#fruitsContainer").height()){
            //check if we have lives left
            if(lifeBar > 1 ){

                //generate a fruit
                generateFruit(); 
                $("#targetFruit").css({'left' : Math.round(550*Math.random()), 'top' : -50}); //random position

                velocity = 1+ Math.round(5*Math.random()); // change velocity
                
                //lifeBar decrease
                lifeBar --;
                
                //refresh lifeBar box, i.e decrease one
                refreshLifeBar();
                $("#targetFruit").show();
                
            }else{ // game over
                playerStatus = false; //we are not playing anymore
                $("#beginResetButton").html("Start Game"); // change button to Start Game
                $("#gameOverBox").show();
                $("#gameOverBox").html('<p>Game Over!</p><p>Score: '+ score +'</p>');
                $("#lifeBar").hide();
                stopAction();
            }
        }
    }, 10);
}

// generate a random fruit

function generateFruit(){
    $("#targetFruit").attr('src' , 'images/' + fruits[Math.round(8*Math.random())] +'.png');   
}

//Stop dropping fruits

function stopAction(){
    clearInterval(action);
    $("#targetFruit").hide();
}
});