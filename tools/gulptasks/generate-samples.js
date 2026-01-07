/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable node/no-unsupported-features/es-syntax */

const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const { glob } = require('glob');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Generate a single sample from a config file path
 *
 * @param {string} configFile
 *        The config file path (relative to project root)
 * @param {object} log
 *        Logger instance
 * @return {Promise<void>}
 *         Promise to keep
 */
async function generateSample(configFile, log) {
    const { saveDemoFile } = await import(
        '../sample-generator/index.ts'
    );

    const configPath = path.join(__dirname, '../../', configFile);
    const outputDir = path.dirname(configFile);

    log.message(`Generating sample from ${configFile}...`);

    // Clear the module cache to ensure fresh import
    delete require.cache[configPath];

    // Dynamically import the config with cache busting
    const configModule = await import(`${configPath}?update=${Date.now()}`);
    const config = configModule.default;

    // Set the output directory to the same location as the config file
    config.output = outputDir.replace(/^samples\//u, '');

    // Call saveDemoFile (checksum is calculated and saved inside)
    await saveDemoFile(config);

    log.success(' ✔︎ Success');
}

/**
 * Gulp task to generate samples from config.ts files.
 *
 * Supports filtering samples via --samples command line argument.
 * Supports watching for changes via --watchfiles command line argument.
 *
 * @example
 * // Generate all samples
 * gulp generate-samples
 *
 * // Generate specific samples
 * gulp generate-samples --samples "highcharts/xaxis/*"
 *
 * // Watch for changes and regenerate automatically
 * gulp generate-samples --watchfiles
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function task() {
    const log = require('../libs/log');
    const argv = require('yargs').argv;

    // Check if watch mode is enabled
    if (argv.watchfiles) {
        log.message('Watching samples directory for config.ts changes...');
        log.message('Press Ctrl+C to stop watching\n');

        const samplesPath = path.join(__dirname, '../../samples');

        // Use fs.watch with recursive option (available on macOS and Windows)
        const watcher = fs.watch(samplesPath, { recursive: true }, async (eventType, filename) => {
            if (!filename || !filename.endsWith('config.ts')) {
                return;
            }

            // Debounce rapid changes
            const watchKey = filename;
            if (task.watchTimeouts && task.watchTimeouts[watchKey]) {
                clearTimeout(task.watchTimeouts[watchKey]);
            }

            if (!task.watchTimeouts) {
                task.watchTimeouts = {};
            }

            task.watchTimeouts[watchKey] = setTimeout(async () => {
                const configFile = path.join('samples', filename);
                const fullPath = path.join(samplesPath, filename);

                // Check if file exists (wasn't deleted)
                if (!fs.existsSync(fullPath)) {
                    return;
                }

                log.message(`⚡️ Detected change: ${configFile}`);
                try {
                    await generateSample(configFile, log);
                } catch (error) {
                    log.failure(`Failed to generate sample: ${error.message}`);
                }

                delete task.watchTimeouts[watchKey];
            }, 100);
        });

        watcher.on('error', error => {
            log.failure(`Watcher error: ${error}`);
        });

        // Return a promise that never resolves to keep the task running
        return new Promise(() => {});
    }

    // Print info about watch parameter when not in watch mode
    log.message('💡 Tip: Use --watchfiles to automatically regenerate samples on changes\n');

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
        return false;
    }

    log.message(`Found ${configFiles.length} config file(s)`);

    // Process each config file
    for (const configFile of configFiles) {
        await generateSample(configFile, log);
    }

    log.success('All samples generated successfully');

    return true;
}

gulp.task('generate-samples', task);
