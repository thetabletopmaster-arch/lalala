const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir);
}

// Serve audio files
app.use('/audio', express.static(audioDir));

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        console.log('Received chat request...');

        // Get chat completion from OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
            max_tokens: 150,
            temperature: 1.2, // Higher temperature for more unsettling responses
        });

        const assistantMessage = completion.choices[0].message.content;
        console.log('OpenAI response:', assistantMessage);

        // Generate speech using OpenAI TTS
        console.log('Generating speech...');
        const speechResponse = await openai.audio.speech.create({
            model: 'tts-1',
            voice: 'onyx', // Deeper, more unsettling voice
            input: assistantMessage,
            speed: 0.9 // Slightly slower for more disturbing effect
        });

        // Save audio file
        const audioFileName = `dolphin_${Date.now()}.mp3`;
        const audioPath = path.join(audioDir, audioFileName);
        const buffer = Buffer.from(await speechResponse.arrayBuffer());
        fs.writeFileSync(audioPath, buffer);

        console.log('Audio saved:', audioFileName);

        // Return response
        res.json({
            message: assistantMessage,
            audioUrl: `/audio/${audioFileName}`
        });

        // Clean up old audio files (older than 1 hour)
        setTimeout(() => {
            const files = fs.readdirSync(audioDir);
            const oneHourAgo = Date.now() - 3600000;

            files.forEach(file => {
                const filePath = path.join(audioDir, file);
                const stats = fs.statSync(filePath);
                if (stats.mtimeMs < oneHourAgo) {
                    fs.unlinkSync(filePath);
                    console.log('Cleaned up old audio file:', file);
                }
            });
        }, 1000);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Failed to process request',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'The dolphin is watching...' });
});

app.listen(PORT, () => {
    console.log(`\n╔═══════════════════════════════════════════════╗`);
    console.log(`║  🐬 DISTURBING DOLPHIN GAME SERVER ACTIVE 🐬  ║`);
    console.log(`╚═══════════════════════════════════════════════╝\n`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser\n`);
    console.log(`Make sure OPENAI_API_KEY is set in .env file\n`);
});
