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
                // Keep each demo's globals and namespace augmentations isolated.
                for (const demo of demos) {
                    const demoConfigPath = path.resolve(
                        path.dirname(demo), 'tsconfig.json'
                    );
                    const demoConfig = fs.existsSync(demoConfigPath) ?
                        api.readConfigFile(demoConfigPath) : config;
                    const demoParsed = fs.existsSync(demoConfigPath) ?
                        api.parseJsonConfigFileContent(
                            demoConfig.config || {},
                            { configFileName: demoConfigPath }
                        ) : parsed;
                    const declarations = demoParsed.fileNames.filter(
                        file => file.endsWith('.d.ts')
                    );
                    diagnostics = diagnostics.concat(
                        ...(demoConfig.error ? [demoConfig.error] : []),
                        ...demoParsed.errors
                    );
                    const program = api.createProgram(
                        [...new Set([...declarations, demo])],
                        {
                            ...demoParsed.options,
                            noEmit: true,
                            composite: false,
                            incremental: false
                        }
                    );
                    try {
                        const demoDiagnostics = [
                            ...program.getGlobalDiagnostics(),
                            ...program.getProgramDiagnostics(),
                            ...program.getSyntacticDiagnostics(),
                            ...program.getSemanticDiagnostics()
                        ];
                        diagnostics = diagnostics.concat(demoDiagnostics);
                        process.stdout.write(
                            demoDiagnostics.some(
                                diagnostic => diagnostic.category ===
                                    DiagnosticCategory.Error
                            ) ? 'F' : '.'
                        );
                    } finally {
                        program.dispose();
                    }
                }
                process.stdout.write('\n');
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
    return typecheckSamples(require('yargs').argv);
}

task.description = 'Typecheck demo.ts samples with TypeScript 7.1 after gulp jsdoc-dts';
task.flags = {
    '--path': 'Check matching demo.ts files (repeat for multiple globs)',
    '-p': 'Alias for --path'
};

gulp.task('typecheck-samples', task);

module.exports = { typecheckSamples };
