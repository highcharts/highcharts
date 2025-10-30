/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import logger from '../tools/libs/log.js';

const rootDir = join(import.meta.dirname, '..');

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
