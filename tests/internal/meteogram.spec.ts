import { test, expect } from '~/fixtures.ts';
import { getSample, transpileTS } from '~/utils.ts';

test('Meteogram refuses forecast redirects', async ({ page }) => {
    let redirected = false;
    await page.route('https://meteogram.test/**', route => route.fulfill({
        contentType: 'text/html',
        body: '<div id="loading">Loading</div>'
    }));
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
    await page.goto('https://meteogram.test/#https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60&lon=10');
    const sample = getSample('samples/highcharts/demo/combo-meteogram');
    await page.addScriptTag({ content: transpileTS(sample.script || '') });
    await expect(page.locator('#loading')).toContainText('Failed loading data');
    expect(redirected).toBe(false);
});
