let tg =
window.Telegram.WebApp;

tg.expand();

document
.getElementById("name")
.innerText =
tg.initDataUnsafe.user
?.first_name || "Игрок";

let lvl = 1;

let xp = 0;

let hp = 100;

let gold = 0;

const enemies = [

"Слизень",
"Скелет",
"Орк",
"Демон",
"Дракон"

];

const prefixes = [

"Теневой",
"Проклятый",
"Ледяной",
"Огненный",
"Древний"

];

const weapons = [

"меч",
"лук",
"кинжал",
"посох",
"броня"

];

const suffixes = [

"хаоса",
"смерти",
"тьмы",
"вечности",
"бездны"

];

const rarities = [

{
name:"common",
chance:50
},

{
name:"rare",
chance:30
},

{
name:"epic",
chance:15
},

{
name:"legendary",
chance:5
}

];

function rarity(){

let roll =
Math.random()*100;

let total = 0;

for(let r of rarities){

total += r.chance;

if(roll <= total){

return r.name;

}

}

return "common";

}

function random(arr){

return arr[
Math.floor(
Math.random()*arr.length
)
];

}

function createItem(){

return {

name:

random(prefixes)+" "+

random(weapons)+" "+

random(suffixes),

rarity:rarity()

};

}

function addItem(item){

let div =
document.createElement("div");

div.className =
"item "+item.rarity;

div.innerHTML =
"🎁 "+item.name;

document
.getElementById("drops")
.prepend(div);

}

function updateUI(){

document
.getElementById("lvl")
.innerText = lvl;

document
.getElementById("hp")
.innerText = hp;

document
.getElementById("gold")
.innerText = gold;

document
.getElementById("enemy")
.innerText =
random(enemies);

}

function fight(){

let dmg =
Math.floor(
Math.random()*20
);

hp -= dmg;

gold +=
Math.floor(
Math.random()*50
);

let item =
createItem();

addItem(item);

if(hp <= 0){

alert("💀 Ты умер");

hp = 100;

}

updateUI();

}

function openChest(){

let item =
createItem();

addItem(item);

}

updateUI();
