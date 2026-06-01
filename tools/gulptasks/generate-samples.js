/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable node/no-unsupported-features/es-syntax */

const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const { glob } = require('glob');
const saveDemoFilePromise = import('../sample-generator/index.ts')
    .then(m => m.saveDemoFile);

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
 * @param {object} [options]
 *        Generation options
 * @param {boolean} [options.silent=false]
 *        Whether to suppress per-sample log output
 * @return {Promise<void>}
 *         Promise to keep
 */
async function generateSample(configFile, log, options = {}) {
    const { silent = false } = options;
    const saveDemoFile = await saveDemoFilePromise;

    const configPath = path.join(__dirname, '../../', configFile);
    const outputDir = path.dirname(configFile);

    if (!silent) {
        log.message(`Generating sample from ${configFile}...`);
    }

    // Clear the module cache to ensure fresh import
    delete require.cache[configPath];

    // Dynamically import the config with cache busting
    const configModule = await import(
        `file:///${configPath}?update=${Date.now()}`
    );
    const config = configModule.default;

    // Set the output directory to the same location as the config file
    config.output = outputDir
        .replace(/^samples\//u, '')
        .replace(/^samples\\/u, ''); // samples\\ for Windows

    // Generate sample assets from config.
    await saveDemoFile(config);

    if (!silent) {
        log.success(' ✔︎ Success');
    }
}

/**
 * Whether a path is a generated sample artifact.
 *
 * @param {string} filePath
 *        Git status file path.
 * @return {boolean}
 *         True if generated artifact.
 */
function isGeneratedSampleArtifact(filePath) {
    const normalizedPath = filePath.replace(/\\/gu, '/');

    if (!normalizedPath.startsWith('samples/')) {
        return false;
    }

    return /\/(demo\.(ts|html|css|details)|\.gitignore|demo\.js)$/u
        .test(normalizedPath);
}

/**
 * Parse `git status --porcelain` output and return unstaged generated files.
 *
 * @return {Array<string>}
 *         Relative file paths that are modified but not staged.
 */
function getUnstagedGeneratedFiles() {
    const childProcess = require('node:child_process');

    const output = childProcess.execFileSync(
        'git',
        ['status', '--porcelain', '--', 'samples'],
        {
            cwd: process.cwd(),
            encoding: 'utf-8'
        }
    );

    const files = [];

    output
        .split('\n')
        .filter(Boolean)
        .forEach(line => {
            const status = line.slice(0, 2);
            let filePath = line.slice(3).trim();

            if (status === '!!') {
                return;
            }

            if (filePath.includes(' -> ')) {
                filePath = filePath.split(' -> ').pop() || filePath;
            }

            if (!isGeneratedSampleArtifact(filePath)) {
                return;
            }

            const isUntracked = status === '??';
            const hasUnstagedChanges = status[1] !== ' ';

            if (isUntracked || hasUnstagedChanges) {
                files.push(filePath);
            }
        });

    return [...new Set(files)].sort();
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
 * // Rebuild options lookup (flat-tree.json)
 * gulp generate-samples --setup
 *
 * // Watch for changes and regenerate automatically
 * gulp generate-samples --watchfiles
 *
 * // Regenerate all samples and fail on unstaged generated output
 * gulp generate-samples --check
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function task() {
    const log = require('../libs/log');
    const argv = require('yargs').argv;

    // Check the setup argument. If set, run `gulp scripts`, `gulp jsdoc-dts`
    // and the sample-generator/setup.ts script before generating samples.
    if (argv.setup) {
        log.message('Running setup tasks...');

        // Run prerequisite tasks
        await new Promise((resolve, reject) => {
            gulp.series(
                // These two tasks can be uncommented if you want to run the
                // setup (build flat-tree.json) without running the full build
                'scripts',
                'jsdoc-dts',
                async function setupSampleGenerator(done) {
                    try {
                        const { setup } = await import(
                            '../sample-generator/setup.ts'
                        );
                        await setup();
                        done();
                    } catch (error) {
                        done(error);
                    }
                }
            )(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        return true;
    }

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

    const useDotProgress = Boolean(argv.check);
    let dotCount = 0;

    // Process each config file
    for (const configFile of configFiles) {
        await generateSample(configFile, log, { silent: useDotProgress });

        if (useDotProgress) {
            process.stdout.write('.');
            dotCount += 1;

            if (dotCount % 80 === 0) {
                process.stdout.write('\n');
            }
        }
    }

    if (useDotProgress && dotCount % 80 !== 0) {
        process.stdout.write('\n');
    }

    if (argv.check) {
        const unstagedFiles = getUnstagedGeneratedFiles();

        if (unstagedFiles.length) {
            const preview = unstagedFiles.slice(0, 20);

            log.failure('Generated sample files are modified but not staged:');
            preview.forEach(file => log.warn(`- ${file}`));

            if (unstagedFiles.length > preview.length) {
                log.warn(`- ... and ${unstagedFiles.length - preview.length} more`);
            }

            throw new Error(
                'Generated sample files are not staged. Run `git add .` and try again.'
            );
        }

        log.success('Generated sample files are up to date and staged.');
    }

    log.success('All samples generated successfully');

    return true;
}

gulp.task('generate-samples', task);
