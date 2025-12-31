#!/bin/bash

echo "╔═══════════════════════════════════════════════╗"
echo "║  🐬 DISTURBING DOLPHIN GAME - SETUP SCRIPT 🐬 ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your OpenAI API key!"
    echo "   Get your API key from: https://platform.openai.com/api-keys"
    echo ""
else
    echo "✓ .env file already exists"
fi

# Create audio directory
if [ ! -d "audio" ]; then
    mkdir audio
    echo "✓ Audio directory created"
fi

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║           SETUP COMPLETE!                     ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your OPENAI_API_KEY"
echo "2. Run: npm start"
echo "3. Open: http://localhost:3000"
echo ""
echo "The dolphin is waiting..."
echo ""
