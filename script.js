
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
    correct: new Audio("/correct.mp3"),
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
{q:"Capital of USA?", o:["New York","Washington DC","Los Angeles","Chicago"], a:1},
{q:"Capital of UK?", o:["London","Paris","Berlin","Rome"], a:0},
{q:"Capital of France?", o:["Madrid","Rome","Paris","Berlin"], a:2},
{q:"Capital of Germany?", o:["Munich","Berlin","Frankfurt","Hamburg"], a:1},
{q:"Capital of Italy?", o:["Venice","Rome","Milan","Naples"], a:1},

{q:"Capital of Japan?", o:["Tokyo","Seoul","Beijing","Bangkok"], a:0},
{q:"Capital of China?", o:["Shanghai","Beijing","Hong Kong","Wuhan"], a:1},
{q:"Capital of Russia?", o:["Moscow","Kyiv","Minsk","Warsaw"], a:0},
{q:"Capital of Canada?", o:["Toronto","Ottawa","Vancouver","Montreal"], a:1},
{q:"Capital of Australia?", o:["Sydney","Melbourne","Canberra","Perth"], a:2},

{q:"Capital of India?", o:["Delhi","Mumbai","Kolkata","Chennai"], a:0},
{q:"Capital of Brazil?", o:["Rio","Sao Paulo","Brasilia","Salvador"], a:2},
{q:"Capital of Argentina?", o:["Buenos Aires","Lima","Santiago","Bogota"], a:0},
{q:"Capital of Mexico?", o:["Mexico City","Cancun","Monterrey","Tijuana"], a:0},
{q:"Capital of South Africa?", o:["Cape Town","Pretoria","Johannesburg","Durban"], a:1},

{q:"Capital of Egypt?", o:["Cairo","Alexandria","Giza","Luxor"], a:0},
{q:"Capital of Turkey?", o:["Istanbul","Ankara","Izmir","Antalya"], a:1},
{q:"Capital of Saudi Arabia?", o:["Riyadh","Jeddah","Mecca","Medina"], a:0},
{q:"Capital of UAE?", o:["Dubai","Abu Dhabi","Sharjah","Ajman"], a:1},
{q:"Capital of Pakistan?", o:["Karachi","Islamabad","Lahore","Peshawar"], a:1},

{q:"Capital of Bangladesh?", o:["Dhaka","Chittagong","Khulna","Sylhet"], a:0},
{q:"Capital of Nepal?", o:["Kathmandu","Pokhara","Lalitpur","Biratnagar"], a:0},
{q:"Capital of Sri Lanka?", o:["Colombo","Kandy","Galle","Jaffna"], a:0},
{q:"Capital of Afghanistan?", o:["Kabul","Herat","Kandahar","Mazar"], a:0},
{q:"Capital of Iran?", o:["Tehran","Isfahan","Shiraz","Tabriz"], a:0},

{q:"Capital of Iraq?", o:["Baghdad","Basra","Mosul","Karbala"], a:0},
{q:"Capital of Thailand?", o:["Bangkok","Phuket","Chiang Mai","Pattaya"], a:0},
{q:"Capital of Indonesia?", o:["Jakarta","Bali","Surabaya","Bandung"], a:0},
{q:"Capital of Philippines?", o:["Manila","Cebu","Davao","Quezon"], a:0},
{q:"Capital of Vietnam?", o:["Hanoi","Ho Chi Minh","Da Nang","Hue"], a:0},

{q:"Capital of South Korea?", o:["Seoul","Busan","Incheon","Daegu"], a:0},
{q:"Capital of North Korea?", o:["Pyongyang","Seoul","Busan","Incheon"], a:0},
{q:"Capital of Spain?", o:["Barcelona","Madrid","Valencia","Seville"], a:1},
{q:"Capital of Portugal?", o:["Lisbon","Porto","Braga","Coimbra"], a:0},
{q:"Capital of Netherlands?", o:["Amsterdam","Rotterdam","Utrecht","Hague"], a:0},

{q:"Capital of Belgium?", o:["Brussels","Antwerp","Ghent","Bruges"], a:0},
{q:"Capital of Switzerland?", o:["Zurich","Geneva","Bern","Basel"], a:2},
{q:"Capital of Sweden?", o:["Stockholm","Oslo","Copenhagen","Helsinki"], a:0},
{q:"Capital of Norway?", o:["Oslo","Bergen","Trondheim","Stavanger"], a:0},
{q:"Capital of Denmark?", o:["Copenhagen","Aarhus","Odense","Aalborg"], a:0},

{q:"Capital of Finland?", o:["Helsinki","Turku","Tampere","Oulu"], a:0},
{q:"Capital of Poland?", o:["Warsaw","Krakow","Gdansk","Wroclaw"], a:0},
{q:"Capital of Ukraine?", o:["Kyiv","Lviv","Odessa","Kharkiv"], a:0},
{q:"Capital of Greece?", o:["Athens","Thessaloniki","Sparta","Patras"], a:0},
{q:"Capital of Austria?", o:["Vienna","Salzburg","Graz","Linz"], a:0},

{q:"Capital of Hungary?", o:["Budapest","Debrecen","Szeged","Pecs"], a:0},
{q:"Capital of Czech Republic?", o:["Prague","Brno","Ostrava","Plzen"], a:0},
{q:"Capital of Romania?", o:["Bucharest","Cluj","Timisoara","Iasi"], a:0},
{q:"Capital of Bulgaria?", o:["Sofia","Plovdiv","Varna","Burgas"], a:0},
{q:"Capital of New Zealand?", o:["Auckland","Wellington","Christchurch","Hamilton"], a:1},
{q:"Largest country in the world?", o:["USA","China","Russia","Canada"], a:2},
{q:"Smallest country?", o:["Monaco","Vatican City","Malta","Luxembourg"], a:1},
{q:"Most populous country?", o:["India","USA","China","Brazil"], a:0},
{q:"Which country has most islands?", o:["Indonesia","Philippines","Sweden","Japan"], a:2},
{q:"Which country has no capital?", o:["Nauru","Monaco","Vatican","Malta"], a:0},

{q:"Currency of USA?", o:["Dollar","Euro","Pound","Yen"], a:0},
{q:"Currency of UK?", o:["Euro","Pound","Dollar","Franc"], a:1},
{q:"Currency of Japan?", o:["Yuan","Won","Yen","Dollar"], a:2},
{q:"Currency of China?", o:["Yen","Yuan","Won","Dollar"], a:1},
{q:"Currency of India?", o:["Rupee","Dollar","Taka","Rial"], a:0},

{q:"Currency of UAE?", o:["Dirham","Riyal","Dinar","Pound"], a:0},
{q:"Currency of Saudi Arabia?", o:["Riyal","Dirham","Dinar","Dollar"], a:0},
{q:"Currency of Europe?", o:["Euro","Dollar","Pound","Yen"], a:0},
{q:"Currency of Russia?", o:["Ruble","Euro","Dollar","Yen"], a:0},
{q:"Currency of Pakistan?", o:["Rupee","Taka","Rial","Dinar"], a:0},

{q:"Which country is known as Land of Rising Sun?", o:["China","Japan","Korea","Thailand"], a:1},
{q:"Land of Kangaroos?", o:["New Zealand","Australia","USA","Canada"], a:1},
{q:"Land of Pharaohs?", o:["Egypt","Greece","Rome","Turkey"], a:0},
{q:"Land of Thunder Dragon?", o:["Nepal","Bhutan","Tibet","China"], a:1},
{q:"Land of Midnight Sun?", o:["Norway","Sweden","Finland","Denmark"], a:0},

{q:"Which country has Eiffel Tower?", o:["Italy","France","Spain","Germany"], a:1},
{q:"Which country has Great Wall?", o:["India","China","Japan","Korea"], a:1},
{q:"Which country has Taj Mahal?", o:["Pakistan","India","Bangladesh","Nepal"], a:1},
{q:"Which country has Statue of Liberty?", o:["USA","UK","France","Canada"], a:0},
{q:"Which country has Colosseum?", o:["Greece","Italy","Spain","France"], a:1},

{q:"Which continent is largest?", o:["Africa","Asia","Europe","America"], a:1},
{q:"Which continent is smallest?", o:["Europe","Australia","Antarctica","Africa"], a:1},
{q:"Which continent has most countries?", o:["Africa","Asia","Europe","America"], a:0},
{q:"Which continent has no country?", o:["Antarctica","Asia","Europe","Africa"], a:0},
{q:"Which continent is coldest?", o:["Antarctica","Asia","Europe","Africa"], a:0},

{q:"Which country has most population in Europe?", o:["Germany","France","Italy","Spain"], a:0},
{q:"Which country is famous for pizza?", o:["France","Italy","USA","Spain"], a:1},
{q:"Which country is famous for sushi?", o:["China","Japan","Korea","Thailand"], a:1},
{q:"Which country is famous for chocolate?", o:["Belgium","Italy","France","Germany"], a:0},
{q:"Which country is famous for pyramids?", o:["Egypt","India","China","Peru"], a:0},

{q:"Which country has longest river Nile?", o:["India","Egypt","Brazil","China"], a:1},
{q:"Amazon river is in?", o:["Brazil","USA","India","China"], a:0},
{q:"Mount Everest is in?", o:["India","Nepal","China","Bhutan"], a:1},
{q:"Which country has Sahara Desert?", o:["Egypt","India","China","Brazil"], a:0},
{q:"Which country has Amazon forest?", o:["Brazil","India","China","USA"], a:0},

{q:"Which country hosted Olympics 2020?", o:["Japan","China","UK","USA"], a:0},
{q:"Which country hosted FIFA 2022?", o:["Qatar","USA","France","Brazil"], a:0},
{q:"Which country is known for football?", o:["Brazil","India","China","Japan"], a:0},
{q:"Which country is known for cricket?", o:["India","USA","China","Japan"], a:0},
{q:"Which country is known for rugby?", o:["New Zealand","India","China","Japan"], a:0},

{q:"Which country is famous for tea?", o:["India","China","Japan","UK"], a:1},
{q:"Which country is famous for coffee?", o:["Brazil","India","China","Japan"], a:0},
{q:"Which country is famous for wine?", o:["France","India","China","Japan"], a:0},
{q:"Which country is famous for cars?", o:["Germany","India","China","Japan"], a:0},
{q:"Which country is famous for technology?", o:["USA","India","China","Japan"], a:0},
{q:"Which country has the most time zones?", o:["USA","Russia","France","China"], a:2},
{q:"Which is the longest river in the world?", o:["Amazon","Nile","Yangtze","Mississippi"], a:1},
{q:"Which country is both in Europe and Asia?", o:["Turkey","India","Egypt","Brazil"], a:0},
{q:"Which desert is the largest in the world?", o:["Sahara","Arabian","Antarctic","Gobi"], a:2},
{q:"Which ocean is the largest?", o:["Atlantic","Indian","Pacific","Arctic"], a:2},

