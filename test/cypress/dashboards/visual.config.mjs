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
        SNAPSHOT_DIFF_DIRECTORY	: resolve('../../../','cypress/snapshots/diff'),
        SNAPSHOT_BASE: resolve('../../../','cypress/snapshots/base'),
        type: 'base'
    },
    e2e: {
        ...defaultConfig.e2e,
        setupNodeEvents(on, config) {
            getCompareSnapshotsPlugin(on, config);

            if(config.env.type === 'actual') {
                on('after:run', async (results) => {
                    // create json of files in the diff directoryA
                    const commonPath = ['test', 'cypress', 'dashboards',  'visual'];

                    const diffDir = join(config.env.SNAPSHOT_DIFF_DIRECTORY, ...commonPath);

                    // TODO: try to figure out why these files are saved to this bonkers place
                    const baseFiles = await walkDir(
                        join(
                            resolve('../../../','test/cypress/dashboards/cypress/snapshots/base'),
                            ...commonPath
                        )
                    ).catch(() => []);

                    const diffFiles = await walkDir(diffDir)
                        .catch(() => []);

                    if (diffFiles.length){

                        console.log(diffFiles);
                        console.log(baseFiles);


                        const diffFilesData = [];
                        for (const file of diffFiles){
                            const baseFileName = file.replace('diff', 'base');
                            const actualFileName = file.replace('diff', 'actual');

                            if (baseFiles.includes(baseFileName)) {

                                diffFilesData.push({
                                    base: baseFileName,
                                    diff: file,
                                    actual: actualFileName
                                });

                            }
                        }

                        const diffJson = JSON.stringify(diffFilesData, null, 2);

                        const tmpDir = resolve('../../../', 'tmp');
                        await mkdir(tmpDir, { recursive: true });
                        await writeFile(join(tmpDir, 'dashboards-visual-results.json'), diffJson);

                        console.table(diffJson);
                        console.error('There are visual regression differences, see tmp/dashboards-visual-results.json for details');
                    }
                });
            }
        },
        specPattern: 'test/cypress/dashboards/visual/**/*.cy.{js,jsx,ts,tsx}',
        video: false
    }
});
