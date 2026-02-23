import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function getStat(path: string): ReturnType<typeof statSync> | undefined {
    try {
        return statSync(path);
    } catch {
        return;
    }
}

function getNewestMTime(path: string): number {
    const stats = getStat(path);

    if (!stats) {
        return Number.NEGATIVE_INFINITY;
    }

    if (!stats.isDirectory()) {
        return Number(stats.mtimeMs);
    }

    let entries: string[];

    try {
        entries = readdirSync(path);
    } catch {
        return Number.POSITIVE_INFINITY;
    }

    let newestMTime = Number(stats.mtimeMs);

    for (const entry of entries) {
        const entryPath = join(path, entry);
        const entryMTime = getNewestMTime(entryPath);

        if (!Number.isFinite(entryMTime)) {
            return Number.POSITIVE_INFINITY;
        }

        if (entryMTime > newestMTime) {
            newestMTime = entryMTime;
        }
    }

    return newestMTime;
}

export function shouldBuild(check: string, inputs: readonly string[]): boolean {
    if (!existsSync(check)) {
        return true;
    }

    const outputStats = getStat(check);

    if (!outputStats) {
        return true;
    }

    const outputMTime = Number(outputStats.mtimeMs);

    for (const input of inputs) {
        if (!existsSync(input)) {
            continue;
        }

        const inputMTime = getNewestMTime(input);

        if (!Number.isFinite(inputMTime) || inputMTime > outputMTime) {
            return true;
        }
    }

    return false;
}
