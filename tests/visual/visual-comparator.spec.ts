import { test, expect } from '@playwright/test';
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

test('visual cleanup restores direct prototype mutations between samples', async ({ page }) => {
    await page.setContent('<div data-test-container></div>');
    await page.addScriptTag({ path: 'code/highcharts.src.js' });
    await page.addScriptTag({ path: 'code/highcharts-more.src.js' });
    await page.addScriptTag({ path: 'tests/visual/visual-setup.js' });

    const restored = await page.evaluate(() => {
        const prototype = window.Highcharts.SVGRenderer.prototype;
        const original = prototype.html;
        window.HCVisualSetup.beforeSample();
        prototype.html = function () { throw new Error('Sample override'); };
        window.HCVisualSetup.afterSample();
        return prototype.html === original;
    });

    expect(restored).toBe(true);
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
