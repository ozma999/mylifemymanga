const API_KEY="여기에_API_KEY";

const searchBtn=document.getElementById("searchBtn");
const results=document.getElementById("results");
const grid=document.getElementById("grid");

let selected=[];

searchBtn.onclick=search;

function search(){

const q=document.getElementById("searchInput").value;

fetch(`https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${API_KEY}&Query=${q}&QueryType=Title&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`)

.then(r=>r.json())

.then(data=>{

results.innerHTML="";

data.item.forEach(b=>{

const img=document.createElement("img");

img.src=b.cover;

img.onclick=()=>add(b.cover);

results.appendChild(img);

});

});

}

function add(src){

if(selected.length>=9) return;

selected.push(src);

render();

}

function render(){

grid.innerHTML="";

selected.forEach((src,i)=>{

const slot=document.createElement("div");

slot.className="slot";

const img=document.createElement("img");

img.src=src;

img.crossOrigin="anonymous";

slot.appendChild(img);

grid.appendChild(slot);

});

}

new Sortable(grid,{

animation:150,

onEnd:()=>{

selected=[...grid.querySelectorAll("img")].map(i=>i.src);

}

});

document.getElementById("saveBtn").onclick=function(){

const canvas=document.getElementById("canvas");

const ctx=canvas.getContext("2d");

const imgs=grid.querySelectorAll("img");

let loaded=0;

imgs.forEach((img,i)=>{

const x=(i%3)*300;

const y=Math.floor(i/3)*300;

const temp=new Image();

temp.crossOrigin="anonymous";

temp.src=img.src;

temp.onload=function(){

ctx.drawImage(temp,x,y,300,300);

loaded++;

if(loaded===imgs.length){

const a=document.createElement("a");

a.download="top9manga.png";

a.href=canvas.toDataURL();

a.click();

}

}

});

}