// Web Audio API Visualizer matching the stars theme

let audioCtx, analyserViz, dataArrayViz, visualizerCanvas, visualizerCtx;
let isVisualizerInit = false;
let audioSourceNode = null; // Track the source node to avoid double-connecting

function initVisualizer() {
    if (isVisualizerInit) {
        // Already inited — just resume if suspended
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        return;
    }

    const audioElement = document.getElementById('birthdayAudio');
    if (!audioElement) return;

    // Create Canvas — only once
    if (!visualizerCanvas) {
        visualizerCanvas = document.createElement('canvas');
        visualizerCanvas.id = 'audio-visualizer';
        visualizerCanvas.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 120px;
            z-index: 9000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 1s ease;
        `;
        document.body.appendChild(visualizerCanvas);
        visualizerCtx = visualizerCanvas.getContext('2d');
    }

    const resizeCanvas = () => {
        visualizerCanvas.width = window.innerWidth;
        visualizerCanvas.height = 120;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Setup Audio Context — only once
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();

        if (!analyserViz) {
            analyserViz = audioCtx.createAnalyser();
            analyserViz.fftSize = 256;
        }

        // Connect source only once — connecting twice throws InvalidStateError
        if (!audioSourceNode) {
            audioSourceNode = audioCtx.createMediaElementSource(audioElement);
            audioSourceNode.connect(analyserViz);
            analyserViz.connect(audioCtx.destination);
        }

        const bufferLength = analyserViz.frequencyBinCount;
        dataArrayViz = new Uint8Array(bufferLength);

        isVisualizerInit = true;

        // Fade in the canvas
        setTimeout(() => {
            if (visualizerCanvas) visualizerCanvas.style.opacity = '1';
        }, 500);

        drawVisualizer();
    } catch (e) {
        console.warn('Visualizer init error:', e);
    }
}

function drawVisualizer() {
    if (!isVisualizerInit || !visualizerCanvas) return;
    requestAnimationFrame(drawVisualizer);

    analyserViz.getByteFrequencyData(dataArrayViz);

    const w = visualizerCanvas.width;
    const h = visualizerCanvas.height;

    visualizerCtx.clearRect(0, 0, w, h);

    const total = dataArrayViz.length;
    const barWidth = (w / total) * 2;
    let x = 0;

    for (let i = 0; i < total; i++) {
        const pct = dataArrayViz[i] / 255;
        const barHeight = pct * h * 0.9;

        // Gradient from pink to hot pink
        const r = Math.floor(255);
        const g = Math.floor(105 + (1 - pct) * 50);
        const b = Math.floor(180 - pct * 60);

        visualizerCtx.shadowBlur = 18;
        visualizerCtx.shadowColor = `rgba(255, 20, 147, 0.8)`;
        visualizerCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        visualizerCtx.fillRect(x, h - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}

// Trigger on first click anywhere — bypasses browser autoplay block
document.addEventListener('click', () => {
    initVisualizer();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}, { once: false });
