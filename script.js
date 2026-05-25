let tg = window.Telegram.WebApp;

tg.expand();

document.getElementById("name").innerText =
tg.initDataUnsafe.user?.first_name || "Игрок";

let lvl = 1;

const items = [

{
name:"Легендарный меч бездны",
rarity:"legendary"
},

{
name:"Эпический лук теней",
rarity:"epic"
},

{
name:"Редкий амулет хаоса",
rarity:"rare"
},

{
name:"Необычная броня",
rarity:"uncommon"
}

];

function randomItem(){

return items[
Math.floor(Math.random()*items.length)
];

}

function addItem(item){

let div = document.createElement("div");

div.className =
"item "+item.rarity;

div.innerHTML =
"🎁 "+item.name;

document.getElementById("drops")
.prepend(div);

}

function fight(){

let item = randomItem();

addItem(item);

}

function openChest(){

let item = randomItem();

addItem(item);

}
