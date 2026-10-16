#!/usr/bin/env node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import TS from 'typescript';
import { glob } from 'glob';
import Yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const ROOT = process.cwd();
const SAMPLE_GLOB = 'samples/stock/demo/**/demo.js';
const HIGHCHARTS_DECLARATIONS = path.join(ROOT, 'code', 'highcharts.d.ts');
const STOCK_DECLARATIONS = path.join(ROOT, 'code', 'modules', 'stock.d.ts');
const exclude = [
    // Highcharts.patterns not typed in highcharts.d.ts
    'highcharts/demo/accessible-pie',
    // Uses custom series type and custom props like Point.highPlot
    'highcharts/demo/advanced-accessible',
    // Sonification methods are not yet typed, although they are part of the API
    'highcharts/demo/all-instruments',
    // HighchartsConnectors is not available
    'highcharts/demo/annotations',
    // Complex demo, various custom props and methods
    'highcharts/demo/area-race-chart',
    // Sonification methods are not yet typed, although they are part of the API
    'highcharts/demo/audio-boxplot',
    // Contains text animation plugin, extending internal props like Fx
    'highcharts/demo/bar-race',

    // Plugin with internal series props
    'stock/demo/candlestick-volume-width'
];
const ANSI = {
    green: '\u001b[32m',
    red: '\u001b[31m',
    reset: '\u001b[39m',
    yellow: '\u001b[33m'
};

const argv = Yargs(hideBin(process.argv))
    .option('limit', {
        type: 'number',
        describe: 'Maximum number of demos to verify'
    })
    .option('index', {
        type: 'number',
        describe: 'Index of one eligible unconverted demo to verify'
    })
    .option('write', {
        choices: ['pass', 'all'],
        describe: 'Write demo.ts files for passing demos or for all demos'
    })
    .strict()
    .parse();

function colorize(color, text) {
    if (!process.stdout.isTTY) {
        return text;
    }

    return `${ANSI[color]}${text}${ANSI.reset}`;
}

function formatDiagnostics(diagnostics) {
    return diagnostics.filter(diagnostic => {
        const message = TS.flattenDiagnosticMessageText(
            diagnostic.messageText,
            '\n'
        );

        return !(
            diagnostic.code === 2769 &&
            message.startsWith('No overload matches this call.')
        );
    }).map(diagnostic => {
        const message = TS.flattenDiagnosticMessageText(
            diagnostic.messageText,
            '\n'
        );

        if (diagnostic.file && typeof diagnostic.start === 'number') {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
                diagnostic.start
            );
            const fileName = path.basename(diagnostic.file.fileName);

            return `${fileName}:${line + 1}:${character + 1} ${message}`;
        }

        return message;
    }).join('\n');
}

function addOptionsSatisfiesAssertion(sourceText) {
    const sourceFile = TS.createSourceFile(
        'demo.js',
        sourceText,
        TS.ScriptTarget.ES2022,
        true,
        TS.ScriptKind.JS
    );

    let chartConfigNode;

    function visit(node) {
        if (chartConfigNode) {
            return;
        }

        if (
            TS.isCallExpression(node) &&
            TS.isPropertyAccessExpression(node.expression) &&
            node.expression.name.text === 'chart' &&
            node.arguments.length >= 2 &&
            TS.isObjectLiteralExpression(node.arguments[1])
        ) {
            chartConfigNode = node.arguments[1];
            return;
        }

        TS.forEachChild(node, visit);
    }

    visit(sourceFile);

    if (!chartConfigNode) {
        return sourceText;
    }

    const insertAt = chartConfigNode.end;
    return `${sourceText.slice(0, insertAt)} satisfies Highcharts.Options${sourceText.slice(insertAt)}`;
}

async function writeSampleFiles(demoJsPath, sourceText) {
    const sampleDir = path.dirname(demoJsPath);
    const demoTsPath = path.join(sampleDir, 'demo.ts');
    const gitignorePath = path.join(sampleDir, '.gitignore');

    await fs.writeFile(demoTsPath, sourceText, 'utf8');
    await fs.writeFile(gitignorePath, 'demo.js', 'utf8');
    await fs.rm(demoJsPath, { force: true });

    return path.relative(ROOT, demoTsPath);
}

function compileDemo(sourceFileName, demoJsPath) {
    const compilerOptions = {
        target: TS.ScriptTarget.ES2022,
        module: TS.ModuleKind.ES2022,
        moduleResolution: TS.ModuleResolutionKind.Node10,
        jsx: TS.JsxEmit.Preserve,
        noEmit: true,
        noEmitOnError: true,
        skipLibCheck: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        strict: false
    };

    const rootFiles = [HIGHCHARTS_DECLARATIONS];

    if (demoJsPath.includes(`${path.sep}samples${path.sep}stock${path.sep}`)) {
        rootFiles.push(STOCK_DECLARATIONS);
    }

    const program = TS.createProgram([...rootFiles, sourceFileName], compilerOptions);
    return TS.getPreEmitDiagnostics(program);
}

