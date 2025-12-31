# 🐬 COMPLETE BEGINNER'S SETUP GUIDE 🐬

## Complete Step-by-Step Tutorial for Absolute Beginners

This guide assumes you're starting from scratch. Follow every step carefully.

---

## 📋 PART 1: INSTALL REQUIRED SOFTWARE

### Step 1: Install Node.js

**What is Node.js?** It's the software that runs JavaScript on your computer (outside of a web browser).

**Download & Install:**

1. Go to: **https://nodejs.org/**
2. Click the **green button** that says "Download Node.js (LTS)" - this is version 20.x or higher
3. Run the downloaded installer
4. Click "Next" through all the steps (keep all default settings)
5. Click "Install"
6. Wait for installation to complete
7. Click "Finish"

**Verify Installation:**

Open your terminal/command prompt:
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
- **Linux**: Press `Ctrl + Alt + T`

Type this command and press Enter:
```bash
node --version
```

You should see something like: `v20.11.0`

Then type:
```bash
npm --version
```

You should see something like: `10.2.4`

✅ If you see version numbers, you're ready to continue!
❌ If you get "command not found", restart your computer and try again.

---

## 📂 PART 2: NAVIGATE TO THE PROJECT FOLDER

### Step 2: Open Terminal in Project Folder

**Option A - Easy Way (Windows):**
1. Open File Explorer
2. Navigate to the folder: `/home/user/lalala`
3. Click in the address bar at the top
4. Type `cmd` and press Enter
5. A terminal will open in that folder

**Option B - Easy Way (Mac):**
1. Open Finder
2. Navigate to the folder: `/home/user/lalala`
3. Right-click the folder
4. Hold `Option` key
5. Click "Open in Terminal"

**Option C - Manual Way (All Systems):**

Open terminal and type:
```bash
cd /home/user/lalala
```

**Verify you're in the right place:**
```bash
pwd
```

You should see: `/home/user/lalala`

Type:
```bash
ls
```

You should see files like: `index.html`, `server.js`, `package.json`, etc.

---

## 📦 PART 3: INSTALL PROJECT DEPENDENCIES

### Step 3: Install Required Packages

**What are dependencies?** Libraries and tools this project needs to work.

