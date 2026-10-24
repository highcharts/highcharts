/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const fs = require('node:fs');
const path = require('node:path');
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

function createTsgoConfig(configPath, config, demoParsed, demo, declarations) {
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
        Object.entries(rawCompilerOptions).filter(([key]) =>
            allowedOptions.has(key)
        ).map(([key, value]) => [key, normalizeTsgoConfigOption(key, value)])
    );
    const configData = {
        compilerOptions: {
            ...compilerOptions,
            noEmit: true,
            strict: false,
            noImplicitAny: true,
            noImplicitThis: true
        },
        files: [...new Set([...declarations, demo])]
    };
    const tempDir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'tsgo-demo-'));
    const configFile = path.join(tempDir, 'tsconfig.tsgo.json');
    fs.writeFileSync(configFile, JSON.stringify(configData, null, 2));

    return { configFile, tempDir };
}

function runTsgoTypecheck(configPath, config, demoParsed, demo, declarations) {
    const tsgo = resolveTsgoBinary();
    if (!tsgo) {
        return null;
    }

    const { configFile, tempDir } = createTsgoConfig(
        configPath,
        config,
        demoParsed,
        demo,
        declarations
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
    const selectedPath = argv.p || argv.path;
    const selected = selectedPath && new Set(
        glob.sync(selectedPath)
            .map(file => path.resolve(file))
    );

    if (!fs.existsSync('code/highcharts.d.ts')) {
        throw new Error('Build declarations first with "npx gulp jsdoc-dts".');
    }

    let sampleCount = 0;
    let errorCount = 0;
    const configCache = new Map();
    const formatHost = {
        getCanonicalFileName: file => file,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine
    };

    const getConfigData = configPath => {
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
    };

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
        const demos = parsed.fileNames.filter(file => (
            path.basename(file) === 'demo.ts' &&
            (!selected || selected.has(path.resolve(file)))
        ));
        let diagnostics = [
            ...(productConfig.error ? [productConfig.error] : []),
            ...parsed.errors
        ];

        if (demos.length) {
            log.message(`Typechecking ${product}: ${demos.length} samples...`);
            sampleCount += demos.length;
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
                    const errorMatches = (output.match(/error TS\d+:/g) || []).length;
                    diagnostics = diagnostics.concat(
                        ...(config.error ? [config.error] : []),
                        ...demoParsed.errors,
                        ...(errorMatches ? [{
                            category: ts.DiagnosticCategory.Error,
                            messageText: output,
                            code: 0,
                            file: undefined,
                            start: undefined,
                            length: undefined
                        }] : [])
                    );
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
                diagnostics = diagnostics.concat(
                    ...(config.error ? [config.error] : []),
                    ...demoParsed.errors,
                    ...demoDiagnostics
                );
                process.stdout.write(
                    demoDiagnostics.some(
                        diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
                    ) ? 'F' : '.'
                );
            }
            process.stdout.write('\n');
        }

        if (diagnostics.length) {
            log.message(ts.formatDiagnostics(diagnostics, formatHost));
            errorCount += diagnostics.filter(
                diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
            ).length;
        }
    }

    if (sampleCount) {
        process.stdout.write('\n');
    }
    if (errorCount) {
        throw new Error(`Sample typechecking failed with ${errorCount} errors.`);
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
    '-p': 'Alias for --path'
};

gulp.task('typecheck-samples', task);

module.exports = { resolveTsgoBinary, resolveTypeScript, typecheckSamples };
