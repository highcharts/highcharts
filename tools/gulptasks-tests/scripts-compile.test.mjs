import assert from 'node:assert/strict';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import scriptsCompile from '../gulptasks/scripts-compile.js';

const source = `/* SPDX-License-Identifier: LicenseRef-Highcharts */

/**
 * @license Highcharts
 */

/* Internal note */
.highcharts-container {
    color: #ffffff;

    &:hover {
        color: light-dark(#000000, #ffffff);
    }
}
`;

test('minifies .src.css into .css and keeps the license banner', async () => {
    const root = fs.mkdtempSync(join(tmpdir(), 'hc-compile-css-'));
    const input = join(root, 'highcharts.src.css');
    const output = join(root, 'highcharts.css');
    fs.writeFileSync(input, source);
    try {
        await scriptsCompile([input]);
        const css = fs.readFileSync(output, 'utf8');

        assert.equal(fs.readFileSync(input, 'utf8'), source);
        assert.ok(css.startsWith(
            '/* SPDX-License-Identifier: LicenseRef-Highcharts */'
        ));
        assert.ok(css.includes('@license Highcharts'));
        assert.ok(!css.includes('Internal note'));
        assert.ok(css.endsWith(
            '.highcharts-container{color:#fff;&:hover{' +
            'color:light-dark(#000,#fff)}}'
        ));

        await scriptsCompile([input]);
        assert.equal(fs.readFileSync(output, 'utf8'), css);
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
});
