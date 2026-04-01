
// ================== GLOBAL ==================
let coins = parseInt(localStorage.getItem("coins")) || 0;
let xp = parseInt(localStorage.getItem("xp")) || 0;
let currentCategory = "";
let currentLevel = 0;
let soundOn = true;
let spinAllowed = false;

// ================== SOUND SYSTEM ==================
const sounds = {
    click: new Audio("click.mp3"),
    correct: new Audio("correct.mp3"),
    wrong: new Audio("wrong.mp3"),
    spin: new Audio("spin.mp3")
};

function playSound(type){
    if(!soundOn) return;

    let s = sounds[type];
    if(s){
        s.currentTime = 0;
        s.play();
    }
}

// Button click sound (ALL BUTTONS)
window.addEventListener("load", ()=>{
    document.querySelectorAll("button").forEach(btn=>{
        btn.addEventListener("click", ()=>{
            playSound("click");
        });
    });
});

// ================== UI ==================
function updateCoins(){
    let c = document.getElementById("coins");
    if(c) c.innerText = "🪙 " + coins;
}
updateCoins();

function updateXP(){
    let progress = xp % 100;

    let bar = document.getElementById("progress");
    let text = document.getElementById("xpText");

    if(bar) bar.style.width = progress + "%";
    if(text) text.innerText = "XP: " + xp;
}

