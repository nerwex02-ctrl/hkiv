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
gems:500,

attack:5,
armor:0,

weapon:null,
helmet:null,
chest:null,
ring:null,

inventory:[]

};

let enemy = null;

const enemies = [

{name:"Слизень",hp:40,gold:20},
{name:"Скелет",hp:80,gold:50},
{name:"Орк",hp:140,gold:100},
{name:"Демон",hp:250,gold:180},
{name:"Дракон",hp:700,gold:600},
{name:"Титан",hp:1500,gold:1500},
{name:"Повелитель Бездны",hp:3000,gold:4000}

];

const rarities = [

{
name:"COMMON",
color:"#777",
chance:50,
multi:1
},

{
name:"RARE",
color:"deepskyblue",
chance:30,
multi:2
},

{
name:"EPIC",
color:"violet",
chance:14,
multi:5
},

{
name:"LEGENDARY",
color:"gold",
chance:5,
multi:10
},

{
name:"MYTHIC",
color:"red",
chance:1,
multi:25
}

];

const names = [

"Меч",
"Клинок",
"Топор",
"Посох",
"Шлем",
"Кольцо",
"Доспех",
"Амулет",
"Лук",
"Кинжал"

];

const prefixes = [

"Адский",
"Ледяной",
"Теневой",
"Кровавый",
"Божественный",
"Проклятый"

];

const suffixes = [

"хаоса",
"смерти",
"вечности",
"бездны",
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

let types = [

"weapon",
"helmet",
"chest",
"ring"

];

let type = rand(types);

return {

id:
Date.now()+
Math.random(),

type:type,

name:

rand(prefixes)+" "+

rand(names)+" "+

rand(suffixes),

rarity:rar.name,

color:rar.color,

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

...rand(enemies)

};

enemy.maxHp =
enemy.hp;

renderEnemy();

}

function renderEnemy(){

document
.getElementById("enemy")
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

enemy.hp+" / "+
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
.getElementById("gold")
.innerText =
player.gold;

document
.getElementById("gems")
.innerText =
player.gems;

document
.getElementById("attack")
.innerText =
player.attack;

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
font-size:18px;
font-weight:bold;
color:${item.color};
">

${item.rarity}

</div>

<div style="
margin-top:6px;
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

let dmg =

Math.floor(
Math.random()*
player.attack
)+1;

enemy.hp -= dmg;

if(enemy.hp <= 0){

player.gold +=
enemy.gold;

player.xp += 20;

if(Math.random()<0.9){

addItem(
generateItem()
);

}

spawnEnemy();

}

let enemyDmg =

Math.floor(
Math.random()*25
)+5;

enemyDmg -=
player.armor;

if(enemyDmg < 0){

enemyDmg = 0;

}

player.hp -= enemyDmg;

if(player.hp < 0){

player.hp = 0;

}

if(player.hp <= 0){

alert("💀 ТЫ УМЕР");

player.hp =
player.maxHp;

player.gold = 0;

}

if(player.xp >= 100){

player.lvl++;

player.xp = 0;

player.maxHp += 25;

player.hp =
player.maxHp;

alert(
"🔥 LEVEL UP: "+
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
