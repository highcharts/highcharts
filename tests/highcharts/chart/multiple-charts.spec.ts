import { test, expect } from '~/fixtures.ts';
import { useSharedPage } from '~/helpers.ts';

test.describe('Multiple charts', () => {
    const errors: string[] = [];
    const getPage = useSharedPage(
        '/highcharts/e2e/multiple-charts',
        page => {
            page.on('pageerror', error => errors.push(error.message));
            return Promise.resolve();
        }
    );

    test('#17192, Should not throw when mouse switches chart.', async () => {
        const page = getPage();

        await expect(page.locator(
            '#container1 .highcharts-root, #container2 .highcharts-root'
        )).toHaveCount(2);

        for (const container of ['#container1', '#container2', '#container1']) {
            const box = await page.locator(container).boundingBox();

            await page.mouse.move(
                (box?.x ?? 0) + (box?.width ?? 0) / 2,
                (box?.y ?? 0) + (box?.height ?? 0) / 2,
                { steps: 5 }
            );
        }

        expect(
            errors,
            'Should not throw exception when moving mouse between charts.'
        ).toEqual([]);
    });
});