// ================== SCREEN ==================
function showScreen(id){
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function goHome(){ showScreen("home"); }
function openCategories(){ showScreen("categories"); }
function openShop(){ showScreen("shop"); }

// ================== THEME ==================
function applyTheme(){
    let theme = localStorage.getItem("theme");
    document.body.className = "";

    if(theme) document.body.classList.add(theme);
}
applyTheme();

function buyTheme(theme){
    let price = {
        dark:50, blue:50, green:50,
        neon:80, sunset:80,
        galaxy:100, anime:120
    };

    if(coins < price[theme]){
        alert("Not enough coins!");
        return;
    }

    coins -= price[theme];
    localStorage.setItem("coins", coins);
    updateCoins();

    localStorage.setItem("theme", theme);
    applyTheme();

    alert("Theme applied!");
}

// ================== LEVELS ==================
function openLevels(cat){
    currentCategory = cat;
    showScreen("levels");

    let grid = document.getElementById("levelsGrid");
    grid.innerHTML = "";

    let unlocked = parseInt(localStorage.getItem(cat)) || 1;

    for(let i=1;i<=200;i++){
        let div = document.createElement("div");
        div.innerText = i;
        div.className = "level";

        if(i > unlocked){
            div.classList.add("locked");

            div.onclick = ()=>{
                let buy = confirm("Unlock level for 20 coins?");
                if(buy){
                    if(coins >= 20){
                        coins -= 20;
                        localStorage.setItem("coins", coins);
                        updateCoins();

                        localStorage.setItem(currentCategory, i);
                        openLevels(currentCategory);
                    } else {
                        alert("Not enough coins!");
                    }
                }
            }

        } else {
            div.onclick = ()=>startQuiz(i);
        }

        grid.appendChild(div);
    }
}

// ================== QUESTIONS ==================
const questions = {
world:[
{q:"Capital of India?",o:["Delhi","Paris","Rome","Tokyo"],a:0},
{q:"Largest ocean?",o:["Atlantic","Indian","Pacific","Arctic"],a:2}
],
science:[{q:"H2O is?",o:["Water","Oxygen","Hydrogen","Salt"],a:0}],
history:[{q:"Who discovered India route?",o:["Columbus","Vasco da Gama","Newton","Einstein"],a:1}],
geo:[{q:"Earth shape?",o:["Flat","Round","Square","Triangle"],a:1}],
mixed:[{q:"2+2?",o:["3","4","5","6"],a:1}]
};

// ================== QUIZ ==================
function startQuiz(level){
    currentLevel = level;
    showScreen("quiz");

    let q = questions[currentCategory][level - 1];

    if(!q){
        document.getElementById("question").innerText = "More questions coming soon!";
        return;
    }

    document.getElementById("question").innerText = q.q;

    let optDiv = document.getElementById("options");
    optDiv.innerHTML = "";

    document.getElementById("result").innerText = "";

    updateXP();

    q.o.forEach((opt,i)=>{
        let btn = document.createElement("button");
        btn.innerText = opt;

        btn.onclick = ()=>{
            if(i === q.a){

                playSound("correct");

                document.getElementById("result").innerText = "Correct ✅";

                coins += 10;
                localStorage.setItem("coins", coins);
                updateCoins();

                xp += 5;
                localStorage.setItem("xp", xp);
                updateXP();

                // wins
                let wins = parseInt(localStorage.getItem("wins")) || 0;
                wins++;
                localStorage.setItem("wins", wins);

                checkAchievements();

                let unlock = parseInt(localStorage.getItem(currentCategory)) || 1;
                if(currentLevel >= unlock){
                    localStorage.setItem(currentCategory, currentLevel + 1);
                }

                setTimeout(()=>openLevels(currentCategory),1000);

            } else {

                playSound("wrong");

                document.getElementById("result").innerText = "Wrong ❌";
            }
        }

        optDiv.appendChild(btn);
    });
}

// ================== ACHIEVEMENTS ==================
function checkAchievements(){
    let wins = parseInt(localStorage.getItem("wins")) || 0;
    let xp = parseInt(localStorage.getItem("xp")) || 0;

    let achievements = [];

    if(wins >= 10) achievements.push("🥉 Beginner (10 Wins)");
    if(wins >= 50) achievements.push("🥈 Pro Player (50 Wins)");
    if(wins >= 100) achievements.push("🥇 Champion (100 Wins)");
    if(xp >= 500) achievements.push("🔥 Master (500 XP)");

    localStorage.setItem("achievements", JSON.stringify(achievements));
}

function openAchievements(){
    showScreen("achievements");

    let list = document.getElementById("achList");
    list.innerHTML = "";

    let achievements = JSON.parse(localStorage.getItem("achievements")) || [];

    if(achievements.length === 0){
        list.innerHTML = "<li>No achievements yet 😢</li>";
        return;
    }

    achievements.forEach(a=>{
        let li = document.createElement("li");
        li.innerText = a;
        list.appendChild(li);
    });
}

// ================== SPIN ==================
function openSpin(){ showScreen("spin"); }

function watchAd(){
    alert("Watching Ad...");
    setTimeout(()=>{
        alert("Ad finished! Spin unlocked 🎉");
        spinAllowed = true;
    },2000);
}

function spinWheel(){
    if(!spinAllowed){
        alert("Watch ad first!");
        return;
    }

    let wheel = document.getElementById("wheel");

    // 🔊 SPIN SOUND START
    sounds.spin.loop = true;
    playSound("spin");

    let randomDeg = Math.floor(3600 + Math.random() * 360);
    wheel.style.transform = "rotate(" + randomDeg + "deg)";

    spinAllowed = false;

    setTimeout(()=>{
        let deg = randomDeg % 360;

        let reward;

        if(deg < 60) reward = 10;
        else if(deg < 120) reward = 20;
        else if(deg < 180) reward = 50;
        else if(deg < 240) reward = 0;
        else if(deg < 300) reward = 30;
        else reward = 5;

        if(reward === 0){
            document.getElementById("spinResult").innerText = "Try Again!";
        } else {
            coins += reward;
            localStorage.setItem("coins", coins);
            updateCoins();
            document.getElementById("spinResult").innerText = "You won " + reward + " coins!";
        }

        // 🔇 STOP SOUND
        sounds.spin.pause();
        sounds.spin.currentTime = 0;

    },4000);
}

// ================== DAILY ==================
function claimDaily(){
    let last = localStorage.getItem("daily");
    let today = new Date().toDateString();

    if(last === today){
        alert("Already claimed!");
        return;
    }

    coins += 30;
    localStorage.setItem("coins",coins);
    localStorage.setItem("daily",today);
    updateCoins();

    alert("You got 30 coins!");
}

// ================== RESET ==================
function resetLevels(){
    let sure = confirm("Reset all levels?");

    if(sure){
        let categories = ["world","science","history","geo","mixed"];

        categories.forEach(cat=>{
            localStorage.setItem(cat,1);
        });

        location.reload();
    }
}

// ================== SOUND TOGGLE ==================
window.onload = function(){
    document.getElementById("musicToggle").onclick = function(){
        soundOn = !soundOn;
        this.innerText = soundOn ? "🔊" : "🔇";
    }
};
