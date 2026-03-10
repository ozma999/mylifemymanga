const resultsDiv = document.getElementById("results");
const gridDiv = document.getElementById("grid");

let selected = [];

async function searchBooks(){

const query = document.getElementById("searchInput").value;

const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`;

const res = await fetch(url);
const data = await res.json();

resultsDiv.innerHTML="";

data.items.forEach(book=>{

const img = book.volumeInfo.imageLinks?.thumbnail;

if(!img) return;

const el=document.createElement("img");
el.src=img;

el.onclick=()=>{
addToGrid(img);
};

resultsDiv.appendChild(el);

});

}

function addToGrid(img){

if(selected.length>=9) return;

selected.push(img);

const el=document.createElement("img");
el.src=img;

gridDiv.appendChild(el);

}

function saveImage(){

if(selected.length<9){
alert("9개를 선택하세요");
return;
}

const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");

let loaded=0;

selected.forEach((src,i)=>{

const img=new Image();
img.crossOrigin="anonymous";
img.src=src;

img.onload=()=>{

const x=(i%3)*300;
const y=Math.floor(i/3)*300;

ctx.drawImage(img,x,y,300,300);

loaded++;

if(loaded===9){

const link=document.createElement("a");
link.download="top9.png";
link.href=canvas.toDataURL();
link.click();

}

};

});

}

function shareURL(){

const data=encodeURIComponent(JSON.stringify(selected));

const url=`${location.origin}?data=${data}`;

navigator.clipboard.writeText(url);

alert("URL 복사됨");

}

function loadFromURL(){

const params=new URLSearchParams(location.search);

const data=params.get("data");

if(!data) return;

selected=JSON.parse(decodeURIComponent(data));

selected.forEach(img=>{

const el=document.createElement("img");
el.src=img;

gridDiv.appendChild(el);

});

}

loadFromURL();