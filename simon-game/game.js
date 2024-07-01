var buttonColors = ["red", "blue", "green", "yellow"];
var level = 0;
var gamePattern = [];
var userClickedPattern = [];
var started = false;

$(document).on("keydown", function() {
    if (!started) {
        started = true;
        $("h1").text("Level " + level);
        nextSequence();
    }
});

$(".btn").on("click", function() {
    let userChosenColor = $(this).attr("id");
    playSound(userChosenColor);
    animatePress(userChosenColor);
    let index = userClickedPattern.push(userChosenColor) - 1;
    checkAnswer(index);
});

function nextSequence() {
    let randomNumber = Math.floor(Math.random() * 4);
    let chosenColor = buttonColors[randomNumber];
    playSound(chosenColor);
    flashButton(chosenColor);
    gamePattern.push(chosenColor);
    level++;
    $("h1").text("Level " + level);
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        if (currentLevel == level - 1) {
            userClickedPattern = [];
            setTimeout(nextSequence, 1000);
        }
    } else {
        let audio = new Audio("./sounds/wrong.mp3");
        audio.play();
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 400);
        $("h1").text("Game Over, Press Any Key to Restart");
        level = 0;
        gamePattern = [];
        userClickedPattern = [];
        started = false;
    }
}

function playSound(color) {
    let audio = new Audio("./sounds/" + color + ".mp3");
    audio.play();
}

function flashButton(color) {
    $("." + color).fadeOut(100).fadeIn(100);
}

function animatePress(color) {
    $("." + color).addClass("pressed");

    setTimeout(function() {
        $("." + color).removeClass("pressed");
    }, 100);
}