import { test, expect } from '~/fixtures.ts';
import { useSharedPage, waitForChart } from '~/helpers.ts';

test.describe('Chart tick trimming, #21743', () => {
    const getPage = useSharedPage('/highcharts/e2e/axis-tick');

    test('Should properly filter ticks on any linked same sized non-grid axis', async () => {
        const page = getPage();

        await waitForChart(page);
        const visibility = await page.evaluate(() => {
            const chart = Highcharts.charts[0] as any;
            const getVisibility = (axis: any) => Array.from(
                axis.gridGroup.element
                    .querySelectorAll('.highcharts-minor-grid-line'),
                (line: Element) => line.getAttribute('visibility')
            );

            chart.setSize(600, null);

            return {
                parent: getVisibility(chart.xAxis[0]),
                linked: getVisibility(chart.xAxis[1])
            };
        });

        expect(
            visibility.linked.length,
            'Linked axis should have same nr of minor ticks as parent on ' +
            'same sized non-grid axis.'
        ).toBe(visibility.parent.length);
        expect(
            visibility.linked,
            'Ticks should have same visibility as their parent.'
        ).toEqual(visibility.parent);
    });
});
