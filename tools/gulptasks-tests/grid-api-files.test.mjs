import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const require = createRequire(new URL('../gulptasks/grid/api-docs.js', import.meta.url));
const module = { exports: {} };
runInNewContext(fs.readFileSync(
    new URL('../gulptasks/grid/api-docs.js', import.meta.url), 'utf8'
) + '\nmodule.exports = { postProcessApiJS, postProcessCSS, ' +
    'postProcessJSONArtifacts, postProcessSitemap };', {
    module,
    require: name => (name === 'gulp' ? {
        task() {},
        series() {}
    } : require(name))
});
const processors = module.exports;

function withDirectory(check) {
    const root = fs.mkdtempSync(join(tmpdir(), 'hc-grid-api-'));
    try {
        check(root);
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
}

test('preserves Grid JavaScript, CSS, JSON and sitemap transformations', () => {
    withDirectory(root => {
        fs.mkdirSync(join(root, 'nav'));
        fs.writeFileSync(join(root, 'api.js'),
            'function getClassReferenceUrl(type) { return null; }\n');
        fs.writeFileSync(join(root, 'style.css'), '.option-header h1 { color: red; }');
        fs.writeFileSync(join(root, 'tree.json'), JSON.stringify({
            plotOptions: {},
            series: {},
            columns: {
                meta: { fullname: 'columns' },
                doclet: { product: 'gridpro' }
            }
        }));
        fs.writeFileSync(join(root, 'search.json'),
            JSON.stringify(['plotOptions.x', 'series.x', 'columns']));
        fs.writeFileSync(join(root, 'nav/index.json'), JSON.stringify({
            children: [{ fullname: 'plotOptions' }, { fullname: 'columns' }]
        }));
        fs.writeFileSync(join(root, 'nav/columns.json'),
            JSON.stringify({ fullname: 'columns' }));
        fs.writeFileSync(join(root, 'dump.json'),
            JSON.stringify([{ fullname: 'series' }, { fullname: 'columns' }]));
        fs.writeFileSync(join(root, 'sitemap.xml'),
            '<url><loc>https://api.highcharts.com/highcharts/columns</loc>' +
            '<priority>0.5</priority></url>');

        processors.postProcessApiJS(root, { Column: 'typedoc/Column.html' });
        processors.postProcessCSS(root);
        processors.postProcessJSONArtifacts(root);
        processors.postProcessSitemap(root);
        const api = runInNewContext(fs.readFileSync(join(root, 'api.js'), 'utf8') +
            '\ngetClassReferenceUrl("Column");');
        assert.equal(api, '/grid/typedoc/Column.html');
        assert.match(fs.readFileSync(join(root, 'style.css'), 'utf8'),
            /^#option-list \.option-header h1/u);
        function readJSON(name) {
            return JSON.parse(fs.readFileSync(join(root, name), 'utf8'));
        }
        assert.deepEqual(Object.keys(readJSON('tree.json')), ['columns']);
        assert.deepEqual(readJSON('search.json'), ['columns']);
        assert.deepEqual(readJSON('dump.json'), [{ fullname: 'columns' }]);
        assert.deepEqual(readJSON('nav/index.json').children,
            [{ fullname: 'columns', product: 'gridpro' }]);
        assert.equal(readJSON('nav/columns.json').product, 'gridpro');
        assert.equal(fs.readFileSync(join(root, 'sitemap.xml'), 'utf8'),
            '<url><loc>https://api.highcharts.com/grid/columns</loc>' +
            '<priority>0.5</priority></url>');
    });
});

test('skips absent optional outputs but rejects malformed JSON', () => {
    withDirectory(root => {
        processors.postProcessApiJS(root, {});
        processors.postProcessCSS(root);
        processors.postProcessJSONArtifacts(root);
        processors.postProcessSitemap(root);
        fs.writeFileSync(join(root, 'tree.json'), '{');
        assert.throws(() => processors.postProcessJSONArtifacts(root), {
            name: 'SyntaxError'
        });
    });
});

test('Grid CSS updating cannot overwrite a substituted pathname target', () => {
    withDirectory(root => {
        const file = join(root, 'style.css');
        const original = join(root, 'opened.css');
        const sentinel = join(root, 'unrelated.css');
        fs.writeFileSync(file, '.option-header h1 { color: red; }');
        fs.writeFileSync(sentinel, 'untouched');
        const open = fs.openSync;
        const read = fs.readFileSync;
        let descriptor;
        let swapped = false;
        fs.openSync = (path, ...args) => {
            const result = open(path, ...args);
            if (path === file) {
                descriptor = result;
            }
            return result;
        };
        fs.readFileSync = (path, ...args) => {
            const result = read(path, ...args);
            if (!swapped && (path === file || path === descriptor)) {
                fs.renameSync(file, original);
                fs.symlinkSync(sentinel, file);
                swapped = true;
            }
            return result;
        };
        try {
            processors.postProcessCSS(root);
            assert.equal(swapped, true);
            assert.equal(read(sentinel, 'utf8'), 'untouched');
            assert.match(read(original, 'utf8'), /^#option-list/u);
        } finally {
            fs.openSync = open;
            fs.readFileSync = read;
        }
    });
});
