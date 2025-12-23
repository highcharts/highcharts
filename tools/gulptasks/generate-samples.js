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
 * @return {Promise<void>}
 *         Promise to keep
 */
async function task() {
    const { saveDemoFile } = await import(
        '../sample-generator/index.ts'
    );

    const log = require('../libs/log');

    // Find all config.ts files in the samples directory
    const configFiles = await glob('samples/**/config.ts', {
        ignore: ['**/node_modules/**'],
        cwd: path.join(__dirname, '../../')
    });

    if (configFiles.length === 0) {
        log.warn('No config.ts files found in samples directory');
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

            log.success(`Generated sample in ${outputDir}`);
        } catch (error) {
            log.failure(`Error generating sample from ${configFile}: ${error.message}`);
        }
    }

    log.success('All samples generated successfully');
}

gulp.task('generate-samples', task);
