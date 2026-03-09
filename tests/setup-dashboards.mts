 
 
import { execSync } from 'node:child_process';
import { join } from 'node:path';

import logger from '../tools/libs/log.js';
import { shouldBuild } from './setup-build-utils.mts';

const rootDir = join(import.meta.dirname, '..');

const builds = [
    {
        label: 'Dashboards',
        check: join(rootDir, 'code', 'dashboards', 'dashboards.src.js'),
        inputs: [
            join(rootDir, 'ts'),
            join(rootDir, 'css', 'dashboards'),
            join(rootDir, 'tools', 'webpacks', 'dashboards.webpack.mjs'),
            join(rootDir, 'tools', 'gulptasks', 'scripts-dts', 'dashboards'),
            join(
                rootDir,
                'tools',
                'gulptasks',
                'dashboards',
                'build-properties.json'
            )
        ],
        command: 'npx gulp scripts --product Dashboards'
    },
    {
        label: 'Grid',
        check: join(rootDir, 'code', 'grid', 'grid-pro.src.js'),
        inputs: [
            join(rootDir, 'ts'),
            join(rootDir, 'css', 'grid'),
            join(rootDir, 'tools', 'webpacks', 'grid.webpack.mjs'),
            join(rootDir, 'tools', 'gulptasks', 'grid', 'build-properties.json')
        ],
        command: 'npx gulp scripts --product Grid'
    }
] as const;

for (const { label, check, inputs, command } of builds) {
    if (!shouldBuild(check, inputs)) {
        logger.message(`Note: Skipped ${label} build`);
        continue;
    }

    logger.message(`Running ${label} build`);
    execSync(command, {
        cwd: rootDir,
        stdio: 'inherit'
    });
}
