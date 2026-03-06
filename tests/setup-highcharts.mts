 
 
import { existsSync } from 'node:fs';
import { join } from 'node:path/posix';

import logger from '../tools/libs/log.js';
import { run } from '../tools/gulptasks/lib/gulp.js';
import createJSONSources from '../tools/create-json-sources.js';

import '../tools/gulptasks/scripts.js';
import '../tools/gulptasks/scripts-css.js';
import '../tools/gulptasks/scripts-messages.js';
import '../tools/gulptasks/scripts-webpack.js';
import '../tools/gulptasks/scripts-code.js';
import '../tools/gulptasks/scripts-ts.js';

createJSONSources();

await run('scripts');

if (
    !process.env.CI &&
    !existsSync(
        join(import.meta.dirname, '../code/highcharts.src.d.ts')
    ) ) {
    logger.warn('No Highcharts declarations found. Run `npx gulp jsdoc-dts` to get working types in test files');
}
