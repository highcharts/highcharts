import {
    readdirSync,
    readFileSync,
    writeFileSync,
    statSync,
    existsSync
} from 'fs';
import { join, extname } from 'path';

const ROOTS = ['ts', 'css'];

function processFile(path) {
    const ext = extname(path);
    const isTs = ext === '.ts';
    const isCss = ext === '.css';

    if (!isTs && !isCss) {
        return;
    }

    let txt = readFileSync(path, 'utf8');
    const original = txt;

    // check if file already has any Author line
    const hasAuthorLine = txt.includes('Author:');

    // add SPDX line before @license header if it is missing
    if (
        !txt.includes('SPDX-License-Identifier: LicenseRef-Highcharts') &&
        txt.includes('@license Highcharts')
    ) {
        if (isTs) {
            txt = txt.replace(
                '/**\n * @license',
                '// SPDX-License-Identifier: LicenseRef-Highcharts\n/**\n * @license'
            );
        } else if (isCss) {
            txt = txt.replace(
                '/**\n * @license',
                '/* SPDX-License-Identifier: LicenseRef-Highcharts */\n\n/**\n * @license'
            );
        }
    }

    // add SPDX line at the top for files that have a License line
    // but do not have SPDX yet (for example simple header blocks).
    if (
        !txt.includes('SPDX-License-Identifier: LicenseRef-Highcharts') &&
        /License: www\.highcharts\.com\/license/u.test(txt)
    ) {
        // insert SPDX before the first block comment in the file
        if (isTs) {
            txt = txt.replace(
                /^(\s*\/\*[\*!])/u,
                '// SPDX-License-Identifier: LicenseRef-Highcharts\n$1'
            );
        } else if (isCss) {
            txt = txt.replace(
                /^(\s*\/\*[\*!])/u,
                '/* SPDX-License-Identifier: LicenseRef-Highcharts */\n\n$1'
            );
        }
    }

    // replace "(c) YEAR[-YEAR] Name" with "(c) YEAR[-YEAR] Highsoft AS"
    // and optionally add an "Author: Name" line below.
    const canAddAuthor = isTs; // TS only, no Author in CSS

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
            if (canAddAuthor && !hasAuthorLine) {
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
        } else {
            processFile(fullPath);
        }
    }
}

for (const root of ROOTS) {
    if (existsSync(root)) {
        walk(root);
    }
}
