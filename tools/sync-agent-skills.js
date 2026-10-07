#!/usr/bin/env node
/*
 * Synchronize canonical skills to Claude and GitHub code review.
 * Usage: node tools/sync-agent-skills.js [--yes|-y] [--help|-h]
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const repoRoot = path.resolve(__dirname, '..');
const src = path.join(repoRoot, '.agents', 'skills');
const targets = [
    {
        source: src,
        destination: path.join(repoRoot, '.claude', 'skills')
    },
    {
        source: path.join(src, 'code-review'),
        destination: path.join(repoRoot, '.github', 'skills', 'code-review')
    }
];
const destinationNames = targets.map(
    target => path.relative(repoRoot, target.destination)
).join(' and ');

class CliError extends Error {
    constructor(message, exitCode = 1) {
        super(message);
        this.exitCode = exitCode;
    }
}

function printHelp() {
    process.stdout.write(
        [
            'Sync canonical .agents/skills to .claude/skills.',
            'Also sync code-review to .github/skills/code-review.',
            '',
            'Usage:',
            '  npm run sync:skills -- [--yes]',
            '  node tools/sync-agent-skills.js [--yes|-y] [--help|-h]',
            '',
            'Options:',
            '  --yes, -y   Replace destination content without confirmation.',
            '  --help, -h  Print this help text.'
        ].join('\n') + '\n'
    );
}

function parseArgs(argv) {
    let assumeYes = false;
    let showHelp = false;

    for (const arg of argv) {
        if (arg === '--yes' || arg === '-y') {
            assumeYes = true;
            continue;
        }

        if (arg === '--help' || arg === '-h') {
            showHelp = true;
            continue;
        }

        throw new CliError(`Unknown option: ${arg}`);
    }

    return {
        assumeYes,
        showHelp
    };
}

function hasEntries(directory) {
    return fs.existsSync(directory) && fs.readdirSync(directory).length > 0;
}

function clearDirectory(directory) {
    if (!fs.existsSync(directory)) {
        return;
    }

    for (const entry of fs.readdirSync(directory)) {
        fs.rmSync(path.join(directory, entry), {
            force: true,
            recursive: true
        });
    }
}

function copyDirectory(sourceDir, destinationDir) {
    fs.mkdirSync(destinationDir, { recursive: true });

    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
        const sourcePath = path.join(sourceDir, entry.name);
        const destinationPath = path.join(destinationDir, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(sourcePath, destinationPath);
            continue;
        }

        if (entry.isSymbolicLink()) {
            const target = fs.readlinkSync(sourcePath);
            fs.symlinkSync(target, destinationPath);
            continue;
        }

        fs.copyFileSync(sourcePath, destinationPath);
    }
}

function askToContinue(question) {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(question, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

async function run() {
    const { assumeYes, showHelp } = parseArgs(process.argv.slice(2));

    if (showHelp) {
        printHelp();
        return;
    }

    for (const { source } of targets) {
        if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
            throw new CliError(
                `Missing source directory: ${path.relative(repoRoot, source)}`
            );
        }
    }

    if (targets.some(target => hasEntries(target.destination)) && !assumeYes) {
        if (!process.stdin.isTTY) {
            throw new CliError(
                `Refusing to replace ${destinationNames} without ` +
                'confirmation in non-interactive mode. Re-run with --yes.'
            );
        }

        const reply = await askToContinue(
            `This will replace contents of ${destinationNames}. Continue? [y/N] `
        );

        if (!/^(?:y|yes)$/iu.test(reply.trim())) {
            process.stdout.write('Aborted.\n');
            return;
        }
    }

    for (const { source, destination } of targets) {
        clearDirectory(destination);
        copyDirectory(source, destination);
    }

    process.stdout.write(`Synced .agents/skills -> ${destinationNames}\n`);
}

run().catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = error.exitCode || 1;
});
