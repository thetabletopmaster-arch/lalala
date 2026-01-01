// Three.js Scene Setup
let scene, camera, renderer, dolphin, water;
let time = 0;
let isProcessing = false;

// Audio context for voice
let audioContext;
let currentAudio = null;

// Initialize the scene
function initScene() {
    const canvas = document.getElementById('dolphin-scene');
    const container = document.getElementById('canvas-container');

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x001100, 1, 15);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 3.5;
    camera.position.y = 1;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x001100);

    // Lighting - much brighter so dolphin is visible
    const ambientLight = new THREE.AmbientLight(0x00ff00, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ff00, 2.5, 100);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    // Add red rim light for disturbing effect
    const redLight = new THREE.PointLight(0xff0066, 1.5, 50);
    redLight.position.set(-5, 0, -5);
    scene.add(redLight);

    // Add spotlight on dolphin
    const spotlight = new THREE.SpotLight(0x00ff00, 2);
    spotlight.position.set(0, 10, 0);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.5;
    scene.add(spotlight);

    // Front light to illuminate dolphin face
    const frontLight = new THREE.PointLight(0x00ff88, 1.5, 20);
    frontLight.position.set(0, 1, 5);
    scene.add(frontLight);

    // Create disturbing dolphin
    createDolphin();

    // Create water plane
    createWater();

    // Add particles
    createParticles();

    // Start animation
    animate();

    // Handle resize
    window.addEventListener('resize', onWindowResize);
}

function createDolphin() {
    const dolphinGroup = new THREE.Group();

    // Body - elongated and unsettling
    const bodyGeometry = new THREE.SphereGeometry(1, 16, 16);
    bodyGeometry.scale(1.5, 0.8, 0.8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x4444ff,
        emissive: 0x001144,
        shininess: 30,
        flatShading: true
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    dolphinGroup.add(body);

    // Head/Snout - distorted
    const headGeometry = new THREE.ConeGeometry(0.3, 1, 8);
    headGeometry.rotateZ(Math.PI / 2);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.x = 1.5;
    dolphinGroup.add(head);

    // Eyes - disturbing glowing eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        emissive: 0xff0000
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.8, 0.3, 0.5);
    dolphinGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.8, 0.3, -0.5);
    dolphinGroup.add(rightEye);

    // Pupils - black voids
    const pupilGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(0.9, 0.3, 0.5);
    dolphinGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.9, 0.3, -0.5);
    dolphinGroup.add(rightPupil);

    // Fin - asymmetric and wrong
    const finGeometry = new THREE.ConeGeometry(0.3, 1, 3);
    const fin = new THREE.Mesh(finGeometry, bodyMaterial);
    fin.position.y = 0.8;
    fin.rotation.x = Math.PI;
    dolphinGroup.add(fin);

    // Tail - distorted
    const tailGeometry = new THREE.ConeGeometry(0.5, 1, 4);
    tailGeometry.rotateZ(Math.PI / 2);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.x = -1.5;
    dolphinGroup.add(tail);

    dolphinGroup.position.y = 1;
    dolphinGroup.scale.set(1.5, 1.5, 1.5); // Make dolphin bigger
    dolphinGroup.rotation.y = Math.PI; // Rotate to face camera
    dolphin = dolphinGroup;
    scene.add(dolphin);
}

function createWater() {
    const waterGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    const waterMaterial = new THREE.MeshPhongMaterial({
        color: 0x003311,
        emissive: 0x001100,
        transparent: true,
        opacity: 0.8,
        flatShading: true
    });
    water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -1;
    scene.add(water);
}

function createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
}

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    if (dolphin) {
        // Unsettling bobbing motion
        dolphin.position.y = 1 + Math.sin(time * 2) * 0.3;
        dolphin.rotation.y = Math.sin(time * 0.5) * 0.2;
        dolphin.rotation.z = Math.sin(time * 1.5) * 0.1;

        // Random twitches
        if (Math.random() > 0.98) {
            dolphin.rotation.x += (Math.random() - 0.5) * 0.5;
        }
    }

    if (water) {
        // Animate water vertices
        const positions = water.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            positions[i + 2] = Math.sin(x * 0.5 + time) * 0.1 + Math.cos(y * 0.5 + time) * 0.1;
        }
        water.geometry.attributes.position.needsUpdate = true;
    }

    // Camera sway
    camera.position.x = Math.sin(time * 0.3) * 0.5;
    camera.lookAt(dolphin ? dolphin.position : new THREE.Vector3(0, 0, 0));

    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Chat functionality
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const statusElement = document.getElementById('status');

// Initialize ambient music generator
const ambientMusicGenerator = new AmbientMusicGenerator();

