const resultsDiv=document.getElementById("results");
const gridDiv=document.getElementById("grid");

let selected=[];

async function searchBooks(){

const query=document.getElementById("searchInput").value;

const url=`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`;

const res=await fetch(url);
const data=await res.json();

resultsDiv.innerHTML="";

data.items.forEach(book=>{

let img=book.volumeInfo.imageLinks?.thumbnail;

if(!img) return;

img=img.replace("http://","https://");

img=img.replace(
"books.google.com",
"books.googleusercontent.com"
);

const el=document.createElement("img");
el.src=img;

el.onclick=()=>addToGrid(img);

resultsDiv.appendChild(el);

});

}

function addToGrid(img){

if(selected.length>=9) return;

selected.push(img);

const item=document.createElement("div");
item.className="gridItem";

const image=document.createElement("img");
image.src=img;

const remove=document.createElement("button");
remove.className="removeBtn";
remove.innerText="×";

remove.onclick=()=>{

gridDiv.removeChild(item);

selected=selected.filter(i=>i!==img);

};

item.appendChild(image);
item.appendChild(remove);

gridDiv.appendChild(item);

}

function clearGrid(){

gridDiv.innerHTML="";
selected=[];

}

function saveImage(){

if(selected.length<9){

alert("9개를 선택하세요");

return;

}

const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");

ctx.clearRect(0,0,900,900);

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

alert("URL copied");

}

function loadFromURL(){

const params=new URLSearchParams(location.search);

const data=params.get("data");

if(!data) return;

selected=JSON.parse(decodeURIComponent(data));

selected.forEach(img=>addToGrid(img));

}

loadFromURL();

new Sortable(gridDiv,{
animation:150
});