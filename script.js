let tg = window.Telegram.WebApp;

tg.expand();

document.getElementById("name").innerText =
tg.initDataUnsafe.user?.first_name || "Игрок";

let player = {

lvl:1,
xp:0,

hp:100,
maxHp:100,

gold:0,
gems:250,

attack:5,
armor:0,

weapon:null,
helmet:null,
chest:null,
ring:null,

inventory:[]

};

let currentEnemy = null;

const enemies = [

{
name:"Слизень",
hp:40,
gold:20
},

{
name:"Скелет",
hp:70,
gold:40
},

{
name:"Орк",
hp:120,
gold:80
},

{
name:"Демон",
hp:200,
gold:140
},

{
name:"Дракон",
hp:500,
gold:500
},

{
name:"Повелитель Бездны",
hp:1200,
gold:1500
}

];

const itemTypes = [

"weapon",
"helmet",
"chest",
"ring"

];

const weapons = [

"Меч",
"Кинжал",
"Топор",
"Посох",
"Лук"

];

const helmets = [

"Шлем",
"Корона",
"Капюшон"

];

const chests = [

"Броня",
"Куртка",
"Доспех"

];

const rings = [

"Кольцо",
"Амулет"

];

const prefixes = [

"Теневой",
"Ледяной",
"Адский",
"Божественный",
"Кровавый",
"Древний"

];

const suffixes = [

"хаоса",
"бездны",
"смерти",
"вечности",
"бури"

];

const rarities = [

{
name:"common",
chance:50,
color:"#777",
multi:1
},

{
name:"rare",
chance:30,
color:"deepskyblue",
multi:2
},

{
name:"epic",
chance:15,
color:"violet",
multi:4
},

{
name:"legendary",
chance:4,
color:"gold",
multi:8
},

{
name:"mythic",
chance:1,
color:"red",
multi:15
}

];

function random(arr){

return arr[
Math.floor(
Math.random()*arr.length
)
];

}

function randomRarity(){

let roll = Math.random()*100;

let total = 0;

for(let r of rarities){

total += r.chance;

if(roll <= total){

return r;

}

}

return rarities[0];

}

function generateItem(){

let rarity = randomRarity();

let type = random(itemTypes);

let baseName = "";

if(type=="weapon"){

baseName = random(weapons);

}

if(type=="helmet"){

baseName = random(helmets);

}

if(type=="chest"){

baseName = random(chests);

}

if(type=="ring"){

baseName = random(rings);

}

return {

id:
Date.now()+
Math.random(),

type:type,

name:

random(prefixes)+" "+

baseName+" "+

random(suffixes),

rarity:rarity.name,

color:rarity.color,

attack:
Math.floor(
Math.random()*10+1
)*rarity.multi,

armor:
Math.floor(
Math.random()*8
)*rarity.multi,

price:
Math.floor(
Math.random()*100
)*rarity.multi

};

}

function spawnEnemy(){

currentEnemy = {

...random(enemies)

};

currentEnemy.maxHp =
currentEnemy.hp;

renderEnemy();

}

function renderEnemy(){

document
.getElementById("enemy")
.innerText =
currentEnemy.name;

let percent =

(currentEnemy.hp/
currentEnemy.maxHp)
*100;

document
.getElementById(
"enemyhp"
)
.style.width =
percent+"%";

}

function updateStats(){

player.attack = 5;
player.armor = 0;

const equips = [

player.weapon,
player.helmet,
player.chest,
player.ring

];

equips.forEach(item=>{

if(item){

player.attack += item.attack;
player.armor += item.armor;

}

});

}

function renderUI(){

document
.getElementById("lvl")
.innerText =
player.lvl;

document
.getElementById("xp")
.innerText =
player.xp;

document
.getElementById("hp")
.innerText =
player.hp;

document
.getElementById("gold")
.innerText =
player.gold;

document
.getElementById("armor")
.innerText =
player.armor;

document
.getElementById("slots")
.innerText =
player.inventory.length;

}

function renderInventory(){

let drops =
document
.getElementById("drops");

drops.innerHTML = "";

player.inventory
.forEach(item=>{

let div =
document
.createElement("div");

div.className =
"item";

div.style.border =
"2px solid "+
item.color;

div.innerHTML =

`

<div style="
font-weight:bold;
color:${item.color};
font-size:18px;
">

${item.name}

</div>

<div>

⚔ ${item.attack}
🛡 ${item.armor}
💰 ${item.price}

</div>

<div style="
margin-top:10px;
display:flex;
gap:8px;
">

<button
class="smallBtn"
onclick="equipItem('${item.id}')">

🛡 Надеть

</button>

<button
class="smallBtn"
onclick="sellItem('${item.id}')">

💰 Продать

</button>

</div>

`;

drops.appendChild(div);

});

}

function equipItem(id){

let item =
player.inventory.find(
i=>i.id == id
);

if(!item) return;

player[item.type] = item;

updateStats();

saveGame();

renderUI();

alert(
"✅ Надето: "+
item.name
);

}

function sellItem(id){

let item =
player.inventory.find(
i=>i.id == id
);

if(!item) return;

player.gold += item.price;

player.inventory =
player.inventory.filter(
i=>i.id != id
);

renderInventory();

renderUI();

saveGame();

}

function addItem(item){

if(
player.inventory.length
>=1000
){

alert(
"🎒 Инвентарь заполнен"
);

return;

}

player.inventory.push(item);

renderInventory();

saveGame();

}

function fight(){

let dmg =

Math.floor(
Math.random()*
player.attack
)+1;

currentEnemy.hp -= dmg;

if(currentEnemy.hp <= 0){

player.gold +=
currentEnemy.gold;

player.xp += 20;

if(Math.random()<0.8){

addItem(
generateItem()
);

}

spawnEnemy();

}

let enemyDmg =

Math.floor(
Math.random()*20
)-player.armor;

if(enemyDmg < 0){

enemyDmg = 0;

}

player.hp -= enemyDmg;

if(player.hp <= 0){

alert("💀 Ты умер");

player.hp =
player.maxHp;

player.gold = 0;

}

if(player.xp >= 100){

player.lvl++;

player.xp = 0;

player.maxHp += 20;

player.hp =
player.maxHp;

alert(
"🔥 Новый уровень: "+
player.lvl
);

}

renderEnemy();

renderUI();

saveGame();

}

function openChest(){

if(player.gems < 25){

alert(
"❌ Нужно 25 гемов"
);

return;

}

player.gems -= 25;

addItem(
generateItem()
);

renderUI();

}

function healPlayer(){

if(player.gold < 100){

alert(
"❌ Нужно 100 золота"
);

return;

}

player.gold -= 100;

player.hp =
player.maxHp;

renderUI();

}

function toggleInventory(){

document
.getElementById(
"inventoryWindow"
)
.classList
.toggle("hidden");

}

function saveGame(){

localStorage.setItem(

"lootRPG",

JSON.stringify(player)

);

}

function loadGame(){

let save = JSON.parse(

localStorage.getItem(
"lootRPG"
)

);

if(save){

player = save;

}

}

loadGame();

updateStats();

renderInventory();

renderUI();

spawnEnemy();
