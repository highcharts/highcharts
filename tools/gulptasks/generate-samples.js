/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable node/no-unsupported-features/es-syntax */

const gulp = require('gulp');
const path = require('path');
const { glob } = require('glob');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Gulp task to generate samples from config.ts files.
 *
 * Supports filtering samples via --samples command line argument.
 *
 * @example
 * // Generate all samples
 * gulp generate-samples
 *
 * // Generate specific samples
 * gulp generate-samples --samples "highcharts/xaxis/*"
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function task() {
    const { saveDemoFile } = await import(
        '../sample-generator/index.ts'
    );

    const log = require('../libs/log');
    const argv = require('yargs').argv;

    let configFiles = await glob('samples/**/config.ts', {
        ignore: ['**/node_modules/**'],
        cwd: path.join(__dirname, '../../')
    });

    // Filter based on --samples parameter if provided
    if (argv.samples) {
        const samplePatterns = argv.samples
            .split(',')
            .map(p => p.trim())
            .filter(Boolean);

        log.message(`Filtering samples by patterns: ${samplePatterns.join(', ')}`);

        // eslint-disable-next-line node/no-extraneous-require
        const { minimatch } = require('minimatch');

        configFiles = configFiles.filter(configFile => {
            // Remove 'samples/' prefix and '/config.ts' suffix for matching
            const samplePath = configFile
                .replace(/^samples\//u, '')
                .replace(/\/config\.ts$/u, '');

            return samplePatterns.some(pattern => {
                // Remove trailing slash if present
                const cleanPattern = pattern.replace(/\/$/u, '');
                // Match exact path or as a glob pattern
                return minimatch(samplePath, cleanPattern) ||
                       samplePath === cleanPattern;
            });
        });
    }

    if (configFiles.length === 0) {
        log.warn('No config.ts files found matching criteria');
        return;
    }

    log.message(`Found ${configFiles.length} config file(s)`);

    // Process each config file
    for (const configFile of configFiles) {
        const configPath = path.join(__dirname, '../../', configFile);
        const outputDir = path.dirname(configFile);

        log.message(`Generating sample from ${configFile}...`);

        try {
            // Dynamically import the config
            const configModule = await import(configPath);
            const config = configModule.default;

            // Set the output directory to the same location as the config file
            config.output = outputDir.replace(/^samples\//u, '');

            // Call saveDemoFile
            await saveDemoFile(config);

            log.success(' ✔︎ Success');
        } catch (error) {
            log.failure(` ❌ Error: ${error.message}`);
        }
    }

    log.success('All samples generated successfully');
}

gulp.task('generate-samples', task);
