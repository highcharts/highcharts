import { test, expect } from '~/fixtures.ts';
import { useSharedPage, waitForChart } from '~/helpers.ts';
import { waitForBoard } from '../../helpers.ts';

const kpiValue = '.highcharts-dashboards-component-kpi-value';

test.describe('KPI Component test', () => {
    const getPage = useSharedPage('/dashboards/cypress/kpi-with-connector');

    test('KPI Component should have a last value of the point when connector attached.', async () => {
        const page = getPage();

        await expect(page.locator(`#kpi ${kpiValue}`)).toBeVisible();
        await expect(page.locator(`#kpi ${kpiValue}`)).toHaveText('1200');

        await expect(page.locator(`#kpi-2 ${kpiValue}`)).toBeVisible();
        await expect(page.locator(`#kpi-2 ${kpiValue}`))
            .toHaveText('OTHER_VALUE');
    });

    test('KPI Component\'s value should change after selection to last visible point.', async () => {
        const page = getPage();

        await waitForChart(page);
        await page.evaluate(() => {
            Highcharts.charts[0].xAxis[0].setExtremes(
                void 0,
                Date.UTC(2019, 0, 7)
            );
        });

        await expect(page.locator(`#kpi ${kpiValue}`)).toHaveText('700');
        await expect(page.locator(`#kpi-2 ${kpiValue}`))
            .toHaveText('OTHER_VALUE');
    });
});

test.describe('Linking KPI value to chart point test', () => {
    const getPage = useSharedPage('/dashboards/kpi-component/linked-value-to');

    test('Value of the selected point should be equal to the KPI Component value', async () => {
        const page = getPage();

        await expect(page.locator(`#kpi ${kpiValue}`)).toBeVisible();
        await expect(page.locator(`#kpi ${kpiValue}`)).toHaveText('1200');

        await waitForChart(page);
        expect(
            await page.evaluate(
                () => Highcharts.charts[0].series[1].points[2].y
            ),
            'The point value is equal to the KPI value.'
        ).toBe(1200);
    });

    test('The synced point should update with a change of the KPI value in extremes sync.', async () => {
        const page = getPage();

        await waitForBoard(page);
        const values = await page.evaluate(() => {
            const board = (window as any).Dashboards.boards[0];
            const chartComponent = board.mountedComponents[1].component;
            const kpiComponent = board.mountedComponents[0].component;
            const getY = () => kpiComponent.chart.series[1].points[2].y;

            chartComponent.chart.xAxis[0].setExtremes(
                null,
                Date.UTC(2019, 0, 7)
            );
            const synced = getY();

            kpiComponent.update({
                linkedValueTo: {
                    enabled: false
                }
            });

            chartComponent.chart.xAxis[0].setExtremes(
                null,
                Date.UTC(2019, 0, 12)
            );

            return { synced, unlinked: getY() };
        });

        expect(values.synced, 'The point value is equal to the KPI value.')
            .toBe(700);
        expect(
            values.unlinked,
            'The point Y value should remain the same after turning off the linkedValueTo option.'
        ).toBe(700);
    });
});

test.describe('KPI component formula value', () => {
    const getPage = useSharedPage('/dashboards/cypress/kpi-with-connector');

    test('KPI component formula value should be properly displayed.', async () => {
        const page = getPage();

        await waitForBoard(page);
        await page.evaluate(() => {
            (window as any).Dashboards.boards[0].mountedComponents[1]
                .component.update({ formula: 'MEDIAN' });
        });

        await expect(page.locator(`#kpi ${kpiValue}`)).toHaveText('650');
    });
});
