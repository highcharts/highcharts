import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = 'ts';

function processFile(path) {
    let txt = readFileSync(path, 'utf8');
    const original = txt;

    // check if file already has any Author line
    const hasAuthorLine = txt.includes('Author:');

    // add SPDX line before @license header if it is missing
    if (
        !txt.includes('SPDX-License-Identifier: LicenseRef-Highcharts') &&
        txt.includes('@license Highcharts JS')
    ) {
        txt = txt.replace(
            '/**\n * @license Highcharts JS',
            '// SPDX-License-Identifier: LicenseRef-Highcharts\n/**\n * @license Highcharts JS'
        );
    }

    // add SPDX line at the top for files that have a License line
    // but do not have SPDX yet (for example simple header blocks).
    if (
        !txt.includes('SPDX-License-Identifier: LicenseRef-Highcharts') &&
        /License: www\.highcharts\.com\/license/u.test(txt)
    ) {
        // insert SPDX before the first block comment in the file
        txt = txt.replace(
            /^(\s*\/\*[\*!])/u,
            '// SPDX-License-Identifier: LicenseRef-Highcharts\n$1'
        );
    }

    // replace "(c) YEAR[-YEAR] Name" with "(c) YEAR[-YEAR] Highsoft AS"
    // and optionally add an "Author: Name" line below.
    txt = txt.replace(
        /^(\s*\*\s*)\(c\) (\d{4}(?:-\d{4})?) ([^\n]+)$/gmu,
        (match, prefix, years, name) => {
            // if the name is already Highsoft AS, do not change this line
            if (/Highsoft AS/.test(name)) {
                return match;
            }

            // new copyright line
            let result = `${prefix}(c) ${years} Highsoft AS`;

            // add Author line only if the file does not already contain any Author line
            if (!hasAuthorLine) {
                result += `\n${prefix}Author: ${name}`;
            }

            return result;
        }
    );

    // replace "License: www.highcharts.com/license"
    txt = txt.replace(
        /(^\s*\*\s+)License: www\.highcharts\.com\/license/gmu,
        '$1A commercial license may be required depending on use.\n' +
        '$1See www.highcharts.com/license'
    );

    if (txt !== original) {
        writeFileSync(path, txt);
    }
}

function walk(dir) {
    for (const entry of readdirSync(dir)) {
        const fullPath = join(dir, entry);
        const stats = statSync(fullPath);

        if (stats.isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

walk(ROOT);
