import { injectVisualSampleStyles } from './visual-styles.ts';
import { test, expect } from '@playwright/test';
import type { Chart } from '~code/highcharts.src.js';
import { readFileSync } from 'node:fs';
import {
    compareVisualSVGs,
    type VisualComparator
} from './visual-comparison.ts';

type VisualWindow = Window & {
    VisualComparator?: VisualComparator;
};

const svg = (fill: string) => (
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">' +
        `<rect width="600" height="400" fill="${fill}"/></svg>`
);

test.beforeEach(async ({ page }) => {
    await page.setContent('');
    await page.addScriptTag({ path: 'test/visual-comparator.js' });
});

test('visual cleanup restores prototypes and cancels sample timers', async ({ page }) => {
    await page.setContent('<div data-test-container></div>');
    await page.addScriptTag({ path: 'code/highcharts.src.js' });
    await page.addScriptTag({ path: 'code/highcharts-more.src.js' });
    await page.addScriptTag({ path: 'tests/visual/visual-setup.js' });

    const restored = await page.evaluate(async () => {
        const prototype = window.Highcharts.SVGRenderer.prototype;
        const original = prototype.html;
        let callbacks = 0;
        window.HCVisualSetup.beforeSample();
        prototype.html = function () { throw new Error('Sample override'); };
        setTimeout(() => callbacks++, 0);
        requestAnimationFrame(() => callbacks++);
        window.HCVisualSetup.afterSample();
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => setTimeout(resolve, 0));
        return { prototypeRestored: prototype.html === original, callbacks };
    });

    expect(restored).toEqual({ prototypeRestored: true, callbacks: 0 });
});

test('styled sample cleanup preserves the next chart layout and SVG styles', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.setContent('<div data-test-container><div id="container"></div></div>');
    for (const path of [
        'code/highcharts.src.js',
        'code/highcharts-more.src.js',
        'tests/visual/visual-setup.js'
    ]) {
        await page.addScriptTag({ path });
    }
    const polygonCSS = readFileSync(
        'samples/highcharts/css/polygon/demo.css', 'utf8'
    ).replace(/@import[^;]+;/g, '');
    const results = await page.evaluate(({ polygonCSS }) => {
        const visualWindow = window as VisualWindow;
        function addStyle(id: string, css: string): void {
            const style = document.createElement('style');
            style.id = id;
            style.textContent = css;
            document.head.appendChild(style);
        }
        function render(styledMode = false) {
            window.HCVisualSetup.beforeSample();
            return window.Highcharts.chart('container', {
                chart: { type: 'column', animation: false, styledMode },
                series: [{ type: 'column', data: [1, 2] }],
                responsive: {
                    rules: [{
                        condition: { maxWidth: 600 },
                        chartOptions: { chart: { inverted: true, height: 600 } }
                    }]
                }
            });
        }
        function dimensions(chart: Chart) {
            return {
                width: chart.chartWidth,
                height: chart.chartHeight,
                inverted: !!chart.inverted
            };
        }

        const fresh = dimensions(render());
        window.HCVisualSetup.afterSample();
        addStyle('highcharts.css', '.highcharts-background { fill: red; }');
        addStyle('demo.css', polygonCSS);
        const narrowed = dimensions(render(true));
        window.HCVisualSetup.afterSample();
        const reused = dimensions(render());
        window.HCVisualSetup.afterSample();
        addStyle('highcharts.css', '.highcharts-background { fill: blue; }');
        addStyle('demo.css', '.highcharts-point { fill: green; }');
        const styledSVG = visualWindow.VisualComparator.getSVG(render(true));
        window.HCVisualSetup.afterSample();
        return { fresh, narrowed, reused, styledSVG };
    }, { polygonCSS });

    expect(results.fresh).toEqual({
        width: 784, height: 400, inverted: false
    });
    expect(results.narrowed).toEqual({
        width: 600, height: 600, inverted: true
    });
    expect(results.reused).toEqual(results.fresh);
    expect(results.styledSVG).toContain('fill: blue');
    expect(results.styledSVG).toContain('fill: green');
    expect(results.styledSVG).not.toContain('fill: red');
    expect(results.styledSVG).not.toContain('max-width: 600px');
});

