// 3D Birthday Cake with Microphone Candle Blowing (Three.js)

let scene, camera, renderer, candleFlame, particles = [];
let audioContext, analyser, microphone, dataArray;
let isCakeActive = false;

function init3DCake() {
    isCakeActive = true;
    const container = document.createElement('div');
    container.id = 'cake-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '500';
    container.style.background = 'rgba(0, 0, 0, 0.85)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    document.body.appendChild(container);

    const title = document.createElement('h2');
    title.innerText = "Blow on your microphone to make a wish!";
    title.style.color = 'white';
    title.style.fontFamily = 'Pacifico, cursive';
    title.style.zIndex = '501';
    title.style.marginBottom = '20px';
    container.appendChild(title);

    // Three.js Setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffaa00, 1, 100);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Cake Base
    const geometry = new THREE.CylinderGeometry(3, 3, 2, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0xff69b4 });
    const cake = new THREE.Mesh(geometry, material);
    scene.add(cake);

    // Candle
    const candleGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const candleMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.y = 1.75;
    scene.add(candle);

    // Flame
    const flameGeo = new THREE.ConeGeometry(0.3, 0.8, 16);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.9 });
    candleFlame = new THREE.Mesh(flameGeo, flameMat);
    candleFlame.position.y = 2.7;
    scene.add(candleFlame);

    camera.position.z = 8;
    camera.position.y = 4;
    camera.lookAt(0, 0, 0);

    animateCake();
    initMicrophone();
}

function animateCake() {
    if (!isCakeActive) return;
    requestAnimationFrame(animateCake);

    // Flicker flame
    if (candleFlame.visible) {
        candleFlame.scale.x = 1 + Math.random() * 0.2;
        candleFlame.scale.y = 1 + Math.random() * 0.2;
        candleFlame.scale.z = 1 + Math.random() * 0.2;
    }

    renderer.render(scene, camera);
}

async function initMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        checkBlow();
    } catch (e) {
        console.warn("Microphone access denied or not available", e);
        // Fallback: click to blow out
        document.getElementById('cake-container').addEventListener('click', blowOutCandle);
    }
}

function checkBlow() {
    if (!isCakeActive || !candleFlame.visible) return;
    requestAnimationFrame(checkBlow);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const average = sum / dataArray.length;

    // If microphone picks up a loud blowing noise
    if (average > 100) {
        blowOutCandle();
    }
}

function blowOutCandle() {
    candleFlame.visible = false;
    // Launch fireworks from ui.js
    if (typeof showFirework === 'function') {
        showFirework();
        showFirework();
        showFirework();
    }

    setTimeout(() => {
        isCakeActive = false;
        document.getElementById('cake-container').remove();
    }, 4000);
}
