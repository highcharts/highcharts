import { test, expect } from '../fixtures.ts';
import { getKarmaScripts, getSample } from '../utils.ts';

test('Karma scripts', async () => {
    const scripts = await getKarmaScripts();
    expect(scripts).toContain('code/highcharts.src.js');
});

test.describe('Demo folder assembly', () =>{
    test('demo.js', () => {
        const demoPath = 'samples/highcharts/demo/line-chart';
        const demo = getSample(demoPath);

        expect(demo).toHaveProperty('script');
        expect(demo).toHaveProperty('html');
        expect(demo).toHaveProperty('details');
        expect(demo).toHaveProperty('css');
    });
});
