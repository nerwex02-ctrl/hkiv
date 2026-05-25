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

let maxHp = 100;

let armor = 0;

let gold = 0;

let gems = 250;

let enemyHp = 100;

let inventory = [];

const enemies = [

"Слизень",
"Скелет",
"Орк",
"Демон",
"Дракон",
"Некромант",
"Вампир",
"Титан",
"Лич",
"Гидра",
"Повелитель Бездны",
"Лавовый Голем",
"Призрак",
"Темный Рыцарь",
"Адский Паук"

];

const prefixes = [

"Теневой",
"Огненный",
"Ледяной",
"Кровавый",
"Божественный",
"Проклятый",
"Ядовитый",
"Адский",
"Сияющий",
"Легендарный"

];

const weapons = [

"меч",
"лук",
"посох",
"кинжал",
"молот",
"броня",
"шлем",
"щит",
"кольцо",
"амулет"

];

const suffixes = [

"хаоса",
"вечности",
"смерти",
"бездны",
"бури",
"тьмы",
"света",
"дракона",
"феникса"

];

const rarities = [

{
name:"common",
chance:40,
price:50
},

{
name:"rare",
chance:30,
price:150
},

{
name:"epic",
chance:18,
price:500
},

{
name:"legendary",
chance:9,
price:1500
},

{
name:"mythic",
chance:3,
price:5000
}

];

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

function random(arr){

return arr[
Math.floor(
Math.random()*arr.length
)
];

}

function createItem(){

let rar =
rarity();

return {

id:
Date.now()+
Math.random(),

name:

random(prefixes)+" "+

random(weapons)+" "+

random(suffixes),

rarity:rar.name,

price:rar.price,

attack:
Math.floor(
Math.random()*50
)+1,

armor:
Math.floor(
Math.random()*30
),

equipped:false

};

}

function renderInventory(){

let drops =
document
.getElementById("drops");

drops.innerHTML = "";

document
.getElementById("slots")
.innerText =
inventory.length;

inventory.forEach(item=>{

let div =
document
.createElement("div");

div.className =
"item "+item.rarity;

div.innerHTML =

`
<div>
${item.name}
</div>

<div>
⚔ ${item.attack}
🛡 ${item.armor}
💰 ${item.price}
</div>

<div class="itemButtons">

<button
class="smallBtn"
onclick="equipItem('${item.id}')">

${item.equipped
? "✅ Надето"
: "🛡 Надеть"}

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

inventory.forEach(i=>{

if(i.id == id){

i.equipped =
!i.equipped;

}

});

updateStats();

saveGame();

renderInventory();

}

function sellItem(id){

let item =
inventory.find(
i=>i.id == id
);

gold += item.price;

inventory =
inventory.filter(
i=>i.id != id
);

renderInventory();

updateUI();

saveGame();

}

function updateStats(){

armor = 0;

inventory.forEach(i=>{

if(i.equipped){

armor += i.armor;

}

});

}

function updateUI(){

document
.getElementById("lvl")
.innerText = lvl;

document
.getElementById("hp")
.innerText = hp;

document
.getElementById("xp")
.innerText = xp;

document
.getElementById("gold")
.innerText = gold;

document
.getElementById("armor")
.innerText = armor;

document
.getElementById("enemy")
.innerText =
random(enemies);

document
.getElementById("enemyhp")
.style.width =
enemyHp+"%";

}

function addItem(item){

if(inventory.length >= 1000){

alert(
"🎒 Инвентарь заполнен"
);

return;

}

inventory.push(item);

renderInventory();

saveGame();

}

function fight(){

let dmg =
Math.floor(
Math.random()*20
)+lvl;

enemyHp -= dmg;

gold +=
Math.floor(
Math.random()*100
);

xp += 15;

if(enemyHp <= 0){

enemyHp = 100;

gold += 250;

addItem(
createItem()
);

}

let enemyDmg =
Math.floor(
Math.random()*25
)-armor;

if(enemyDmg < 0){

enemyDmg = 0;

}

hp -= enemyDmg;

if(hp <= 0){

alert("💀 Ты умер");

hp = maxHp;

gold = 0;

xp = 0;

lvl = 1;

}

if(xp >= 100){

lvl++;

xp = 0;

maxHp += 20;

hp = maxHp;

alert(
"🔥 Новый уровень: "+
lvl
);

}

updateUI();

saveGame();

}

function openChest(){

if(gems < 25){

alert(
"❌ Мало гемов"
);

return;

}

gems -= 25;

addItem(
createItem()
);

updateUI();

}

function healPlayer(){

if(gold < 100){

alert(
"❌ Нужно 100 золота"
);

return;

}

gold -= 100;

hp = maxHp;

updateUI();

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

JSON.stringify({

lvl,
xp,
hp,
maxHp,
armor,
gold,
gems,
inventory

})

);

}

function loadGame(){

let save =
JSON.parse(

localStorage
.getItem(
"lootRPG"
)

);

if(save){

lvl = save.lvl;
xp = save.xp;
hp = save.hp;
maxHp = save.maxHp;
armor = save.armor;
gold = save.gold;
gems = save.gems;
inventory = save.inventory;

}

}

loadGame();

renderInventory();

updateStats();

updateUI();
