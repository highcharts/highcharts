import { test, expect } from '~/fixtures.ts';
import { useSharedPage, waitForChart } from '~/helpers.ts';
import { clickChart } from '../helpers.ts';

test.describe('Popup tests, #16234', () => {
    const getPage = useSharedPage(
        '/highcharts/e2e/annotations-gui',
        page => page.setViewportSize({ width: 1000, height: 500 })
    );

    test('Should create Circle Annotation, and check if there are label options', async () => {
        const page = getPage();

        // Show the submenus, like jQuery's show()
        await page.locator('.highcharts-submenu-wrapper').evaluateAll(
            elements => elements.forEach(el => {
                (el as HTMLElement).style.display = 'block';
            })
        );
        await page.locator('.highcharts-circle-annotation').click();
        await clickChart(page, [[250, 200], [250, 250]], true);

        await page.locator('.highcharts-annotation > *').first().click();
        await page.locator('.highcharts-annotation-edit-button').click();

        await expect(page.getByText('Label options')).toHaveCount(0);
    });
});

test.describe('Label annotation crop property.', () => {
    const getPage = useSharedPage(
        '/highcharts/e2e/annotations-gui',
        page => page.setViewportSize({ width: 1000, height: 500 })
    );

    test('#19179: Should set userOptions.crop based on labelOptions', async () => {
        const page = getPage();

        await page.locator('.highcharts-label-annotation').first().click();

        await page.locator('#container').click({ position: { x: 100, y: 100 } });

        await waitForChart(page);
        await expect.poll(() => page.evaluate(
            () => Highcharts.charts[0].annotations[0].labels[0].options.crop
        )).toBe(false);
    });
});
