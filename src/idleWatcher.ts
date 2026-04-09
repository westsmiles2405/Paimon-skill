/**
 * 闲置检测 — 长时间未操作时发出派蒙式提醒
 */

import * as vscode from 'vscode';

export class IdleWatcher {
    private timer?: ReturnType<typeof setTimeout>;

    constructor(private readonly onIdle: () => void) {
        this.reset();
    }

    public reset(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        const config = vscode.workspace.getConfiguration('paimon');
        const enabled = config.get<boolean>('enableIdleReminder', true);
        if (!enabled) {
            return;
        }

        const minutes = config.get<number>('idleMinutes', 30);
        this.timer = setTimeout(() => {
            this.onIdle();
        }, minutes * 60 * 1000);
    }

    public dispose(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
}
