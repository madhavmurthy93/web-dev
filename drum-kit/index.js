let buttons = document.querySelectorAll(".drum");
for (let button of buttons) {
    button.addEventListener("mousedown", function() {
        let innerHTML = this.innerHTML;
        playSound(innerHTML);
        buttonClickedAnimation(innerHTML);
    });

    button.addEventListener("mouseup", function() {
        let innerHTML = this.innerHTML;
        buttonReleasedAnimation(innerHTML);
    });
}

document.addEventListener("keydown", function(event) {
    playSound(event.key);
    buttonClickedAnimation(event.key);
});

document.addEventListener("keyup", function(event) {
    buttonReleasedAnimation(event.key);
});

function playSound(key) {
    switch(key) {
        case "w":
            let tom1 = new Audio("./sounds/tom-1.mp3");
            tom1.play();
            break;
        case "a":
            let tom2 = new Audio("./sounds/tom-2.mp3");
            tom2.play();
            break;
        case "s":
            let tom3 = new Audio("./sounds/tom-3.mp3");
            tom3.play();
            break;
        case "d":
            let tom4 = new Audio("./sounds/tom-4.mp3");
            tom4.play();
            break;
        case "j":
            let snare = new Audio("./sounds/snare.mp3");
            snare.play();
            break;
        case "k":
            let crash = new Audio("./sounds/crash.mp3");
            crash.play();
            break;
        case "l":
            let kick = new Audio("./sounds/kick-bass.mp3");
            kick.play();
            break;
        default:
            break;
    }
}

function buttonClickedAnimation(key) {
    let activeButton = document.querySelector("." + key);
    activeButton.classList.add("pressed");
}

function buttonReleasedAnimation(key) {
    let releasedButton = document.querySelector("." + key);
    releasedButton.classList.remove("pressed");
}
