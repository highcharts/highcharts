/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import logger from '../tools/libs/log.js';

// only run if no dashboards code
if (!existsSync(join(import.meta.dirname, '../code/dashboards/'))) {
    execSync(
        'npx gulp dashboards/scripts',
        {
            cwd: join(import.meta.dirname, '..'),
            stdio: 'inherit'
        }
    );
} else {
    logger.message('Note: Skipped Dashboards build');
}
