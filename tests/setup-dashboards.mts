 
 
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import logger from '../tools/libs/log.js';

const rootDir = join(import.meta.dirname, '..');

const productEnv = process.env.VISUAL_TEST_PRODUCT ?? '';
const productFilters = productEnv
    .split(/[,;\n]/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
const needsDashboardsBuild = productFilters.some((product) =>
    product.startsWith('dashboards') || product.startsWith('grid')
);

const builds = [
    {
        label: 'Dashboards',
        check: join(rootDir, 'code', 'dashboards', 'dashboards.src.js'),
        command: 'npx gulp scripts --product Dashboards'
    },
    {
        label: 'Grid',
        check: join(rootDir, 'code', 'grid', 'grid-pro.src.js'),
        command: 'npx gulp scripts --product Grid'
    }
] as const;

if (productFilters.length && !needsDashboardsBuild) {
    logger.message('Note: Skipped Dashboards/Grid build');
} else {
    for (const { label, check, command } of builds) {
        if (!existsSync(check)) {
            execSync(
                command,
                {
                    cwd: rootDir,
                    stdio: 'inherit'
                }
            );
        } else {
            logger.message(`Note: Skipped ${label} build`);
        }
    }
}
