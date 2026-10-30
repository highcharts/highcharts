#!/usr/bin/env node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import TS from 'typescript';
import { glob } from 'glob';
import Yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const ROOT = process.cwd();
const DEFAULT_SAMPLE_GLOB = 'highcharts/demo/**';
const exclude = [
    // Plugin with internal series props
    'stock/demo/candlestick-volume-width',
    // Stock Tools
    'stock/demo/stock-tools-custom-gui',
    // @todo: Document `annotations.langKey`
    'stock/demo/technical-analysis'
];
const ANSI = {
    green: '\u001b[32m',
    red: '\u001b[31m',
    reset: '\u001b[39m',
    yellow: '\u001b[33m'
};

const argv = Yargs(hideBin(process.argv))
    .option('samples', {
        type: 'string',
        default: DEFAULT_SAMPLE_GLOB,
        describe: 'Glob under samples/ to include, e.g. highcharts/demo/**'
    })
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
    .option('validate', {
        type: 'boolean',
        default: false,
        describe: 'Validate existing demo.ts files instead of converting demo.js files'
    })
    .strict()
    .parse();

if (argv.validate) {
    console.error('The --validate argument is obsolete. Use "gulp typecheck-samples" instead.');
    process.exit(1);
}

function colorize(color, text) {
    if (!process.stdout.isTTY) {
        return text;
    }

    return `${ANSI[color]}${text}${ANSI.reset}`;
}

function formatDiagnostics(diagnostics, filePathOverride) {
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
            const fileName = filePathOverride || path.basename(diagnostic.file.fileName);

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
            (
                node.expression.name.text === 'chart' ||
                node.expression.name.text === 'stockChart' ||
                node.expression.name.text === 'mapChart' ||
                node.expression.name.text === 'ganttChart'
            ) &&
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

function getSampleProduct(relativePath) {
    return relativePath.split(path.sep)[1];
}

function getSampleProjectConfigPath(demoJsPath) {
    const relativePath = path.relative(ROOT, demoJsPath);
    const product = getSampleProduct(relativePath);

    if (!product) {
        throw new Error(`Cannot determine sample product for ${relativePath}`);
    }

    return path.join(ROOT, 'samples', `tsconfig.${product}.json`);
}

function getAncestorSampleConfigPaths(demoJsPath) {
    const configPaths = [];
    const samplesRoot = path.join(ROOT, 'samples');
    let currentDir = path.dirname(demoJsPath);

    while (currentDir.startsWith(samplesRoot)) {
        const configPath = path.join(currentDir, 'tsconfig.json');

        if (TS.sys.fileExists(configPath)) {
            configPaths.push(configPath);
        }

        if (currentDir === samplesRoot) {
            break;
        }

        currentDir = path.dirname(currentDir);
    }

    return configPaths;
}

function readParsedConfig(configPath) {
    const parsed = TS.getParsedCommandLineOfConfigFile(
        configPath,
        {},
        TS.sys
    );

    if (!parsed) {
        throw new Error(`Unable to parse ${path.relative(ROOT, configPath)}`);
    }

    return parsed;
}

function isDeclarationFile(fileName) {
    return fileName.endsWith('.d.ts') || fileName.endsWith('.d.mts');
}

function getSampleCompilerContext(demoJsPath) {
    const projectConfigPath = getSampleProjectConfigPath(demoJsPath);
    const projectConfig = readParsedConfig(projectConfigPath);
    const declarationFiles = new Set(
        projectConfig.fileNames.filter(isDeclarationFile)
    );

    for (const configPath of getAncestorSampleConfigPaths(demoJsPath)) {
        const ancestorConfig = readParsedConfig(configPath);

        for (const fileName of ancestorConfig.fileNames) {
            if (isDeclarationFile(fileName)) {
                declarationFiles.add(fileName);
            }
        }
    }

    return {
        compilerOptions: {
            ...projectConfig.options,
            noEmit: true,
            noEmitOnError: true,
            skipLibCheck: true
        },
        declarationFiles: [...declarationFiles]
    };
}

function compileDemo(sourceFileName, demoJsPath) {
    const { compilerOptions, declarationFiles } = getSampleCompilerContext(
        demoJsPath
    );
    const program = TS.createProgram(
        [...declarationFiles, sourceFileName],
        compilerOptions
    );

    return TS.getPreEmitDiagnostics(program);
}

async function verifySample(demoJsPath, tempRoot) {
    const demoTsPath = demoJsPath.replace(/\.js$/u, '.ts');
    const relativeJsPath = path.relative(ROOT, demoJsPath);
    const relativeTsPath = path.relative(ROOT, demoTsPath);

    if (argv.validate) {
        if (!await fileExists(demoTsPath)) {
            return {
                status: 'skip',
                relativePath: relativeJsPath,
                reason: `${relativeTsPath} does not exist`
            };
        }

        const diagnostics = compileDemo(demoTsPath, demoTsPath);
        const hasDiagnostics = diagnostics.length > 0;

        if (hasDiagnostics) {
            return {
                status: 'fail',
                relativePath: relativeJsPath,
                reason: formatDiagnostics(diagnostics, relativeTsPath)
            };
        }

        return {
            status: 'pass',
            relativePath: relativeJsPath,
            savedAs: relativeTsPath
        };
    }

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
    ) && !argv.validate && (
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
            reason: formatDiagnostics(
                diagnostics,
                shouldWrite ? path.relative(ROOT, demoJsPath).replace(/\.js$/u, '.ts') : undefined
            ),
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
    const sampleGlob = (argv.samples || DEFAULT_SAMPLE_GLOB).replace(/^samples\//u, '');
    const demoFilePattern = argv.validate ? 'demo.ts' : 'demo.js';
    const demoFiles = (await glob(`samples/${sampleGlob}/${demoFilePattern}`, {
        cwd: ROOT,
        absolute: true,
        nodir: true,
        ignore: ['**/node_modules/**']
    })).sort();

    const eligibleFiles = [];
    const excludedFiles = [];

    for (const demoPath of demoFiles) {
        const relativePath = path.relative(ROOT, demoPath);

        if (isExcludedDemo(relativePath)) {
            excludedFiles.push(demoPath);
            continue;
        }

        if (argv.validate) {
            eligibleFiles.push(demoPath);
            continue;
        }

        const demoTsPath = demoPath.replace(/\.js$/u, '.ts');

        if (await fileExists(demoTsPath)) {
            continue;
        }

        eligibleFiles.push(demoPath);
    }

    return { eligibleFiles, excludedFiles };
}

async function main() {
    const { eligibleFiles, excludedFiles } = await getDemoJsFiles();
    let demoJsFiles = eligibleFiles;

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
    let skipped = excludedFiles.length;
    let written = 0;

    for (const excludedDemoJsPath of excludedFiles) {
        console.log(colorize(
            'yellow',
            `SKIP  ${path.relative(ROOT, excludedDemoJsPath)}  (Excluded)`
        ));
    }

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
                if (result.savedAs && argv.write && !argv.validate) {
                    written += 1;
                    console.log(`WRITE ${result.savedAs}`);
                }
            } else {
                failed += 1;
                console.log(colorize('red', `FAIL  ${result.relativePath}`));
                console.log(result.reason);
                if (result.writtenAs && !argv.validate) {
                    written += 1;
                    console.log(`WRITE ${result.writtenAs}`);
                }
            }
        }
    } finally {
        await fs.rm(tempRoot, { recursive: true, force: true });
    }

    const total = demoJsFiles.length + excludedFiles.length;
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