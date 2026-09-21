/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-console: 0 */
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');

const root = path.resolve(__dirname, '../..');
const cleanup = ['build', 'code', 'cypress', 'js', 'node_modules', 'out', 'tmp'];
const phases = ['reset', 'dry-run', 'candidate'];
const repositories = {
    Grid: ['grid-lite-dist', 'grid-pro-dist'],
    Dashboards: ['dashboards-dist']
};

function getHelp(product) {
    return `Usage: node tools/${product.toLowerCase()}-release.js [--plan] [--from PHASE] [--allow-non-master]

Interactive ${product} release preparation. PHASE: reset, dry-run, candidate.
--plan prints the checklist without running commands (also works in CI).
--from resumes at a phase; you must have completed earlier phases yourself.
--allow-non-master bypasses the Highcharts branch check for debugging.
Requires sibling highcharts-utils and ${repositories[product].join(', ')} clones.
Destructive steps require typing "approve"; manual steps require "done".
${product === 'Dashboards' ?
        'The candidate selection also accepts "skip" for bugfix releases.\n' : ''}Other answers, EOF or Ctrl+C stop the script. There is no auto-yes mode.
Stops on command failure. Never passes --push to dist-release.
`;
}

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
    product = 'Grid',
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
    const dashboards = product === 'Dashboards';
    const repos = repositories[product];
    const branch = 'main';
    const config = path.join(utils, 'config.json');
    async function gate(message, answer = 'done', skippable = false) {
        const approval = answer === 'approve';
        const label = approval ? 'Approval required:' : 'Confirmation required:';
        const color = approval ? '\u001b[1;33m' : '\u001b[1;36m';
        const prefix = process.stdout.isTTY && !('NO_COLOR' in process.env) ?
            `${color}${label}\u001b[0m\n` : `${label}\n`;
        const question = `${prefix}${message} [type ${answer}` +
            `${skippable ? ' or skip' : ''}]`;
        if (plan) {
            console.log(`\n${question}`);
        } else {
            const response = await prompt(question);
            if (skippable && response === 'skip') {
                return false;
            }
            if (response !== answer) {
                throw new Error('Stopped without confirmation.');
            }
        }
        return true;
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
        for (const repo of repos) {
            await gate(
                `In ${path.resolve(root, '..', repo)}, manually reset unwanted ` +
                'changes or commit and push work you want to keep.\n' +
                'Confirm there are no untracked or uncommitted files and ' +
                `the branch is ${branch}.`
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
        if (dashboards) {
            await gate(
                `Disable compileOnDemand and useMinifiedCode in ${config}.\n` +
                'Disable Compile on Demand in the utils UI too, and verify ' +
                `highchartsDir resolves to ${root}. Restart the utils server.`
            );
            if (!plan) {
                const settings = readJSON(config);
                if (settings.compileOnDemand !== false ||
                    settings.useMinifiedCode !== false) {
                    throw new Error(
                        'Disable compileOnDemand and useMinifiedCode first.'
                    );
                }
            }
        }
        await gate(
            dashboards ?
                'DRY RUN: Build Highcharts with npx gulp scripts. ' +
                'Generated build/, code/ and js/ files will be replaced.' :
                'DRY RUN: Run npx gulp dist to build Highcharts and its ' +
            'declarations. This deletes build/ and code/.', 'approve'
        );
        execute(['npx', 'gulp', dashboards ? 'scripts' : 'dist']);
        const properties = path.join(
            root, `tools/gulptasks/${product.toLowerCase()}/build-properties.json`
        );
        await gate(
            `Check the version in ${properties}` +
            (plan ? '.' : ` (currently ${readJSON(properties).version}).`) +
            '\nUpdate it manually if needed, then confirm it is correct.'
        );
        if (dashboards) {
            await gate(
                'Build Grid and run Dashboards, Cypress and Highcharts tests. ' +
                'Build/test tasks replace generated files under build/, ' +
                'code/, js/ and test output directories.', 'approve'
            );
            execute(['npm', 'run', 'gcode']);
            execute(['npm', 'run', 'dtest']);
            execute(['npx', 'gulp', 'test-cypress', '--product', 'Dashboards']);
            execute(['npm', 'test']);
            await gate(
                'Build Highcharts, Grid and Dashboards with npx gulp dist ' +
                '--with-deps. This deletes build/ and code/ initially, ' +
                'then preserves dependency code between builds.', 'approve'
            );
            execute(['npx', 'gulp', 'dist', '--with-deps']);
        } else {
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
        }
        await gate(
            `Set "useMinifiedCode": true in ${config}.\n` +
            `Verify highchartsDir resolves to this checkout: ${root}.`
        );
        if (!plan) {
            const settings = readJSON(config);
            if (settings.useMinifiedCode !== true) {
                throw new Error('highcharts-utils must use minified code.');
            }
            if (dashboards && settings.compileOnDemand !== false) {
                throw new Error('Keep compileOnDemand disabled for demo checks.');
            }
        }
        if (dashboards) {
            await gate(
                'Keep Compile on Demand disabled, restart highcharts-utils ' +
                'and check every Dashboards, Grid Lite and Grid Pro demo. ' +
                'Confirm all demos pass using minified code.'
            );
            await gate(
                'Inspect Highcharts-Dashboards-x.x.x.zip under ' +
                'build/dist/ (unpacked contents: build/dist/dashboards). ' +
                'Confirm version, code, declarations ' +
                'and examples; compare package code with dashboards-dist.'
            );
        } else {
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
    }
    if (dashboards && !await gate(
        'RELEASE CANDIDATE: Prepare for a non-bugfix release or major changes. ' +
        'Type skip for a bugfix release that does not need a candidate.',
        'done', true
    )) {
        console.log('Dry run complete. Candidate preparation skipped.');
        return;
    }
    await gate(
        'RELEASE CANDIDATE: Confirm all dry-run checks passed for this ' +
        `version and ${repos.join(', ')} are clean on ${branch}, ` +
        'including no untracked files.'
    );
    await gate(
        `Run npx gulp dist-release --product ${product}. This pulls/rebases ` +
        `and deletes/replaces files in sibling ${repos.join(', ')}.\n` +
        'It runs npm publish --dry-run, without committing, tagging or pushing.',
        'approve'
    );
    execute(['npx', 'gulp', 'dist-release', '--product', product]);
    console.log(plan ? '\nPlan only; no changes made.' :
        '\nCandidate prepared locally. Review the dist repositories. ' +
        'Do not run the suggested publish commands.');
}

async function main(args, product = 'Grid') {
    const help = getHelp(product);
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
        for (const repo of ['highcharts-utils', ...repositories[product]]) {
            if (!fs.existsSync(path.resolve(root, '..', repo, 'package.json'))) {
                throw new Error(`Missing sibling repository: ${repo}`);
            }
        }
    }
    await runRelease({ from, plan, product });
}

module.exports = { main, runRelease };