{q:"Which country has highest population density?", o:["India","China","Monaco","Japan"], a:2},
{q:"Which country has most volcanoes?", o:["Japan","Indonesia","USA","Italy"], a:1},
{q:"Which country has largest rainforest?", o:["Brazil","India","China","Congo"], a:0},
{q:"Which country has longest coastline?", o:["USA","Canada","Russia","Australia"], a:1},
{q:"Which country has most languages?", o:["India","USA","China","Indonesia"], a:0},

{q:"Which continent has no deserts?", o:["Europe","Asia","Africa","Australia"], a:0},
{q:"Which country is called Land of Fire and Ice?", o:["Iceland","Norway","Canada","Russia"], a:0},
{q:"Which country has most pyramids?", o:["Egypt","Sudan","Mexico","Peru"], a:1},
{q:"Which is the smallest continent?", o:["Europe","Australia","Antarctica","South America"], a:1},
{q:"Which country has no rivers?", o:["Saudi Arabia","Egypt","India","China"], a:0},

{q:"Which country has the tallest building?", o:["USA","China","UAE","Saudi Arabia"], a:2},
{q:"Which country has largest island?", o:["Greenland","Australia","Madagascar","Borneo"], a:0},
{q:"Which country has most lakes?", o:["USA","Canada","Russia","India"], a:1},
{q:"Which country has highest mountain?", o:["Nepal","China","India","Bhutan"], a:0},
{q:"Which country has most deserts?", o:["Australia","India","China","USA"], a:0},

{q:"Which country has the most billionaires?", o:["USA","China","India","Germany"], a:0},
{q:"Which country has most oil reserves?", o:["Saudi Arabia","USA","Russia","Venezuela"], a:3},
{q:"Which country is largest democracy?", o:["USA","India","Brazil","Indonesia"], a:1},
{q:"Which country is known for tulips?", o:["Netherlands","France","Italy","Germany"], a:0},
{q:"Which country is known for maple syrup?", o:["USA","Canada","UK","France"], a:1},

{q:"Which country has largest army?", o:["USA","China","India","Russia"], a:1},
{q:"Which country has highest GDP?", o:["China","USA","Japan","Germany"], a:1},
{q:"Which country uses Euro but not in EU?", o:["Norway","Switzerland","Monaco","UK"], a:2},
{q:"Which country is not in UN?", o:["Vatican City","USA","India","China"], a:0},
{q:"Which country has most UNESCO sites?", o:["Italy","China","India","France"], a:0},

{q:"Which country has highest literacy?", o:["Finland","Norway","USA","Germany"], a:1},
{q:"Which country is known for fjords?", o:["Norway","Sweden","Finland","Denmark"], a:0},
{q:"Which country is known for samba?", o:["Brazil","Spain","Italy","France"], a:0},
{q:"Which country is known for tango?", o:["Argentina","Brazil","Spain","Italy"], a:0},
{q:"Which country is known for opera?", o:["Italy","France","Germany","Austria"], a:0},

{q:"Which country has most islands?", o:["Sweden","Indonesia","Philippines","Japan"], a:0},
{q:"Which country has highest waterfall?", o:["Venezuela","Brazil","USA","Canada"], a:0},
{q:"Which country has largest desert (hot)?", o:["Sahara","Arabian","Gobi","Kalahari"], a:0},
{q:"Which country has most earthquakes?", o:["Japan","India","China","USA"], a:0},
{q:"Which country has most bridges?", o:["China","USA","India","Japan"], a:0},

{q:"Which country has fastest train?", o:["Japan","China","France","Germany"], a:1},
{q:"Which country has most tourists?", o:["France","USA","Spain","Italy"], a:0},
{q:"Which country has highest life expectancy?", o:["Japan","USA","India","China"], a:0},
{q:"Which country has most forests?", o:["Russia","Brazil","Canada","USA"], a:0},
{q:"Which country has most diamonds?", o:["Russia","South Africa","Botswana","Canada"], a:0},

