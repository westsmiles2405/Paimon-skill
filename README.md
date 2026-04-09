# ⭐ 派蒙工作陪伴 — VS Code Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.85.0-007ACC?logo=visual-studio-code)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> *“旅行者，别发呆啦！派蒙陪你一起把今天的任务做完！”*

让旅行者最好的伙伴 **派蒙** 陪伴你的 VS Code 工作之旅。她会用活泼可爱的方式督促进度、帮你启动番茄钟、在你低落时打气、在你摸鱼时提醒你，还会时不时开启美食频道。

---

## ✨ 功能一览

| 功能 | 命令 | 说明 |
|------|------|------|
| ⭐ 开启今日冒险 | `派蒙：开启今日冒险` | 根据时间段生成开场问候 |
| ⏱ 番茄钟专注 | `派蒙：开始番茄钟专注` | 25 分钟专注 + 5 分钟休息 |
| ⏹ 结束番茄钟 | `派蒙：结束番茄钟` | 提前结束当前番茄钟 |
| 💪 给我打气 | `派蒙：给我打气` | 获得一段鼓励回复 |
| 🔍 检查代码 | `派蒙：检查我的代码` | 汇总当前工作区错误信息 |
| 🏁 今日收工 | `派蒙：今日收工` | 今日总结与收尾台词 |
| 🍗 美食时间 | `派蒙：美食时间` | 随机美食推荐台词 |
| 📦 应急食品 | `派蒙：应急食品` | 彩蛋回应 |
| 🏷 取个绰号 | `派蒙：取个绰号` | 随机给你起个称号 |

## 🧭 侧边栏面板

活动栏会出现派蒙图标，点击打开 **“派蒙的冒险日志”**：

- 支持自由对话（关键词识别 + 角色化回复）
- 每保存 10 次文件，派蒙会主动发工作台词
- 长时间未操作会触发提醒
- 展示今日统计：番茄数、对话数、保存数

## ⚙️ 配置项

| 设置 | 默认值 | 说明 |
|------|--------|------|
| `paimon.pomodoroMinutes` | 25 | 番茄钟专注时长（分钟） |
| `paimon.breakMinutes` | 5 | 休息时长（分钟） |
| `paimon.enableIdleReminder` | true | 是否在长时间未操作时提醒 |
| `paimon.idleMinutes` | 30 | 闲置多少分钟后提醒 |
| `paimon.enableStatusBar` | true | 是否显示状态栏入口 |

## 🚀 快速开始

```bash
git clone https://github.com/westsmiles2405/Paimon-skill.git
cd Paimon-skill
npm install
npm run compile
```

然后在 VS Code 中按 **F5** 启动 Extension Development Host 调试。

## 📁 项目结构

```text
paimon-companion/
├── src/
│   ├── extension.ts
│   ├── persona.ts
│   ├── dynamicReply.ts
│   ├── chatPanel.ts
│   ├── pomodoro.ts
│   ├── stats.ts
│   └── idleWatcher.ts
├── media/
│   ├── paimon-icon.svg
│   └── paimon-icon.png
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

## 📝 说明

本项目中的派蒙风格台词为原创改写，避免直接复刻官方原句，仅用于学习与娱乐。

## 📄 许可证

[MIT](LICENSE) © 2025