async function verifySample(demoJsPath, tempRoot) {
    const demoTsPath = demoJsPath.replace(/\.js$/u, '.ts');
    const relativeJsPath = path.relative(ROOT, demoJsPath);
    const relativeTsPath = path.relative(ROOT, demoTsPath);

    if (await fileExists(demoTsPath)) {
        return {
            status: 'skip',
            relativePath: relativeJsPath,
            reason: `${relativeTsPath} already exists`
        };
    }

    const sourceText = await fs.readFile(demoJsPath, 'utf8');
    const transformedText = addOptionsSatisfiesAssertion(sourceText);
    const sampleTempDir = path.join(
        tempRoot,
        path.relative(ROOT, path.dirname(demoJsPath))
    );

    await fs.mkdir(sampleTempDir, { recursive: true });

    const tempDemoTsPath = path.join(sampleTempDir, 'demo.ts');
    await fs.writeFile(tempDemoTsPath, transformedText, 'utf8');

    const diagnostics = compileDemo(tempDemoTsPath, demoJsPath);
    const hasDiagnostics = diagnostics.length > 0;
    const shouldWrite = !exclude.some(pattern =>
        relativeJsPath.includes(pattern)
    ) && (
        argv.write === 'all' ||
        (argv.write === 'pass' && !hasDiagnostics)
    );
    let writtenAs;

    if (shouldWrite) {
        writtenAs = await writeSampleFiles(demoJsPath, transformedText);
    }

    if (hasDiagnostics) {
        return {
            status: 'fail',
            relativePath: relativeJsPath,
            reason: formatDiagnostics(diagnostics),
            writtenAs
        };
    }

    return {
        status: 'pass',
        relativePath: relativeJsPath,
        savedAs: writtenAs || path.relative(ROOT, tempDemoTsPath)
    };
}

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

function isExcludedDemo(relativePath) {
    return exclude.some(pattern => relativePath.includes(pattern));
}

async function getDemoJsFiles() {
    const demoJsFiles = (await glob(SAMPLE_GLOB, {
        cwd: ROOT,
        absolute: true,
        nodir: true,
        ignore: ['**/node_modules/**']
    })).sort();

    const eligibleFiles = [];

    for (const demoJsPath of demoJsFiles) {
        const relativeJsPath = path.relative(ROOT, demoJsPath);

        if (isExcludedDemo(relativeJsPath)) {
            continue;
        }

        const demoTsPath = demoJsPath.replace(/\.js$/u, '.ts');

        if (await fileExists(demoTsPath)) {
            continue;
        }

        eligibleFiles.push(demoJsPath);
    }

    return eligibleFiles;
}

async function main() {
    let demoJsFiles = await getDemoJsFiles();

    if (typeof argv.index === 'number') {
        if (!Number.isInteger(argv.index) || argv.index < 0) {
            throw new Error('--index must be a non-negative integer');
        }

        const selectedDemo = demoJsFiles[argv.index];

        if (!selectedDemo) {
            throw new Error(
                `--index ${argv.index} is out of range for ${demoJsFiles.length} eligible demos`
            );
        }

        demoJsFiles = [selectedDemo];
        console.log(`Selecting demo index ${argv.index}: ${path.relative(ROOT, selectedDemo)}`);
    }

    if (typeof argv.limit === 'number') {
        if (!Number.isInteger(argv.limit) || argv.limit < 0) {
            throw new Error('--limit must be a non-negative integer');
        }

        demoJsFiles = demoJsFiles.slice(0, argv.limit);
        console.log(`Limiting verification to ${demoJsFiles.length} demos.`);
    }

    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'verify-demo-ts-'));

    let passed = 0;
    let failed = 0;
    let skipped = 0;
    let written = 0;

    try {
        for (const demoJsPath of demoJsFiles) {
            const result = await verifySample(demoJsPath, tempRoot);

            for (const pattern of exclude) {
                if (result.relativePath.includes(pattern)) {
                    result.status = 'skip';
                    result.reason = 'Excluded';
                    break;
                }
            }

            if (result.status === 'skip') {
                skipped += 1;
                console.log(colorize(
                    'yellow',
                    `SKIP  ${result.relativePath}  (${result.reason})`
                ));
            } else if (result.status === 'pass') {
                passed += 1;
                console.log(colorize('green', `PASS  ${result.relativePath}`));
                if (result.savedAs && argv.write) {
                    written += 1;
                    console.log(`WRITE ${result.savedAs}`);
                }
            } else {
                failed += 1;
                console.log(colorize('red', `FAIL  ${result.relativePath}`));
                console.log(result.reason);
                if (result.writtenAs) {
                    written += 1;
                    console.log(`WRITE ${result.writtenAs}`);
                }
            }
        }
    } finally {
        await fs.rm(tempRoot, { recursive: true, force: true });
    }

    const total = demoJsFiles.length;
    console.log('');
    console.log(`Checked ${total} demos: ${passed} pass, ${failed} fail, ${skipped} skipped, ${written} written.`);

    if (failed) {
        process.exitCode = 1;
    }
}

process.stdout.on('error', error => {
    if (error && error.code !== 'EPIPE') {
        throw error;
    }
});

main().catch(error => {
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
});