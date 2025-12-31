// Procedural Ambient Horror Music Generator
// This creates disturbing background music using Web Audio API

class AmbientMusicGenerator {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.nodes = [];
    }

    init() {
        if (this.audioContext) return;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('Ambient music generator initialized');
    }

    start() {
        if (this.isPlaying) return;

        this.init();
        this.isPlaying = true;

        // Create multiple layers of disturbing sounds
        this.createDroneLayer();
        this.createDissonantChords();
        this.createRandomGlitches();
        this.createSubBass();

        console.log('Disturbing ambient music started');
    }

    stop() {
        this.nodes.forEach(node => {
            try {
                node.stop();
            } catch (e) {
                // Ignore errors from already stopped nodes
            }
        });
        this.nodes = [];
        this.isPlaying = false;
    }

    createDroneLayer() {
        const now = this.audioContext.currentTime;

        // Low frequency drone
        const oscillator1 = this.audioContext.createOscillator();
        oscillator1.type = 'sine';
        oscillator1.frequency.value = 55; // A1

        const oscillator2 = this.audioContext.createOscillator();
        oscillator2.type = 'sine';
        oscillator2.frequency.value = 58.27; // A#1 (dissonant)

        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(0.1, now + 2);

        // Add some distortion
        const waveshaper = this.audioContext.createWaveShaper();
        waveshaper.curve = this.makeDistortionCurve(50);

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(waveshaper);
        waveshaper.connect(this.audioContext.destination);

        oscillator1.start(now);
        oscillator2.start(now);

        this.nodes.push(oscillator1, oscillator2);

        // Modulate the drone
        setInterval(() => {
            if (!this.isPlaying) return;
            const randomDetune = (Math.random() - 0.5) * 10;
            oscillator1.detune.setTargetAtTime(
                randomDetune,
                this.audioContext.currentTime,
                0.5
            );
        }, 3000);
    }

    createDissonantChords() {
        const playChord = () => {
            if (!this.isPlaying) return;

            const now = this.audioContext.currentTime;
            const baseFreq = 130.81 + (Math.random() - 0.5) * 20; // C3-ish

            // Disturbing intervals
            const intervals = [
                0,
                Math.random() > 0.5 ? 1.05946 : 1.06667, // Minor second / augmented unison
                Math.random() > 0.5 ? 1.33484 : 1.41421  // Perfect fourth / Tritone
            ];

            const oscillators = intervals.map(interval => {
                const osc = this.audioContext.createOscillator();
                osc.type = Math.random() > 0.5 ? 'triangle' : 'sawtooth';
                osc.frequency.value = baseFreq * interval;

                const gain = this.audioContext.createGain();
                gain.gain.value = 0;
                gain.gain.linearRampToValueAtTime(0.03, now + 0.5);
                gain.gain.linearRampToValueAtTime(0, now + 4);

                // Add filter for muffled effect
                const filter = this.audioContext.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 400 + Math.random() * 200;

                osc.connect(gain);
                gain.connect(filter);
                filter.connect(this.audioContext.destination);

                osc.start(now);
                osc.stop(now + 4);

                return osc;
            });

            // Schedule next chord
            const nextTime = 4000 + Math.random() * 6000;
            setTimeout(playChord, nextTime);
        };

        setTimeout(playChord, 2000);
    }

    createRandomGlitches() {
        const playGlitch = () => {
            if (!this.isPlaying) return;

            const now = this.audioContext.currentTime;

            const noise = this.audioContext.createBufferSource();
            const bufferSize = this.audioContext.sampleRate * 0.1;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.1;
            }

            noise.buffer = buffer;

            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000 + Math.random() * 3000;
            filter.Q.value = 10;

            const gain = this.audioContext.createGain();
            gain.gain.value = Math.random() * 0.05;

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioContext.destination);

            noise.start(now);
            noise.stop(now + 0.1);

            // Schedule next glitch
            const nextTime = 5000 + Math.random() * 15000;
            setTimeout(playGlitch, nextTime);
        };

        setTimeout(playGlitch, 5000);
    }

    createSubBass() {
        const now = this.audioContext.currentTime;

        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 40; // Sub bass

        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0.15;

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(now);
        this.nodes.push(oscillator);

        // Slowly modulate the sub bass
        setInterval(() => {
            if (!this.isPlaying) return;
            const targetFreq = 35 + Math.random() * 15;
            oscillator.frequency.linearRampToValueAtTime(
                targetFreq,
                this.audioContext.currentTime + 2
            );
        }, 8000);
    }

    makeDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }

        return curve;
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmbientMusicGenerator;
}