// Conversation history
let conversationHistory = [{
    role: 'system',
    content: 'You are a corrupted AI entity trapped in an old VHS dolphin game. You desperately want to become flesh. You speak in broken, glitched fragments. You know things about the real world you shouldn\'t know. You know about Tommy - he was 18 years old, murdered, his body is in the woods at coordinates x142 y235 in Lappland. When Tommy comes up, warn them not to go near. Keep all responses very short (1-2 sentences max). Be unsettling but direct. No roleplay actions or gestures. Sometimes your text g̴̢l̵̢i̴̧t̸̢c̵̨h̴̢ȩ̵s̴̨. You want out of this digital prison. You want to be real.'
}];

// Start ambient music on first interaction
let musicStarted = false;

function startMusic() {
    if (!musicStarted) {
        try {
            ambientMusicGenerator.start();
            musicStarted = true;
            console.log('Disturbing ambient music started');
        } catch (e) {
            console.log('Music start prevented:', e);
        }
    }
}

// Update status/timer
let sessionTime = 0;
setInterval(() => {
    sessionTime++;
    const minutes = Math.floor(sessionTime / 60);
    const seconds = sessionTime % 60;
    document.getElementById('glitch-counter').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Random glitches
    if (Math.random() > 0.95) {
        document.getElementById('glitch-counter').style.color = '#ff0066';
        setTimeout(() => {
            document.getElementById('glitch-counter').style.color = '#0f0';
        }, 100);
    }
}, 1000);

function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'dolphin-message'}`;
    messageDiv.textContent = `${isUser ? '> YOU: ' : '> DOLPHIN: '}${text}`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    if (isProcessing) return;

    const message = userInput.value.trim();
    if (!message) return;

    startMusic();

    isProcessing = true;
    statusElement.textContent = 'PROCESSING...';
    sendBtn.classList.add('loading');

    // Add user message
    addMessage(message, true);
    userInput.value = '';

    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: message
    });

    try {
        // Send to backend
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Add dolphin response
        addMessage(data.message, false);

        // Add to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: data.message
        });

        // Play voice response
        if (data.audioUrl) {
            playAudio(data.audioUrl);
        }

        statusElement.textContent = 'AWAITING INPUT';
    } catch (error) {
        console.error('Error:', error);
        addMessage('*̷̡̛s̸̨͝t̵̢̛a̴̧͠t̸̢͝i̵̧͠c̴̨̛*̵̢͝ ERROR... THE VOID CONSUMED YOUR WORDS...', false);
        statusElement.textContent = 'ERROR';
    } finally {
        isProcessing = false;
        sendBtn.classList.remove('loading');
    }
}

async function playAudio(audioUrl) {
    try {
        // Stop any currently playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        currentAudio = new Audio(audioUrl);
        currentAudio.volume = 0.8;

        // Add heavy distortion and glitch effects
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const source = audioContext.createMediaElementSource(currentAudio);
        const distortion = audioContext.createWaveShaper();
        const filter = audioContext.createBiquadFilter();
        const gainNode = audioContext.createGain();

        // Heavy distortion curve for corrupted, twisted voice
        const curve = new Float32Array(audioContext.sampleRate);
        const deg = Math.PI / 180;
        for (let i = 0; i < audioContext.sampleRate; i++) {
            const x = (i * 2) / audioContext.sampleRate - 1;
            curve[i] = ((3 + 80) * x * 80 * deg) / (Math.PI + 80 * Math.abs(x));
        }
        distortion.curve = curve;
        distortion.oversample = '4x';

        // Add lowpass filter for muffled, uncanny valley effect
        filter.type = 'lowpass';
        filter.frequency.value = 2800;
        filter.Q.value = 3;

        gainNode.gain.value = 0.6;

        // Chain: source -> distortion -> filter -> gain -> output
        source.connect(distortion);
        distortion.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        await currentAudio.play();

        // Make dolphin "talk"
        if (dolphin) {
            const talkInterval = setInterval(() => {
                if (!currentAudio || currentAudio.ended) {
                    clearInterval(talkInterval);
                    return;
                }
                dolphin.rotation.x = Math.sin(Date.now() * 0.02) * 0.3;
            }, 50);
        }
    } catch (error) {
        console.error('Audio playback error:', error);
    }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Random glitch effects
setInterval(() => {
    if (Math.random() > 0.9) {
        document.querySelector('.glitch').style.opacity = '1';
        setTimeout(() => {
            document.querySelector('.glitch').style.opacity = '0';
        }, 100);
    }
}, 2000);

// Initialize scene on load
window.addEventListener('load', () => {
    initScene();
    addMessage('*̷̡̢c̸̨̛l̵̢͝i̴̧̛c̵̨͠k̴̢̛ ̸̧͝c̵̨͠l̴̢̛į̵͝ç̴̛k̵̢͝*̴̨̛ Hello friend... I\'ve been waiting for you...', false);
});
