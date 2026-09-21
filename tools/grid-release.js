/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-console: 0 */
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');

const root = path.resolve(__dirname, '..');
const cleanup = ['build', 'code', 'cypress', 'js', 'node_modules', 'out', 'tmp'];
const phases = ['reset', 'dry-run', 'candidate'];
const help = `Usage: node tools/grid-release.js [--plan] [--from PHASE] [--allow-non-master]

Interactive Grid release preparation. PHASE: reset, dry-run, candidate.
--plan prints the checklist without running commands (also works in CI).
--from resumes at a phase; you must have completed earlier phases yourself.
--allow-non-master bypasses the Highcharts branch check for debugging.
Requires sibling highcharts-utils, grid-lite-dist and grid-pro-dist clones.
Destructive steps require typing "approve"; manual steps require "done".
Any other answer, EOF or Ctrl+C stops the script. There is no auto-yes mode.
Stops on command failure. Never passes --push to dist-release.
`;

function command(args, cwd = root) {
    console.log(`\n${cwd}> ${args.join(' ')}`);
    // npm/npx are .cmd launchers on Windows. Arguments here are fixed literals.
    const result = spawnSync(args[0], args.slice(1), {
        cwd,
        stdio: 'inherit',
        shell: process.platform === 'win32'
    });
    if (result.error || result.status !== 0) {
        throw result.error || new Error(`Command failed: ${args.join(' ')}`);
    }
}

async function ask(message) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const controller = new AbortController();
    rl.on('close', () => controller.abort());
    rl.on('SIGINT', () => controller.abort());
    try {
        return (await rl.question(`${message}\n> `, {
            signal: controller.signal
        })).trim();
    } finally {
        rl.close();
    }
}

async function removeDirectory(file) {
    const start = Date.now();
    console.log(`Removing ${file}...`);
    const progress = setInterval(() => {
        console.log(
            `Still removing ${file} (${Math.round((Date.now() - start) / 1000)}s)...`
        );
    }, 5000);
    try {
        await fs.promises.rm(file, { recursive: true, force: true });
        console.log(`Removed ${file}.`);
    } finally {
        clearInterval(progress);
    }
}

