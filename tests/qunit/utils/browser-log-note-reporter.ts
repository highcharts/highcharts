import type { Reporter } from '@playwright/test/reporter';
import { readFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { glob } from 'glob';

const QUNIT_CONSOLE_LOG_NOTE_MARKER = join(
    'tests',
    'qunit',
    '.console-log-note-printed.log'
);
const QUNIT_CONSOLE_LOG_GLOB = join('tests', 'qunit', 'console-worker-*.log');

class QUnitBrowserLogNoteReporter implements Reporter {
    onBegin(): void {
        const existingWorkerLogs = glob.sync(QUNIT_CONSOLE_LOG_GLOB, {
            nodir: true
        });

        for (const workerLog of existingWorkerLogs) {
            try {
                unlinkSync(workerLog);
            } catch (error) {
                const err = error as NodeJS.ErrnoException;
                if (err.code !== 'ENOENT') {
                    throw error;
                }
            }
        }

        try {
            unlinkSync(QUNIT_CONSOLE_LOG_NOTE_MARKER);
        } catch (error) {
            const err = error as NodeJS.ErrnoException;
            if (err.code !== 'ENOENT') {
                throw error;
            }
        }
    }

    onEnd(): void {
        try {
            readFileSync(QUNIT_CONSOLE_LOG_NOTE_MARKER, 'utf8');
        } catch (error) {
            const err = error as NodeJS.ErrnoException;
            if (err.code === 'ENOENT') {
                return;
            }
            throw error;
        }

        console.log(`🗒 Browser logs: ${QUNIT_CONSOLE_LOG_GLOB}`);

        try {
            unlinkSync(QUNIT_CONSOLE_LOG_NOTE_MARKER);
        } catch (error) {
            const err = error as NodeJS.ErrnoException;
            if (err.code !== 'ENOENT') {
                throw error;
            }
        }
    }
}

export default QUnitBrowserLogNoteReporter;
