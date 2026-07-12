// 3D Birthday Cake - Premium Edition
// Features: Layered cake model, orbit drag, mouse shake to blow candle

let scene, camera, renderer, candleFlame, cakeGroup;
let audioContext, analyser, microphone, dataArray;
let isCakeActive = false;

// Shake detection state
let shakeHistory = [];
let lastShakeDir = null;
let shakeSwitches = 0;
let lastMouseX = 0;
let shakeThreshold = 80; // px movement to count as a shake direction change

function init3DCake() {
    isCakeActive = true;

    // Full-screen premium overlay
    const container = document.createElement('div');
    container.id = 'cake-container';
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 99999;
        background: radial-gradient(ellipse at center, #1a0a2e 0%, #0d0518 60%, #000 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: grab;
    `;
    document.body.appendChild(container);

    // Title
    const title = document.createElement('h2');
    title.id = 'cake-title';
    title.innerText = '🎂 Make a Wish! Move cursor left & right 3 times or click!';
    title.style.cssText = `
        color: #fff;
        font-family: 'Pacifico', cursive;
        font-size: clamp(0.9rem, 2.5vw, 1.4rem);
        text-align: center;
        text-shadow: 0 0 20px #ff69b4, 0 0 40px #ff1493;
        margin: 0 20px 10px 20px;
        z-index: 1;
        pointer-events: none;
    `;
    container.appendChild(title);

    // Shake progress indicator
    const shakeIndicator = document.createElement('div');
    shakeIndicator.id = 'shake-indicator';
    shakeIndicator.innerHTML = '💨 💨 💨';
    shakeIndicator.style.cssText = `
        font-size: 1.8rem;
        letter-spacing: 8px;
        opacity: 0.3;
        transition: opacity 0.3s;
        margin-bottom: 5px;
        z-index: 1;
        pointer-events: none;
    `;
    container.appendChild(shakeIndicator);

    // Fallback if Three.js not loaded
    if (typeof THREE === 'undefined') {
        const msg = document.createElement('div');
        msg.style.cssText = 'color:#ff69b4;font-size:1.2rem;text-align:center;padding:40px;font-family:Dancing Script,cursive;';
        msg.innerHTML = '🎂<br><br>Click here to blow out the candle and make your wish!';
        container.appendChild(msg);
        container.addEventListener('click', blowOutCandleFallback);
        return;
    }

    try {
    // Three.js scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 6, 14);
    camera.lookAt(0, 2, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.75);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.5);
    scene.add(ambientLight);

    const candleLight = new THREE.PointLight(0xffaa33, 2.5, 20);
    candleLight.position.set(0, 8, 0);
    scene.add(candleLight);

    const rimLight = new THREE.DirectionalLight(0xff69b4, 0.8);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // === Build Cake Model ===
    cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Plate
    const plateGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.2, 64);
    const plateMat = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 200 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = -0.1;
    cakeGroup.add(plate);

    // Bottom layer - chocolate
    const layer1Geo = new THREE.CylinderGeometry(3.5, 3.5, 2.2, 64);
    const layer1Mat = new THREE.MeshPhongMaterial({ color: 0x8b4513, shininess: 60 });
    const layer1 = new THREE.Mesh(layer1Geo, layer1Mat);
    layer1.position.y = 1.1;
    cakeGroup.add(layer1);

    // Frosting bottom
    const frost1Geo = new THREE.CylinderGeometry(3.6, 3.6, 0.25, 64);
    const frostMat = new THREE.MeshPhongMaterial({ color: 0xffb6c1, shininess: 150 });
    const frost1 = new THREE.Mesh(frost1Geo, frostMat);
    frost1.position.y = 2.32;
    cakeGroup.add(frost1);

    // Middle layer - pink
    const layer2Geo = new THREE.CylinderGeometry(2.8, 2.8, 1.8, 64);
    const layer2Mat = new THREE.MeshPhongMaterial({ color: 0xff69b4, shininess: 80 });
    const layer2 = new THREE.Mesh(layer2Geo, layer2Mat);
    layer2.position.y = 3.35;
    cakeGroup.add(layer2);

    // Frosting middle
    const frost2 = new THREE.Mesh(
        new THREE.CylinderGeometry(2.9, 2.9, 0.22, 64),
        frostMat
    );
    frost2.position.y = 4.35;
    cakeGroup.add(frost2);

    // Top layer - white
    const layer3Geo = new THREE.CylinderGeometry(2.0, 2.0, 1.5, 64);
    const layer3Mat = new THREE.MeshPhongMaterial({ color: 0xfff0f5, shininess: 120 });
    const layer3 = new THREE.Mesh(layer3Geo, layer3Mat);
    layer3.position.y = 5.22;
    cakeGroup.add(layer3);

    // Add sprinkle decorations
    const sprinkleColors = [0xff1493, 0xffd700, 0x00bfff, 0xff4500, 0x7fff00];
    for (let i = 0; i < 30; i++) {
        const sprinkleGeo = new THREE.CapsuleGeometry(0.06, 0.25, 4, 8);
        const sprinkleMat = new THREE.MeshPhongMaterial({
            color: sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)]
        });
        const sprinkle = new THREE.Mesh(sprinkleGeo, sprinkleMat);
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.7;
        sprinkle.position.set(
            Math.cos(angle) * radius,
            6.0,
            Math.sin(angle) * radius
        );
        sprinkle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        cakeGroup.add(sprinkle);
    }

    // Candle
    const candleGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.8, 32);
    const candleMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.set(0, 7.0, 0);
    cakeGroup.add(candle);

    // Candle wick
    const wickGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
    const wickMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const wick = new THREE.Mesh(wickGeo, wickMat);
    wick.position.set(0, 8.05, 0);
    cakeGroup.add(wick);

    // Flame (cone + glow sphere)
    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, 8.5, 0);
    cakeGroup.add(flameGroup);
    candleFlame = flameGroup;

    const flameGeo = new THREE.ConeGeometry(0.22, 0.65, 16);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.95 });
    const flameInner = new THREE.Mesh(flameGeo, flameMat);
    flameGroup.add(flameInner);

    const glowGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.35 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = -0.15;
    flameGroup.add(glow);

    // Start animation
    animateCake();

    // Orbit drag controls
    setupOrbitDrag(container);

    // Shake gesture for blowing
    setupShakeGesture(container, shakeIndicator);

    // Click fallback
    container.addEventListener('click', () => {
        if (isCakeActive && candleFlame && candleFlame.visible) {
            blowOutCandle();
        }
    });

    // Mic fallback
    initMicrophone();

    } catch(err) {
        console.error('3D Cake error:', err);
        // Remove broken canvas if any
        const broken = container.querySelector('canvas');
        if (broken) broken.remove();
        // Show click-to-wish fallback
        const msg = document.createElement('div');
        msg.style.cssText = 'color:#ff69b4;font-size:1.4rem;text-align:center;padding:40px;font-family:Dancing Script,cursive;line-height:2;';
        msg.innerHTML = '🎂<br>Click anywhere to blow out the candle<br>and make your wish! 💫';
        container.appendChild(msg);
        container.addEventListener('click', blowOutCandleFallback);
    }
}

// === Orbit Drag ===
let isCakeDragging = false;
let prevDragX = 0;
let prevDragY = 0;
let cakeRotY = 0;
let cakeRotX = 0.2;

function setupOrbitDrag(container) {
    container.addEventListener('mousedown', (e) => {
        isCakeDragging = true;
        prevDragX = e.clientX;
        prevDragY = e.clientY;
        container.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => {
        if (isCakeDragging && cakeGroup) {
            const dx = e.clientX - prevDragX;
            const dy = e.clientY - prevDragY;
            cakeRotY += dx * 0.01;
            cakeRotX += dy * 0.005;
            cakeRotX = Math.max(-0.5, Math.min(0.8, cakeRotX));
            prevDragX = e.clientX;
            prevDragY = e.clientY;
        }
    });
    window.addEventListener('mouseup', () => {
        isCakeDragging = false;
        const container = document.getElementById('cake-container');
        if (container) container.style.cursor = 'grab';
    });
    // Touch orbit
    let prevTouchX = 0;
    container.addEventListener('touchstart', (e) => { prevTouchX = e.touches[0].clientX; });
    container.addEventListener('touchmove', (e) => {
        if (cakeGroup) {
            const dx = e.touches[0].clientX - prevTouchX;
            cakeRotY += dx * 0.01;
            prevTouchX = e.touches[0].clientX;
        }
    });
}

// === Mouse Shake Gesture ===
function setupShakeGesture(container, indicator) {
    lastMouseX = 0;
    shakeSwitches = 0;
    lastShakeDir = null;

    window.addEventListener('mousemove', (e) => {
        if (!isCakeActive || !candleFlame || !candleFlame.visible) return;

        const dx = e.clientX - lastMouseX;
        lastMouseX = e.clientX;

        if (Math.abs(dx) < 5) return; // ignore tiny jitter

        const dir = dx > 0 ? 'right' : 'left';

        if (dir !== lastShakeDir) {
            if (lastShakeDir !== null) {
                shakeSwitches++;
                // Update indicator
                const lit = Math.min(shakeSwitches, 3);
                indicator.style.opacity = '1';
                indicator.innerHTML = '💨'.repeat(lit) + '<span style="opacity:0.2">' + '💨'.repeat(3 - lit) + '</span>';

                if (shakeSwitches >= 5) { // ~3 full left-right sweeps = 5 switches
                    blowOutCandle();
                    shakeSwitches = 0;
                }
            }
            lastShakeDir = dir;
        }
    });
}

function animateCake() {
    if (!isCakeActive) return;
    requestAnimationFrame(animateCake);

    // Auto-rotate slowly when not dragging
    if (!isCakeDragging && cakeGroup) {
        cakeRotY += 0.003;
    }
    if (cakeGroup) {
        cakeGroup.rotation.y = cakeRotY;
        cakeGroup.rotation.x = cakeRotX;
    }

    // Flicker flame
    if (candleFlame && candleFlame.visible) {
        candleFlame.scale.x = 1 + Math.sin(Date.now() * 0.01) * 0.08 + Math.random() * 0.06;
        candleFlame.scale.y = 1 + Math.cos(Date.now() * 0.008) * 0.1 + Math.random() * 0.05;
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
        console.warn('Microphone not available, using shake/click fallback.');
    }
}

function checkBlow() {
    if (!isCakeActive || !candleFlame || !candleFlame.visible) return;
    requestAnimationFrame(checkBlow);
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    if (sum / dataArray.length > 90) blowOutCandle();
}

function blowOutCandle() {
    if (!candleFlame) return;
    candleFlame.visible = false;

    // Update title
    const title = document.getElementById('cake-title');
    if (title) {
        title.innerText = '🎉 Happy Birthday! Your wish is coming true! 🎉';
        title.style.textShadow = '0 0 30px #ffd700, 0 0 60px #ff69b4';
    }

    blowOutCandleFallback();
}

function blowOutCandleFallback() {
    if (typeof showFirework === 'function') {
        showFirework();
        setTimeout(showFirework, 400);
        setTimeout(showFirework, 800);
    }
    setTimeout(() => {
        isCakeActive = false;
        if (renderer) renderer.dispose();
        const container = document.getElementById('cake-container');
        if (container) {
            container.style.animation = 'fadeOutScale 1s ease forwards';
            setTimeout(() => container.remove(), 1000);
        }
    }, 4000);
}