async function runRelease({
    from = 'reset',
    plan = false,
    prompt = ask,
    run = command,
    remove = removeDirectory,
    readJSON = file => JSON.parse(fs.readFileSync(file, 'utf8'))
} = {}) {
    if (!phases.includes(from)) {
        throw new Error(`Unknown phase: ${from}`);
    }
    const utils = path.resolve(root, '../highcharts-utils');
    async function gate(message, answer = 'done') {
        const question = `${message} [type ${answer}]`;
        if (plan) {
            console.log(`\n${question}`);
        } else if (await prompt(question) !== answer) {
            throw new Error('Stopped without confirmation.');
        }
    }
    function execute(args) {
        if (plan) {
            console.log(args.join(' '));
        } else {
            run(args);
        }
    }
    if (from === 'reset') {
        await gate(
            `RESET: Delete these paths under ${root}:\n` +
            cleanup.join(', ') + '\nThis removes any work saved there.',
            'approve'
        );
        if (!plan) {
            for (const file of cleanup) {
                await remove(path.join(root, file));
            }
        }
        for (const repo of ['grid-lite-dist', 'grid-pro-dist']) {
            await gate(
                `In ${path.resolve(root, '..', repo)}, manually reset unwanted ` +
                'changes or commit and push work you want to keep.\n' +
                'Confirm there are no untracked or uncommitted files and ' +
                'the branch is main.'
            );
        }
        execute(['git', 'pull', '--ff-only']);
        execute(['npm', 'i']);
        if (plan) {
            console.log(`${utils}> npm i`);
        } else {
            run(['npm', 'i'], utils);
        }
    }
    if (from !== 'candidate') {
        await gate(
            'DRY RUN: Run npx gulp dist to build Highcharts and its ' +
            'declarations. This deletes build/ and code/.', 'approve'
        );
        execute(['npx', 'gulp', 'dist']);
        const properties = path.join(
            root, 'tools/gulptasks/grid/build-properties.json'
        );
        await gate(
            `Check the version in ${properties}` +
            (plan ? '.' : ` (currently ${readJSON(properties).version}).`) +
            '\nUpdate it manually if needed, then confirm it is correct.'
        );
        await gate(
            'Build Grid and Highcharts for the Pro tests. Generated files ' +
            'under build/, code/ and js/ will be replaced.', 'approve'
        );
        execute(['npx', 'gulp', 'scripts', '--product', 'Grid']);
        execute(['npx', 'gulp', 'scripts', '--force']);
        execute(['npm', 'run', 'gtest']);
        await gate(
            'Run Grid dist. This deletes build/ and code/ and rebuilds ' +
            'the Grid distribution.', 'approve'
        );
        execute(['npx', 'gulp', 'dist', '--product', 'Grid']);
        const config = path.join(utils, 'config.json');
        await gate(
            `Set "useMinifiedCode": true in ${config}.\n` +
            `Verify highchartsDir resolves to this checkout: ${root}.`
        );
        if (!plan && readJSON(config).useMinifiedCode !== true) {
            throw new Error('highcharts-utils must use minified code.');
        }
        await gate(
            'Rebuild Highcharts and compile for demo checks. Generated ' +
            'files under build/, code/ and js/ will be replaced.', 'approve'
        );
        execute(['npx', 'gulp', 'scripts', '--force']);
        execute(['npx', 'gulp', 'compile']);
        await gate(
            'Start/restart highcharts-utils and check every Grid Lite and ' +
            'Grid Pro demo. Confirm all demos pass.'
        );
        await gate(
            'Inspect both Highcharts-Grid-Lite-x.x.x.zip and ' +
            'Highcharts-Grid-Pro-x.x.x.zip under build/dist/.\n' +
            'Confirm versions, packaged code, declarations and examples.'
        );
    }
    await gate(
        'RELEASE CANDIDATE (Dev team / Ken): Confirm all dry-run checks ' +
        'passed for this version and both dist repositories are clean ' +
        'on main, including no untracked files.'
    );
    await gate(
        'Run npx gulp dist-release --product Grid. This pulls/rebases and ' +
        'deletes/replaces files in ../grid-lite-dist and ../grid-pro-dist.\n' +
        'It runs npm publish --dry-run, without committing, tagging or pushing.',
        'approve'
    );
    execute(['npx', 'gulp', 'dist-release', '--product', 'Grid']);
    console.log(plan ? '\nPlan only; no changes made.' :
        '\nCandidate prepared locally. Review both dist repositories.');
}

async function main(args) {
    let from = 'reset';
    let plan = false;
    let allowNonMaster = false;
    for (let i = 0; i < args.length; ++i) {
        if (args[i] === '--help') {
            console.log(help);
            return;
        }
        if (args[i] === '--plan') {
            plan = true;
        } else if (args[i] === '--allow-non-master') {
            allowNonMaster = true;
        } else if (args[i] === '--from' && phases.includes(args[i + 1])) {
            from = args[++i];
        } else {
            throw new Error(`Unknown argument: ${args[i]}\n${help}`);
        }
    }
    if (!plan) {
        if (!process.stdin.isTTY || !process.stdout.isTTY) {
            throw new Error('An interactive terminal is required. Use --plan in CI.');
        }
        if (!allowNonMaster && execFileSync('git', ['branch', '--show-current'], {
            cwd: root, encoding: 'utf8'
        }).trim() !== 'master') {
            throw new Error(
                'Run from master, or use --allow-non-master for debugging. ' +
                'No branch is switched automatically.'
            );
        }
        for (const repo of ['highcharts-utils', 'grid-lite-dist', 'grid-pro-dist']) {
            if (!fs.existsSync(path.resolve(root, '..', repo, 'package.json'))) {
                throw new Error(`Missing sibling repository: ${repo}`);
            }
        }
    }
    await runRelease({ from, plan });
}

if (require.main === module) {
    main(process.argv.slice(2)).catch(error => {
        console.error(error.message);
        process.exitCode = 1;
    });
}

module.exports = { main, runRelease };
