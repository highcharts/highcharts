import { test, expect } from '~/fixtures.ts';
import { useSharedPage, waitForChart } from '~/helpers.ts';
import { clickChart, selectRange } from '../helpers.ts';

test.describe('Measure annotation.', () => {
    const getPage = useSharedPage(
        '/highcharts/e2e/stock-tools-gui/',
        page => page.setViewportSize({ width: 1000, height: 800 })
    );

    test('Measure y annotation should have the width of the chart, #15696', async () => {
        const page = getPage();

        await selectRange(page, '3m');

        await page.locator('.highcharts-measure-xy > *').nth(1).click();
        await page.locator('.highcharts-measure-y').click();

        await clickChart(page, [[250, 200], [350, 100]], true);

        await waitForChart(page);
        expect(
            await page.evaluate(
                () => (Highcharts.charts[0] as any).annotations[0].startXMax
            ),
            'The startXMax property should be calculated.'
        ).toBeTruthy();
    });
});
