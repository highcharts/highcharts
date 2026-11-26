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

test('minifies .css and keeps the full version as .src.css', async () => {
    const root = fs.mkdtempSync(join(tmpdir(), 'hc-compile-css-'));
    const bundle = join(root, 'css', 'highcharts.css');
    const bundleSource = join(root, 'css', 'highcharts.src.css');
    const module = join(root, 'css', 'modules', 'grid-lite.css');
    fs.mkdirSync(join(root, 'css', 'modules'), { recursive: true });
    fs.writeFileSync(bundle, source);
    fs.writeFileSync(module, source);
    try {
        await scriptsCompile([bundle, module]);
        const css = fs.readFileSync(bundle, 'utf8');

        assert.equal(fs.readFileSync(bundleSource, 'utf8'), source);
        assert.ok(css.startsWith(
            '/* SPDX-License-Identifier: LicenseRef-Highcharts */'
        ));
        assert.ok(css.includes('@license Highcharts'));
        assert.ok(!css.includes('Internal note'));
        assert.ok(css.endsWith(
            '.highcharts-container{color:#fff;&:hover{' +
            'color:light-dark(#000,#fff)}}'
        ));
        assert.equal(fs.readFileSync(module, 'utf8'), source);
        assert.ok(!fs.existsSync(module.replace('.css', '.src.css')));

        await scriptsCompile([bundle, module]);
        assert.equal(fs.readFileSync(bundleSource, 'utf8'), source);
        assert.equal(fs.readFileSync(bundle, 'utf8'), css);
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
});
