import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = 'ts';

function walk(dir) {
    for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        const st = statSync(p);
        if (st.isDirectory()) {
            walk(p);
        } else if (p.endsWith('.ts')) {
            let txt = readFileSync(p, 'utf8');

            // Add SPDX header only if missing
            if (!txt.includes('SPDX-License-Identifier: LicenseRef-Highcharts')) {
                txt = txt.replace(
                    '/**\n * @license Highcharts JS',
                    '// SPDX-License-Identifier: LicenseRef-Highcharts\n/**\n * @license Highcharts JS'
                );
            }

            // copyright - keep years, replace name
            txt = txt.replace(
                /\(c\) (\d{4}-\d{4}) [^\n]+/gu,
                '(c) $1 Highsoft AS'
            );

            // license lines
            txt = txt.replace(
                ' * License: www.highcharts.com/license',
                ' * A commercial license may be required depending on use.\n' +
                ' * See www.highcharts.com/license'
            );

            writeFileSync(p, txt);
        }
    }
}

walk(ROOT);
