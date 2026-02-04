import { createChart, expect, test } from '~/fixtures';
import { testImageDataURL } from '~/testContent';

test.describe('SVGRenderer', () => {
    test('Symbol tests', {
        annotation: [
            {
                type: 'qunit-sample',
                description: 'samples/unit-tests/svgrenderer/symbols'
            }
        ]
    }, async ({ page }) => {
        const w = 400,
            h = 400,
            url = testImageDataURL;

        const chart = await createChart(
            page,
            {
                chart: {
                    width: w,
                    height: h,
                    backgroundColor: 'none'
                }
            }
        );
        const renderer = await chart.evaluateHandle( c => c.renderer);
        await renderer.evaluate(
            (ren,  url) => {
                ren.symbol(url, 100, 100)
                    .attr({ 'data-testid':'symbol1' })
                    .add();


                // With explicit size
                ren.symbol(
                    url,
                    200,
                    100,
                    null,
                    null,
                    {
                        width: 20,
                        height: 20
                    } as any
                )
                    .attr({ 'data-testid': 'symbol2' })
                    .add();


                // Label with background
                ren.label('Hello Label', 300, 100, url)
                    .attr({
                        padding: 0,
                        width: 100,
                        height: 30,
                        'data-testid': 'label'
                    })
                    .add();

                // Symbol with wrong name #6627
                ren
                    .symbol('krakow', 100, 200, 10, 10)
                    .attr({
                        fill: 'red',
                        'data-testid': 'symbol3'
                    })
                    .add();
            },
            url
        );

        const symbol1 = page.getByTestId('symbol1');
        const symbol2 = page.getByTestId('symbol2');
        const labelImg = page.getByTestId('label')
            .locator('image');
        const symbol3 = page.getByTestId('symbol3');

        await Promise.all([
            expect(symbol1).toHaveAttribute('width', '30'),
            expect(symbol1).toHaveAttribute('transform', /translate\(-15[ ,]-15\)/),

            expect(symbol2).toHaveAttribute('width', '20'),
            expect(symbol2).toHaveAttribute('transform', /translate\(-10[ ,]-10\)/),

            expect(labelImg).toHaveAttribute('width', '30'),
            expect(labelImg).toHaveAttribute('transform', /translate\(35[ ,]0\)/),

            expect(symbol3).toHaveJSProperty('tagName', 'path'),
            expect(symbol3).toHaveAttribute('d', /A\s+5\s+5/)
        ]);

        await renderer.dispose();
    });
});
