let xp = parseInt(localStorage.getItem("xp")) || 0;
let coins = parseInt(localStorage.getItem("coins")) || 0;
let currentCategory = "";
let currentLevel = 0;

// 🪙 COINS UI
function updateCoins() {
    document.getElementById("coins").innerText = "🪙 " + coins;
}
updateCoins();

// 📊 XP UI
function updateXP(){
    let progress = xp % 100;

    let bar = document.getElementById("progress");
    let text = document.getElementById("xpText");

    if(bar) bar.style.width = progress + "%";
    if(text) text.innerText = "XP: " + xp;
}

// SCREEN CONTROL
function showScreen(id){
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// NAVIGATION
function goHome(){ showScreen("home"); }
function openCategories(){ showScreen("categories"); }
function openShop(){ showScreen("shop"); }

function openAchievements(){
    showScreen("achievements");
    let list = document.getElementById("achList");
    list.innerHTML = "";
    if(localStorage.getItem("firstWin")){
        list.innerHTML += "<li>First Win 🏆</li>";
    }
}
// 🎨 THEME
function applyTheme(){
    let theme = localStorage.getItem("theme");

    document.body.className = ""; // reset

    if(theme === "dark"){
        document.body.classList.add("dark");
    }
    else if(theme === "blue"){
        document.body.classList.add("blue");
    }
    else if(theme === "green"){
        document.body.classList.add("green");
    }
    else if(theme === "neon"){
        document.body.classList.add("neon");
    }
    else if(theme === "sunset"){
        document.body.classList.add("sunset");
    }
    else if(theme === "galaxy"){
        document.body.classList.add("galaxy");
    }
    else if(theme === "anime"){
        document.body.classList.add("anime");
    }
}

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

    alert(theme + " theme applied!");
}

// LEVEL SYSTEM + 🔓 BUY LOCKED LEVEL
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
                let buy = confirm("Unlock level for 200 coins?");
                if(buy){
                    if(coins >= 200){
                        coins -= 200;
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

// QUESTIONS
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

// QUIZ
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
                document.getElementById("result").innerText = "Correct ✅";

                // 🪙 coins
                coins += 10;
                localStorage.setItem("coins", coins);
                updateCoins();

                // 📊 XP
                xp += 5;
                localStorage.setItem("xp", xp);
                updateXP();

                // unlock next
                let unlock = parseInt(localStorage.getItem(currentCategory)) || 1;
                if(currentLevel >= unlock){
                    localStorage.setItem(currentCategory, currentLevel + 1);
                }

                localStorage.setItem("firstWin",true);

                setTimeout(()=>openLevels(currentCategory),1000);
            } else {
                document.getElementById("result").innerText = "Wrong ❌";
            }
        }

        optDiv.appendChild(btn);
    });
}

// SPIN
function openSpin(){ showScreen("spin"); }

let spun = localStorage.getItem("spinDone");

function watchAd(){
    alert("Showing Ad...");
    setTimeout(()=>alert("Ad Finished!"),2000);
}


let spinAllowed = false;

function watchAd(){
    alert("Showing Ad...");
    setTimeout(()=>{
        alert("Ad Finished! Now you can spin 🎉");
        spinAllowed = true;
    },2000);
}

function spinWheel(){
    if(!spinAllowed){
        alert("Watch ad first!");
        return;
    }

    let wheel = document.getElementById("wheel");

    let randomDeg = Math.floor(3600 + Math.random() * 360);
    wheel.style.transform = "rotate(" + randomDeg + "deg)";

    spinAllowed = false; // reset

    setTimeout(()=>{
        let deg = randomDeg % 360;

        let reward;

        if(deg >= 0 && deg < 60){
            reward = 10;
        }
        else if(deg >= 60 && deg < 120){
            reward = 20;
        }
        else if(deg >= 120 && deg < 180){
            reward = 50;
        }
        else if(deg >= 180 && deg < 240){
            reward = 0;
        }
        else if(deg >= 240 && deg < 300){
            reward = 30;
        }
        else{
            reward = 5;
        }

        if(reward === 0){
            document.getElementById("spinResult").innerText = "Try Again!";
        } else {
            coins += reward;
            localStorage.setItem("coins", coins);
            updateCoins();

            document.getElementById("spinResult").innerText = "You won " + reward + " coins!";
        }

    }, 4000);
}

// DAILY
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

// RESET
function resetLevels() {
    let sure = confirm("Reset all levels?");

    if (sure) {
        let categories = ["world", "science", "history", "geo", "mixed"];

        categories.forEach(cat => {
            localStorage.setItem(cat, 1);
        });

        localStorage.setItem("currentLevel", 1);

        alert("Levels reset!");
        location.reload();
    }
}