/**
 * 派蒙 Webview 侧边栏面板
 */
import * as crypto from 'crypto';
import * as vscode from 'vscode';
import { PaimonStats } from './stats';

function getNonce(): string {
    return crypto.randomBytes(16).toString('hex');
}

interface PendingMessage {
    from: 'paimon' | 'user';
    text: string;
}

export class PaimonChatPanel implements vscode.WebviewViewProvider {
    public static readonly viewType = 'paimon.chatPanel';
    private view?: vscode.WebviewView;
    private messages: PendingMessage[] = [];
    private onUserMessage?: (text: string) => void;
    private latestStats?: PaimonStats;

    constructor(private readonly extensionUri: vscode.Uri) { }

    public setOnUserMessage(handler: (text: string) => void): void {
        this.onUserMessage = handler;
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ): void {
        this.view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri],
        };
        webviewView.webview.html = this.getHtml();

        webviewView.webview.onDidReceiveMessage((data: unknown) => {
          if (!data || typeof data !== 'object') {
            return;
          }
          const payload = data as { type?: unknown; text?: unknown };
          if (payload.type === 'userMessage' && typeof payload.text === 'string') {
            const trimmed = payload.text.trim();
                if (trimmed && trimmed.length <= 500) {
                    this.messages.push({ from: 'user', text: trimmed });
                    this.trimMessages();
                    this.syncMessages();
                    this.onUserMessage?.(trimmed);
                }
            }
        });

        this.syncMessages();
    }

    public addBotMessage(text: string): void {
        this.messages.push({ from: 'paimon', text });
        this.trimMessages();
        this.syncMessages();
    }

    public updateStats(stats: PaimonStats): void {
        this.latestStats = stats;
        if (this.view) {
            this.view.webview.postMessage({
                type: 'updateStats',
                stats,
            });
        }
    }

    private trimMessages(): void {
        const MAX_MESSAGES = 200;
        if (this.messages.length > MAX_MESSAGES) {
            this.messages = this.messages.slice(this.messages.length - MAX_MESSAGES);
        }
    }

    private syncMessages(): void {
        if (!this.view) {
            return;
        }
        this.view.webview.postMessage({
            type: 'messages',
            messages: this.messages,
        });
        if (this.latestStats) {
            this.view.webview.postMessage({
                type: 'updateStats',
                stats: this.latestStats,
            });
        }
    }

    private getHtml(): string {
        const nonce = getNonce();
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
  <title>派蒙的冒险日志</title>
  <style nonce="${nonce}">
    :root {
      --paimon-gold: #ffd54f;
      --paimon-orange: #ffb74d;
      --paimon-bg: var(--vscode-editor-background, #1e1e2e);
      --paimon-fg: var(--vscode-editor-foreground, #cdd6f4);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: var(--vscode-font-family, 'Segoe UI', sans-serif);
      background: var(--paimon-bg);
      color: var(--paimon-fg);
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--paimon-gold);
      text-align: center;
      font-size: 14px;
      color: var(--paimon-gold);
      font-weight: 600;
    }
    .header span {
      color: var(--paimon-orange);
      font-size: 12px;
      display: block;
      margin-top: 2px;
    }
    .stats-bar {
      display: flex;
      justify-content: space-around;
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255, 213, 79, 0.2);
      font-size: 11px;
      color: rgba(205, 214, 244, 0.7);
    }
    .stat-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .stat-value { font-size: 16px; font-weight: 700; color: var(--paimon-orange); }
    #chat {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .msg {
      max-width: 90%;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
      word-wrap: break-word;
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .msg .avatar {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    .msg .bubble { flex: 1; min-width: 0; }
    .msg .name { font-size: 11px; margin-bottom: 4px; font-weight: 600; }
    .msg.paimon {
      align-self: flex-start;
      background: rgba(255, 213, 79, 0.12);
      border: 1px solid rgba(255, 213, 79, 0.25);
      color: var(--paimon-fg);
    }
    .msg.paimon .name { color: var(--paimon-gold); }
    .msg.paimon .avatar { background: rgba(255, 183, 77, 0.2); }
    .msg.user {
      align-self: flex-end;
      flex-direction: row-reverse;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    .msg.user .name { color: #d7dde8; text-align: right; }
    .msg.user .avatar { background: rgba(255, 255, 255, 0.16); }
    .input-area {
      display: flex;
      padding: 8px 12px;
      gap: 8px;
      border-top: 1px solid rgba(255, 213, 79, 0.2);
    }
    #userInput {
      flex: 1;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 213, 79, 0.3);
      color: var(--paimon-fg);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 13px;
      outline: none;
    }
    #userInput:focus { border-color: var(--paimon-gold); }
    #sendBtn {
      background: var(--paimon-gold);
      color: #1e1e2e;
      border: none;
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 13px;
      cursor: pointer;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header">⭐ 派蒙的冒险日志<span>工作陪伴 · 番茄钟 · 美食提醒</span></div>
  <div class="stats-bar">
    <div class="stat-item"><span class="stat-value" id="statPomodoro">0</span><span>🍅 番茄</span></div>
    <div class="stat-item"><span class="stat-value" id="statMsg">0</span><span>💬 对话</span></div>
    <div class="stat-item"><span class="stat-value" id="statSave">0</span><span>💾 保存</span></div>
  </div>
  <div id="chat"></div>
  <div class="input-area">
    <input id="userInput" type="text" placeholder="对派蒙说点什么…" maxlength="500" />
    <button id="sendBtn">发送</button>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const chat = document.getElementById('chat');
    const input = document.getElementById('userInput');
    const btn = document.getElementById('sendBtn');

    function send() {
      var t = input.value.trim();
      if (!t) return;
      vscode.postMessage({ type: 'userMessage', text: t });
      input.value = '';
    }
    btn.addEventListener('click', send);
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') send(); });

    window.addEventListener('message', function(e) {
      var msg = e.data;
      if (msg.type === 'messages') renderAll(msg.messages);
      if (msg.type === 'updateStats') updateStats(msg.stats);
    });

    function updateStats(s) {
      var sp = document.getElementById('statPomodoro');
      var sm = document.getElementById('statMsg');
      var ss = document.getElementById('statSave');
      if (sp) sp.textContent = s.todayPomodoros || 0;
      if (sm) sm.textContent = s.todayMessages || 0;
      if (ss) ss.textContent = s.todaySaves || 0;
    }

    function renderAll(msgs) {
      chat.innerHTML = '';
      for (var i = 0; i < msgs.length; i++) {
        var m = msgs[i];
        var div = document.createElement('div');
        div.className = 'msg ' + m.from;

        var avatar = document.createElement('span');
        avatar.className = 'avatar';
        avatar.textContent = m.from === 'paimon' ? '⭐' : '🧭';

        var bubble = document.createElement('div');
        bubble.className = 'bubble';

        var name = document.createElement('div');
        name.className = 'name';
        name.textContent = m.from === 'paimon' ? '派蒙' : '旅行者';
        bubble.appendChild(name);

        var content = document.createElement('span');
        content.textContent = m.text;
        bubble.appendChild(content);

        div.appendChild(avatar);
        div.appendChild(bubble);
        chat.appendChild(div);
      }
      chat.scrollTop = chat.scrollHeight;
    }
  </script>
</body>
</html>`;
    }
}
