# SpeedTest-game

This is a speed test, but it operates on a different concept than the standard one. We don't depend on WPM (words per minute), but we are using a way that states either you are capable or not by setting words according to the difficulty specified and the number of words selected (max 30 per game and this is specified for written numbers more than 30).

I am very happy that I have finally finished this project because it took a lot of time from me to solve a lot of logic and algorithmic mistakes to finish it. In addition, it was the first project I started to build using TypeScript. However, during the middle of the construction process, I have stopped because it took a lot of time and started on other projects. Until finally, I returned to complete it, and it is as you see now.


[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/SaifAbdelrazek011/speed-typing-game/blob/main/LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-3178C6.svg)

A responsive typing speed test game with adaptive difficulty levels and theme switching, implemented in TypeScript with strict type safety.

**Live Demo**: [Play Now](https://saifabdelrazek011.github.io/speed-typing-game)

![Gameplay Demo]([./screenshots/gameplay.gif](https://cloud-81omewll7-hack-club-bot.vercel.app/0image.png)) <!-- Add actual screenshot -->

## Technical Architecture

### Core Components
- **Game Engine**: Real-time word matching algorithm with O(n) complexity
- **State Management**: Pure TypeScript implementation with type-safe transitions
- **DOM Manipulation**: Optimized batch updates using DocumentFragment
- **Persistence Layer**: LocalStorage for theme preferences

### Key Features
- 🎚️ 4 Difficulty Levels (Easy/Normal/Hard/Insane)
- ⏲️ Adaptive Time Limits (JSON-configurable)
- 🎮 Input Validation System with anti-cheat mechanisms
- 🌓 Theme System (Light/Dark) with CSS Variables
- 🔊 Sound Feedback System

### Difficulties Explained
- Easy: simple words with 5 sec per word
- normal: medium words in difficulty with 4 sec per word
- hard: hard and long words with 4 sec per word
- insane: as hard as hard in words difficulty but in 2 sec per word only

## Codebase Structure

```plaintext
SpeedTest-game/
├── audio/                  # Sound files
│   ├── fall.mp3
│   └── success.mp3
├── Images/                 # Theme assets
│   ├── moon.png
│   └── sun.png
├── src/                    # TypeScript source
│   └── Main.ts             # Core game logic
├── dist/                   # Compiled JS
│   └── Main.js
├── index.html              # Main entry point
├── style.css               # Styles
├── words.json              # Word database
├── ideas-for-improving.txt # Development notes
├── package.json
├── package-lock.json
└── tsconfig.json
