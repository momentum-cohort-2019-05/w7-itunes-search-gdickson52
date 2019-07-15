class AudioPlayer {

    constructor() {
        this.player = new Audio();
    }

    pause() {
        if(!this.player.paused) {
            this.player.pause();
        }
    }

    play(music) {
        this.pause();

        const artwork = document.createElement('img');
        artwork.src = music.artworkUrl100;

        const playerSystem = document.querySelector('.player');
        playerSystem.innerHTML = '';
        playerSystem.appendChild(artwork);


        this.player.src = music.previewUrl;
        this.player.play();
    }
}

let player = new AudioPlayer();

function renderItems(data) {

    data.forEach((item) => {
        if(item.trackName) {
            const li = document.createElement('li');
            li.textContent = item.trackName;

            li.onclick = (e) => {
                player.play(item);
            }

            const ul = document.querySelector('ul.music-playlist');
            ul.appendChild(li);
        }
    })
}

const searchForm = document.querySelector('form');

searchForm.onsubmit = (e) => {
    e.preventDefault();

    const system = document.querySelector('ul.music-playlist');
    system.innerHTML = '';
    system.textContent = 'Loading...';

    const searchInput = document.querySelector('.search-input');
    let term = searchInput.value;

    let endpoint = 'https://itunes.apple.com/search?term='+term;

    const datatransfer = new XMLHttpRequest();

    datatransfer.addEventListener('load', (e) => {
        system.innerHTML = '';
        let result = JSON.parse(datatransfer.responseText);
        console.log(result);
        renderItems(result.results);
    });

    datatransfer.addEventListener('error', () => {
        console.log('transfer failed');
    });

    datatransfer.open('GET', endpoint, true);

    datatransfer.send();

}


let canvas, ctx, center_x, center_y, radius, bars, 
    x_end, y_end, bar_height, bar_width,
    frequency_array;
 
bars = 200;
bar_width = 2;
 
function initPage(){
    
    audio = new Audio();
    context = new (window.AudioContext || window.webkitAudioContext)();
    analyser = context.createAnalyser();
    audio.src = ""; // the source path
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
 
    
    frequency_array = new Uint8Array(analyser.frequencyBinCount);
    
    audio.play();
    animationLooper();
}
 
function animationLooper(){
    
    // set to the size of device
    canvas = document.getElementById("renderer");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    
    // find the center of the window
    center_x = canvas.width / 2;
    center_y = canvas.height / 2;
    radius = 150;
    
    // style the background
    let gradient = ctx.createLinearGradient(0,0,0,canvas.height);
    gradient.addColorStop(0,"coral");
    gradient.addColorStop(1,"coral");
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    //draw a circle
    ctx.beginPath();
    ctx.arc(center_x,center_y,radius,0,2*Math.PI);
    ctx.stroke();
    
    analyser.getByteFrequencyData(frequency_array);
    for(let i = 0; i < bars; i++){
        
        //divide a circle into equal parts
        rads = Math.PI * 2 / bars;
        
        bar_height = frequency_array[i]*0.7;
        
        // set coordinates
        x = center_x + Math.cos(rads * i) * (radius);
	    y = center_y + Math.sin(rads * i) * (radius);
        x_end = center_x + Math.cos(rads * i)*(radius + bar_height);
        y_end = center_y + Math.sin(rads * i)*(radius + bar_height);
        
        //draw a bar
        drawBar(x, y, x_end, y_end, bar_width,frequency_array[i]);
    
    }
    window.requestAnimationFrame(animationLooper);
}
 
// for drawing a bar
function drawBar(x1, y1, x2, y2, width,frequency){
    
    let lineColor = "rgb(" + frequency + ", " + frequency + ", " + 205 + ")";
    
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}
