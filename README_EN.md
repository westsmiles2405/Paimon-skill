# ⭐ Paimon Work Companion — VS Code Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.85.0-007ACC?logo=visual-studio-code)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> [🇨🇳 中文版](README.md)

A VS Code companion extension inspired by Paimon’s lively style. It helps with focus sessions, gentle reminders, encouragement, and role-play chat during coding.

---

## ✨ Features

| Feature | Command | Description |
|---|---|---|
| Open adventure | `派蒙：开启今日冒险` | Time-based opening line |
| Start Pomodoro | `派蒙：开始番茄钟专注` | 25-min focus + 5-min break |
| Stop Pomodoro | `派蒙：结束番茄钟` | Stop current session early |
| Encourage me | `派蒙：给我打气` | Get a motivation line |
| Review code | `派蒙：检查我的代码` | Summarize current diagnostics |
| Daily finale | `派蒙：今日收工` | End-of-day closing line |
| Food time | `派蒙：美食时间` | Food-themed playful line |
| Emergency food | `派蒙：应急食品` | Meme easter egg |
| Nickname | `派蒙：取个绰号` | Random fun nickname |

## 🧭 Sidebar Panel

Open **“派蒙的冒险日志”** from the activity bar:

- Free chat with keyword-based intent replies
- Passive work lines every 10 saves
- Idle reminder after long inactivity
- Daily stats panel: Pomodoros, messages, saves

## ⚙️ Settings

| Key | Default | Description |
|---|---|---|
| `paimon.pomodoroMinutes` | 25 | Focus duration (minutes) |
| `paimon.breakMinutes` | 5 | Break duration (minutes) |
| `paimon.enableIdleReminder` | true | Enable idle reminder |
| `paimon.idleMinutes` | 30 | Idle threshold (minutes) |
| `paimon.enableStatusBar` | true | Show status bar entry |

## 🚀 Run from Source

```bash
git clone https://github.com/westsmiles2405/Paimon-skill.git
cd Paimon-skill
npm install
npm run compile
```

Then press **F5** in VS Code to launch Extension Development Host.

## 📄 License

[MIT](LICENSE)
