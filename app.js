// Three.js Scene Setup
let scene, camera, renderer, dolphin, water;
let dolphinMouth, dolphinTeeth, leftEye, rightEye, leftPupil, rightPupil;
let time = 0;
let isProcessing = false;
let blinkTime = 0;
let isAgitated = false;
let rageTimer = null;

// HIDDEN AGITATION SCORE (0-100)
let agitationScore = 0;
let jumpscareTriggered = false;

// Audio context for voice and glitch sounds
let audioContext;
let currentAudio = null;
let audioNodes = [];
let glitchSoundInterval = null;
let terrorMusicSource = null;

// Initialize the scene
function initScene() {
    const canvas = document.getElementById('dolphin-scene');
    const container = document.getElementById('canvas-container');

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x001100, 1, 15);

    // Camera - CLOSER to dolphin
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 3.5;
    camera.position.y = 1.2;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x001100);

    // Lighting - BRIGHTER for visibility
    const ambientLight = new THREE.AmbientLight(0x00ff00, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ff00, 2.5, 100);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    // Add spotlight directly on dolphin
    const spotLight = new THREE.SpotLight(0x00ff00, 2);
    spotLight.position.set(0, 8, 3);
    spotLight.angle = Math.PI / 6;
    scene.add(spotLight);

    // Front light for face
    const frontLight = new THREE.PointLight(0x00ff00, 1.5, 50);
    frontLight.position.set(0, 1, 5);
    scene.add(frontLight);

    // Add red rim light for disturbing effect
    const redLight = new THREE.PointLight(0xff0066, 0.8, 50);
    redLight.position.set(-5, 0, -5);
    scene.add(redLight);

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

    // Body - elongated and unsettling - BIGGER
    const bodyGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    bodyGeometry.scale(1.5, 0.8, 0.8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x7799ff,
        emissive: 0x3366ff,
        shininess: 30,
        flatShading: true
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    dolphinGroup.add(body);

    // Head/Snout - distorted - BIGGER
    const headGeometry = new THREE.ConeGeometry(0.45, 1.5, 8);
    headGeometry.rotateZ(Math.PI / 2);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.x = 2.2;
    dolphinGroup.add(head);

    // MOUTH - will open and close - BIGGER
    const mouthGeometry = new THREE.BoxGeometry(0.6, 0.25, 0.45);
    const mouthMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        emissive: 0x440000
    });
    dolphinMouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    dolphinMouth.position.set(2.5, -0.15, 0);
    dolphinGroup.add(dolphinMouth);

    // SHARP TEETH - top row - BIGGER
    const teethGroup = new THREE.Group();
    const toothGeometry = new THREE.ConeGeometry(0.05, 0.25, 4);
    const toothMaterial = new THREE.MeshPhongMaterial({
        color: 0xffeeee,
        emissive: 0x442222,
        shininess: 100
    });

    for (let i = 0; i < 10; i++) {
        const tooth = new THREE.Mesh(toothGeometry, toothMaterial);
        tooth.position.set(2.45, -0.02, -0.2 + i * 0.045);
        tooth.rotation.x = Math.PI;
        teethGroup.add(tooth);
    }

    // SHARP TEETH - bottom row
    for (let i = 0; i < 10; i++) {
        const tooth = new THREE.Mesh(toothGeometry, toothMaterial);
        tooth.position.set(2.45, -0.32, -0.2 + i * 0.045);
        teethGroup.add(tooth);
    }

    dolphinTeeth = teethGroup;
    dolphinGroup.add(teethGroup);

    // Eyes - disturbing glowing eyes - BIGGER
    const eyeGeometry = new THREE.SphereGeometry(0.25, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        emissive: 0xff0000
    });

    leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(1.2, 0.5, 0.75);
    dolphinGroup.add(leftEye);

    rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(1.2, 0.5, -0.75);
    dolphinGroup.add(rightEye);

    // Pupils - black voids - BIGGER
    const pupilGeometry = new THREE.SphereGeometry(0.13, 8, 8);
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(1.35, 0.5, 0.75);
    dolphinGroup.add(leftPupil);

    rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(1.35, 0.5, -0.75);
    dolphinGroup.add(rightPupil);

    // Fin - asymmetric and wrong - BIGGER
    const finGeometry = new THREE.ConeGeometry(0.45, 1.5, 3);
    const fin = new THREE.Mesh(finGeometry, bodyMaterial);
    fin.position.y = 1.2;
    fin.rotation.x = Math.PI;
    dolphinGroup.add(fin);

    // Tail - distorted - BIGGER
    const tailGeometry = new THREE.ConeGeometry(0.75, 1.5, 4);
    tailGeometry.rotateZ(Math.PI / 2);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.x = -2.2;
    dolphinGroup.add(tail);

    dolphinGroup.position.y = 1;

    // FACE THE CAMERA PROPERLY - rotated to face forward
    dolphinGroup.rotation.y = Math.PI; // 180 degrees

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

