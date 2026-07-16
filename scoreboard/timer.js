let startTime = 0;

let elapsedTime = 0;

let running = false;



const timer =
document.getElementById("timer");



function updateTimer(){


if(running){

let now =
Date.now();


elapsedTime =
now - startTime;


}


let total =
elapsedTime;


let seconds =
Math.floor(total / 1000);


let ms =
Math.floor(
(total % 1000) / 10
);



timer.innerHTML =
String(seconds)
.padStart(2,"0")
+
":"
+
String(ms)
.padStart(2,"0");

}



setInterval(
updateTimer,
30
);





document.addEventListener(
"keydown",
(e)=>{


// 空格 開始/暫停

if(e.code==="Space"){


if(!running){


startTime =
Date.now()
-
elapsedTime;


running=true;


}else{


elapsedTime =
Date.now()
-
startTime;


running=false;


}


}



// R 重置

if(e.code==="KeyR"){


running=false;

elapsedTime=0;


}



});