In your terminal (make sure you're in `/home/user/lalala`), type:

```bash
npm install
```

Then press Enter.

**What will happen:**
- You'll see a progress bar
- Text will scroll showing packages being downloaded
- This takes 30-60 seconds depending on your internet speed
- You'll see "added X packages" when done

**You should see something like:**
```
added 150 packages, and audited 151 packages in 45s
```

✅ **Success!** A new folder called `node_modules` was created with all the code libraries.

❌ **If you get errors:**
- Make sure you have internet connection
- Make sure you're in the right folder (check with `pwd`)
- Try running `npm cache clean --force` then `npm install` again

---

## 🔑 PART 4: VERIFY API KEY IS SET UP

### Step 4: Check Environment File

The API key has already been configured for you in the `.env` file.

**To verify it's there (optional):**

**Windows:**
```bash
type .env
```

**Mac/Linux:**
```bash
cat .env
```

You should see:
```
OPENAI_API_KEY=sk-proj-KLbFEAcznsLoc...
```

✅ If you see this, you're good to go!

---

## 🚀 PART 5: START THE SERVER

### Step 5: Run the Server

In your terminal (still in `/home/user/lalala`), type:

```bash
npm start
```

Press Enter.

**What you should see:**
```
╔═══════════════════════════════════════════════╗
║  🐬 DISTURBING DOLPHIN GAME SERVER ACTIVE 🐬  ║
╚═══════════════════════════════════════════════╝

Server running on http://localhost:3000
Open http://localhost:3000 in your browser
```

✅ **Success!** Your server is now running!

**IMPORTANT:**
- **DO NOT CLOSE THIS TERMINAL WINDOW!**
- The server must keep running for the game to work
- You'll see logs appear here as you interact with the game

❌ **If you get "Port 3000 already in use":**
- Something else is using port 3000
- See troubleshooting section below

---

## 🌐 PART 6: OPEN THE GAME IN YOUR BROWSER

### Step 6: Launch the Game

1. Open your web browser (Chrome, Firefox, Edge, Safari - any will work)
2. In the address bar, type exactly:
   ```
   http://localhost:3000
   ```
3. Press Enter

**What you should see:**
- A black/green screen with VHS effects
- Text: "SPEAK TO THE DOLPHIN"
- A 3D blue dolphin with glowing red eyes
- Scanlines and glitch effects
- A text input box at the bottom
- A timer counting up in the corner

✅ **It worked!** You can now interact with the dolphin.

---

## 🎮 PART 7: PLAY THE GAME

### Step 7: Chat with the Dolphin

1. **Click** anywhere on the page (this allows audio to play)
2. **Type** a message in the input box at the bottom
   - Example: "Hello dolphin"
   - Example: "Who are you?"
   - Example: "Tell me something disturbing"
3. **Click** the "SPEAK" button or press Enter
4. **Wait** 3-5 seconds for the response

**What happens:**
- Your message appears in green
- The dolphin's response appears in pink/red
- You'll hear a voice speaking the response
- Disturbing ambient music starts playing
- The dolphin animates as it "talks"

5. **Continue chatting** - type another message and repeat!

---

## 🎧 PART 8: OPTIMIZE YOUR EXPERIENCE

### Step 8: Best Settings for Maximum Horror

**Audio:**
- Use headphones for immersive experience
- Turn volume to 50-70%
- Make sure your browser isn't muted

**Visual:**
- Use fullscreen mode (press F11 on most browsers)
- Dim your room lights
- Adjust monitor brightness if effects are too subtle

**Browser Permissions:**
- If audio doesn't play, check that your browser allows audio
- Look for a speaker icon in the address bar and click "Allow"

---

## 🛑 PART 9: STOPPING THE GAME

### Step 9: How to Stop

**To stop the server:**
1. Go back to the terminal window where `npm start` is running
2. Press `Ctrl + C` (hold Control and press C)
3. You'll see the terminal prompt return

**To restart:**
- Just run `npm start` again

**The browser:**
- Simply close the browser tab
- No special shutdown needed

---

## ⚠️ TROUBLESHOOTING COMMON ISSUES

### Problem: "npm: command not found"
**Solution:** Node.js isn't installed or not in your PATH
- Reinstall Node.js
- Restart your computer
- Try opening a NEW terminal window

### Problem: "Cannot find module 'express'"
**Solution:** Dependencies weren't installed
- Run `npm install` again
- Make sure you're in the `/home/user/lalala` folder

### Problem: "Error: listen EADDRINUSE :::3000"
**Solution:** Port 3000 is already being used
- Close any other servers running on your computer
- Or edit `server.js` and change `PORT = 3000` to `PORT = 3001`
- Then use `http://localhost:3001` instead

### Problem: "OpenAI API error" or "401 Unauthorized"
**Solution:** API key issue
- Check that `.env` file exists
- Make sure the API key is correct
- Make sure you have billing set up at https://platform.openai.com/account/billing

### Problem: No audio playing
**Solution:** Browser autoplay restrictions
- Click anywhere on the page first
- Check browser volume (click speaker icon in tab)
- Check system volume
- Try a different browser

### Problem: Dolphin not responding / "Failed to fetch"
**Solution:** Server isn't running or wrong URL
- Make sure `npm start` is running in terminal
- Check you're using `http://localhost:3000` (not https)
- Check your firewall isn't blocking localhost

### Problem: Page won't load / blank screen
**Solution:**
- Check browser console (press F12, click "Console" tab, look for errors)
- Make sure all files are present (run `ls` in terminal)
- Try clearing browser cache (Ctrl+Shift+Delete)

---

## 📊 EXPECTED COSTS

Each conversation with the dolphin costs approximately **$0.025** (2.5 cents):
- GPT-4 Turbo: ~$0.01 per message
- Text-to-Speech: ~$0.015 per response

**Example:**
- 10 messages = ~$0.25 (25 cents)
- 100 messages = ~$2.50
- 1000 messages = ~$25

Make sure you have billing set up and funds in your OpenAI account!

---

## 📁 PROJECT FILE STRUCTURE

```
/home/user/lalala/
├── index.html              ← Main game page (HTML structure)
├── style.css               ← VHS styling and visual effects
├── app.js                  ← 3D dolphin and chat logic
├── ambient-generator.js    ← Procedural horror music
├── server.js               ← Backend server (handles AI)
├── package.json            ← Project configuration
├── .env                    ← Your API key (SECRET - don't share!)
├── .env.example            ← Template for API key
├── .gitignore              ← Files to ignore in git
├── README.md               ← Technical documentation
├── setup.sh                ← Automated setup script
├── node_modules/           ← Installed dependencies (auto-created)
└── audio/                  ← Generated voice files (auto-created)
```

---

## 🎯 QUICK START SUMMARY

For next time, here's the quick version:

```bash
# 1. Navigate to project
cd /home/user/lalala

# 2. Start server
npm start

# 3. Open browser to:
http://localhost:3000

# 4. Start chatting!
```

---

## 🆘 NEED MORE HELP?

**Check the logs:**
- Look at the terminal where `npm start` is running
- Any errors will appear there in red

**Check browser console:**
- Press F12 in your browser
- Click "Console" tab
- Look for red error messages

**Start fresh:**
```bash
# Stop the server (Ctrl+C)
# Delete node_modules
rm -rf node_modules
# Reinstall everything
npm install
# Start again
npm start
```

---

## ✅ CHECKLIST

Before asking for help, make sure:
- [ ] Node.js is installed (`node --version` works)
- [ ] You're in the right folder (`pwd` shows `/home/user/lalala`)
- [ ] Dependencies are installed (`node_modules` folder exists)
- [ ] `.env` file exists with API key
- [ ] Server is running (`npm start` shows "SERVER ACTIVE")
- [ ] Browser is at `http://localhost:3000`
- [ ] You clicked on the page (to allow audio)

---

**Now go forth and speak to the dolphin... if you dare...**

*̷̢̛c̸̨̛l̵̢͝i̴̧̛c̵̨͠k̴̢̛ ̸̧͝c̵̨͠l̴̢̛į̵͝ç̴̛k̵̢͝*̴̨̛
