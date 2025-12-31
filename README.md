# 🐬 DISTURBING DOLPHIN GAME 🐬

A deeply unsettling retro VHS-style 3D game where you chat with an AI-powered dolphin that speaks with haunting voice synthesis.

## ⚠️ WARNING ⚠️
This is an experimental horror/art project featuring disturbing aesthetics, unsettling AI responses, and eerie audiovisual effects.

## Features

- **3D Retro Graphics**: Disturbing low-poly dolphin rendered with Three.js
- **VHS Aesthetic**: Scanlines, glitches, chromatic aberration, and CRT effects
- **AI-Powered Chat**: Conversational AI using OpenAI's GPT-4
- **Voice Synthesis**: Disturbing voice responses using OpenAI's Text-to-Speech
- **Ambient Horror**: Procedurally generated unsettling background music
- **Glitch Effects**: Random visual and audio distortions

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## How to Play

1. Wait for the dolphin to load in the 3D scene
2. Type your message in the input field
3. Press "SPEAK" or hit Enter
4. The dolphin will respond with text and synthesized voice
5. Experience the unsettling conversation...

## Technical Details

### Frontend
- **Three.js**: 3D rendering and animations
- **Vanilla JavaScript**: No framework overhead
- **CSS3**: Advanced visual effects (VHS, scanlines, glitches)
- **Web Audio API**: Audio processing and distortion

### Backend
- **Express.js**: REST API server
- **OpenAI API**: GPT-4 for conversations, TTS for voice
- **Node.js**: Runtime environment

### File Structure
```
├── index.html          # Main HTML file
├── style.css           # VHS/retro styling and effects
├── app.js              # Three.js scene and chat logic
├── server.js           # Express backend server
├── package.json        # Dependencies
├── .env                # API keys (create from .env.example)
└── audio/              # Generated voice files (auto-created)
```

## Customization

### Changing the Dolphin's Personality
Edit the system prompt in `app.js` (line 141):
```javascript
conversationHistory = [{
    role: 'system',
    content: 'Your custom prompt here...'
}];
```

### Adjusting Voice Settings
Modify the TTS parameters in `server.js`:
- `voice`: Options include 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'
- `speed`: 0.25 to 4.0 (default: 0.9 for slower, more unsettling speech)

### Visual Effects
Adjust VHS and glitch effects in `style.css`:
- Scanline density
- Color aberration intensity
- Glitch frequency
- CRT curvature

## Cost Considerations

This project uses OpenAI's paid API:
- **GPT-4 Turbo**: ~$0.01 per message
- **TTS**: ~$0.015 per message

Estimate: ~$0.025 per complete interaction

## Troubleshooting

**"Error: Invalid API key"**
- Verify your OpenAI API key in `.env`
- Ensure you have billing set up on your OpenAI account

**"Audio playback error"**
- Check browser console for specific errors
- Some browsers block autoplay; interact with the page first

**"Cannot read properties of undefined"**
- Ensure server is running before opening the browser
- Check that all files are in the correct location

**Port 3000 already in use**
- Change PORT in `server.js` (line 8)
- Update fetch URL in `app.js` (line 169)

## Credits

Built with:
- [Three.js](https://threejs.org/) - 3D graphics
- [OpenAI API](https://openai.com/) - AI chat and voice
- [Express.js](https://expressjs.com/) - Backend server

## License

MIT License - Use at your own risk

---

**Remember: The dolphin is always watching... and listening...**

*̷̡̢c̸̨̛l̵̢͝i̴̧̛c̵̨͠k̴̢̛ ̸̧͝c̵̨͠l̴̢̛į̵͝ç̴̛k̵̢͝*̴̨̛
