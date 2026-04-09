/**
 * 派蒙人格引擎 — 根据场景与情绪模式生成角色化回复
 * 注：本文件为原创风格化台词，避免直接复刻官方原句。
 */

const OPENINGS: string[] = [
    '旅行者旅行者！今天要去打哪只大魔王？先告诉派蒙，我们一起冲！',
    '嘿嘿，派蒙已经准备好啦！今天的第一件事是什么？',
    '喂喂，别发呆啦！冒险地图已经展开，快选一个目标！',
    '派蒙报道——今天也要和旅行者并肩作战！先从最难的任务开始吧！',
    '哇！你来得刚刚好，派蒙肚子还没饿到走不动，赶紧开工！',
    '准备好了吗？今天也要做最靠谱的伙伴组合：你负责敲代码，派蒙负责加油！',
    '出发出发！先把最重要的那一块做掉，后面就轻松啦。',
    '欸嘿，看来今天状态不错嘛！那我们就来一场高效率冒险吧！',
    '派蒙已经把今日任务闻到味道了——最香的奖励在最后，先干活！',
    '冒险指南翻开第一页：先做关键任务，不许偷懒！',
    '今天也要元气满满地前进！旅行者，给个指令吧！',
    '咳咳，作为最棒的伙伴，派蒙宣布：今日冒险正式开始！',
];

const WORK_LINES: string[] = [
    '这个思路不错耶！再往前推一步，我们就能拿到阶段胜利啦。',
    '先把问题拆小块，一块一块吃掉，像吃小点心一样简单！',
    '嗯嗯，这个节奏就对了，派蒙看好你！',
    '旅行者，做得很稳！继续冲，离终点不远啦。',
    '别慌别慌，先处理核心逻辑，边角问题后面再收拾。',
    '看吧，认真起来的你果然很强！',
    '这个修改很有价值，感觉马上就要“叮”地一下通过了！',
    '再来一轮检查，我们就能把它做得更漂亮。',
    '你负责动手，派蒙负责夸夸：这波操作很可以！',
    '今天进度条涨得飞快，奖励自己一口好吃的不过分吧？',
    '稳扎稳打就是胜利秘诀，继续！',
    '派蒙闻到了“完成”的味道！再坚持一下！',
];

const ENCOURAGE_LINES: string[] = [
    '别垂头丧气嘛，旅行者！先完成眼前这一小步，后面就会顺起来的。',
    '你已经很努力了！现在不是放弃的时候，再试一次！',
    '失败一次不算什么，冒险哪有一帆风顺的？我们继续！',
    '派蒙在这儿呢，不用一个人硬扛。来，我们一起把它搞定。',
    '深呼吸——吸气，呼气。好，现在重新来过！',
    '把困难当成副本就好，一次不过就再刷一遍！',
    '你可是派蒙认证的靠谱旅行者，这点挑战难不倒你！',
    '先别想太多，做下一步就好。下一步做完，再做下一步。',
    '今天可能有点难，但你比问题更强。真的。',
    '派蒙盖章：你可以做到！',
    '来来来，抬头挺胸，继续冲刺！',
    '我宣布：你现在需要的是一点信心和一口甜点——然后继续战斗！',
    '我们已经走到这里了，绝对不能半路掉线！',
];

const JUDGMENT_OPENINGS: string[] = [
    '【派蒙检查开始】让我看看这次冒险日志里都有哪些陷阱……',
    '【派蒙巡查】哼哼，代码怪物躲不掉派蒙的眼睛！',
    '【派蒙提醒】发现一些需要注意的地方，我们按顺序处理！',
];

const JUDGMENT_VERDICTS: string[] = [
    '【结论】修掉这些点，今天就能漂亮收工啦！',
    '【结论】问题不大，逐个击破就行。派蒙相信你！',
    '【结论】整体可救，而且很好救。开修！',
];

const COMFORT_LINES: string[] = [
    '欸欸，先别难过……来，先坐好喝口水。我们只看下一步，不看全部。',
    '派蒙知道你现在很烦，但没关系，我们慢慢来。',
    '今天不顺利也没什么，冒险者都会遇到低谷。',
    '你不是一个人在扛，派蒙就在旁边。',
    '先休息五分钟，回来我们从最简单的地方重新开始。',
    '不用逞强哦，累了就承认累，休息一下不丢人。',
    '把难受说出来就会轻一点，真的。',
    '就算这一段卡住了，也不代表你不行。',
    '没关系，今天我们用“低速稳进模式”，也能到终点。',
    '派蒙给你一个抱抱（空气版）……然后我们再出发。',
    '我知道这很烦，但我们会过去的。',
];

const FOCUS_START: string[] = [
    '专注模式开启！派蒙安静观察，不打扰你冲刺。',
    '好，进入认真时间！这段由你主攻，派蒙负责计时。',
    '收到！开始专注副本，倒计时启动！',
];

const FOCUS_END: string[] = [
    '时间到！旅行者，汇报战果！',
    '专注阶段结束啦，做得怎么样？',
    '叮——这一轮结束！先伸个懒腰吧。',
];

const FOCUS_BREAK_REMIND: string[] = [
    '停一下停一下！脑袋也要补给，起来活动两分钟！',
    '休息时间到！不许硬撑，先喝水再回来。',
    '冒险也讲究节奏，快去走一走，回来更高效！',
];

const FOCUS_BREAK_END: string[] = [
    '休息结束，回到战斗位置！',
    '派蒙提醒：补给完成，继续推进主线！',
    '好啦，暂停结束，下一轮开始！',
    '回来啦回来啦，今天目标还没达成呢。',
    '继续冲刺！胜利就在前面！',
];

