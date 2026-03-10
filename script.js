const resultsDiv = document.getElementById("results");
const gridDiv = document.getElementById("grid");

let selected = [];

async function searchBooks(){

const q = document.getElementById("searchInput").value;

const res = await fetch(
"https://www.googleapis.com/books/v1/volumes?q="+encodeURIComponent(q)
);

const data = await res.json();

resultsDiv.innerHTML="";

data.items.forEach(book=>{

const img =
book.volumeInfo.imageLinks?.thumbnail ||
book.volumeInfo.imageLinks?.smallThumbnail;

if(!img) return;

const el = document.createElement("img");
el.src = img;

el.addEventListener("click",function(){
addToGrid(this.src);
});

resultsDiv.appendChild(el);

});

}

function addToGrid(img){

if(selected.length>=9) return;

selected.push(img);

renderGrid();

}

function renderGrid(){

gridDiv.innerHTML="";

selected.forEach((img,index)=>{

const el = document.createElement("img");

el.src = img;

el.title="click to remove";

el.addEventListener("click",function(){

selected.splice(index,1);

renderGrid();

});

gridDiv.appendChild(el);

});

}

function saveImage(){

const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");

const size=300;

selected.forEach((src,i)=>{

const img=new Image();
img.crossOrigin="anonymous";

img.onload=function(){

const x=(i%3)*size;
const y=Math.floor(i/3)*size;

ctx.drawImage(img,x,y,size,size);

};

img.src=src;

});

setTimeout(()=>{

const link=document.createElement("a");
link.download="top9manga.png";
link.href=canvas.toDataURL();
link.click();

},1000);

}

function resetGrid(){

selected=[];
renderGrid();

}

function shareURL(){

const encoded=btoa(JSON.stringify(selected));

const url=location.origin+location.pathname+"?data="+encoded;

navigator.clipboard.writeText(url);

alert("URL copied!");

}

window.onload=function(){

const params=new URLSearchParams(location.search);

const data=params.get("data");

if(data){

selected=JSON.parse(atob(data));

renderGrid();

}

}