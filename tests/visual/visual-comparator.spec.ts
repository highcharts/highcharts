import { test, expect } from '@playwright/test';

type VisualComparator = {
    CANVAS_WIDTH: number;
    CANVAS_HEIGHT: number;
    compare: (data1: Uint8ClampedArray, data2: Uint8ClampedArray) => number;
    createCanvas: (id: string) => HTMLCanvasElement;
    svgToPixels: (
        svg: string,
        canvas: HTMLCanvasElement
    ) => Promise<Uint8ClampedArray>;
};

type VisualWindow = Window & {
    VisualComparator?: VisualComparator;
};

const svg = (fill: string) => (
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">' +
        `<rect width="600" height="400" fill="${fill}"/></svg>`
);

async function compareSVGs(
    page: import('@playwright/test').Page,
    referenceSVG: string,
    candidateSVG: string
): Promise<number> {
    return page.evaluate(async ({ referenceSVG, candidateSVG }) => {
        const comparator = (window as VisualWindow).VisualComparator;
        if (!comparator) {
            throw new Error('Visual comparator is not loaded.');
        }

        const referencePixels = comparator.svgToPixels(
            referenceSVG,
            comparator.createCanvas('reference')
        );
        const candidatePixels = comparator.svgToPixels(
            candidateSVG,
            comparator.createCanvas('candidate')
        );
        const pixels = await Promise.all([referencePixels, candidatePixels]);

        return comparator.compare(pixels[0], pixels[1]);
    }, { referenceSVG, candidateSVG });
}

test.beforeEach(async ({ page }) => {
    await page.setContent('');
    await page.addScriptTag({ path: 'test/visual-comparator.js' });
});

test('Visual comparator: identical SVGs have no numeric difference', async ({
    page
}) => {
    const difference = await compareSVGs(page, svg('#ffffff'), svg('#ffffff'));

    expect(difference).toBe(0);
});

test('Visual comparator: changed SVGs have a numeric difference', async ({
    page
}) => {
    const difference = await compareSVGs(page, svg('#ffffff'), svg('#000000'));

    expect(difference).toBeGreaterThan(0);
});

test('Visual comparator: missing SVG rejects', async ({ page }) => {
    await expect(page.evaluate(() => {
        const comparator = (window as VisualWindow).VisualComparator;
        if (!comparator) {
            throw new Error('Visual comparator is not loaded.');
        }

        return comparator.svgToPixels(
            undefined as unknown as string,
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