{q:"Which country has largest gold reserve?", o:["USA","Germany","Italy","France"], a:0},
{q:"Which country has most airports?", o:["USA","China","India","Brazil"], a:0},
{q:"Which country has most roads?", o:["USA","India","China","Brazil"], a:0},
{q:"Which country has most cars?", o:["USA","China","Japan","Germany"], a:1},
{q:"Which country has most satellites?", o:["USA","Russia","China","India"], a:0},
{q:"Which is the largest island in the world?", o:["Greenland","Madagascar","Borneo","Australia"], a:0},
 {q:"Who is known as the 'Father of Modern Physics'?", o:["Albert Einstein","Isaac Newton","Galileo Galilei","Nikola Tesla"], a:0},
{q:"What is the currency of the United Kingdom?", o:["Dollar","Pound Sterling","Euro","Yen"], a:1},
  {q:"Which is the smallest planet in our solar system?", o:["Mercury","Mars","Venus","Pluto"], a:0},
{q:"Who wrote 'The Iliad'?", o:["Homer","Shakespeare","Virgil","Dante"], a:0},
  {q:"What is the national bird of India?", o:["Peacock","Swan","Eagle","Sparrow"], a:0},
 {q:"Which country is famous for the Great Wall?", o:["China","Japan","Mongolia","India"], a:0},
  {q:"Who invented the World Wide Web (WWW)?", o:["Bill Gates","Tim Berners-Lee","Steve Jobs","Mark Zuckerberg"], a:1},
  {q:"What is the chemical symbol for gold?", o:["Ag","Au","Gd","Go"], a:1},
  {q:"Which river flows through Egypt?", o:["Nile","Amazon","Yangtze","Ganges"], a:0},
  {q:"Who was the first President of the United States?", o:["Abraham Lincoln","George Washington","Thomas Jefferson","John Adams"], a:1},
  {q:"What is the largest mammal on Earth?", o:["Elephant","Blue Whale","Giraffe","Hippopotamus"], a:1},
  {q:"Which planet is known for its Great Red Spot?", o:["Mars","Jupiter","Saturn","Neptune"], a:1},
  {q:"Who discovered radioactivity?", o:["Marie Curie","Albert Einstein","Isaac Newton","Niels Bohr"], a:0},
  {q:"What is the capital of Italy?", o:["Rome","Milan","Venice","Florence"], a:0},
  {q:"Which continent has the most countries?", o:["Africa","Asia","Europe","South America"], a:0},
  {q:"Who painted 'The Last Supper'?", o:["Leonardo da Vinci","Michelangelo","Raphael","Donatello"], a:0},
  {q:"What is the main gas in the air we breathe?", o:["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"], a:1},
  {q:"Which animal is known as the King of the Jungle?", o:["Tiger","Lion","Elephant","Cheetah"], a:1},
  {q:"Who wrote 'Pride and Prejudice'?", o:["Charlotte Bronte","Jane Austen","Mary Shelley","Emily Bronte"], a:1},
  {q:"Which country is known as the Land of a Thousand Lakes?", o:["Finland","Sweden","Norway","Iceland"], a:0},
  {q:"What is the boiling point of water in Celsius?", o:["90°C","100°C","80°C","120°C"], a:1},
  {q:"Who invented the airplane?", o:["Wright Brothers","Leonardo da Vinci","Thomas Edison","Alexander Graham Bell"], a:0},
  {q:"What is the tallest waterfall in the world?", o:["Niagara","Angel Falls","Victoria Falls","Yosemite Falls"], a:1},
  {q:"Which is the fastest bird in the world?", o:["Eagle","Peregrine Falcon","Ostrich","Hummingbird"], a:1},
  {q:"Who was the first man in space?", o:["Neil Armstrong","Yuri Gagarin","Buzz Aldrin","John Glenn"], a:1},
  {q:"What is the capital of Russia?", o:["Moscow","Saint Petersburg","Kazan","Sochi"], a:0},
  {q:"Which element has the chemical symbol 'Na'?", o:["Sodium","Nitrogen","Neon","Nickel"], a:0},
  {q:"Who is known as the 'Missile Man of India'?", o:["APJ Abdul Kalam","Vikram Sarabhai","Homi Bhabha","C.V. Raman"], a:0},
  {q:"Which planet is farthest from the Sun?", o:["Uranus","Neptune","Saturn","Pluto"], a:1},
  {q:"What is the national fruit of India?", o:["Mango","Apple","Banana","Papaya"], a:0},
  {q:"Who wrote 'Animal Farm'?", o:["George Orwell","J.K. Rowling","Mark Twain","Charles Dickens"], a:0},
  {q:"Which country is famous for the Eiffel Tower?", o:["France","Italy","Germany","Spain"], a:0},
  {q:"What is the chemical symbol for silver?", o:["Ag","Si","Au","Sr"], a:0},
  {q:"Who was the first woman Prime Minister of India?", o:["Indira Gandhi","Sonia Gandhi","Pratibha Patil","Sarojini Naidu"], a:0},
  {q:"Which desert is the hottest in the world?", o:["Sahara","Gobi","Kalahari","Dasht-e Lut"], a:3},
  {q:"Who discovered electricity?", o:["Benjamin Franklin","Thomas Edison","Nikola Tesla","Michael Faraday"], a:0},
  {q:"What is the largest lake in the world?", o:["Lake Superior","Caspian Sea","Lake Victoria","Lake Baikal"], a:1},
  {q:"Which country is famous for the Taj Mahal?", o:["India","Pakistan","Bangladesh","Nepal"], a:0},
  {q:"Who wrote 'Macbeth'?", o:["William Shakespeare","Charles Dickens","Jane Austen","Mark Twain"], a:0},
  {q:"Which ocean is the smallest in the world?", o:["Atlantic","Indian","Arctic","Pacific"], a:2},
  {q:"What is the national tree of India?", o:["Neem","Banyan","Peepal","Mango"], a:1},
  {q:"Who invented the first computer?", o:["Charles Babbage","Alan Turing","Bill Gates","Steve Jobs"], a:0},
  {q:"Which country is known as the Land of Fire and Ice?", o:["Iceland","Norway","Greenland","Finland"], a:0},
  {q:"What is the capital of Germany?", o:["Berlin","Munich","Frankfurt","Hamburg"], a:0},
  {q:"Who is the founder of Tesla?", o:["Elon Musk","Jeff Bezos","Bill Gates","Mark Zuckerberg"], a:0},
  {q:"What is the currency of China?", o:["Yuan","Yen","Won","Dollar"], a:0},
  {q:"Which planet is called the Morning Star or Evening Star?", o:["Venus","Mercury","Mars","Jupiter"], a:0},
  {q:"Who is the Father of the Nation of South Africa?", o:["Nelson Mandela","Mahatma Gandhi","Desmond Tutu","Oliver Tambo"], a:0},
  {q:"What is the main ingredient of steel?", o:["Iron","Carbon","Aluminum","Copper"], a:0},
],
science:[
{q:"What is H2O?", o:["Oxygen","Hydrogen","Water","Salt"], a:2},
{q:"What gas do plants absorb?", o:["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"], a:2},
{q:"Red planet?", o:["Earth","Mars","Venus","Jupiter"], a:1},
{q:"Boiling point of water?", o:["50°C","100°C","150°C","200°C"], a:1},
{q:"Center of atom?", o:["Proton","Electron","Nucleus","Neutron"], a:2},
{q:"Breathing organ?", o:["Heart","Lungs","Brain","Liver"], a:1},
{q:"Force pulling objects to Earth?", o:["Magnetism","Gravity","Friction","Energy"], a:1},
{q:"Nearest star?", o:["Moon","Mars","Sun","Venus"], a:2},

{q:"Symbol of Oxygen?", o:["O","Ox","Og","On"], a:0},
{q:"Food making part of plant?", o:["Root","Stem","Leaf","Flower"], a:2},
{q:"Largest organ?", o:["Brain","Liver","Skin","Heart"], a:2},
{q:"Humans breathe in?", o:["CO2","O2","N2","H2"], a:1},
{q:"Freezing point of water?", o:["0°C","10°C","-10°C","5°C"], a:0},
{q:"Unit of force?", o:["Joule","Newton","Watt","Volt"], a:1},
{q:"Closest planet to Sun?", o:["Venus","Earth","Mercury","Mars"], a:2},
{q:"Brain function?", o:["Pump blood","Control body","Digest food","Breathe"], a:1},
{q:"Energy is?", o:["Matter","Power to do work","Heat","Light"], a:1},
{q:"Cells fighting infection?", o:["RBC","WBC","Platelets","Plasma"], a:1},

{q:"Speed of light?", o:["3×10^8 m/s","100 m/s","1000 m/s","10 m/s"], a:0},
{q:"DNA is?", o:["Protein","Genetic material","Fat","Vitamin"], a:1},
{q:"Blood purifier?", o:["Heart","Liver","Kidney","Brain"], a:2},
{q:"Smallest unit of life?", o:["Atom","Cell","Tissue","Organ"], a:1},
{q:"Gas used in photosynthesis?", o:["O2","CO2","H2","N2"], a:1},
{q:"SI unit of time?", o:["Minute","Hour","Second","Day"], a:2},
{q:"Evaporation is?", o:["Solid→Gas","Liquid→Gas","Gas→Liquid","Solid→Liquid"], a:1},
{q:"Sound is?", o:["Light","Energy wave","Matter","Gas"], a:1},
{q:"Electricity is?", o:["Heat","Flow of electrons","Light","Force"], a:1},
{q:"Friction is?", o:["Push","Pull","Resistance force","Motion"], a:2},

{q:"Hardest substance?", o:["Gold","Iron","Diamond","Silver"], a:2},
{q:"Magnet does?", o:["Light","Attract metal","Heat","Energy"], a:1},
{q:"Unit of energy?", o:["Watt","Joule","Volt","Ampere"], a:1},
{q:"Planet with rings?", o:["Mars","Earth","Saturn","Venus"], a:2},
{q:"Gravity is?", o:["Push","Pull force","Heat","Energy"], a:1},
{q:"Main gas in air?", o:["Oxygen","Nitrogen","CO2","Hydrogen"], a:1},
{q:"Thermometer measures?", o:["Weight","Temperature","Speed","Light"], a:1},
{q:"Solar energy comes from?", o:["Wind","Water","Sun","Heat"], a:2},
{q:"Battery does?", o:["Store energy","Heat device","Light device","Sound device"], a:0},
{q:"Acid taste?", o:["Sweet","Sour","Bitter","Salty"], a:1},

{q:"Base taste?", o:["Sour","Bitter","Sweet","Neutral"], a:1},
{q:"Neutral substance?", o:["Acid","Base","Neither","Salt"], a:2},
{q:"Rusting is?", o:["Burning","Iron + Oxygen","Melting","Freezing"], a:1},
{q:"Inertia is?", o:["Force","Resistance to change","Energy","Speed"], a:1},
{q:"Motion is?", o:["Rest","Movement","Energy","Force"], a:1},
{q:"Mass is?", o:["Weight","Amount of matter","Speed","Energy"], a:1},
{q:"Light is?", o:["Energy","Matter","Gas","Liquid"], a:0},
{q:"Heat is?", o:["Energy","Matter","Light","Gas"], a:0},
{q:"Pressure is?", o:["Force/Area","Speed","Energy","Heat"], a:0},
{q:"Unit of current?", o:["Volt","Ampere","Watt","Joule"], a:1},
{q:"What is the SI unit of temperature?", o:["Celsius","Kelvin","Fahrenheit","Joule"], a:1},
{q:"Which part of eye controls light?", o:["Retina","Cornea","Iris","Lens"], a:2},
{q:"What is photosynthesis?", o:["Breathing","Food making","Digestion","Movement"], a:1},
{q:"What is the main source of energy for Earth?", o:["Moon","Sun","Wind","Water"], a:1},
{q:"Which metal is liquid at room temp?", o:["Iron","Mercury","Gold","Silver"], a:1},
{q:"What is pH scale used for?", o:["Speed","Acidity","Temperature","Force"], a:1},
{q:"What is atom made of?", o:["Cells","Protons, neutrons, electrons","DNA","Molecules"], a:1},
{q:"What is force?", o:["Energy","Push or pull","Heat","Light"], a:1},
{q:"What is velocity?", o:["Speed","Speed with direction","Distance","Force"], a:1},
{q:"What is acceleration?", o:["Speed","Change in velocity","Force","Mass"], a:1},

{q:"Which organ produces insulin?", o:["Liver","Kidney","Pancreas","Heart"], a:2},
{q:"What is ozone layer?", o:["Water layer","Gas layer","Ice layer","Dust layer"], a:1},
{q:"Which gas protects Earth?", o:["CO2","Ozone","Oxygen","Nitrogen"], a:1},
{q:"What is conductor?", o:["Blocks current","Allows current","Stores energy","Reflects light"], a:1},
{q:"What is insulator?", o:["Allows current","Blocks current","Stores heat","Reflects light"], a:1},
{q:"Which metal is best conductor?", o:["Iron","Copper","Aluminium","Silver"], a:3},
{q:"What is reflection?", o:["Bending","Bouncing of light","Breaking","Mixing"], a:1},
{q:"What is refraction?", o:["Bouncing","Bending of light","Heat","Sound"], a:1},
{q:"What is wave?", o:["Energy movement","Matter","Gas","Solid"], a:0},
{q:"What is frequency?", o:["Speed","Repetition rate","Energy","Force"], a:1},

{q:"Which planet is hottest?", o:["Mercury","Venus","Earth","Mars"], a:1},
{q:"What is galaxy?", o:["Planet","Star group","Solar system","Universe"], a:1},
{q:"What is solar system?", o:["Stars","Planets around sun","Galaxies","Moons"], a:1},
{q:"What is eclipse?", o:["Shadow event","Light","Heat","Explosion"], a:0},
{q:"What is meteor?", o:["Star","Rock from space","Planet","Gas"], a:1},
{q:"What is comet?", o:["Ice rock","Gas","Metal","Water"], a:0},
{q:"What is orbit?", o:["Path","Force","Energy","Light"], a:0},
{q:"What is rotation?", o:["Revolve","Spin","Jump","Fall"], a:1},
{q:"What is revolution?", o:["Spin","Orbit movement","Heat","Force"], a:1},
{q:"What is gravity on moon?", o:["Same","More","Less","None"], a:2},

{q:"What is skeleton?", o:["Muscle","Bone structure","Skin","Blood"], a:1},
{q:"What is muscle?", o:["Bone","Tissue","Blood","Nerve"], a:1},
{q:"What is digestion?", o:["Breathing","Breaking food","Thinking","Movement"], a:1},
{q:"What is respiration?", o:["Eating","Breathing","Walking","Sleeping"], a:1},
{q:"What is circulation?", o:["Blood flow","Air flow","Water flow","Energy"], a:0},
{q:"What is neuron?", o:["Muscle","Nerve cell","Bone","Blood"], a:1},
{q:"What is hormone?", o:["Chemical signal","Energy","Food","Gas"], a:0},
{q:"What is immunity?", o:["Energy","Protection","Speed","Heat"], a:1},
{q:"What is vaccine?", o:["Food","Medicine","Protection injection","Energy"], a:2},
{q:"What is bacteria?", o:["Virus","Microorganism","Cell","Atom"], a:1},

{q:"What is virus?", o:["Cell","Microbe","Energy","Atom"], a:1},
{q:"What is fungus?", o:["Plant","Microorganism","Animal","Gas"], a:1},
{q:"What is ecosystem?", o:["Living system","Energy","Water","Air"], a:0},
{q:"What is pollution?", o:["Clean air","Dirty environment","Energy","Heat"], a:1},
{q:"What is renewable energy?", o:["Limited","Unlimited","Heat","Gas"], a:1},
{q:"What is non-renewable energy?", o:["Unlimited","Limited","Light","Air"], a:1},
{q:"What is fossil fuel?", o:["Coal","Water","Air","Light"], a:0},
{q:"What is wind energy?", o:["Sun","Air movement","Water","Heat"], a:1},
{q:"What is hydro energy?", o:["Water","Air","Sun","Coal"], a:0},
{q:"What is nuclear energy?", o:["Atom energy","Heat","Light","Water"], a:0},
{q:"What is the SI unit of pressure?", o:["Pascal","Newton","Joule","Watt"], a:0},
{q:"What is pressure?", o:["Force/Area","Speed","Energy","Mass"], a:0},
{q:"What is thrust?", o:["Force","Energy","Speed","Mass"], a:0},
{q:"What is buoyancy?", o:["Upward force","Downward force","Speed","Energy"], a:0},
{q:"What floats?", o:["Low density","High density","Heavy","Solid"], a:0},

{q:"What is heat transfer?", o:["Energy movement","Force","Speed","Mass"], a:0},
{q:"Modes of heat transfer?", o:["3","2","4","5"], a:0},
{q:"Conduction is?", o:["Direct heat","Wave","Air","Water"], a:0},
{q:"Convection is?", o:["Fluid movement","Solid heat","Light","Sound"], a:0},
{q:"Radiation is?", o:["Through waves","Solid","Liquid","Gas"], a:0},

{q:"What is thermometer?", o:["Temp measure","Speed","Force","Mass"], a:0},
{q:"What is barometer?", o:["Pressure","Temp","Speed","Force"], a:0},
{q:"What is hygrometer?", o:["Humidity","Temp","Pressure","Speed"], a:0},
{q:"What is anemometer?", o:["Wind speed","Temp","Pressure","Humidity"], a:0},
{q:"What is seismograph?", o:["Earthquake","Temp","Speed","Force"], a:0},

{q:"What is sound speed in air?", o:["343 m/s","100 m/s","500 m/s","1000 m/s"], a:0},
{q:"Sound needs?", o:["Medium","Vacuum","Light","Heat"], a:0},
{q:"Light speed?", o:["3×10^8","100","1000","10"], a:0},
{q:"Light travels in?", o:["Straight line","Curve","Circle","Random"], a:0},
{q:"Rainbow is?", o:["Light spectrum","Heat","Energy","Gas"], a:0},

{q:"Which color has max wavelength?", o:["Red","Blue","Green","Violet"], a:0},
{q:"Which color min wavelength?", o:["Violet","Red","Blue","Green"], a:0},
{q:"What is lens?", o:["Light bend","Heat","Force","Mass"], a:0},
{q:"Convex lens?", o:["Converge","Diverge","Reflect","Absorb"], a:0},
{q:"Concave lens?", o:["Diverge","Converge","Reflect","Absorb"], a:0},

{q:"What is electricity unit?", o:["Ampere","Volt","Joule","Watt"], a:0},
{q:"Voltage unit?", o:["Volt","Ampere","Watt","Joule"], a:0},
{q:"Power unit?", o:["Watt","Volt","Ampere","Joule"], a:0},
{q:"Resistance unit?", o:["Ohm","Volt","Ampere","Watt"], a:0},
{q:"Current is?", o:["Electron flow","Heat","Light","Energy"], a:0},

{q:"Series circuit?", o:["One path","Multiple path","No path","Random"], a:0},
{q:"Parallel circuit?", o:["Multiple path","Single path","No path","Random"], a:0},
{q:"Fuse protects?", o:["Circuit","Light","Heat","Sound"], a:0},
{q:"Switch does?", o:["On/off","Heat","Light","Sound"], a:0},
{q:"Battery gives?", o:["Energy","Light","Heat","Sound"], a:0},

{q:"Magnetic poles?", o:["2","3","4","5"], a:0},
{q:"Like poles?", o:["Repel","Attract","Neutral","None"], a:0},
{q:"Unlike poles?", o:["Attract","Repel","Neutral","None"], a:0},
{q:"Earth is?", o:["Magnet","Solid","Gas","Liquid"], a:0},
{q:"Compass shows?", o:["Direction","Speed","Force","Energy"], a:0},

{q:"What is force unit?", o:["Newton","Joule","Watt","Volt"], a:0},
{q:"Newton law count?", o:["3","2","4","5"], a:0},
{q:"1st law?", o:["Inertia","Force","Speed","Energy"], a:0},
{q:"2nd law?", o:["F=ma","Energy","Speed","Heat"], a:0},
{q:"3rd law?", o:["Action reaction","Speed","Force","Energy"], a:0},

{q:"Work unit?", o:["Joule","Newton","Watt","Volt"], a:0},
{q:"Power formula?", o:["Work/time","Force","Mass","Speed"], a:0},
{q:"Energy types?", o:["Many","1","2","3"], a:0},
{q:"Kinetic energy?", o:["Motion energy","Heat","Light","Sound"], a:0},
{q:"Potential energy?", o:["Stored energy","Motion","Heat","Light"], a:0},
{q:"What is the SI unit of frequency?", o:["Hertz","Joule","Watt","Volt"], a:0},
{q:"What is frequency?", o:["Repetition rate","Speed","Force","Energy"], a:0},
{q:"What is wavelength?", o:["Wave length","Speed","Energy","Force"], a:0},
{q:"What is amplitude?", o:["Height of wave","Speed","Force","Energy"], a:0},
{q:"What is sound intensity?", o:["Loudness","Speed","Energy","Force"], a:0},

{q:"What is echo?", o:["Reflected sound","Light","Heat","Energy"], a:0},
{q:"What is ultrasound?", o:[">20kHz sound","Light","Heat","Energy"], a:0},
{q:"Human hearing range?", o:["20-20kHz","10-10kHz","100-1000","1-100"], a:0},
{q:"What is noise?", o:["Unwanted sound","Music","Light","Energy"], a:0},
{q:"Sound travels fastest in?", o:["Solid","Liquid","Gas","Vacuum"], a:0},

{q:"What is lens used for?", o:["Focus light","Heat","Energy","Sound"], a:0},
{q:"Mirror types?", o:["3","2","4","5"], a:0},
{q:"Plane mirror image?", o:["Virtual","Real","Both","None"], a:0},
{q:"Convex mirror?", o:["Diverge light","Converge","Absorb","Reflect"], a:0},
{q:"Concave mirror?", o:["Converge light","Diverge","Absorb","None"], a:0},

{q:"What is magnetism?", o:["Force","Energy","Heat","Light"], a:0},
{q:"Magnetic field?", o:["Area of force","Energy","Heat","Light"], a:0},
{q:"Electromagnet?", o:["Current magnet","Permanent","Heat","Light"], a:0},
{q:"Magnetic material?", o:["Iron","Wood","Plastic","Glass"], a:0},
{q:"Non-magnetic?", o:["Plastic","Iron","Nickel","Cobalt"], a:0},

{q:"What is current?", o:["Electron flow","Heat","Light","Force"], a:0},
{q:"What is circuit?", o:["Closed path","Open path","No path","Random"], a:0},
{q:"Open circuit?", o:["Broken path","Closed path","Full path","None"], a:0},
{q:"Closed circuit?", o:["Complete path","Broken","None","Random"], a:0},
{q:"Short circuit?", o:["Direct path","Long path","None","Random"], a:0},

{q:"What is energy conservation?", o:["Energy constant","Loss","Gain","Destroy"], a:0},
{q:"Renewable sources?", o:["Solar","Coal","Oil","Gas"], a:0},
{q:"Non-renewable?", o:["Coal","Solar","Wind","Water"], a:0},
{q:"Solar panel?", o:["Convert light","Heat","Energy","Sound"], a:0},
{q:"Wind turbine?", o:["Air energy","Water","Heat","Light"], a:0},

{q:"What is ecosystem?", o:["Living system","Energy","Heat","Light"], a:0},
{q:"Biotic factors?", o:["Living","Non-living","Energy","Heat"], a:0},
{q:"Abiotic factors?", o:["Non-living","Living","Energy","Heat"], a:0},
{q:"Food chain?", o:["Energy flow","Heat","Light","Force"], a:0},
{q:"Producer?", o:["Plants","Animals","Humans","Microbes"], a:0},

{q:"Consumer?", o:["Animals","Plants","Sun","Water"], a:0},
{q:"Decomposer?", o:["Bacteria","Plants","Animals","Sun"], a:0},
{q:"Photosynthesis product?", o:["Glucose","Oxygen","CO2","Water"], a:0},
{q:"Respiration product?", o:["CO2","Oxygen","Glucose","Water"], a:0},
{q:"Transpiration?", o:["Water loss","Food making","Breathing","Movement"], a:0},

{q:"Human skeleton bones?", o:["206","200","150","300"], a:0},
{q:"Blood types?", o:["4","3","2","5"], a:0},
{q:"RBC carries?", o:["Oxygen","CO2","Water","Food"], a:0},
{q:"WBC does?", o:["Fight infection","Carry O2","Clot","None"], a:0},
{q:"Platelets?", o:["Clotting","Breathing","Digestion","Movement"], a:0},

{q:"Heart chambers?", o:["4","3","2","5"], a:0},
{q:"Brain parts?", o:["3","2","4","5"], a:0},
{q:"Lungs function?", o:["Breathing","Blood","Food","Energy"], a:0},
{q:"Kidney function?", o:["Filter blood","Pump","Think","Digest"], a:0},
{q:"Liver function?", o:["Detox","Pump","Think","Breathe"], a:0},
],
computer:[
  {q:"Which shortcut is used to copy selected text?", o:["Ctrl + X","Ctrl + C","Ctrl + V","Ctrl + Z"], a:1},
  {q:"Which shortcut is used to paste copied text?", o:["Ctrl + V","Ctrl + P","Ctrl + X","Ctrl + C"], a:0},
  {q:"Which shortcut is used to cut selected text?", o:["Ctrl + X","Ctrl + C","Ctrl + V","Ctrl + Z"], a:0},
  {q:"Which shortcut is used to undo an action?", o:["Ctrl + Y","Ctrl + Z","Ctrl + X","Ctrl + C"], a:1},
  {q:"Which shortcut is used to redo an action?", o:["Ctrl + Z","Ctrl + Y","Ctrl + X","Ctrl + C"], a:1},
  {q:"Which shortcut opens a new tab in browser?", o:["Ctrl + T","Ctrl + N","Ctrl + W","Ctrl + Tab"], a:0},
  {q:"Which shortcut closes the current tab?", o:["Ctrl + W","Ctrl + T","Ctrl + N","Ctrl + Q"], a:0},
  {q:"Which shortcut opens File Explorer?", o:["Windows + E","Ctrl + E","Alt + E","Windows + F"], a:0},
  {q:"Which shortcut locks the computer?", o:["Windows + L","Ctrl + L","Alt + L","Windows + K"], a:0},
  {q:"Which shortcut opens Task Manager?", o:["Ctrl + Shift + Esc","Ctrl + Alt + Del","Alt + Tab","Windows + M"], a:0},
  {q:"Which shortcut selects all text?", o:["Ctrl + A","Ctrl + S","Ctrl + C","Ctrl + X"], a:0},
  {q:"Which shortcut saves a document?", o:["Ctrl + S","Ctrl + P","Ctrl + N","Ctrl + O"], a:0},
  {q:"Which shortcut opens a document?", o:["Ctrl + O","Ctrl + N","Ctrl + P","Ctrl + S"], a:0},
  {q:"Which shortcut prints a document?", o:["Ctrl + P","Ctrl + S","Ctrl + O","Ctrl + N"], a:0},
  {q:"Which shortcut opens a new window?", o:["Ctrl + N","Ctrl + T","Ctrl + W","Alt + N"], a:0},
  {q:"Which shortcut switches between open windows?", o:["Alt + Tab","Ctrl + Tab","Ctrl + Shift","Windows + Tab"], a:0},
  {q:"Which shortcut minimizes all windows?", o:["Windows + D","Windows + M","Alt + M","Ctrl + M"], a:0},
  {q:"Which shortcut restores minimized windows?", o:["Windows + D","Windows + R","Alt + D","Ctrl + D"], a:0},
  {q:"Which shortcut finds text in a document?", o:["Ctrl + F","Ctrl + H","Ctrl + G","Ctrl + I"], a:0},
  {q:"Which shortcut replaces text in a document?", o:["Ctrl + H","Ctrl + F","Ctrl + R","Ctrl + G"], a:0},
  {q:"Which shortcut opens the Run dialog?", o:["Windows + R","Windows + E","Ctrl + R","Alt + R"], a:0},
  {q:"Which shortcut refreshes the page?", o:["F5","F1","Ctrl + R","Alt + R"], a:0},
  {q:"Which shortcut opens browser history?", o:["Ctrl + H","Ctrl + J","Ctrl + U","Ctrl + I"], a:0},
  {q:"Which shortcut opens downloads in browser?", o:["Ctrl + J","Ctrl + H","Ctrl + D","Ctrl + I"], a:0},
  {q:"Which shortcut bookmarks a page?", o:["Ctrl + D","Ctrl + B","Ctrl + K","Ctrl + L"], a:0},
  {q:"Which shortcut opens settings in browser?", o:["Alt + F","Ctrl + S","Ctrl + F","Ctrl + P"], a:0},
  {q:"Which shortcut opens help menu?", o:["F1","F2","F5","F12"], a:0},
  {q:"Which shortcut renames a selected file?", o:["F2","F1","F3","F4"], a:0},
  {q:"Which shortcut repeats last action in some apps?", o:["F4","F2","F3","F1"], a:0},
  {q:"Which shortcut toggles full screen?", o:["F11","F10","F12","Alt + Enter"], a:0},
  {q:"Which shortcut opens print preview?", o:["Ctrl + P","Ctrl + Shift + P","Ctrl + Alt + P","Alt + P"], a:0},
  {q:"Which shortcut opens developer tools in browser?", o:["F12","F11","Ctrl + F12","Alt + F12"], a:0},
  {q:"Which shortcut closes the current program?", o:["Alt + F4","Ctrl + F4","Ctrl + W","Alt + W"], a:0},
  {q:"Which shortcut switches between browser tabs?", o:["Ctrl + Tab","Alt + Tab","Ctrl + Shift","Alt + Shift"], a:0},
  {q:"Which shortcut opens search in Windows?", o:["Windows + S","Windows + F","Ctrl + S","Alt + S"], a:0},
  {q:"Which shortcut opens emoji panel?", o:["Windows + .","Windows + ;","Ctrl + .","Alt + ."], a:0},
  {q:"Which shortcut opens settings in Windows?", o:["Windows + I","Windows + S","Ctrl + I","Alt + I"], a:0},
  {q:"Which shortcut takes a screenshot of entire screen?", o:["PrtSc","Alt + PrtSc","Windows + PrtSc","Ctrl + PrtSc"], a:2},
  {q:"Which shortcut takes screenshot of active window?", o:["Alt + PrtSc","PrtSc","Windows + PrtSc","Ctrl + PrtSc"], a:0},
  {q:"Which shortcut opens magnifier?", o:["Windows + +","Windows + M","Ctrl + +","Alt + +"], a:0},
  {q:"Which shortcut opens lock screen in Windows?", o:["Windows + L","Windows + K","Alt + L","Ctrl + L"], a:0},
  {q:"Which shortcut opens Cortana/Search bar?", o:["Windows + S","Windows + C","Alt + S","Ctrl + S"], a:0},
  {q:"Which shortcut opens notifications panel?", o:["Windows + A","Windows + N","Alt + A","Ctrl + A"], a:0},
  {q:"Which shortcut snaps window to left/right in Windows?", o:["Windows + Left/Right","Alt + Left/Right","Ctrl + Left/Right","Windows + Shift + Left/Right"], a:0},
  {q:"Which shortcut opens Quick Link menu?", o:["Windows + X","Windows + Q","Alt + X","Ctrl + X"], a:0},
  {q:"Which shortcut opens the emoji keyboard in Windows?", o:["Windows + .","Windows + ;","Ctrl + .","Alt + ."], a:0},
  {q:"Which shortcut opens Task View?", o:["Windows + Tab","Windows + T","Alt + Tab","Ctrl + Tab"], a:0},
  {q:"Which shortcut mutes/unmutes volume in Windows?", o:["Windows + Ctrl + M","Windows + M","Alt + M","Ctrl + M"], a:0},
  {q:"Which shortcut increases/decreases volume?", o:["Windows + Ctrl + Up/Down","Windows + Up/Down","Alt + Up/Down","Ctrl + Up/Down"], a:0},
  {q:"Which shortcut locks rotation on Windows tablets?", o:["Windows + O","Windows + L","Ctrl + O","Alt + O"], a:0},
  {q:"What does CPU stand for?", o:["Central Process Unit","Central Processing Unit","Computer Personal Unit","Central Peripheral Unit"], a:1},
  {q:"Which language is used for web apps?", o:["Python","JavaScript","C++","Java"], a:1},
  {q:"What does RAM stand for?", o:["Random Access Memory","Read Access Memory","Run Access Memory","Random Allocate Memory"], a:0},
  {q:"Which is not a programming language?", o:["Python","HTML","Java","C++"], a:1},
  {q:"Which is the primary language for Android development?", o:["Java","Swift","C#","Kotlin"], a:3},
  {q:"Which of these is an operating system?", o:["Windows","Python","Chrome","HTML"], a:0},
  {q:"What does HTML stand for?", o:["HyperText Markup Language","HyperText Makeup Language","HighText Markup Language","Hyper Tool Markup Language"], a:0},
  {q:"Which of these is used for database management?", o:["MySQL","Python","C++","HTML"], a:0},
  {q:"Which is the smallest unit of data in a computer?", o:["Byte","Bit","Nibble","Word"], a:1},
  {q:"What does URL stand for?", o:["Uniform Resource Locator","Universal Resource Link","Uniform Reference Link","Unified Resource Locator"], a:0},
  {q:"Which is a type of software?", o:["System Software","Application Software","Both","None"], a:2},
  {q:"Which is used to style web pages?", o:["HTML","CSS","JavaScript","Python"], a:1},
  {q:"Which of these is not a database?", o:["Oracle","MySQL","MongoDB","Photoshop"], a:3},
  {q:"Which is an example of a compiled language?", o:["C","Python","PHP","JavaScript"], a:0},
  {q:"Which is used for version control?", o:["Git","Python","HTML","CSS"], a:0},
  {q:"Which protocol is used to send emails?", o:["FTP","SMTP","HTTP","POP3"], a:1},
  {q:"Which one is a backend language?", o:["PHP","HTML","CSS","JavaScript"], a:0},
  {q:"Which is a frontend framework?", o:["React","Django","Flask","Laravel"], a:0},
  {q:"Which is a cloud service provider?", o:["AWS","Linux","Python","Git"], a:0},
  {q:"Which is not a type of computer memory?", o:["ROM","RAM","CPU","Cache"], a:2},
  {q:"Which is the brain of the computer?", o:["CPU","RAM","ROM","GPU"], a:0},
  {q:"Which is used to make web pages interactive?", o:["HTML","CSS","JavaScript","SQL"], a:2},
  {q:"Which is used to create mobile apps?", o:["Flutter","React","Kotlin","All of the above"], a:3},
  {q:"Which database is NoSQL?", o:["MongoDB","MySQL","Oracle","SQLite"], a:0},
  {q:"Which is a markup language?", o:["HTML","Python","Java","C#"], a:0},
  {q:"Which device is used for input?", o:["Keyboard","Monitor","Printer","Speaker"], a:0},
  {q:"Which device is used for output?", o:["Keyboard","Printer","Mouse","Scanner"], a:1},
  {q:"Which is a programming paradigm?", o:["Object-Oriented","Procedural","Functional","All of the above"], a:3},
  {q:"Which company developed Python?", o:["Microsoft","Sun Microsystems","Google","None"], a:3},
  {q:"Which is a search engine?", o:["Google","Linux","Windows","Python"], a:0},
  {q:"Which one is an IDE?", o:["Visual Studio","Windows","Python","HTML"], a:0},
  {q:"Which is used to store large amounts of data?", o:["Hard Disk","RAM","CPU","Monitor"], a:0},
  {q:"Which is a computer network?", o:["LAN","ROM","CPU","Java"], a:0},
  {q:"Which is used for communication over the internet?", o:["HTTP","RAM","CPU","CSS"], a:0},
  {q:"Which is a programming language for AI?", o:["Python","C++","Java","All"], a:3},
  {q:"Which is a protocol for secure communication?", o:["HTTPS","HTTP","FTP","SMTP"], a:0},
  {q:"Which is an open-source operating system?", o:["Linux","Windows","MacOS","iOS"], a:0},
  {q:"Which one is a markup language used for emails?", o:["HTML","Python","Java","CSS"], a:0},
  {q:"Which is used to connect devices in a network?", o:["Router","Keyboard","Monitor","CPU"], a:0},
  {q:"Which is the fastest type of memory?", o:["Cache","RAM","ROM","Hard Disk"], a:0},
  {q:"Which language is mainly used for AI and ML?", o:["Python","Java","C++","HTML"], a:0},
  {q:"Which is used to design websites visually?", o:["Figma","Python","C++","Java"], a:0},
  {q:"Which language is server-side scripting?", o:["PHP","HTML","CSS","JavaScript"], a:0},
  {q:"Which database is relational?", o:["MySQL","MongoDB","Cassandra","Redis"], a:0},
  {q:"Which is used for data visualization?", o:["Tableau","Python","Excel","All of the above"], a:3},
  {q:"Which is used for containerization?", o:["Docker","Python","Java","C++"], a:0},
  {q:"Which is used to create APIs?", o:["Node.js","Python","PHP","All"], a:3},
  {q:"Which is used for front-end development?", o:["HTML, CSS, JS","Python","Java","C++"], a:0},
  {q:"Which programming language is platform-independent?", o:["Java","C++","C","Python"], a:0},
  {q:"Which is a machine learning library?", o:["TensorFlow","React","Node.js","Laravel"], a:0},
  {q:"Which is used to secure web applications?", o:["HTTPS","FTP","SMTP","HTTP"], a:0},
  {q:"Which device is used to scan documents into a computer?", o:["Printer","Scanner","Monitor","Keyboard"], a:1},
  {q:"Which port is used to connect a monitor?", o:["USB","HDMI","Ethernet","Audio Jack"], a:1},
  {q:"Which port is commonly used for internet connection?", o:["USB","HDMI","Ethernet","VGA"], a:2},
  {q:"Which type of computer virus spreads without user action?", o:["Trojan","Worm","Spyware","Adware"], a:1},
  {q:"Which software protects against viruses?", o:["Antivirus","Firewall","Browser","Word Processor"], a:0},
  {q:"Which computer component handles graphics rendering?", o:["GPU","CPU","RAM","ROM"], a:0},
  {q:"Which memory type is faster than RAM?", o:["Cache","ROM","Hard Disk","SSD"], a:0},
  {q:"Which device is used to convert digital signals to analog?", o:["DAC","ADC","Modem","Router"], a:0},
  {q:"Which device converts analog signals to digital?", o:["ADC","DAC","Hub","Switch"], a:0},
  {q:"Which device amplifies signals in a network?", o:["Repeater","Router","Switch","Modem"], a:0},
  {q:"Which is an example of cloud storage?", o:["Google Drive","RAM","Hard Disk","Cache"], a:0},
  {q:"Which network connects devices within a building?", o:["LAN","WAN","MAN","PAN"], a:0},
  {q:"Which network covers a city?", o:["LAN","WAN","MAN","PAN"], a:2},
  {q:"Which network connects computers worldwide?", o:["LAN","WAN","MAN","PAN"], a:1},
  {q:"Which protocol is used for secure web browsing?", o:["HTTP","HTTPS","FTP","SMTP"], a:1},
  {q:"Which device filters network traffic for security?", o:["Router","Firewall","Switch","Hub"], a:1},
  {q:"Which type of software converts high-level code to machine code?", o:["Compiler","Interpreter","Debugger","Assembler"], a:0},
  {q:"Which type of software executes code line by line?", o:["Compiler","Interpreter","Assembler","Debugger"], a:1},
  {q:"Which command is used to check network connections in Windows?", o:["ping","ipconfig","netstat","tracert"], a:0},
  {q:"Which protocol is used to send email?", o:["SMTP","HTTP","FTP","POP3"], a:0},
  {q:"Which protocol is used to receive emails?", o:["SMTP","POP3","FTP","HTTP"], a:1},
  {q:"Which is an example of open-source software?", o:["Linux","Windows","MacOS","Adobe Photoshop"], a:0},
  {q:"Which is a type of malware that hides inside other programs?", o:["Worm","Trojan","Spyware","Ransomware"], a:1},
  {q:"Which computer port is used for audio input?", o:["USB","Microphone Jack","Ethernet","VGA"], a:1},
  {q:"Which computer port is used for USB devices?", o:["Ethernet","USB Port","HDMI","Audio Jack"], a:1},
  {q:"Which storage device has no moving parts?", o:["SSD","HDD","CD-ROM","Floppy Disk"], a:0},
  {q:"Which storage is volatile?", o:["RAM","ROM","SSD","HDD"], a:0},
  {q:"Which storage is non-volatile?", o:["RAM","Cache","ROM","Registers"], a:2},
  {q:"Which protocol is used for file transfer over networks?", o:["FTP","HTTP","SMTP","POP3"], a:0},
  {q:"Which IP version uses 128-bit addresses?", o:["IPv4","IPv6","IPX","ARP"], a:1},
  {q:"Which device assigns IP addresses automatically?", o:["Switch","Router","DHCP Server","Firewall"], a:2},
  {q:"Which component temporarily holds instructions and data for CPU?", o:["RAM","ROM","Cache","Registers"], a:0},
  {q:"Which technology is used for wireless internet?", o:["Wi-Fi","Bluetooth","USB","Ethernet"], a:0},
  {q:"Which device allows multiple computers to communicate in a network?", o:["Hub","Monitor","Keyboard","Printer"], a:0},
  {q:"Which technology allows a single computer to run multiple virtual computers?", o:["Virtualization","Cloud Computing","AI","BIOS"], a:0},
  {q:"Which command shows current IP configuration in Windows?", o:["ipconfig","ping","netstat","tracert"], a:0},
  {q:"Which command shows the route packets take to a network?", o:["tracert","ping","netstat","ipconfig"], a:0},
  {q:"Which type of address uniquely identifies a network interface?", o:["MAC Address","IP Address","Port Number","Domain Name"], a:0},
  {q:"Which device forwards packets between networks?", o:["Router","Switch","Hub","Repeater"], a:0},
  {q:"Which device divides a network into segments?", o:["Switch","Router","Hub","Repeater"], a:0},
  {q:"Which type of network uses radio waves?", o:["Wi-Fi","Ethernet","Fibre","Bluetooth"], a:0},
  {q:"Which programming model allows code to run on many computers simultaneously?", o:["Parallel Computing","Sequential Computing","Batch Processing","Time Sharing"], a:0},
  {q:"Which computer component handles instructions and controls other parts?", o:["Control Unit","ALU","RAM","GPU"], a:0},
  {q:"Which storage uses laser to read/write data?", o:["Optical Disk","HDD","SSD","RAM"], a:0},
  {q:"Which programming language is considered low-level?", o:["Assembly","Python","Java","HTML"], a:0},
  {q:"Which is the main protocol for web pages?", o:["HTTP","SMTP","FTP","POP3"], a:0},
  {q:"Which device translates domain names to IP addresses?", o:["DNS Server","Router","Switch","Hub"], a:0},
  {q:"Which is used for computer-aided design?", o:["CAD Software","Word Processor","Spreadsheet","Browser"], a:0},
  {q:"Which type of memory stores frequently used instructions?", o:["Cache","RAM","ROM","Registers"], a:0},
  {q:"Which device is used to connect multiple networks?", o:["Router","Switch","Hub","Repeater"], a:0},
  {q:"Which shortcut opens the 'Run' dialog in Windows?", o:["Windows + R","Ctrl + R","Alt + R","Shift + R"], a:0},
  {q:"Which shortcut opens the Quick Link menu in Windows?", o:["Windows + X","Windows + Q","Ctrl + X","Alt + X"], a:0},
  {q:"Which shortcut opens the Action Center in Windows?", o:["Windows + A","Windows + C","Ctrl + A","Alt + A"], a:0},
  {q:"Which shortcut opens the emoji panel in Windows?", o:["Windows + .","Windows + ;","Ctrl + .","Alt + ."], a:0},
  {q:"Which shortcut switches between virtual desktops?", o:["Windows + Ctrl + Left/Right","Alt + Tab","Ctrl + Tab","Windows + Tab"], a:0},
  {q:"Which shortcut locks screen orientation on tablets?", o:["Windows + O","Windows + L","Alt + O","Ctrl + O"], a:0},
  {q:"Which shortcut opens the file properties dialog?", o:["Alt + Enter","Ctrl + Enter","Shift + Enter","Windows + Enter"], a:0},
  {q:"Which shortcut opens browser developer tools?", o:["F12","Ctrl + F12","Alt + F12","Windows + F12"], a:0},
  {q:"Which shortcut opens browser history?", o:["Ctrl + H","Ctrl + J","Ctrl + U","Ctrl + I"], a:0},
  {q:"Which shortcut opens browser downloads?", o:["Ctrl + J","Ctrl + H","Ctrl + D","Ctrl + I"], a:0},
  {q:"Which shortcut opens browser bookmarks?", o:["Ctrl + B","Ctrl + D","Ctrl + K","Ctrl + L"], a:0},
  {q:"Which shortcut zooms in the browser or app?", o:["Ctrl + +","Ctrl + -","Ctrl + 0","Ctrl + Z"], a:0},
  {q:"Which shortcut resets zoom to default?", o:["Ctrl + 0","Ctrl + +","Ctrl + -","Ctrl + R"], a:0},
  {q:"Which shortcut toggles read-only mode in MS Word?", o:["Alt + R","Ctrl + R","Shift + R","Windows + R"], a:0},
  {q:"Which shortcut opens Replace dialog in MS Word?", o:["Ctrl + H","Ctrl + F","Ctrl + G","Ctrl + R"], a:0},
  {q:"Which shortcut opens Go To dialog in MS Word?", o:["Ctrl + G","Ctrl + H","Ctrl + F","Ctrl + J"], a:0},
  {q:"Which shortcut opens Clipboard in MS Office?", o:["Ctrl + C","Ctrl + Shift + C","Ctrl + V","Ctrl + X"], a:1},
  {q:"Which shortcut switches keyboard layout in Windows?", o:["Alt + Shift","Ctrl + Shift","Windows + Space","Alt + Ctrl"], a:0},
  {q:"Which shortcut opens Windows Search?", o:["Windows + S","Windows + Q","Ctrl + S","Alt + S"], a:0},
  {q:"Which shortcut opens Task View?", o:["Windows + Tab","Windows + T","Alt + Tab","Ctrl + Tab"], a:0},
  {q:"Which shortcut opens File Explorer to Quick Access?", o:["Windows + E","Windows + F","Ctrl + E","Alt + E"], a:0},
  {q:"Which shortcut toggles desktop show/hide?", o:["Windows + D","Windows + M","Alt + D","Ctrl + D"], a:0},
  {q:"Which shortcut takes screenshot of active window?", o:["Alt + PrtSc","Windows + PrtSc","Ctrl + PrtSc","Shift + PrtSc"], a:0},
  {q:"Which shortcut opens Magnifier in Windows?", o:["Windows + +","Windows + M","Ctrl + +","Alt + +"], a:0},
  {q:"Which shortcut opens Narrator in Windows?", o:["Windows + Ctrl + Enter","Windows + N","Ctrl + Enter","Alt + Enter"], a:0},
  {q:"Which shortcut opens Settings?", o:["Windows + I","Windows + S","Ctrl + I","Alt + I"], a:0},
  {q:"Which shortcut opens Bluetooth settings?", o:["Windows + K","Windows + B","Ctrl + K","Alt + K"], a:0},
  {q:"Which shortcut opens Cortana?", o:["Windows + C","Windows + S","Ctrl + C","Alt + C"], a:0},
  {q:"Which shortcut mutes/unmutes volume?", o:["Windows + Ctrl + M","Windows + M","Alt + M","Ctrl + M"], a:0},
  {q:"Which shortcut shows all open windows of current app?", o:["Alt + Tab","Ctrl + Tab","Windows + Tab","Windows + Shift + Tab"], a:1},
  {q:"Which shortcut opens virtual keyboard?", o:["Windows + Ctrl + O","Windows + K","Ctrl + O","Alt + K"], a:0},
  {q:"Which shortcut opens touch keyboard in Windows?", o:["Windows + Ctrl + O","Windows + K","Ctrl + O","Alt + K"], a:0},
  {q:"Which shortcut switches input language in Windows 10/11?", o:["Windows + Space","Alt + Shift","Ctrl + Shift","Windows + Shift"], a:0},
  {q:"Which shortcut opens Windows Ink Workspace?", o:["Windows + W","Windows + I","Ctrl + W","Alt + W"], a:0},
  {q:"Which shortcut toggles high contrast mode?", o:["Left Alt + Left Shift + Print Screen","Windows + H","Ctrl + Alt + H","Windows + Shift + H"], a:0},
  {q:"Which shortcut opens Snip & Sketch?", o:["Windows + Shift + S","Windows + S","Ctrl + Shift + S","Alt + S"], a:0},
  {q:"Which shortcut opens File Explorer to This PC?", o:["Windows + E","Windows + T","Ctrl + E","Alt + E"], a:0},
  {q:"Which shortcut locks device screen quickly?", o:["Windows + L","Ctrl + L","Alt + L","Windows + K"], a:0},
  {q:"Which shortcut opens Action Center quickly?", o:["Windows + A","Windows + C","Ctrl + A","Alt + A"], a:0},
  {q:"Which shortcut opens Windows Clipboard history?", o:["Windows + V","Windows + C","Ctrl + V","Alt + V"], a:0},
  {q:"Which shortcut rotates screen in Windows?", o:["Ctrl + Alt + Arrow Keys","Windows + Arrow Keys","Alt + Arrow Keys","Shift + Arrow Keys"], a:0},
  {q:"Which shortcut shows system properties?", o:["Windows + Pause/Break","Windows + P","Ctrl + Pause","Alt + Pause"], a:0},
  {q:"Which shortcut opens Disk Cleanup?", o:["Windows + R -> cleanmgr","Windows + D","Ctrl + D","Alt + D"], a:0},
  {q:"Which shortcut opens Resource Monitor?", o:["Ctrl + Shift + Esc -> resmon","Windows + R","Alt + R","Windows + E"], a:0},  
],

