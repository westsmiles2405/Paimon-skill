/**
 * 派蒙动态回复引擎 — 关键词意图识别 + 角色化生成
 */

import * as vscode from 'vscode';
import {
    getComfort,
    getSolemnComfort,
    getEncourageLine,
    getWorkLine,
    getTimeBasedGreeting,
    getFoodLine,
    getEmergencyFoodLine,
    getNicknameLine,
} from './persona';

const SAD_KEYWORDS = [
    '难过', '伤心', '哭', '崩溃', '失败', '完蛋',
    '无语', '烦', '累', '郁闷', '焦虑', '绝望',
    '不行', '放弃', '痛苦',
];

const DEEP_SAD_KEYWORDS = [
    '去世', '死了', '离世', '走了', '不在了',
    '分手', '离婚', '自杀', '想死', '活不下去',
    '亲人', '永别', '葬礼', '丧',
];

const WORK_KEYWORDS = [
    '写代码', '编程', '调试', 'debug', '功能', '需求',
    '上线', '部署', '开发', '测试', '重构', '优化',
    '写完', 'code', '代码', '函数',
];

const ENCOURAGEMENT_KEYWORDS = [
    '加油', '鼓励', '打气', '支持', '帮忙', '信心',
    '坚持', '挺住', '可以', '行不行', '给力',
];

const GREETING_KEYWORDS = ['你好', '早上好', 'hi', 'hello', '嗨', '在吗', '派蒙'];
const FOOD_KEYWORDS = ['甜品', '蛋糕', '下午茶', '吃', '饿', '零食', '饮料', '美食'];
const EMERGENCY_FOOD_KEYWORDS = ['应急食品', '应急', '食品'];
const NICKNAME_KEYWORDS = ['绰号', '外号', '昵称', '起名'];

export const CODE_ANALYSIS_KEYWORDS = ['分析', '诊断', '检查代码', '代码质量', '有没有错'];

type Intent =
    | 'deep_sad'
    | 'sad'
    | 'work'
    | 'encourage'
    | 'greeting'
    | 'food'
    | 'emergency_food'
    | 'nickname'
    | 'unknown';

function analyzeIntent(text: string): Intent {
    const lower = text.toLowerCase();
    if (FOOD_KEYWORDS.some((k) => lower.includes(k))) { return 'food'; }
    if (EMERGENCY_FOOD_KEYWORDS.some((k) => lower.includes(k))) { return 'emergency_food'; }
    if (NICKNAME_KEYWORDS.some((k) => lower.includes(k))) { return 'nickname'; }
    if (DEEP_SAD_KEYWORDS.some((k) => lower.includes(k))) { return 'deep_sad'; }
    if (SAD_KEYWORDS.some((k) => lower.includes(k))) { return 'sad'; }
    if (ENCOURAGEMENT_KEYWORDS.some((k) => lower.includes(k))) { return 'encourage'; }
    if (WORK_KEYWORDS.some((k) => lower.includes(k))) { return 'work'; }
    if (GREETING_KEYWORDS.some((k) => lower.includes(k))) { return 'greeting'; }
    return 'unknown';
}

function extractInfo(text: string): { type: string; detail: string } {
    const lower = text.toLowerCase();

    if (lower.includes('bug') || lower.includes('报错') || lower.includes('error')) {
        return { type: 'bug', detail: '唔，出现报错了？先把报错信息贴给派蒙，我们一起把它打掉！' };
    }
    if (lower.includes('deadline') || lower.includes('赶') || lower.includes('来不及')) {
        return { type: 'deadline', detail: '时间紧张时先抓主线任务，支线先放一放！' };
    }
    if (lower.includes('同事') || lower.includes('老板') || lower.includes('领导')) {
        return { type: 'people', detail: '先对齐目标，再讨论做法，沟通会顺很多。' };
    }
    return { type: 'general', detail: '' };
}

export function generateResponse(userMessage: string): string {
    const intent = analyzeIntent(userMessage);
    const info = extractInfo(userMessage);

    switch (intent) {
        case 'deep_sad':
            return getSolemnComfort();

        case 'sad':
            if (info.detail) {
                return `${getComfort()}\n\n${info.detail}`;
            }
            return getComfort();

        case 'encourage':
            return getEncourageLine();

        case 'work':
            if (info.detail) {
                return `${getWorkLine()}\n\n${info.detail}`;
            }
            return getWorkLine();

        case 'greeting':
            return getTimeBasedGreeting();

        case 'food':
            return getFoodLine();

        case 'emergency_food':
            return getEmergencyFoodLine();

        case 'nickname':
            return getNicknameLine();

        default: {
            const responses = [
                '派蒙在听哦，继续说继续说！',
                '这个话题有点意思，再展开一点？',
                '嗯嗯，派蒙懂了个大概。你希望我先帮哪一块？',
                '我们可以把这个问题拆成几步来做！',
                '派蒙建议：先给我一个最想解决的小目标。',
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
}

export function analyzeCodeProblems(): string {
    const diagnostics = vscode.languages.getDiagnostics();
    let errors = 0;
    let warnings = 0;
    const topIssues: string[] = [];

    for (const [uri, diags] of diagnostics) {
        for (const d of diags) {
            if (d.severity === vscode.DiagnosticSeverity.Error) {
                errors++;
                if (topIssues.length < 5) {
                    topIssues.push(
                        `⭐ [${uri.path.split('/').pop()}:${d.range.start.line + 1}] ${d.message}`,
                    );
                }
            } else if (d.severity === vscode.DiagnosticSeverity.Warning) {
                warnings++;
            }
        }
    }

    if (errors === 0 && warnings === 0) {
        return '好耶！目前没有错误和警告，旅行者状态绝佳！';
    }

    const header =
        errors > 0
            ? `派蒙发现了 ${errors} 个错误和 ${warnings} 个警告。先打掉错误，再处理警告！`
            : `当前没有错误，但有 ${warnings} 个警告。还能继续优化一下。`;

    const issues = topIssues.length > 0 ? '\n\n' + topIssues.join('\n') : '';

    const advice =
        errors > 3
            ? '\n\n先从最前面的几个错误开始，一次解决一个，稳稳推进。'
            : errors > 0
                ? '\n\n问题不算大，先清 error，warning 稍后整理。'
                : '';

    return `${header}${issues}${advice}`;
}
