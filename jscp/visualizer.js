// Web Audio API Visualizer matching the stars theme

let audioCtx, analyser, dataArray, visualizerCanvas, visualizerCtx;
let isVisualizerInit = false;

function initVisualizer() {
    if (isVisualizerInit) return;
    const audioElement = document.getElementById('birthdayAudio');
    if (!audioElement) return;

    // Create Canvas
    visualizerCanvas = document.createElement('canvas');
    visualizerCanvas.id = 'audio-visualizer';
    visualizerCanvas.style.position = 'fixed';
    visualizerCanvas.style.bottom = '0';
    visualizerCanvas.style.left = '0';
    visualizerCanvas.style.width = '100%';
    visualizerCanvas.style.height = '150px';
    visualizerCanvas.style.zIndex = '100'; // Above background but below UI
    visualizerCanvas.style.pointerEvents = 'none';
    document.body.appendChild(visualizerCanvas);
    
    visualizerCtx = visualizerCanvas.getContext('2d');
    
    const resizeCanvas = () => {
        visualizerCanvas.width = window.innerWidth;
        visualizerCanvas.height = 150;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Setup Audio Context
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        
        const source = audioCtx.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        isVisualizerInit = true;
        drawVisualizer();
    } catch (e) {
        console.log("Web Audio API not supported or CORS issue:", e);
    }
}

function drawVisualizer() {
    if (!isVisualizerInit) return;
    requestAnimationFrame(drawVisualizer);
    
    analyser.getByteFrequencyData(dataArray);
    
    visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    
    const barWidth = (visualizerCanvas.width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
        barHeight = dataArray[i] / 2;
        
        // Star matching glow style
        visualizerCtx.shadowBlur = 15;
        visualizerCtx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        visualizerCtx.fillStyle = `rgba(255, ${255 - barHeight}, ${255 - barHeight}, 0.6)`;
        
        // Draw centered vertically at the bottom
        visualizerCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 2;
    }
}

// Attach to music control to ensure audio context resumes
document.addEventListener('DOMContentLoaded', () => {
    const musicBtn = document.getElementById('musicControl');
    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            if (!isVisualizerInit) initVisualizer();
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        });
    }
});
