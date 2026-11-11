import { test, expect } from '~/fixtures.ts';
import { getSample, transpileTS } from '~/utils.ts';

const endpoint = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';
const sample = getSample('samples/highcharts/demo/combo-meteogram');
const script = transpileTS(sample.script || '');

test.beforeEach(async ({ page }) => {
    await page.route('**/*', route => route.abort());
    await page.route('https://meteogram.test/**', route =>
        route.request().isNavigationRequest() ? route.fulfill({
            contentType: 'text/html',
            body: '<div id="container"><div id="loading">Loading</div></div>'
        }) : route.abort());
});

test('Meteogram accepts default and custom MET forecast locations', async ({ page }) => {
    const hashes = ['', `#${endpoint}?lat=60&lon=10`,
        `#${endpoint}?lat=-20&lon=150&altitude=123`];
    const requests: string[] = [];
    await page.route(`${endpoint}?*`, route => {
        requests.push(route.request().url());
        return route.fulfill({
            path: 'samples/data/json-sources/weather-forecast.json',
            contentType: 'application/json',
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    });
    for (const [index, hash] of hashes.entries()) {
        await page.goto(`https://meteogram.test/?case=${index}${hash}`);
        for (const file of ['highcharts', 'modules/datagrouping',
            'modules/windbarb', 'modules/pattern-fill']) {
            await page.addScriptTag({ path: `code/${file}.src.js` });
        }
        await page.addScriptTag({ content: script });
        await expect(page.locator('#container .highcharts-root')).toBeVisible();
    }
    expect(requests).toEqual([
        `${endpoint}?lat=51.50853&lon=-0.12574&altitude=25`,
        ...hashes.slice(1).map(hash => hash.slice(1))
    ]);
});

test('Meteogram rejects unsupported URLs before making a request', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => {
        if (request.resourceType() === 'fetch') {
            requests.push(request.url());
        }
    });
    const urls = ['/account/delete?confirm=1',
        '//api.met.no/weatherapi/locationforecast/2.0/compact',
        'https://attacker.invalid/collect',
        endpoint.replace('api.met.no', 'api.met.no.attacker.invalid'),
        endpoint.replace('api.met.no', 'api.met.no@attacker.invalid'),
        endpoint.replace('https:', 'http:'),
        endpoint.replace('api.met.no', 'api.met.no:444'),
        endpoint.replace('/compact', '/complete'), `${endpoint}/extra`,
        endpoint.replace('api.met.no', 'user:password@api.met.no'), 'not a URL'];
    for (const [index, url] of urls.entries()) {
        await page.goto(`https://meteogram.test/?case=${index}#${url}`);
        await page.addScriptTag({ content: script });
        await expect(page.locator('#loading')).toContainText('Failed loading data');
    }
    expect(requests).toEqual([]);
});

test('Meteogram refuses forecast redirects', async ({ page }) => {
    let redirected = false;
    await page.route('https://api.met.no/**', route => route.fulfill({
        status: 302,
        headers: {
            location: 'https://attacker.invalid/collect',
            'Access-Control-Allow-Origin': '*'
        }
    }));
    await page.route('https://attacker.invalid/**', route => {
        redirected = true;
        return route.fulfill({
            json: {},
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    });
    await page.goto(`https://meteogram.test/#${endpoint}?lat=60&lon=10`);
    await page.addScriptTag({ content: script });
    await expect(page.locator('#loading')).toContainText('Failed loading data');
    expect(redirected).toBe(false);
});