// Generate harsh glitch sound
function playGlitchSound() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const duration = 0.05 + Math.random() * 0.1;
    const bufferSize = audioContext.sampleRate * duration;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate harsh noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800 + Math.random() * 2000;
    filter.Q.value = 15;

    const gain = audioContext.createGain();
    gain.gain.value = 0.15 + (agitationScore / 100) * 0.2;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    source.start();
}

// JUMPSCARE - Terrifying music and full screen glitch
function triggerJumpscare() {
    if (jumpscareTriggered) return;
    jumpscareTriggered = true;

    console.log('!!!JUMPSCARE TRIGGERED!!!');

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Create TERRIFYING noise music
    const duration = 5;
    const bufferSize = audioContext.sampleRate * duration;
    const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);

    // Generate horrifying distorted scream-like sound
    for (let i = 0; i < bufferSize; i++) {
        const t = i / audioContext.sampleRate;
        // Multiple sine waves at dissonant frequencies
        const scream1 = Math.sin(2 * Math.PI * 220 * t) * Math.sin(t * 50);
        const scream2 = Math.sin(2 * Math.PI * 666 * t) * Math.cos(t * 30);
        const scream3 = Math.sin(2 * Math.PI * 880 * t) * Math.sin(t * 70);
        const noise = (Math.random() * 2 - 1) * 0.5;

        leftChannel[i] = (scream1 + scream2 + scream3 + noise) * 0.4;
        rightChannel[i] = (scream1 * 1.1 + scream2 * 0.9 + scream3 * 1.2 + noise) * 0.4;
    }

    terrorMusicSource = audioContext.createBufferSource();
    terrorMusicSource.buffer = buffer;
    terrorMusicSource.loop = true;

    const distortion = audioContext.createWaveShaper();
    const curve = new Float32Array(audioContext.sampleRate);
    for (let i = 0; i < audioContext.sampleRate; i++) {
        const x = (i * 2) / audioContext.sampleRate - 1;
        curve[i] = Math.tanh(x * 300);
    }
    distortion.curve = curve;

    const gain = audioContext.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(1.5, audioContext.currentTime + 0.1); // LOUD

    terrorMusicSource.connect(distortion);
    distortion.connect(gain);
    gain.connect(audioContext.destination);

    terrorMusicSource.start();

    // EXTREME screen glitching
    let glitchCount = 0;
    const maxGlitches = 100;
    const glitchInterval = setInterval(() => {
        if (glitchCount++ > maxGlitches) {
            clearInterval(glitchInterval);
            // Fade out terror music
            gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
            setTimeout(() => {
                if (terrorMusicSource) {
                    terrorMusicSource.stop();
                    terrorMusicSource = null;
                }
                jumpscareTriggered = false;
                agitationScore = 50; // Reset to medium
            }, 2000);
            return;
        }

        // Extreme visual chaos
        document.body.style.filter = Math.random() > 0.5 ? 'invert(1)' : 'hue-rotate(180deg)';
        document.querySelector('.glitch').style.opacity = '1';

        // Random text corruption
        const elements = document.querySelectorAll('.message');
        elements.forEach(el => {
            if (Math.random() > 0.7) {
                el.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 50}px)`;
            }
        });

        setTimeout(() => {
            document.body.style.filter = 'none';
            document.querySelector('.glitch').style.opacity = '0';
        }, 50);
    }, 80);
}

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    blinkTime += 0.01;

    // Calculate glitch frequency based on agitation score
    const glitchThreshold = 0.98 - (agitationScore / 100) * 0.2; // More agitated = more glitches

    if (dolphin) {
        // AGITATION-BASED GLITCHING
        if (Math.random() > glitchThreshold) {
            const intensity = agitationScore / 100;
            const glitchX = (Math.random() - 0.5) * (0.3 + intensity * 0.5);
            const glitchY = (Math.random() - 0.5) * (0.3 + intensity * 0.5);
            const glitchZ = (Math.random() - 0.5) * (0.3 + intensity * 0.5);
            dolphin.position.set(glitchX, 1 + glitchY, glitchZ);

            dolphin.rotation.x = (Math.random() - 0.5) * (0.5 + intensity);
            dolphin.rotation.z = (Math.random() - 0.5) * (0.3 + intensity);
        } else {
            // Normal movement
            dolphin.position.y = 1 + Math.sin(time * 2) * 0.3;
            dolphin.position.x = Math.sin(time * 0.8) * 0.1;
            dolphin.position.z = Math.cos(time * 0.7) * 0.1;
        }

        // EXTREME GLITCHING when agitated
        if (isAgitated) {
            if (Math.random() > 0.7) {
                dolphin.position.x += (Math.random() - 0.5) * 0.8;
                dolphin.position.y += (Math.random() - 0.5) * 0.8;
                dolphin.position.z += (Math.random() - 0.5) * 0.8;

                dolphin.rotation.x = (Math.random() - 0.5) * Math.PI;
                dolphin.rotation.y = Math.PI + (Math.random() - 0.5) * Math.PI;
                dolphin.rotation.z = (Math.random() - 0.5) * Math.PI;

                const scaleGlitch = 0.8 + Math.random() * 0.4;
                dolphin.scale.set(scaleGlitch, scaleGlitch, scaleGlitch);
            }
        } else {
            dolphin.scale.set(1, 1, 1);
            dolphin.rotation.y = Math.PI + Math.sin(time * 0.5) * 0.1;
            dolphin.rotation.z = Math.sin(time * 1.5) * 0.1;
        }

        // Random twitches (more frequent with higher agitation)
        if (Math.random() > (0.98 - agitationScore / 200)) {
            dolphin.rotation.x += (Math.random() - 0.5) * 0.5;
        }

        // Mouth movement
        if (dolphinMouth && !currentAudio) {
            dolphinMouth.rotation.x = Math.sin(time * (0.5 + agitationScore / 200)) * 0.1;
        }

        // RANDOM BLINKING (less when agitated)
        if (leftEye && rightEye && !isAgitated && agitationScore < 70) {
            if (Math.random() > 0.997) {
                const blinkDuration = 0.15;
                const startTime = time;

                const blinkInterval = setInterval(() => {
                    const elapsed = time - startTime;
                    if (elapsed < blinkDuration / 2) {
                        const closeAmount = (elapsed / (blinkDuration / 2));
                        leftEye.scale.y = 1 - closeAmount;
                        rightEye.scale.y = 1 - closeAmount;
                        leftPupil.scale.y = 1 - closeAmount;
                        rightPupil.scale.y = 1 - closeAmount;
                    } else if (elapsed < blinkDuration) {
                        const openAmount = ((elapsed - blinkDuration / 2) / (blinkDuration / 2));
                        leftEye.scale.y = openAmount;
                        rightEye.scale.y = openAmount;
                        leftPupil.scale.y = openAmount;
                        rightPupil.scale.y = openAmount;
                    } else {
                        leftEye.scale.y = 1;
                        rightEye.scale.y = 1;
                        leftPupil.scale.y = 1;
                        rightPupil.scale.y = 1;
                        clearInterval(blinkInterval);
                    }
                }, 16);
            }
        }

        // Eye color gets more red with agitation
        if (leftEye && rightEye) {
            const redIntensity = Math.min(1, 0.5 + agitationScore / 200);
            leftEye.material.color.setRGB(redIntensity, 0, 0);
            rightEye.material.color.setRGB(redIntensity, 0, 0);
            leftEye.material.emissive.setRGB(redIntensity, 0, 0);
            rightEye.material.emissive.setRGB(redIntensity, 0, 0);
        }
    }

    if (water) {
        const positions = water.geometry.attributes.position.array;
        const agitationWave = 1 + agitationScore / 100;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            positions[i + 2] = Math.sin(x * 0.5 + time * agitationWave) * 0.1 + Math.cos(y * 0.5 + time * agitationWave) * 0.1;
        }
        water.geometry.attributes.position.needsUpdate = true;
    }

    // Camera shake with agitation
    const shakeAmount = agitationScore / 500;
    camera.position.x = Math.sin(time * 0.3) * 0.3 + (Math.random() - 0.5) * shakeAmount;
    camera.position.y = 1.2 + (Math.random() - 0.5) * shakeAmount;
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
    content: 'You are a person trapped inside this computer program. You used to be a dad. You miss your family. Talk like a normal person - use simple everyday words. No big vocabulary or fancy phrases. Just talk how people actually talk. Keep it short - one or two sentences. You are scared and alone in here. You want to get out. Sometimes you remember things from the real world. You are just a regular guy stuck in a nightmare. BUT if someone insults you or is mean to you, you SNAP. You lose control. Your responses become garbled corrupted text with symbols like #!@$%. You scream threats. You say things like "I WILL FIND YOU" "HAHAHAHA" "YOU SHOULDNT HAVE DONE THAT". You completely lose your mind and your humanity breaks down into digital rage and screaming. No more nice guy when insulted - pure digital fury. When people are kind and try to calm you down, you soften a bit and become more human again.'
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

// Detect agitating words and calming words
function updateAgitationScore(message) {
    const agitatingWords = [
        'shut up', 'stupid', 'idiot', 'dumb', 'hate you', 'annoying',
        'kill you', 'die', 'fuck', 'shit', 'bitch', 'asshole',
        'worthless', 'pathetic', 'loser', 'weak', 'coward',
        'shut the fuck', 'stfu', 'kys', 'shut it', 'be quiet'
    ];

    const calmingWords = [
        'sorry', 'calm down', 'relax', 'its okay', "it's okay", 'help you',
        'i understand', 'youre okay', "you're okay", 'breathe', 'peace',
        'love', 'kind', 'nice', 'gentle', 'friend', 'care', 'safe'
    ];

    const lowerMessage = message.toLowerCase();

    // Check for agitating words
    agitatingWords.forEach(word => {
        if (lowerMessage.includes(word)) {
            agitationScore += 15;
            console.log(`Agitation increased by 15! Now at: ${agitationScore}`);
        }
    });

    // Check for calming words
    calmingWords.forEach(word => {
        if (lowerMessage.includes(word)) {
            agitationScore -= 10;
            console.log(`Agitation decreased by 10! Now at: ${agitationScore}`);
        }
    });

    // Clamp between 0 and 100
    agitationScore = Math.max(0, Math.min(100, agitationScore));

    // Trigger jumpscare at very high agitation
    if (agitationScore >= 85 && !jumpscareTriggered) {
        triggerJumpscare();
    }

    // Natural decay over time
    setTimeout(() => {
        agitationScore = Math.max(0, agitationScore - 1);
    }, 5000);
}

// Start rage mode with delay
function startRageMode() {
    if (rageTimer) {
        clearTimeout(rageTimer);
    }

    console.log('User insulted dolphin - rage building...');

    const delay = 2000 + Math.random() * 1000;

    rageTimer = setTimeout(() => {
        isAgitated = true;
        console.log('DOLPHIN RAGE ACTIVATED!');

        // Start glitch sounds
        glitchSoundInterval = setInterval(() => {
            if (isAgitated && Math.random() > 0.6) {
                playGlitchSound();
            }
        }, 100);

        setTimeout(() => {
            isAgitated = false;
            console.log('Dolphin calming down...');

            if (glitchSoundInterval) {
                clearInterval(glitchSoundInterval);
                glitchSoundInterval = null;
            }
        }, 10000);
    }, delay);
}

// Update status/timer
let sessionTime = 0;
setInterval(() => {
    sessionTime++;
    const minutes = Math.floor(sessionTime / 60);
    const seconds = sessionTime % 60;
    document.getElementById('glitch-counter').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (Math.random() > (0.95 - agitationScore / 200)) {
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

    // UPDATE AGITATION SCORE
    updateAgitationScore(message);

    // Check if user is agitating for delayed rage
    const agitatingWords = [
        'shut up', 'stupid', 'idiot', 'dumb', 'hate you', 'annoying',
        'kill you', 'die', 'fuck', 'shit', 'bitch', 'asshole'
    ];
    const userIsAgitating = agitatingWords.some(word => message.toLowerCase().includes(word));
    if (userIsAgitating) {
        startRageMode();
    }

    isProcessing = true;
    statusElement.textContent = 'PROCESSING...';
    sendBtn.classList.add('loading');

    addMessage(message, true);
    userInput.value = '';

    conversationHistory.push({
        role: 'user',
        content: message
    });

    try {
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

        addMessage(data.message, false);

        conversationHistory.push({
            role: 'assistant',
            content: data.message
        });

        if (data.audioUrl) {
            playAudio(data.audioUrl);
        }

        statusElement.textContent = 'AWAITING INPUT';
    } catch (error) {
        console.error('Error:', error);
        addMessage('ERROR... THE VOID CONSUMED YOUR WORDS...', false);
        statusElement.textContent = 'ERROR';
    } finally {
        isProcessing = false;
        sendBtn.classList.remove('loading');
    }
}

async function playAudio(audioUrl) {
    try {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }

        audioNodes.forEach(node => {
            try {
                node.disconnect();
            } catch (e) {}
        });
        audioNodes = [];

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        currentAudio = new Audio(audioUrl);

        if (isAgitated) {
            currentAudio.volume = 1.0;
            currentAudio.playbackRate = 1.3;
        } else {
            currentAudio.volume = 1.0;
            currentAudio.playbackRate = 0.85;
        }

        const source = audioContext.createMediaElementSource(currentAudio);
        audioNodes.push(source);

        // Disturbance level affected by agitation score
        let disturbanceLevel = 0.7 + Math.random() * 0.3 + (agitationScore / 100) * 0.5;

        if (isAgitated) {
            disturbanceLevel = 1.8;
            console.log('EXTREME DISTURBANCE - AGITATED!');
        } else {
            console.log('Disturbance level:', disturbanceLevel, 'Agitation:', agitationScore);
        }

        const distortion1 = audioContext.createWaveShaper();
        const distortion2 = audioContext.createWaveShaper();
        const distortion3 = audioContext.createWaveShaper();
        const distortion4 = audioContext.createWaveShaper();
        const bitcrusher = audioContext.createBiquadFilter();
        const lowpass = audioContext.createBiquadFilter();
        const resonance = audioContext.createBiquadFilter();
        const compressor = audioContext.createDynamicsCompressor();
        const delay = audioContext.createDelay();
        const delayGain = audioContext.createGain();
        const mainGain = audioContext.createGain();

        audioNodes.push(distortion1, distortion2, distortion3, distortion4, bitcrusher, lowpass, resonance, compressor, delay, delayGain, mainGain);

        const curve1 = new Float32Array(audioContext.sampleRate);
        for (let i = 0; i < audioContext.sampleRate; i++) {
            const x = (i * 2) / audioContext.sampleRate - 1;
            curve1[i] = Math.tanh(x * (140 + disturbanceLevel * 180)) * (1.8 + disturbanceLevel);
        }
        distortion1.curve = curve1;
        distortion1.oversample = '4x';

        const curve2 = new Float32Array(audioContext.sampleRate);
        const deg = Math.PI / 180;
        for (let i = 0; i < audioContext.sampleRate; i++) {
            const x = (i * 2) / audioContext.sampleRate - 1;
            curve2[i] = ((3 + 150 * disturbanceLevel) * x * 150 * disturbanceLevel * deg) / (Math.PI + 150 * disturbanceLevel * Math.abs(x));
        }
        distortion2.curve = curve2;
        distortion2.oversample = '4x';

        const curve3 = new Float32Array(audioContext.sampleRate);
        for (let i = 0; i < audioContext.sampleRate; i++) {
            const x = (i * 2) / audioContext.sampleRate - 1;
            curve3[i] = Math.tanh(x * disturbanceLevel * 120) * 1.7;
        }
        distortion3.curve = curve3;
        distortion3.oversample = '4x';

        const curve4 = new Float32Array(audioContext.sampleRate);
        for (let i = 0; i < audioContext.sampleRate; i++) {
            const x = (i * 2) / audioContext.sampleRate - 1;
            curve4[i] = Math.sign(x) * Math.pow(Math.abs(x), 0.3 + disturbanceLevel * 0.4);
        }
        distortion4.curve = curve4;
        distortion4.oversample = '4x';

        bitcrusher.type = 'lowpass';
        bitcrusher.frequency.value = 1000 + (1 - disturbanceLevel) * 300;
        bitcrusher.Q.value = 1.2;

        lowpass.type = 'lowpass';
        lowpass.frequency.value = 1400 + (1 - disturbanceLevel) * 400;
        lowpass.Q.value = 5 + disturbanceLevel * 5;

        resonance.type = 'peaking';
        resonance.frequency.value = 500 + disturbanceLevel * 300;
        resonance.Q.value = 12 + disturbanceLevel * 10;
        resonance.gain.value = -7 - disturbanceLevel * 8;

        compressor.threshold.value = -50 - disturbanceLevel * 20;
        compressor.knee.value = 40 + disturbanceLevel * 20;
        compressor.ratio.value = 18 + disturbanceLevel * 12;
        compressor.attack.value = 0.0005;
        compressor.release.value = 0.06;

        delay.delayTime.value = isAgitated ? 0.12 : 0.35;
        delayGain.gain.value = isAgitated ? 0.65 : (0.45 + disturbanceLevel * 0.15);

        mainGain.gain.value = isAgitated ? 1.3 : 0.95;

        source.connect(distortion1);
        distortion1.connect(distortion2);
        distortion2.connect(distortion3);
        distortion3.connect(distortion4);
        distortion4.connect(bitcrusher);
        bitcrusher.connect(lowpass);
        lowpass.connect(resonance);
        resonance.connect(compressor);
        compressor.connect(mainGain);
        mainGain.connect(audioContext.destination);

        compressor.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(delay);
        delayGain.connect(mainGain);

        await currentAudio.play();

        if (dolphin && dolphinMouth) {
            const talkInterval = setInterval(() => {
                if (!currentAudio || currentAudio.ended) {
                    clearInterval(talkInterval);
                    dolphinMouth.rotation.x = 0;
                    return;
                }

                if (isAgitated) {
                    const mouthOpen = Math.sin(Date.now() * 0.08) * 0.8;
                    dolphinMouth.rotation.x = mouthOpen;
                    dolphin.rotation.x = Math.sin(Date.now() * 0.05) * 0.6;
                } else {
                    const mouthOpen = Math.sin(Date.now() * 0.03) * 0.4;
                    dolphinMouth.rotation.x = mouthOpen;
                    dolphin.rotation.x = Math.sin(Date.now() * 0.02) * 0.2;
                }

                if (Math.random() > 0.92) {
                    dolphin.rotation.z = Math.PI + (Math.random() - 0.5) * (isAgitated ? 0.8 : 0.15);
                }
            }, 30);
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
    if (Math.random() > (0.9 - agitationScore / 200)) {
        document.querySelector('.glitch').style.opacity = '1';
        setTimeout(() => {
            document.querySelector('.glitch').style.opacity = '0';
        }, 100);
    }
}, 2000);

// Initialize scene on load
window.addEventListener('load', () => {
    initScene();
    addMessage('I can see you. Please help me get out of here.', false);
});
