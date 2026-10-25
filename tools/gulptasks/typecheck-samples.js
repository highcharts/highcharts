/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const fs = require('node:fs');
const path = require('node:path');
const Colors = require('colors');
const { spawnSync } = require('node:child_process');

function resolveTsgoBinary() {
    const candidates = [
        process.env.HIGHCHARTS_TYPECHECK_TSGO,
        process.env.TSGO_BIN,
        process.env.TS_GO_BIN
    ].filter(Boolean);

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return {
                name: 'tsgo',
                binary: process.execPath,
                args: [candidate]
            };
        }
    }

    try {
        const packageJsonPath = require.resolve('@typescript/native-preview/package.json');
        const binaryPath = path.join(path.dirname(packageJsonPath), 'bin', 'tsgo');
        if (fs.existsSync(binaryPath)) {
            return {
                name: 'tsgo',
                binary: process.execPath,
                args: [binaryPath]
            };
        }
    } catch (error) {
        if (!['MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND'].includes(error.code)) {
            throw error;
        }
    }

    return null;
}

function normalizeTsgoConfigOption(key, value) {
    const ts = require('typescript');
    const numericEnumMap = {
        target: ts.ScriptTarget,
        module: ts.ModuleKind,
        moduleResolution: ts.ModuleResolutionKind,
        moduleDetection: ts.ModuleDetectionKind,
        jsx: ts.JsxEmit
    };

    if (Array.isArray(value)) {
        return value.map(item => normalizeTsgoConfigOption(key, item));
    }
    if (key === 'lib' && typeof value === 'string') {
        return value.toLowerCase();
    }
    if (typeof value === 'number' && key in numericEnumMap) {
        return String(numericEnumMap[key][value] ?? value);
    }
    return value;
}

function resolveTsgoCompilerOptions(configPath, config, demoParsed) {
    const ts = require('typescript');
    const rawConfig = config?.config || {};
    const inheritedOptions = {};

    if (rawConfig.extends) {
        const extendsList = Array.isArray(rawConfig.extends) ?
            rawConfig.extends : [rawConfig.extends];

        for (const parent of extendsList) {
            const parentPath = path.isAbsolute(parent) ?
                parent :
                path.resolve(path.dirname(configPath), parent);
            const parentConfigPath = ts.sys.fileExists(parentPath) ?
                parentPath :
                `${parentPath}.json`;
            const parentConfig = ts.readConfigFile(
                parentConfigPath,
                ts.sys.readFile
            );

            if (parentConfig?.config) {
                Object.assign(
                    inheritedOptions,
                    resolveTsgoCompilerOptions(parentConfigPath, parentConfig, demoParsed)
                );
            }
        }
    }

    return {
        ...inheritedOptions,
        ...(rawConfig.compilerOptions || {})
    };
}

function createTsgoConfig(configPath, config, demoParsed, demo, declarations, batchFiles = null) {
    const allowedOptions = new Set([
        'allowUmdGlobalAccess',
        'checkJs',
        'esModuleInterop',
        'jsx',
        'lib',
        'module',
        'moduleDetection',
        'moduleResolution',
        'noEmit',
        'noImplicitAny',
        'noImplicitThis',
        'strict',
        'target',
        'types'
    ]);
    const rawCompilerOptions = resolveTsgoCompilerOptions(
        configPath,
        config,
        demoParsed
    );
    const compilerOptions = Object.fromEntries(
        Object.entries(rawCompilerOptions).filter(
            ([key]) => allowedOptions.has(key)
        ).map(([key, value]) => [key, normalizeTsgoConfigOption(key, value)])
    );
    const files = [...new Set([
        ...declarations,
        ...(batchFiles || [demo])
    ])];
    const configData = {
        compilerOptions: {
            ...compilerOptions,
            noEmit: true,
            strict: false,
            noImplicitAny: true,
            noImplicitThis: true
        },
        files
    };
    const tempDir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'tsgo-demo-'));
    const configFile = path.join(tempDir, 'tsconfig.tsgo.json');
    fs.writeFileSync(configFile, JSON.stringify(configData, null, 2));

    return { configFile, tempDir };
}

