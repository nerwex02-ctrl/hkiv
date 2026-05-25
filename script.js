let tg = window.Telegram.WebApp;

tg.expand();

document.getElementById("name").innerText =
tg.initDataUnsafe.user?.first_name || "Игрок";

let player = {

lvl:1,
xp:0,

hp:100,
maxHp:100,

attack:5,
armor:0,

gold:500,
gems:500,

weapon:null,
helmet:null,
chest:null,
ring:null,

inventory:[]

};

let enemy = null;

const enemyList = [

{
name:"Слизень",
hp:50,
gold:30
},

{
name:"Скелет",
hp:120,
gold:70
},

{
name:"Орк",
hp:220,
gold:140
},

{
name:"Демон",
hp:450,
gold:250
},

{
name:"Дракон",
hp:1200,
gold:1000
}

];

const rarities = [

{
name:"COMMON",
chance:50,
color:"#777",
multi:1
},

{
name:"RARE",
chance:30,
color:"deepskyblue",
multi:2
},

{
name:"EPIC",
chance:14,
color:"violet",
multi:5
},

{
name:"LEGENDARY",
chance:5,
color:"gold",
multi:12
},

{
name:"MYTHIC",
chance:1,
color:"red",
multi:30
}

];

const types = [

"weapon",
"helmet",
"chest",
"ring"

];

const names = [

"Меч",
"Топор",
"Посох",
"Кольцо",
"Шлем",
"Доспех",
"Лук",
"Амулет"

];

const prefixes = [

"Адский",
"Теневой",
"Ледяной",
"Божественный",
"Проклятый",
"Кровавый"

];

const suffixes = [

"хаоса",
"смерти",
"бездны",
"вечности",
"бури"

];

function rand(arr){

return arr[
Math.floor(
Math.random()*arr.length
)
];

}

function rarity(){

let roll =
Math.random()*100;

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

let rar = rarity();

return {

id:
Date.now()+
Math.random(),

type:
rand(types),

name:

rand(prefixes)+" "+

rand(names)+" "+

rand(suffixes),

rarity:
rar.name,

color:
rar.color,

attack:
Math.floor(
Math.random()*10+1
)*rar.multi,

armor:
Math.floor(
Math.random()*8
)*rar.multi,

price:
Math.floor(
Math.random()*100+50
)*rar.multi

};

}

function spawnEnemy(){

enemy = {

...rand(enemyList)

};

enemy.maxHp =
enemy.hp;

renderEnemy();

}

function spawnBoss(type){

if(type=="dragon"){

enemy = {

name:"🐉 Дракон",

hp:5000,
maxHp:5000,

gold:5000

};

}

if(type=="titan"){

enemy = {

name:"🗿 Титан",

hp:12000,
maxHp:12000,

gold:15000

};

}

if(type=="void"){

enemy = {

name:"🌌 Повелитель Бездны",

hp:40000,
maxHp:40000,

gold:50000

};

}

renderEnemy();

closePages();

}

function renderEnemy(){

document
.getElementById(
"enemyName"
)
.innerText =
enemy.name;

document
.getElementById(
"enemyhp"
)
.style.width =

(enemy.hp/
enemy.maxHp)
*100+"%";

document
.getElementById(
"enemyhptext"
)
.innerText =

enemy.hp+
" / "+
enemy.maxHp;

}

function updateStats(){

player.attack = 5;
player.armor = 0;

[
player.weapon,
player.helmet,
player.chest,
player.ring

].forEach(item=>{

if(item){

player.attack +=
item.attack;

player.armor +=
item.armor;

}

});

}

function renderEquipment(){

document
.getElementById(
"weaponSlot"
)
.innerText =

player.weapon
? player.weapon.name
: "Пусто";

document
.getElementById(
"helmetSlot"
)
.innerText =

player.helmet
? player.helmet.name
: "Пусто";

document
.getElementById(
"chestSlot"
)
.innerText =

player.chest
? player.chest.name
: "Пусто";

document
.getElementById(
"ringSlot"
)
.innerText =

player.ring
? player.ring.name
: "Пусто";

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
.getElementById("maxhp")
.innerText =
player.maxHp;

document
.getElementById("attack")
.innerText =
player.attack;

document
.getElementById("armor")
.innerText =
player.armor;

document
.getElementById("gold")
.innerText =
player.gold;

document
.getElementById("gems")
.innerText =
player.gems;

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
font-size:18px;
font-weight:bold;
color:${item.color};
">

${item.rarity}

</div>

<div style="
margin-top:8px;
font-size:17px;
">

${item.name}

</div>

<div style="
margin-top:10px;
">

⚔ ${item.attack}
🛡 ${item.armor}
💰 ${item.price}

</div>

<div class="itemButtons">

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

drops.prepend(div);

});

}

function equipItem(id){

let item =
player.inventory.find(
i=>i.id == id
);

if(!item) return;

player[item.type] =
item;

updateStats();

renderEquipment();

renderUI();

saveGame();

}

function sellItem(id){

let item =
player.inventory.find(
i=>i.id == id
);

if(!item) return;

player.gold +=
item.price;

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
"🎒 FULL INVENTORY"
);

return;

}

player.inventory.push(item);

renderInventory();

saveGame();

}

function fight(){

let crit =
Math.random()<0.2;

let dmg =

Math.floor(
Math.random()*
player.attack
)+1;

if(crit){

dmg *= 2;

}

enemy.hp -= dmg;

let enemyDmg =

Math.floor(
Math.random()*40
)+10;

enemyDmg -=
Math.floor(
player.armor*0.35
);

if(enemyDmg < 1){

enemyDmg = 1;

}

player.hp -= enemyDmg;

if(player.hp < 0){

player.hp = 0;

}

if(enemy.hp <= 0){

player.gold +=
enemy.gold;

player.xp += 25;

for(let i=0;i<3;i++){

addItem(
generateItem()
);

}

spawnEnemy();

}

if(player.hp <= 0){

alert("💀 ТЫ УМЕР");

player.hp =
player.maxHp;

player.gold =
Math.floor(
player.gold*0.5
);

}

if(player.xp >= 100){

player.lvl++;

player.xp = 0;

player.maxHp += 30;

player.hp =
player.maxHp;

}

renderEnemy();

renderUI();

saveGame();

}

function openChest(){

if(player.gems < 25){

alert(
"❌ NEED 25 GEMS"
);

return;

}

player.gems -= 25;

for(let i=0;i<3;i++){

addItem(
generateItem()
);

}

renderUI();

}

function openMegaChest(){

if(player.gems < 100){

alert(
"❌ NEED 100 GEMS"
);

return;

}

player.gems -= 100;

for(let i=0;i<10;i++){

addItem(
generateItem()
);

}

renderUI();

}

function healPlayer(){

if(player.gold < 100){

alert(
"❌ NEED 100 GOLD"
);

return;

}

player.gold -= 100;

player.hp =
player.maxHp;

renderUI();

}

function sellAllCommon(){

player.inventory =
player.inventory.filter(item=>{

if(item.rarity=="COMMON"){

player.gold +=
item.price;

return false;

}

return true;

});

renderInventory();

renderUI();

saveGame();

}

function openPage(id){

closePages();

document
.getElementById(id)
.classList
.remove("hidden");

}

function closePages(){

document
.querySelectorAll(".page")
.forEach(page=>{

page.classList
.add("hidden");

});

}

function saveGame(){

localStorage.setItem(

"lootRPG",

JSON.stringify(player)

);

}

function loadGame(){

let save =
JSON.parse(

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

renderEquipment();

renderInventory();

renderUI();

spawnEnemy();