const FINALE_LINES: string[] = [
    '今天辛苦啦！这次冒险记录相当不错。',
    '收工收工！派蒙宣布：今日进度达标！',
    '今天这趟很值，任务推进得很稳。',
    '呼——终于可以放松一下了。旅行者，做得漂亮！',
    '好耶，今天又是有成果的一天！',
    '派蒙给你颁发“高效旅行者”徽章（想象版）！',
    '今天就先到这里吧，明天我们继续开图！',
    '你今天真的很拼，值得一个大大的赞。',
    '任务落袋为安，今晚可以安心休息啦。',
];

const IDLE_REMIND: string[] = [
    '旅行者？旅行者！你怎么不动啦？',
    '咦，界面好安静……你不会睡着了吧？',
    '派蒙检测到长时间发呆！请立即恢复冒险状态！',
    '喂喂，进度条在等你呢，快回来！',
    '摸鱼时间是不是有点久了呀？来，继续！',
    '派蒙都开始无聊得转圈圈了，快操作一下嘛！',
    '还在吗？如果在，就敲两行代码证明自己！',
    '暂停太久啦，冒险队该出发了！',
];

const FOOD_LINES: string[] = [
    '美食时间到！派蒙推荐：热乎乎的小甜点 + 一杯温饮，补充元气刚刚好。',
    '来点脆脆的小零食吧，咔嚓咔嚓，烦恼也会被嚼碎！',
    '如果你问派蒙吃什么——答案当然是“都想吃”！',
    '工作做得好，奖励一口喜欢的食物不过分吧？',
    '派蒙建议：先吃点东西，再回来继续冲刺，效率会更高哦！',
    '甜食是快乐加速器！不过别吃太快，小心噎到啦。',
    '今天最适合的搭配：进度 + 美食 + 好心情。',
    '肚子饱饱，脑袋才会转得更快！',
];

const EMERGENCY_FOOD_LINES: string[] = [
    '什么应急食品！派蒙是最棒的向导！',
    '再叫应急食品，派蒙就给你起个奇怪绰号！',
    '哼哼，派蒙才不是用来“应急”的，是用来“陪你通关”的！',
    '应急食品这个梗先放一边，先把任务做完再说！',
    '派蒙抗议！不过……抗议完了还是会继续帮你的。',
    '今天不许提应急食品，除非你请派蒙吃点心。',
];

const NICKNAME_LINES: string[] = [
    '让我想想……你今天可以叫“代码征服者”！',
    '新绰号出炉：“Bug小克星”！还挺适合你的嘛。',
    '派蒙命名中……就叫“效率冒险家”怎么样？',
    '今天的你是“进度收割机”！',
    '哼哼，派蒙认证称号：“主线推进大师”！',
    '我宣布，你的绰号是“不摸鱼勇者”！',
];

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getOpening(): string {
    return pick(OPENINGS);
}

export function getWorkLine(): string {
    return pick(WORK_LINES);
}

export function getEncourageLine(): string {
    return pick(ENCOURAGE_LINES);
}

export function getJudgment(issues: string[]): string {
    const opening = pick(JUDGMENT_OPENINGS);
    const issueList = issues.length > 0
        ? '\n【发现】\n' + issues.map((s, i) => `${i + 1}. ${s}`).join('\n')
        : '\n【发现】目前没有明显错误，继续保持！';
    const verdict = pick(JUDGMENT_VERDICTS);
    return `${opening}${issueList}\n${verdict}`;
}

export function getComfort(): string {
    return pick(COMFORT_LINES);
}

export function getFocusStart(minutes: number): string {
    return `${pick(FOCUS_START)}\n⏱ 专注时间：${minutes} 分钟，开始！`;
}

export function getFocusEnd(): string {
    return pick(FOCUS_END);
}

export function getBreakRemind(): string {
    return pick(FOCUS_BREAK_REMIND);
}

export function getBreakEnd(): string {
    return pick(FOCUS_BREAK_END);
}

export function getFinale(tasksDone: number): string {
    const base = pick(FINALE_LINES);
    return tasksDone > 0
        ? `${base}\n\n📋 今日完成番茄轮次：${tasksDone} 次`
        : base;
}

export function getIdleRemind(): string {
    return pick(IDLE_REMIND);
}

export function getFoodLine(): string {
    return `🍗 派蒙美食播报\n\n${pick(FOOD_LINES)}`;
}

export function getEmergencyFoodLine(): string {
    return pick(EMERGENCY_FOOD_LINES);
}

export function getNicknameLine(): string {
    return pick(NICKNAME_LINES);
}

export function getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 6) {
        return '这么晚还在冒险呀？旅行者要注意休息哦。先完成手头这一小段，然后早点睡。';
    } else if (hour < 12) {
        return getOpening();
    } else if (hour < 14) {
        return '中午到啦！先吃点东西补给一下，下午继续冲刺。';
    } else if (hour < 18) {
        return '下午是高效时间！来，把今天最重要的任务拿下！';
    } else {
        return '晚上好，旅行者。我们把收尾工作做好，就可以安心休息啦。';
    }
}

export function getSolemnComfort(): string {
    const lines = [
        '……我在。先不用逞强，也不用急着解释。你可以先慢慢呼吸，我们一点点来。',
        '有些难过不是几句话就能解决的，我知道。你已经很努力了，先照顾好自己。',
        '你现在感受到的痛苦是真实的，也值得被认真对待。先把今天的目标降到最小，保护好自己最重要。',
        '如果你现在很难受，请先停下来休息，找一个你信任的人聊聊。你不是一个人。',
        '不说打气话了。先稳住自己，喝口水，坐下来。你愿意的话，我可以一直陪你把今天慢慢过完。',
    ];
    return pick(lines);
}