test('first styled sample capture embeds the Highcharts CSS', async ({ page }) => {
    await page.setContent('<div id="container"></div>');
    await page.addScriptTag({ path: 'code/highcharts.src.js' });
    await page.addScriptTag({ path: 'test/visual-comparator.js' });
    await injectVisualSampleStyles(page, true);

    await page.evaluate(() => {
        window.Highcharts.chart('container', {
            chart: { styledMode: true },
            title: { text: 'First styled sample' },
            series: [{ data: [1, 2, 3] }]
        });
    });
    await page.waitForFunction(() => window.Highcharts.charts[0]?.hasLoaded);

    const capture = await page.evaluate(() => {
        const style = document.getElementById('highcharts.css');
        const chart = window.Highcharts.charts[0];
        return {
            css: style?.innerText || '',
            svg: window.VisualComparator?.getSVG(chart)
        };
    });

    expect(capture.css.length).toBeGreaterThan(0);
    expect(capture.svg?.replace(/\s/g, '')).toContain(
        `<style>${capture.css.replace(/\s/g, '')}</style>`
    );
});

test('Visual comparator: identical SVGs have no numeric difference', async ({
    page
}) => {
    const comparison = await compareVisualSVGs(
        page, svg('#ffffff'), svg('#ffffff')
    );

    expect(comparison).toEqual({ difference: 0, width: 600, height: 400 });
});

test('Visual comparator: changed SVGs preserve pixels in base64', async ({
    page
}) => {
    const comparison = await compareVisualSVGs(
        page, svg('#ffffff'), svg('#0080ff')
    );

    expect(comparison.difference).toBe(600 * 400);
    expect(typeof comparison.referencePixels).toBe('string');
    expect(typeof comparison.candidatePixels).toBe('string');
    expect(Buffer.from(comparison.referencePixels, 'base64')).toEqual(
        Buffer.alloc(600 * 400 * 4, 255)
    );
    expect(Buffer.from(comparison.candidatePixels, 'base64')).toEqual(
        Buffer.alloc(600 * 400 * 4, Buffer.from([0, 128, 255, 255]))
    );
});

test('Visual comparator: captures non-breaking spaces as valid SVG', async ({
    page
}) => {
    const source = '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'width="600" height="400">' +
        '<text x="10" y="20">Series 1:\u00A0\u00A0x = 1, y = 2</text></svg>';
    await page.setContent(source);

    const captures = await page.evaluate(() => {
        const comparator = (window as VisualWindow).VisualComparator;
        if (!comparator) {
            throw new Error('Visual comparator is not loaded.');
        }

        return [
            comparator.getSVG({ container: document.body }),
            comparator.getSVG()
        ];
    });

    for (const captured of captures) {
        const comparison = await compareVisualSVGs(page, source, captured);
        expect(comparison.difference).toBe(0);
    }
});

test('Visual comparator: missing SVG rejects', async ({ page }) => {
    await expect(page.evaluate(() => {
        const comparator = (window as VisualWindow).VisualComparator;
        if (!comparator) {
            throw new Error('Visual comparator is not loaded.');
        }

        return comparator.svgToPixels(
            undefined,
            comparator.createCanvas('missing')
        );
    })).rejects.toThrow();
});

test('Visual comparator: invalid SVG rejects', async ({ page }) => {
    await expect(page.evaluate(() => {
        const comparator = (window as VisualWindow).VisualComparator;
        if (!comparator) {
            throw new Error('Visual comparator is not loaded.');
        }

        return comparator.svgToPixels('<svg', comparator.createCanvas('invalid'));
    })).rejects.toThrow('Error loading SVG on canvas.');
});
