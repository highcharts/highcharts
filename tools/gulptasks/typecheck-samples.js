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
async function typecheckSamples(argv = {}) {
    const fs = require('node:fs');
    const glob = require('glob');
    const path = require('node:path');
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
    // The legacy Node plugin cannot resolve workspace exports or dynamic import.
    // eslint-disable-next-line node/no-missing-import, node/no-unsupported-features/es-syntax
    const { API, DiagnosticCategory, formatDiagnostics } = await import('@highcharts/sample-typecheck');
    const api = new API();

    try {
        for (const product of products) {
            const configPath = path.resolve(`samples/tsconfig.${product}.json`);
            const config = api.readConfigFile(configPath);
            const parsed = api.parseJsonConfigFileContent(
                config.config || {},
                { configFileName: configPath }
            );
            const options = {
                ...parsed.options,
                noEmit: true,
                composite: false,
                incremental: false
            };
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

                // Keep each demo's globals and namespace augmentations isolated.
                for (const demo of demos) {
                    const program = api.createProgram(
                        [...declarations, demo], options
                    );
                    try {
                        diagnostics = diagnostics.concat(
                            program.getGlobalDiagnostics(),
                            program.getProgramDiagnostics(),
                            program.getSyntacticDiagnostics(),
                            program.getSemanticDiagnostics()
                        );
                    } finally {
                        program.dispose();
                    }
                }
            }

            if (diagnostics.length) {
                log.message(formatDiagnostics(diagnostics, api));
                errorCount += diagnostics.filter(
                    diagnostic => diagnostic.category === DiagnosticCategory.Error
                ).length;
            }
        }
    } finally {
        api.close();
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
    return typecheckSamples(require('yargs').argv);
}

task.description = 'Typecheck demo.ts samples with TypeScript 7.1 after gulp jsdoc-dts';
task.flags = {
    '--path': 'Check matching demo.ts files (repeat for multiple globs)',
    '-p': 'Alias for --path'
};

gulp.task('typecheck-samples', task);

module.exports = { typecheckSamples };
