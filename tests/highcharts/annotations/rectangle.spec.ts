import { test, expect } from '~/fixtures.ts';
import { useSharedPage } from '~/helpers.ts';
import { clickChart } from '../helpers.ts';

test.describe('Stock tools rectangle annotatation.', () => {
    const getPage = useSharedPage(
        '/highcharts/cypress/stock-tools-gui/',
        page => page.setViewportSize({ width: 1000, height: 500 })
    );

    test('Rectangle annotation should have closed shape, 16449', async () => {
        const page = getPage();

        await page.locator('.highcharts-label-annotation > *').nth(1).click();
        await page.locator('.highcharts-rectangle-annotation').click();
        await clickChart(page, [[250, 200], [350, 100]], true);

        await expect(
            page.locator('.highcharts-annotation-shapes>path').first(),
            'Shape should be closed'
        ).toHaveAttribute('d', /Z$/u);
    });
});
