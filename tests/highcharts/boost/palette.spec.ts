import { createChart, test, expect } from '~/fixtures.ts';

/*
* Sample the pixel color at a given SVG point inside a Highcharts SVG chart
* with a boosted series.
*/
async function sampleImagePixelAtSVGPoint(
    svg: SVGSVGElement,
    imageEl: SVGImageElement | null,
    svgX: number,
    svgY: number
): Promise<{ r: number; g: number; b: number; a: number; hex: string } | null> {

    // Return the color as hex string, including opacity
    function toHex(r: number, g: number, b: number, a: number): string {
        const h = (n: number) => n.toString(16).padStart(2, '0');
        return `#${h(r)}${h(g)}${h(b)}${h(a)}`;
    }

    imageEl ||= svg.querySelector('.highcharts-boost-canvas');
    if (!imageEl) {
        return null;
    }

    // 1) Map the SVG point into the <image>'s local coordinate space
    const pt = svg.createSVGPoint();
    pt.x = svgX;
    pt.y = svgY;

    const ctm = imageEl.getCTM();
    if (!ctm) {
        return null;
    }
    const inv = ctm.inverse();
    const local = pt.matrixTransform(inv);

    // 2) Convert local coordinates to 0..1 inside the image box
    const ix = imageEl.x.baseVal.value;
    const iy = imageEl.y.baseVal.value;
    const iw = imageEl.width.baseVal.value;
    const ih = imageEl.height.baseVal.value;

    const u = (local.x - ix) / iw;
    const v = (local.y - iy) / ih;

    if (u < 0 || u > 1 || v < 0 || v > 1) {
        return null; // outside the image
    }

    // 3) Load the embedded raster (data URL) into an HTMLImageElement
    const href =
        imageEl.getAttribute('href') ||
            imageEl.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ||
            '';

    if (!href || !href.startsWith('data:image')) {
        return null; // expects a data URL
    }

    const img: HTMLImageElement = await new Promise((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = href;
    });

    // 4) Sample the pixel on an offscreen canvas
    const cw = img.naturalWidth;
    const ch = img.naturalHeight;

    // Map u,v (0..1) to exact pixel indices
    const px = Math.floor(u * cw);
    const py = Math.floor(v * ch);

    if (px < 0 || py < 0 || px >= cw || py >= ch) {
        return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return null;
    }

    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(px, py, 1, 1).data;
    const r = data[0],
        g = data[1],
        b = data[2],
        a = data[3];

    return { r, g, b, a, hex: toHex(r, g, b, a) };
}

test.describe('Boost Module and Palette', () => {
    test('Boost module with color CSS variables', async ({ page }) => {
        // Register the function in the browser context before creating the chart
        await page.evaluate((fnString) => {
            /* eslint-disable-next-line @typescript-eslint/no-implied-eval */
            (window as any).sampleImagePixelAtSVGPoint = new Function(
                'return ' + fnString
            )();
        }, sampleImagePixelAtSVGPoint.toString());

        const chart = await createChart(page, {
            chart: {
                type: 'scatter',
                margin: 80,
                width: 400,
                height: 300
            },
            boost: {
                useGPUTranslations: true,
                seriesThreshold: 1
            },
            series: [{
                data: [1, 3, 2, 4],
                boostThreshold: 1
            }]
        }, {
            modules: ['modules/boost.src.js']
        }).then(handle => handle.jsonValue());

        expect((chart.series[0] as any).boosted).toBe(true);

        // Test pixel color at a specific point in the SVG `image` element
        const pixelColor = await page.evaluate(async () => {
            const chart = Highcharts.charts[0];
            const svg = document.querySelector('#container svg');

            if (!svg) {
                return null;
            }
            const x = chart.xAxis[0].toPixels(0);
            const y = chart.yAxis[0].toPixels(1);

            const result = await (window as any).sampleImagePixelAtSVGPoint(
                svg,
                null,
                x,
                y
            );

            return result?.hex;
        });

        // Expect default blue color from CSS variable --highcharts-color-0
        expect(pixelColor).toBe('#2caffeff');

    });
});
