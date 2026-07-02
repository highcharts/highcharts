import { test, expect } from '~/fixtures.ts';

// #23712 - flex child with height 100% + min-height causes infinite reflow
const flexContainerHTML = (parentHeight = '100%') => `
<!DOCTYPE html>
<html>
<head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</head>
<body>
    <div style="display: flex;">
        <div style="width: 100%;" id="child">
            <div style="height: ${parentHeight}; min-height: 500px;" id="parent">
                <div style="height: 100%" id="container"></div>
            </div>
            <div id="blue-div" style="height: 5px;"></div>
        </div>
    </div>
</body>
</html>
`;

test.describe('Chart reflow', () => {
    test('Infinite reflow in flex container, #23712', async ({ page }) => {
        await page.setContent(flexContainerHTML('100%'), {
            waitUntil: 'networkidle'
        });

        const result = await page.evaluate(() => {
            return new Promise<{ initialHeight: number; heightAfter: number }>(
                (resolve) => {
                    const chart = Highcharts.chart('container', {
                        series: [{ data: [1, 2, 3] }]
                    });

                    const initialHeight = chart.chartHeight;

                    const blueDiv = document.getElementById('blue-div');
                    if (blueDiv) {
                        blueDiv.style.height = '10px';
                    }

                    setTimeout(() => {
                        resolve({
                            initialHeight,
                            heightAfter: chart.chartHeight
                        });
                    }, 300);
                }
            );
        });

        expect(
            result.initialHeight,
            'Chart has finite height (no infinite reflow)'
        ).toBeGreaterThan(400);
        expect(result.initialHeight).toBeLessThan(1000);

        expect(
            result.heightAfter,
            'Chart height remains finite after sibling change'
        ).toBeGreaterThan(400);
        expect(result.heightAfter).toBeLessThan(1000);
    });

    test('Infinite reflow with parent height 99%, #23712', async ({ page }) => {
        await page.setContent(flexContainerHTML('99%'), {
            waitUntil: 'networkidle'
        });

        const result = await page.evaluate(() => {
            return new Promise<{ initialHeight: number; heightAfter: number }>(
                (resolve) => {
                    const chart = Highcharts.chart('container', {
                        series: [{ data: [1, 2, 3] }]
                    });

                    const initialHeight = chart.chartHeight;

                    const blueDiv = document.getElementById('blue-div');
                    if (blueDiv) {
                        blueDiv.style.height = '10px';
                    }

                    setTimeout(() => {
                        resolve({
                            initialHeight,
                            heightAfter: chart.chartHeight
                        });
                    }, 300);
                }
            );
        });

        expect(
            result.initialHeight,
            'Chart has finite height with 99% parent'
        ).toBeGreaterThan(400);
        expect(result.initialHeight).toBeLessThan(1000);

        expect(
            result.heightAfter,
            'Chart height remains finite with 99% parent'
        ).toBeGreaterThan(400);
        expect(result.heightAfter).toBeLessThan(1000);
    });
});
