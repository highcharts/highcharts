import { test, expect } from '../fixtures.ts';
import { getKarmaScripts } from '../utils.ts';

test('Karma scripts', async () => {
    const scripts = await getKarmaScripts();
    expect(scripts).toContain('code/highcharts.src.js');
});
