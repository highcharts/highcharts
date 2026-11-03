import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
const ts = createRequire(import.meta.url)('typescript');

const script = ts.transpileModule(fs.readFileSync(new URL(
    '../../samples/highcharts/demo/combo-meteogram/demo.ts', import.meta.url
), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
const endpoint = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';

async function runSample(hash, fetchImpl) {
    const calls = [];
    const charts = [];
    const loading = { innerHTML: '' };
    const window = {};
    const location = new URL(`https://meteogram.test/${hash}`);
    class Chart {
        constructor(options) {
            charts.push(options);
        }
    }
    await runInNewContext(script, {
        URL,
        location,
        window,
        document: { getElementById: () => loading },
        Highcharts: {
            getOptions: () => ({ colors: ['red', 'green', 'blue'] }),
            Chart
        },
        fetch: async (url, options) => {
            calls.push({ url, options });
            if (fetchImpl) {
                return fetchImpl();
            }
            return { json: async () => ({ properties: { timeseries: [] } }) };
        }
    });
    return { calls, charts, loading, window, location };
}

test('meteogram accepts the default forecast and custom MET coordinates', async () => {
    for (const hash of ['', `#${endpoint}?lat=60&lon=10`,
        `#${endpoint}?lat=-20&lon=150&altitude=123`]) {
        const result = await runSample(hash);
        const expected = hash ? hash.slice(1) :
            `${endpoint}?lat=51.50853&lon=-0.12574&altitude=25`;
        assert.equal(result.calls.length, 1);
        assert.equal(result.calls[0].url, expected);
        assert.equal(result.calls[0].options.redirect, 'error');
        assert.equal(result.calls[0].options.headers['Content-Type'], 'text/plain');
        assert.equal(result.charts.length, 1);
        assert.equal(result.charts[0].chart.renderTo, 'container');
        assert.ok(result.window.meteogram);
        assert.equal(result.loading.innerHTML, '');
    }
});

test('meteogram rejects unsupported hash URLs before making any request', async () => {
    for (const url of ['/account/delete?confirm=1', '//api.met.no/weatherapi/locationforecast/2.0/compact',
        'https://attacker.invalid/collect', 'https://api.met.no.attacker.invalid/weatherapi/locationforecast/2.0/compact',
        'https://api.met.no@attacker.invalid/weatherapi/locationforecast/2.0/compact',
        endpoint.replace('https:', 'http:'), endpoint.replace('api.met.no', 'api.met.no:444'),
        endpoint.replace('/compact', '/complete'), endpoint.replace('/compact', '/compact/extra'),
        endpoint.replace('api.met.no', 'user:password@api.met.no'), 'not a URL']) {
        const result = await runSample(`#${url}`);
        assert.equal(result.calls.length, 0, url);
        assert.equal(result.charts.length, 0, url);
        assert.match(result.loading.innerHTML, /Failed loading data/u);
    }
});

test('meteogram retains the existing network and JSON error display', async () => {
    for (const fetchImpl of [
        async () => {
            throw new Error('network failed');
        },
        async () => ({
            json: async () => {
                throw new Error('invalid JSON');
            }
        })
    ]) {
        const result = await runSample(`#${endpoint}?lat=60&lon=10`, fetchImpl);
        assert.equal(result.calls.length, 1);
        assert.equal(result.charts.length, 0);
        assert.match(result.loading.innerHTML, /Failed loading data/u);
    }
});
