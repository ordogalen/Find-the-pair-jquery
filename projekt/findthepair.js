//All image i need
let mainImages = ["bloat.png","bloat.png","q.png","q.png","isaac.png","isaac.png","greed.png","greed.png","worm.png","worm.png","wrath.png","wrath.png"
    ,"fistula.png","fistula.png","w.png","w.png","monster.png","monster.png","a.png","a.png"];
for (let i = 0; i < mainImages.length; i++) {
    mainImages[i] = "images/"+mainImages[i];
}
//images depends on the size
let images=[];

//size of the game
let actualSize = 0;

let flippedCards=[];
let flips = 0;
let allFlips=0;

let allPairs = 0;

let pause = false;

let firstCard = true;

//t for the setinterval
let t = 0;
let time = 0;

//player array to save in local storage
let lb1 = JSON.parse(localStorage.getItem("leaderboard1")) || [];
let lb2 = JSON.parse(localStorage.getItem("leaderboard2")) || [];
let lb3 = JSON.parse(localStorage.getItem("leaderboard3")) || [];


//audio stuff
let backgroundMusic = new Audio("audios/genesis.mp3");
backgroundMusic.volume=0.05;
let notPair = new Audio("audios/hurt.mp3")
notPair.volume=0.20;
let isPair = new Audio("audios/Holy.mp3")
isPair.volume=0.20;
let winSound = new Audio("audios/win.mp3");
winSound.volume=0.10;


//The main function
function game() {
    //If size changed and the 't' was running i stop it, and set everything to 0
    if(t > 0){
        allFlips=0;
        $("#flips").text("Flips: "+allFlips);
        firstCard=true;
        clearInterval(t);
        time=0;
        $("#timer").text("Timer: "+time);
        paused = false;
    }

    backgroundMusic.play();

    $(".card").click(function () {
        // if the children img display is none and the classname is 'card' and not paused
        if($(this).children("img").css("display",) === "none" && this.className === "card" && !pause) {
            //timer start running when the first card was flipped
            if(firstCard){
                t = setInterval(timer,1000);
                firstCard=false;
            }

            flips++;
            allFlips++;
            $("#flips").text("Flips: "+allFlips);
            flippedCards.push(this);
            $(this).children("img").css("display", "inline");
        }

        //if we flipped 2 cards we check if the cards are the same
        if(flips === 2){
            pause=true;
            if(checkCards()) {
                //if cards are the same
                setTimeout(function() {
                    clearCards(true);
                }, 750)
                allPairs -= 1;
                isPair.play();
            }
            else{
                //if the cards are not the same
                setTimeout(function() {
                    clearCards(false);
                }, 750);
                notPair.play();
            }
            //if all the pairs have been found we stop the game
            if(allPairs === 0){
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
                winSound.play();
                clearInterval(t);
                $('#name').prop('disabled',false);
                paused = true;
            }
            flips = 0;
        }
    });
}

function timer() {
    time++;
    $("#timer").text("Timer: "+time+" s");
}

//clean the cards if found or just hide it if it was not found.
//also clear flippedCards array.
function clearCards(val) {
    if(val) {
        for (let i = 0; i < 2; i++) {
            $(flippedCards[i]).children("img").css("display", "none");
            flippedCards[i].className = "cardHidden";
        }
    }
    else{
        for (let i = 0; i < 2; i++) {
            $(flippedCards[i]).children("img").css("display", "none");
        }
    }
    flippedCards=[];
    pause = false;
}

//checking image src in the flippedCards array.
function checkCards() {
    return flippedCards[0].children[0].src === flippedCards[1].children[0].src;
}


//Fill the cards with randomized image src-s * size
function fillCards(size) {
    let cards = document.querySelectorAll(".card").forEach(value => {
        let img = document.createElement("img");
        let index = Math.ceil(Math.random() * images.length-1)
        img.src=images[index];
        images.splice(index,1);
        value.appendChild(img);
    });

    // show the cards for 2 seconds
    $(".card").children("img").css("display","inline");
    $("#select").prop('disabled',true);
    setTimeout(hideCards,2000);
}

// after 2 seconds the cards will be hidden.
function hideCards() {
    $(".card").children("img").css("display","none");
    $("#select").prop('disabled',false);
    document.getElementById('select').selectedIndex = -1;
}

//if the player select another size, it will change the game size and start the game from 0
function sizeChanged() {
    images = mainImages.slice(0,this.value*2);
    let cp = $("#cardPanel");
    cp.children().remove();
    allPairs = this.value;
    actualSize = this.value;
    for (let i = 0; i < this.value*2; i++) {
        cp.append("<div class ='card'></div>");
    }
    leaderboardRefresh();
    fillCards(this.value);
    game();
}

//sorting the players and append it to the leaderboard
function leaderboardRefresh() {
    $('#name').prop('disabled',true);

    let temp = $("tbody");
    temp.children().remove();
    temp.append('<tr style="border-bottom: 2px dashed black"><th>NAME</th><th>POINTS</th>')


    //save the lb variable to localstorage
    if(actualSize === '6') {
        lb1.sort((a,b) => (a.points > b.points) ? 1:-1)
        //top 10 will shown rest is gone
        lb1.splice(10);
        localStorage.setItem("leaderboard1",JSON.stringify(lb1));
        for (let i = 0; i < lb1.length; i++)
        {
            $('#leaderb').append('<tr><th>' + lb1[i].name + '</th><th>' + lb1[i].points + '</th>');
        }
    }
    else if(actualSize === '8') {
        lb2.sort((a,b) => (a.points > b.points) ? 1:-1)

        //top 10 will shown rest is gone
        lb2.splice(10);
        localStorage.setItem("leaderboard2",JSON.stringify(lb2));
        for (let i = 0; i < lb2.length; i++)
        {
            $('#leaderb').append('<tr><th>' + lb2[i].name + '</th><th>' + lb2[i].points + '</th>');
        }
    }
    else if(actualSize === '10') {
        lb3.sort((a,b) => (a.points > b.points) ? 1:-1)

        //top 10 will shown rest is gone
        lb3.splice(10);
        localStorage.setItem("leaderboard3",JSON.stringify(lb3));
        for (let i = 0; i < lb3.length; i++)
        {
            $('#leaderb').append('<tr><th>' + lb3[i].name + '</th><th>' + lb3[i].points + '</th>');
        }
    }

}

$(document).ready(function () {
    $('#name').prop('disabled',true);
    let selected = $("#select");
    document.getElementById('select').selectedIndex = -1;
    selected.change(sizeChanged);
    leaderboardRefresh();
    $('#submit').click(function () {
        if(paused){
            let player = {
                name: document.getElementById("name").value,
                points: Math.floor(allFlips * 10 + time)
            }
            if(actualSize === '6') {
                lb1.push(player);
            }
            if(actualSize === '8') {
                lb2.push(player);
            }
            if(actualSize === '10') {
                lb3.push(player);
            }
            leaderboardRefresh();
            paused = false;
        }
    });
});

