document.addEventListener('DOMContentLoaded', (event) => {
    let random1 = Math.floor( Math.random() * 6) + 1;
    let img1Path = "./images/dice" + random1 + ".png";
    let random2 = Math.floor( Math.random() * 6) + 1;
    let img2Path = "./images/dice" + random2 + ".png";

    document.querySelector(".img1").setAttribute("src", img1Path);
    document.querySelector(".img2").setAttribute("src", img2Path);

    if (random1 > random2) {
        document.querySelector(".container h1").textContent = "🚩 Player 1 Wins!";
        document.querySelectorAll(".dice p")[0].classList.add("winner");
    } else if (random1 < random2) {
        document.querySelector(".container h1").textContent = "Player 2 Wins! 🚩";
        document.querySelectorAll(".dice p")[1].classList.add("winner");
    } else {
        document.querySelector(".container h1").textContent = "Draw!";
    }
});