function runTsgoTypecheck(configPath, config, demoParsed, demo, declarations, batchFiles = null) {
    const tsgo = resolveTsgoBinary();
    if (!tsgo) {
        return null;
    }

    const { configFile, tempDir } = createTsgoConfig(
        configPath,
        config,
        demoParsed,
        demo,
        declarations,
        batchFiles
    );
    try {
        const result = spawnSync(
            tsgo.binary,
            [...tsgo.args, '--pretty', 'false', '--noEmit', '-p', configFile],
            {
                cwd: process.cwd(),
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'pipe']
            }
        );
        return {
            status: result.status ?? 1,
            output: [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
        };
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

function resolveTypeScript(log = { message: () => {} }) {
    const ts = require('typescript');
    log.message('Using TypeScript compiler: typescript');
    return ts;
}

function countTsErrors(output = '') {
    return (output.match(/error TS\d+:/g) || []).length ||
        (output.trim() ? 1 : 0);
}

function collectFailedFiles(output = '', fallbackFiles = []) {
    const matches = [...output.matchAll(
        /(?:^|\s)([A-Za-z0-9_./-]+\.ts(?:x)?)(?:\(\d+,\d+\))?:\s*error TS\d+:/g
    )];
    const files = new Set(matches.map(match => match[1]).filter(Boolean));

    if (files.size) {
        return files;
    }

    return fallbackFiles.length ? new Set(fallbackFiles) : new Set();
}

function parseTsgoDiagnostics(output = '') {
    const ts = require('typescript');
    const lines = output.split(/\r?\n/).filter(Boolean);
    const diagnostics = [];

    for (const line of lines) {
        const match = line.match(/^(.+?)\((\d+),(\d+)\):\s*error\s+TS(\d+):\s*(.*)$/);
        if (!match) {
            continue;
        }

        const [, fileName, lineText, columnText, codeText, messageText] = match;
        diagnostics.push({
            category: ts.DiagnosticCategory.Error,
            messageText: messageText.trim(),
            code: Number(codeText),
            fileName,
            line: Number(lineText),
            column: Number(columnText)
        });
    }

    return diagnostics;
}

function normalizeTsgoFailure(config, demoParsed, output, status) {
    const ts = require('typescript');
    const messageText = output || 'Sample typechecking failed.';
    const hasFailure = status !== 0 || /error TS\d+:/.test(messageText);

    if (!hasFailure) {
        return [];
    }

    const parsed = parseTsgoDiagnostics(messageText);

    if (parsed.length) {
        return parsed;
    }

    return [{
        category: ts.DiagnosticCategory.Error,
        messageText,
        code: 0,
        file: void 0,
        start: void 0,
        length: void 0
    }];
}

function formatDiagnosticMessage(diagnostic) {
    if (!diagnostic) {
        return '';
    }
    if (typeof diagnostic.messageText === 'string') {
        return diagnostic.messageText;
    }
    if (diagnostic.messageText && typeof diagnostic.messageText.messageText === 'string') {
        return diagnostic.messageText.messageText;
    }
    return String(diagnostic.messageText || '');
}

function formatDiagnosticList(diagnostics, ts) {
    const groups = new Map();

    for (const diagnostic of diagnostics) {
        if (!diagnostic || (!diagnostic.file && !diagnostic.fileName && !diagnostic.messageText)) {
            continue;
        }

        const fileName = diagnostic.fileName || (diagnostic.file ? diagnostic.file.fileName : '(unknown)');
        const list = groups.get(fileName) || [];
        list.push(diagnostic);
        groups.set(fileName, list);
    }

    return [...groups.entries()].map(([fileName, fileDiagnostics]) => {
        const locationLines = fileDiagnostics.map(diagnostic => {
            if (diagnostic.fileName && typeof diagnostic.line === 'number' && typeof diagnostic.column === 'number') {
                const code = diagnostic.code ? `TS${diagnostic.code}` : 'TS0';
                const location = `${diagnostic.line}:${diagnostic.column}`;
                return `  ${Colors.gray(location.padEnd(8, ' '))}  ${Colors.red(code)}  ${formatDiagnosticMessage(diagnostic)}`;
            }

            if (!diagnostic.file) {
                return `  ${Colors.gray('(unknown)')}  TS0  ${formatDiagnosticMessage(diagnostic)}`;
            }

            const start = diagnostic.start ?? 0;
            const { line, character } = ts.getLineAndCharacterOfPosition(
                diagnostic.file,
                start
            );
            const code = diagnostic.code ? `TS${diagnostic.code}` : 'TS0';
            const location = `${line + 1}:${character + 1}`;
            return `  ${Colors.gray(location.padEnd(8, ' '))}  ${Colors.red(code)}  ${formatDiagnosticMessage(diagnostic)}`;
        });

        return `\n${Colors.underline(fileName)}\n${locationLines.join('\n')}`;
    }).join('\n');
}

/**
 * Typecheck demo.ts samples against generated declarations without emitting files.
 *
 * @param {object} argv
 *        Task options, including a path glob or an array of globs.
 */
function typecheckSamples(argv = {}) {
    const glob = require('glob');
    const log = require('../libs/log');
    const ts = resolveTypeScript(log);
    const tsgo = resolveTsgoBinary();
    if (tsgo) {
        log.message(`Using TypeScript compiler: ${tsgo.name}`);
    }
    const products = ['highcharts', 'stock', 'maps', 'gantt'];
    const batchMode = Boolean(argv.batch);
    const selectedPath = argv.p || argv.path;
    const selected = selectedPath && new Set(
        glob.sync(selectedPath)
            .flatMap(file => {
                const absolute = path.resolve(file);
                const relative = path.relative(process.cwd(), absolute);
                return [absolute, relative, file];
            })
    );

    if (!fs.existsSync('code/highcharts.d.ts')) {
        throw new Error('Build declarations first with "npx gulp jsdoc-dts".');
    }

    let sampleCount = 0;
    let errorCount = 0;
    let tsgoErrorCount = 0;
    const failedFiles = new Set();
    const configCache = new Map();
    const formatHost = {
        getCanonicalFileName: file => file,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine
    };

    function getConfigData(configPath) {
        if (configCache.has(configPath)) {
            return configCache.get(configPath);
        }

        const config = ts.readConfigFile(configPath, ts.sys.readFile);
        const parsed = ts.parseJsonConfigFileContent(
            config.config || {},
            ts.sys,
            path.dirname(configPath),
            {
                noEmit: true,
                composite: false,
                incremental: false
            }
        );

        const data = { config, parsed };
        configCache.set(configPath, data);
        return data;
    }

    for (const product of products) {
        const productConfigPath = path.resolve(`samples/tsconfig.${product}.json`);
        const productConfig = ts.readConfigFile(productConfigPath, ts.sys.readFile);
        const parsed = ts.parseJsonConfigFileContent(
            productConfig.config || {},
            ts.sys,
            path.dirname(productConfigPath),
            {
                noEmit: true,
                composite: false,
                incremental: false
            }
        );
        const demos = parsed.fileNames.filter(file => {
            if (path.basename(file) !== 'demo.ts') {
                return false;
            }
            if (!selected) {
                return true;
            }
            const normalized = path.resolve(file);
            return selected.has(normalized) || selected.has(file);
        });
        let diagnostics = [
            ...(productConfig.error ? [productConfig.error] : []),
            ...parsed.errors
        ];

        if (demos.length) {
            log.message(`Typechecking ${product}: ${demos.length} samples...`);
            sampleCount += demos.length;

            if (batchMode) {
                const demoConfigPath = path.resolve(
                    path.dirname(demos[0]),
                    'tsconfig.json'
                );
                const configPath = fs.existsSync(demoConfigPath) ?
                    demoConfigPath :
                    productConfigPath;
                const { config, parsed: demoParsed } = getConfigData(configPath);
                const declarations = demoParsed.fileNames.filter(
                    file => file.endsWith('.d.ts')
                );

                if (tsgo) {
                    const result = runTsgoTypecheck(
                        configPath,
                        config,
                        demoParsed,
                        demos[0],
                        declarations,
                        demos
                    );
                    const output = result && result.output ? result.output : '';
                    const hasTsgoErrors = result && result.status !== 0 || /error TS\d+:/.test(output);
                    const tsgoFailureCount = countTsErrors(output);
                    tsgoErrorCount += tsgoFailureCount;
                    diagnostics = diagnostics.concat(
                        ...(config.error ? [config.error] : []),
                        ...demoParsed.errors,
                        ...normalizeTsgoFailure(
                            config,
                            demoParsed,
                            output,
                            result && result.status !== void 0 ? result.status : 1
                        )
                    );
                    if (hasTsgoErrors) {
                        const discoveredFiles = collectFailedFiles(output, demos);
                        discoveredFiles.forEach(file => failedFiles.add(file));
                    }
                    if (!batchMode) {
                        process.stdout.write(result && result.status === 0 ? '.' : 'F');
                    }
                } else {
                    const host = ts.createCompilerHost(demoParsed.options);
                    const getSourceFile = host.getSourceFile.bind(host);
                    const sourceFiles = new Map();

                    host.getSourceFile = (file, ...args) => {
                        if (!sourceFiles.has(file)) {
                            sourceFiles.set(file, getSourceFile(file, ...args));
                        }
                        return sourceFiles.get(file);
                    };

                    const program = ts.createProgram({
                        rootNames: [...new Set([...declarations, ...demos])],
                        options: demoParsed.options,
                        host
                    });
                    const demoDiagnostics = ts.getPreEmitDiagnostics(program);
                    const hasDemoErrors = demoDiagnostics.some(
                        diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
                    );
                    diagnostics = diagnostics.concat(
                        ...(config.error ? [config.error] : []),
                        ...demoParsed.errors,
                        ...demoDiagnostics
                    );
                    if (hasDemoErrors) {
                        demos.forEach(file => failedFiles.add(file));
                    }
                    process.stdout.write(hasDemoErrors ? 'F' : '.');
                }
                process.stdout.write('\n');
            } else {
                for (const demo of demos) {
                    const demoConfigPath = path.resolve(
                        path.dirname(demo),
                        'tsconfig.json'
                    );
                    const configPath = fs.existsSync(demoConfigPath) ?
                        demoConfigPath :
                        productConfigPath;
                    const { config, parsed: demoParsed } = getConfigData(configPath);
                    const declarations = demoParsed.fileNames.filter(
                        file => file.endsWith('.d.ts')
                    );

                    if (tsgo) {
                        const result = runTsgoTypecheck(
                            configPath,
                            config,
                            demoParsed,
                            demo,
                            declarations
                        );
                        const output = result && result.output ? result.output : '';
                        const hasDemoErrors = result && result.status !== 0 || /error TS\d+:/.test(output);
                        const tsgoFailureCount = countTsErrors(output);
                        tsgoErrorCount += tsgoFailureCount;
                        diagnostics = diagnostics.concat(
                            ...(config.error ? [config.error] : []),
                            ...demoParsed.errors,
                            ...normalizeTsgoFailure(
                                config,
                                demoParsed,
                                output,
                                result && result.status !== void 0 ? result.status : 1
                            )
                        );
                        if (hasDemoErrors) {
                            failedFiles.add(demo);
                        }
                        process.stdout.write(result && result.status === 0 ? '.' : 'F');
                        continue;
                    }

                    const host = ts.createCompilerHost(demoParsed.options);
                    const getSourceFile = host.getSourceFile.bind(host);
                    const sourceFiles = new Map();

                    // Reuse parsed declarations, but keep each demo's globals isolated.
                    host.getSourceFile = (file, ...args) => {
                        if (!sourceFiles.has(file)) {
                            sourceFiles.set(file, getSourceFile(file, ...args));
                        }
                        return sourceFiles.get(file);
                    };

                    const program = ts.createProgram({
                        rootNames: [...new Set([...declarations, demo])],
                        options: demoParsed.options,
                        host
                    });
                    const demoDiagnostics = ts.getPreEmitDiagnostics(program);
                    const hasDemoErrors = demoDiagnostics.some(
                        diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
                    );
                    diagnostics = diagnostics.concat(
                        ...(config.error ? [config.error] : []),
                        ...demoParsed.errors,
                        ...demoDiagnostics
                    );
                    if (hasDemoErrors) {
                        failedFiles.add(demo);
                    }
                    process.stdout.write(hasDemoErrors ? 'F' : '.');
                }
                process.stdout.write('\n');
            }
        }

        if (diagnostics.length) {
            /* eslint-disable-next-line no-console */
            console.log(formatDiagnosticList(diagnostics, ts));
            errorCount += diagnostics.filter(
                diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
            ).length;
        }
    }

    if (sampleCount) {
        process.stdout.write('\n');
    }
    if (errorCount || tsgoErrorCount) {
        const summaryErrorCount = tsgoErrorCount || errorCount;
        const summaryFileCount = failedFiles.size || (summaryErrorCount ? 1 : 0);
        const summary = `${summaryErrorCount} errors in ${summaryFileCount} out of ${sampleCount} files`;
        log.failure(summary);
        throw new Error(summary);
    }
    if (!sampleCount) {
        throw new Error('No demo.ts samples matched.');
    }
    log.success(`Typechecked ${sampleCount} samples.`);
}

function task() {
    typecheckSamples(require('yargs').argv);
    return Promise.resolve();
}

task.description = 'Typecheck demo.ts samples after running gulp jsdoc-dts';
task.flags = {
    '--path': 'Check matching demo.ts files (repeat for multiple globs)',
    '-p': 'Alias for --path',
    '--batch': 'Bundle matched demo.ts files into one project (expected to expose duplicate symbol errors)'
};

gulp.task('typecheck-samples', task);

module.exports = { resolveTsgoBinary, resolveTypeScript, typecheckSamples };
