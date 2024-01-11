import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin.js';

import defaultConfig from '../../../cypress.config.mjs';

import { resolve, join } from 'node:path';

import { readdir, writeFile, stat, mkdir } from 'node:fs/promises';

const screenshotsFolder = resolve('../../../','cypress/snapshots/actual');

console.log(screenshotsFolder)

async function walkDir(dir, fileList = []) {
    const files = await readdir(dir);

    for (const file of files) {
        const fileStat = await stat(join(dir, file));

        if (fileStat.isDirectory()) {
            fileList = await walkDir(join(dir, file), fileList);
        } else {
            fileList.push(join(file));
        }
    }

    return fileList;
}

export default defineConfig({
    ...defaultConfig,
    screenshotsFolder,
    trashAssetsBeforeRuns: false,
    env: {
        ALWAYS_GENERATE_DIFF: false,
        ALLOW_VISUAL_REGRESSION_TO_FAIL: true,
        SNAPSHOT_DIFF_DIRECTORY: resolve('../../../','cypress/snapshots/diff'),
        SNAPSHOT_BASE_DIRECTORY: resolve('../../../','cypress/snapshots/base'),
        type: 'base'
    },
    e2e: {
        ...defaultConfig.e2e,
        setupNodeEvents(on, config) {
            getCompareSnapshotsPlugin(on, config);

            if(config.env.type === 'actual') {
                on('after:run', async (results) => {
                    // create json of files in the diff directory
                    const commonPath = ['test', 'cypress', 'dashboards',  'visual'];
                    const diffDir = join(config.env.SNAPSHOT_DIFF_DIRECTORY, ...commonPath);

                    const baseFiles = await walkDir(
                        join(
                            config.env.SNAPSHOT_BASE_DIRECTORY,
                            ...commonPath
                        )
                    ).catch(() => []);

                    const diffFiles = await walkDir(diffDir)
                        .catch(() => []);

                    if (diffFiles.length) {
                        const diffFilesData = [];
                        for (const file of diffFiles){
                            if (baseFiles.includes(file)) {
                                diffFilesData.push({
                                    base: join(
                                        config.env.SNAPSHOT_BASE_DIRECTORY,
                                        ...commonPath,
                                        file
                                    ),
                                    diff: join(
                                        config.env.SNAPSHOT_DIFF_DIRECTORY,
                                        ...commonPath,
                                        file
                                    ),
                                    actual: join(
                                        // https://github.com/cypress-visual-regression/cypress-visual-regression/issues/133
                                        config.env.SNAPSHOT_DIFF_DIRECTORY.replace('diff', 'actual'),
                                        ...commonPath,
                                        file
                                    )
                                });
                            }
                        }

                        const diffJson = JSON.stringify(diffFilesData, null, 2);

                        const tmpDir = resolve('../../../', 'tmp');
                        await mkdir(tmpDir, { recursive: true });
                        await writeFile(join(tmpDir, 'dashboards-visual-results.json'), diffJson);

                        console.error(
                            '::warning file=tmp/dashboards-visual-results.json,line=1,col=1::',
                            'There are visual regression differences, see tmp/dashboards-visual-results.json for details'
                        );
                    }
                });
            }
        },
        specPattern: 'test/cypress/dashboards/visual/**/*.cy.{js,jsx,ts,tsx}',
        video: false
    }
});
