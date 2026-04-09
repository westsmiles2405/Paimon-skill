/**
 * 派蒙工作陪伴 — 主入口
 */

import * as vscode from 'vscode';
import { PaimonChatPanel } from './chatPanel';
import { PomodoroTimer } from './pomodoro';
import { IdleWatcher } from './idleWatcher';
import { StatsTracker } from './stats';
import {
    getOpening,
    getWorkLine,
    getEncourageLine,
    getJudgment,
    getFocusStart,
    getFocusEnd,
    getBreakRemind,
    getBreakEnd,
    getFinale,
    getIdleRemind,
    getTimeBasedGreeting,
    getFoodLine,
    getEmergencyFoodLine,
    getNicknameLine,
} from './persona';
import {
    generateResponse,
    analyzeCodeProblems,
    CODE_ANALYSIS_KEYWORDS,
} from './dynamicReply';

export function activate(context: vscode.ExtensionContext): void {
    const panel = new PaimonChatPanel(context.extensionUri);
    const pomodoro = new PomodoroTimer();
    const stats = new StatsTracker(context.globalState);

    const idleWatcher = new IdleWatcher(() => {
        panel.addBotMessage(getIdleRemind());
    });

    const statusBar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100,
    );
    statusBar.text = '⭐ 派蒙';
    statusBar.tooltip = '派蒙工作陪伴';
    statusBar.command = 'paimon.openStage';
    const showStatusBar = vscode.workspace
        .getConfiguration('paimon')
        .get<boolean>('enableStatusBar', true);
    if (showStatusBar) {
        statusBar.show();
    }
    context.subscriptions.push(statusBar);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(PaimonChatPanel.viewType, panel),
    );

    panel.setOnUserMessage((text) => {
        stats.recordMessage();
        panel.updateStats(stats.current);
        idleWatcher.reset();

        const lower = text.toLowerCase();
        if (CODE_ANALYSIS_KEYWORDS.some((k) => lower.includes(k))) {
            panel.addBotMessage(analyzeCodeProblems());
            return;
        }

        const reply = generateResponse(text);
        panel.addBotMessage(reply);
    });

    const welcomed = context.globalState.get<boolean>('paimon.welcomed', false);
    if (!welcomed) {
        panel.addBotMessage('旅行者，欢迎回来！派蒙今天也会陪你一起冲进度！');
        panel.addBotMessage(
            '📌 小提示：\n'
            + '• 在输入框跟派蒙聊天\n'
            + '• 按 Ctrl+Shift+P 搜索“派蒙”查看全部命令\n'
            + '• 试试“开始番茄钟专注”\n'
            + '• 说“检查代码”让我帮你找问题',
        );
        panel.addBotMessage('好啦，冒险小队集合完毕，出发！');
        void context.globalState.update('paimon.welcomed', true);
    } else {
        panel.addBotMessage(getTimeBasedGreeting());
    }

    panel.updateStats(stats.current);

    context.subscriptions.push(
        vscode.commands.registerCommand('paimon.openStage', () => {
            const msg = getOpening();
            panel.addBotMessage(msg);
            panel.addBotMessage(getTimeBasedGreeting());
            void vscode.window.showInformationMessage(`⭐ 派蒙：${msg}`);
        }),

        vscode.commands.registerCommand('paimon.startPomodoro', () => {
            if (pomodoro.isRunning) {
                panel.addBotMessage('番茄钟已经在跑啦，先把这一轮完成！');
                return;
            }
            const config = vscode.workspace.getConfiguration('paimon');
            const minutes = config.get<number>('pomodoroMinutes', 25);
            panel.addBotMessage(getFocusStart(minutes));

            pomodoro.start(minutes, (phase) => {
                switch (phase) {
                    case 'focus-end':
                        panel.addBotMessage(getFocusEnd());
                        stats.recordPomodoro();
                        panel.updateStats(stats.current);
                        break;
                    case 'break-start':
                        panel.addBotMessage(getBreakRemind());
                        break;
                    case 'break-end':
                        panel.addBotMessage(getBreakEnd());
                        break;
                }
            });
        }),

        vscode.commands.registerCommand('paimon.stopPomodoro', () => {
            if (!pomodoro.isRunning) {
                panel.addBotMessage('番茄钟还没开始哦。');
                return;
            }
            pomodoro.stop();
            panel.addBotMessage('番茄钟已提前结束。没关系，调整后再来一轮！');
        }),

        vscode.commands.registerCommand('paimon.encourageMe', () => {
            const msg = getEncourageLine();
            panel.addBotMessage(msg);
            void vscode.window.showInformationMessage(`⭐ 派蒙：${msg}`);
        }),

        vscode.commands.registerCommand('paimon.reviewWork', () => {
            const diagnostics = vscode.languages.getDiagnostics();
            const issues: string[] = [];
            for (const [uri, diags] of diagnostics) {
                for (const d of diags) {
                    if (d.severity === vscode.DiagnosticSeverity.Error) {
                        const fileName = vscode.workspace.asRelativePath(uri);
                        issues.push(`${fileName}:${d.range.start.line + 1} — ${d.message}`);
                    }
                }
            }
            const totalErrors = issues.length;
            const topIssues = issues.slice(0, 10);
            if (issues.length > 10) {
                topIssues.push(`……以及另外 ${issues.length - 10} 项问题。`);
            }
            panel.addBotMessage(getJudgment(topIssues));
            void vscode.window.showInformationMessage(`⭐ 派蒙检查：发现 ${totalErrors} 项错误`);
        }),

        vscode.commands.registerCommand('paimon.finale', () => {
            const msg = getFinale(pomodoro.completedCount);
            panel.addBotMessage(msg);
            pomodoro.stop();
            void vscode.window.showInformationMessage(`⭐ 派蒙：${msg}`);
        }),

        vscode.commands.registerCommand('paimon.foodTime', () => {
            panel.addBotMessage(getFoodLine());
        }),

        vscode.commands.registerCommand('paimon.emergencyFood', () => {
            panel.addBotMessage(getEmergencyFoodLine());
        }),

        vscode.commands.registerCommand('paimon.nickname', () => {
            panel.addBotMessage(getNicknameLine());
        }),
    );

    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(() => {
            stats.recordSave();
            panel.updateStats(stats.current);
            idleWatcher.reset();
            if (stats.current.todaySaves % 10 === 0) {
                panel.addBotMessage(getWorkLine());
            }
        }),
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(() => {
            idleWatcher.reset();
        }),
        vscode.window.onDidChangeActiveTextEditor(() => {
            idleWatcher.reset();
        }),
    );

    context.subscriptions.push({
        dispose() {
            pomodoro.dispose();
            idleWatcher.dispose();
        },
    });
}

export function deactivate(): void { }