pharmacy:[
  {q:"Which vitamin is essential for blood clotting?", o:["Vitamin A","Vitamin K","Vitamin C","Vitamin D"], a:1},
  {q:"Which drug is used as an analgesic?", o:["Aspirin","Amoxicillin","Lisinopril","Metformin"], a:0},
  {q:"Which organ metabolizes most drugs?", o:["Kidney","Liver","Heart","Lungs"], a:1},
  {q:"What is the main route for drug excretion?", o:["Liver","Kidney","Lungs","Skin"], a:1},
  {q:"Which antibiotic is penicillin-based?", o:["Amoxicillin","Ciprofloxacin","Tetracycline","Azithromycin"], a:0},
  {q:"Which drug reduces high blood pressure?", o:["Metformin","Amlodipine","Paracetamol","Omeprazole"], a:1},
  {q:"Which drug is used to treat diabetes?", o:["Insulin","Aspirin","Omeprazole","Loratadine"], a:0},
  {q:"Which type of drug relieves allergic reactions?", o:["Antihistamine","Antibiotic","Analgesic","Antipyretic"], a:0},
  {q:"Which drug reduces fever?", o:["Paracetamol","Amoxicillin","Lisinopril","Metformin"], a:0},
  {q:"Which drug is an anti-inflammatory?", o:["Ibuprofen","Insulin","Omeprazole","Amlodipine"], a:0},
  {q:"Which medication is used for asthma?", o:["Albuterol","Paracetamol","Metformin","Aspirin"], a:0},
  {q:"Which class of drugs reduces cholesterol?", o:["Statins","Beta-blockers","Antibiotics","NSAIDs"], a:0},
  {q:"Which drug treats bacterial infections?", o:["Antibiotics","Antivirals","Antifungals","Analgesics"], a:0},
  {q:"Which drug is antiviral?", o:["Acyclovir","Penicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which drug treats fungal infections?", o:["Fluconazole","Amoxicillin","Ibuprofen","Paracetamol"], a:0},
  {q:"Which medication is used to prevent blood clots?", o:["Warfarin","Aspirin","Amoxicillin","Metformin"], a:0},
  {q:"Which vitamin deficiency causes scurvy?", o:["Vitamin A","Vitamin C","Vitamin D","Vitamin K"], a:1},
  {q:"Which vitamin is essential for bone health?", o:["Vitamin C","Vitamin D","Vitamin K","Vitamin B12"], a:1},
  {q:"Which electrolyte is important for heart function?", o:["Potassium","Calcium","Sodium","Magnesium"], a:0},
  {q:"Which drug is a proton pump inhibitor?", o:["Omeprazole","Metformin","Paracetamol","Aspirin"], a:0},
  {q:"Which drug reduces nausea?", o:["Ondansetron","Ibuprofen","Amoxicillin","Insulin"], a:0},
  {q:"Which drug treats depression?", o:["Fluoxetine","Paracetamol","Amoxicillin","Metformin"], a:0},
  {q:"Which drug is used for anxiety?", o:["Diazepam","Aspirin","Amoxicillin","Omeprazole"], a:0},
  {q:"Which drug is used to reduce inflammation in arthritis?", o:["NSAIDs","Insulin","Metformin","Amoxicillin"], a:0},
  {q:"Which drug treats hypertension?", o:["Lisinopril","Amoxicillin","Paracetamol","Aspirin"], a:0},
  {q:"Which drug treats heart failure?", o:["Digoxin","Amoxicillin","Paracetamol","Omeprazole"], a:0},
  {q:"Which type of insulin acts rapidly?", o:["Rapid-acting","Long-acting","Intermediate","Ultra-long"], a:0},
  {q:"Which drug prevents seizures?", o:["Phenytoin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats epilepsy?", o:["Valproate","Ibuprofen","Paracetamol","Aspirin"], a:0},
  {q:"Which drug is used in tuberculosis?", o:["Isoniazid","Amoxicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which vitamin deficiency causes rickets?", o:["Vitamin A","Vitamin D","Vitamin C","Vitamin K"], a:1},
  {q:"Which drug is used to reduce cholesterol absorption?", o:["Ezetimibe","Amoxicillin","Ibuprofen","Paracetamol"], a:0},
  {q:"Which drug treats migraine?", o:["Sumatriptan","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is a beta-blocker?", o:["Atenolol","Paracetamol","Amoxicillin","Omeprazole"], a:0},
  {q:"Which drug treats gout?", o:["Allopurinol","Ibuprofen","Paracetamol","Amoxicillin"], a:0},
  {q:"Which drug treats anemia?", o:["Iron Supplements","Amoxicillin","Ibuprofen","Paracetamol"], a:0},
  {q:"Which vitamin is essential for nerve function?", o:["Vitamin B12","Vitamin C","Vitamin D","Vitamin K"], a:0},
  {q:"Which drug treats fungal skin infections?", o:["Clotrimazole","Amoxicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which drug is a corticosteroid?", o:["Prednisone","Ibuprofen","Paracetamol","Amoxicillin"], a:0},
  {q:"Which drug treats high uric acid levels?", o:["Allopurinol","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats Parkinson’s disease?", o:["Levodopa","Amoxicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which drug treats Alzheimer’s disease?", o:["Donepezil","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat inflammation in allergies?", o:["Corticosteroid","Amoxicillin","Ibuprofen","Paracetamol"], a:0},
  {q:"Which drug is used to treat cold and cough?", o:["Dextromethorphan","Amoxicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which drug is a bronchodilator?", o:["Salbutamol","Paracetamol","Amoxicillin","Ibuprofen"], a:0},
  {q:"Which drug treats constipation?", o:["Laxatives","Amoxicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which drug treats diarrhea?", o:["Loperamide","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats fungal infections in mouth?", o:["Nystatin","Amoxicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which drug prevents osteoporosis?", o:["Calcium and Vitamin D","Ibuprofen","Amoxicillin","Paracetamol"], a:0},
  {q:"Which drug is used to treat hyperthyroidism?", o:["Methimazole","Amoxicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which drug treats hypothyroidism?", o:["Levothyroxine","Amoxicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which drug is used for anticoagulation?", o:["Heparin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats bacterial meningitis?", o:["Ceftriaxone","Amoxicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which class of drugs is used to treat high blood sugar?", o:["Insulin","Beta-blockers","Statins","Antibiotics"], a:0},
  {q:"Which drug is used to treat allergic rhinitis?", o:["Loratadine","Amoxicillin","Ibuprofen","Paracetamol"], a:0},
  {q:"Which medication helps in reducing cholesterol?", o:["Atorvastatin","Metformin","Omeprazole","Aspirin"], a:0},
  {q:"Which vitamin deficiency causes night blindness?", o:["Vitamin A","Vitamin B12","Vitamin D","Vitamin K"], a:0},
  {q:"Which drug class is used for treating infections caused by bacteria?", o:["Antibiotics","Antivirals","Antifungals","Analgesics"], a:0},
  {q:"Which drug is commonly used for pain and fever?", o:["Paracetamol","Amoxicillin","Metformin","Amlodipine"], a:0},
  {q:"Which drug is used to prevent blood clots?", o:["Warfarin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat acid reflux?", o:["Omeprazole","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is a diuretic?", o:["Furosemide","Amoxicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which drug is used to treat depression?", o:["Fluoxetine","Amoxicillin","Paracetamol","Ibuprofen"], a:0},
  {q:"Which drug is used to treat anxiety?", o:["Diazepam","Paracetamol","Amoxicillin","Ibuprofen"], a:0},
  {q:"Which drug class treats inflammation?", o:["NSAIDs","Antibiotics","Antivirals","Analgesics"], a:0},
  {q:"Which vitamin is important for blood clotting?", o:["Vitamin K","Vitamin C","Vitamin D","Vitamin A"], a:0},
  {q:"Which vitamin prevents rickets?", o:["Vitamin D","Vitamin A","Vitamin C","Vitamin K"], a:0},
  {q:"Which drug is used to treat asthma?", o:["Albuterol","Paracetamol","Amoxicillin","Ibuprofen"], a:0},
  {q:"Which drug is an antiviral?", o:["Acyclovir","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats fungal infections?", o:["Fluconazole","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for migraine?", o:["Sumatriptan","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats gout?", o:["Allopurinol","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat anemia?", o:["Iron supplements","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat thyroid deficiency?", o:["Levothyroxine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats hyperthyroidism?", o:["Methimazole","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is a corticosteroid?", o:["Prednisone","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug prevents osteoporosis?", o:["Calcium and Vitamin D","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat Parkinson’s disease?", o:["Levodopa","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats Alzheimer’s disease?", o:["Donepezil","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats bacterial meningitis?", o:["Ceftriaxone","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats diarrhea?", o:["Loperamide","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats constipation?", o:["Laxatives","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats nausea and vomiting?", o:["Ondansetron","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats high blood pressure?", o:["Amlodipine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to lower uric acid?", o:["Allopurinol","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for cough suppression?", o:["Dextromethorphan","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats bronchitis?", o:["Amoxicillin","Paracetamol","Ibuprofen","Aspirin"], a:0},
  {q:"Which drug is a bronchodilator?", o:["Salbutamol","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats high cholesterol?", o:["Statins","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats fever?", o:["Paracetamol","Amoxicillin","Ibuprofen","Aspirin"], a:0},
  {q:"Which drug treats bacterial skin infections?", o:["Mupirocin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats fungal skin infections?", o:["Clotrimazole","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for oral thrush?", o:["Nystatin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats depression and anxiety?", o:["SSRIs","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat ulcers?", o:["Omeprazole","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats urinary tract infections?", o:["Ciprofloxacin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats fungal infections of nails?", o:["Terbinafine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats inflammation due to arthritis?", o:["NSAIDs","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats malaria?", o:["Chloroquine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for blood sugar control in type 2 diabetes?", o:["Metformin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug prevents vitamin B12 deficiency?", o:["Vitamin B12 supplements","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for allergic skin reactions?", o:["Antihistamines","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats inflammation in lungs?", o:["Corticosteroids","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats chronic obstructive pulmonary disease (COPD)?", o:["Bronchodilators","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat motion sickness?", o:["Dimenhydrinate","Amoxicillin","Ibuprofen","Paracetamol"], a:0},
  {q:"Which drug class is used to treat peptic ulcers?", o:["Proton Pump Inhibitors","NSAIDs","Antibiotics","Antivirals"], a:0},
  {q:"Which medication is used for Vitamin B1 deficiency?", o:["Thiamine","Vitamin C","Vitamin D","Vitamin K"], a:0},
  {q:"Which drug is used to treat Parkinson’s tremors?", o:["Benztropine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug prevents nausea during chemotherapy?", o:["Ondansetron","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat hypothyroidism?", o:["Levothyroxine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which medication is used to treat hypertension in pregnancy?", o:["Methyldopa","Amlodipine","Lisinopril","Metformin"], a:0},
  {q:"Which drug is used to treat fungal infections in the mouth?", o:["Nystatin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for the prevention of malaria?", o:["Chloroquine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats excess stomach acid?", o:["Ranitidine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for motion-induced vertigo?", o:["Meclizine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat hypothyroidism?", o:["Levothyroxine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats ADHD?", o:["Methylphenidate","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat epilepsy?", o:["Carbamazepine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which medication treats allergic asthma?", o:["Montelukast","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for gout attacks?", o:["Colchicine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug reduces stomach ulcers caused by NSAIDs?", o:["Misoprostol","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats chronic heart failure?", o:["Digoxin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats tuberculosis?", o:["Isoniazid","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which vitamin is essential for collagen formation?", o:["Vitamin C","Vitamin A","Vitamin D","Vitamin K"], a:0},
  {q:"Which drug is used to treat ADHD in children?", o:["Methylphenidate","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to prevent blood clots after surgery?", o:["Heparin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats opioid overdose?", o:["Naloxone","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats tuberculosis resistant to standard drugs?", o:["Rifampicin + Isoniazid","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which vitamin is used to treat rickets?", o:["Vitamin D","Vitamin A","Vitamin C","Vitamin K"], a:0},
  {q:"Which drug is used for fungal infections of toenails?", o:["Terbinafine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for treating anemia due to iron deficiency?", o:["Ferrous Sulfate","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat acute migraine?", o:["Sumatriptan","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats chronic pain in arthritis?", o:["NSAIDs","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat chronic obstructive pulmonary disease (COPD)?", o:["Tiotropium","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for epilepsy in adults?", o:["Valproate","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for fungal skin infections?", o:["Clotrimazole","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats vitamin B12 deficiency?", o:["Cyanocobalamin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to prevent heart attacks?", o:["Aspirin low dose","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for blood pressure control in elderly?", o:["Amlodipine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats diarrhea caused by bacterial infection?", o:["Ciprofloxacin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to prevent influenza infection?", o:["Oseltamivir","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat hepatitis B?", o:["Tenofovir","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which vitamin prevents neural tube defects in pregnancy?", o:["Folic Acid","Vitamin A","Vitamin D","Vitamin K"], a:0},
  {q:"Which drug treats chronic pain in fibromyalgia?", o:["Duloxetine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats bacterial pneumonia?", o:["Azithromycin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats opioid-induced constipation?", o:["Methylnaltrexone","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats vitamin D deficiency?", o:["Cholecalciferol","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats ADHD and narcolepsy?", o:["Methylphenidate","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats severe allergic reactions (anaphylaxis)?", o:["Epinephrine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats pulmonary arterial hypertension?", o:["Sildenafil","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for chronic pain in neuropathy?", o:["Gabapentin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for bacterial skin infections?", o:["Mupirocin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for prevention of blood clot in atrial fibrillation?", o:["Warfarin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats opioid withdrawal symptoms?", o:["Clonidine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat chronic hepatitis C?", o:["Sofosbuvir","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats vertigo due to inner ear disorders?", o:["Betahistine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for anti-inflammatory effect in lungs?", o:["Budesonide","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug class is used for lowering triglycerides?", o:["Fibrates","Statins","NSAIDs","Antibiotics"], a:0},
  {q:"Which medication is used for iron deficiency anemia?", o:["Ferrous Fumarate","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which vitamin helps in calcium absorption?", o:["Vitamin D","Vitamin C","Vitamin A","Vitamin K"], a:0},
  {q:"Which drug is used to treat motion sickness in children?", o:["Dimenhydrinate","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug prevents osteoporosis in postmenopausal women?", o:["Bisphosphonates","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat chronic heart failure?", o:["Digoxin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat chronic bronchitis?", o:["Budesonide","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which medication is used to treat insomnia?", o:["Zolpidem","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to prevent thromboembolism?", o:["Warfarin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for chronic pain in neuropathy?", o:["Gabapentin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to prevent motion sickness?", o:["Scopolamine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat osteoporosis-related fractures?", o:["Teriparatide","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats allergic conjunctivitis?", o:["Olopatadine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat chronic obstructive pulmonary disease (COPD)?", o:["Tiotropium","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats opioid dependence?", o:["Methadone","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats severe pain in cancer?", o:["Morphine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat psoriasis?", o:["Methotrexate","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats bacterial vaginosis?", o:["Metronidazole","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which vitamin is essential for red blood cell production?", o:["Vitamin B12","Vitamin C","Vitamin D","Vitamin K"], a:0},
  {q:"Which drug treats chronic migraine prevention?", o:["Propranolol","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats allergic rhinitis?", o:["Cetirizine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug prevents kidney stones in hypercalciuria?", o:["Thiazide diuretics","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat chronic liver disease?", o:["Lactulose","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats acute gout flare?", o:["Colchicine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat hypothyroidism during pregnancy?", o:["Levothyroxine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for vitamin B6 deficiency?", o:["Pyridoxine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug prevents vitamin K deficiency bleeding in newborns?", o:["Vitamin K injection","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats chronic kidney disease anemia?", o:["Erythropoietin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat hyperthyroidism?", o:["Methimazole","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats motion sickness in adults?", o:["Meclizine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats inflammatory bowel disease?", o:["Mesalamine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats vitamin C deficiency?", o:["Ascorbic Acid","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats bacterial ear infection?", o:["Amoxicillin","Paracetamol","Ibuprofen","Aspirin"], a:0},
  {q:"Which drug is used for opioid overdose reversal?", o:["Naloxone","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats chronic anxiety?", o:["Buspirone","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats vitamin B9 deficiency?", o:["Folic Acid","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug prevents calcium loss in osteoporosis?", o:["Calcium supplements","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used to treat chronic heart failure?", o:["Carvedilol","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats bacterial skin infections?", o:["Mupirocin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug prevents vitamin D deficiency in infants?", o:["Cholecalciferol drops","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats severe allergic reaction?", o:["Epinephrine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats vitamin B1 deficiency?", o:["Thiamine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug prevents osteoporosis-related fractures?", o:["Teriparatide","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats chronic migraine?", o:["Topiramate","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats bacterial urinary tract infection?", o:["Ciprofloxacin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats chronic cough in COPD?", o:["Tiotropium","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats vitamin B12 deficiency anemia?", o:["Cyanocobalamin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for chronic pain in neuropathic conditions?", o:["Pregabalin","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats opioid withdrawal symptoms?", o:["Clonidine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for chronic hepatitis C treatment?", o:["Sofosbuvir","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug treats vertigo due to inner ear disorders?", o:["Betahistine","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for anti-inflammatory effect in lungs?", o:["Budesonide","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
  {q:"Which drug is used for chronic asthma management?", o:["Fluticasone","Paracetamol","Ibuprofen","Amoxicillin"], a:0},
],
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