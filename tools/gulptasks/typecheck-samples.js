/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/**
 * Typecheck demo.ts samples against generated declarations without emitting files.
 *
 * @param {object} argv
 *        Task options, including a path glob or an array of globs.
 */
function typecheckSamples(argv = {}) {
    const fs = require('node:fs');
    const glob = require('glob');
    const path = require('node:path');
    const ts = require('typescript');
    const log = require('../libs/log');
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
    const formatHost = {
        getCanonicalFileName: file => file,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine
    };

    for (const product of products) {
        const configPath = path.resolve(`samples/tsconfig.${product}.json`);
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
        const demos = parsed.fileNames.filter(file => (
            path.basename(file) === 'demo.ts' &&
            (!selected || selected.has(path.resolve(file)))
        ));
        let diagnostics = [
            ...(config.error ? [config.error] : []),
            ...parsed.errors
        ];

        if (demos.length) {
            log.message(`Typechecking ${product}: ${demos.length} samples...`);
            sampleCount += demos.length;
            const declarations = parsed.fileNames.filter(
                file => file.endsWith('.d.ts')
            );
            const host = ts.createCompilerHost(parsed.options);
            const getSourceFile = host.getSourceFile.bind(host);
            const sourceFiles = new Map();

            // Reuse parsed declarations, but keep each demo's globals isolated.
            host.getSourceFile = (file, ...args) => {
                if (!sourceFiles.has(file)) {
                    sourceFiles.set(file, getSourceFile(file, ...args));
                }
                return sourceFiles.get(file);
            };
            for (const demo of demos) {
                const program = ts.createProgram({
                    rootNames: [...declarations, demo],
                    options: parsed.options,
                    host
                });
                diagnostics = diagnostics.concat(
                    ts.getPreEmitDiagnostics(program)
                );
            }
        }

        if (diagnostics.length) {
            log.message(ts.formatDiagnostics(diagnostics, formatHost));
            errorCount += diagnostics.filter(
                diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
            ).length;
        }
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

module.exports = { typecheckSamples };
