import { createChart, expect, test } from '~/fixtures';

test.describe('global and specific palette', () => {
    test('Global and specific palette test', async ({ page }) => {

        // Chart with global palette
        await createChart(
            page,
            {
                chart: {
                    className: 'global-palette-chart'
                },
                series: [{
                    type: 'column',
                    data: [1, 3, 2, 4],
                    colorByPoint: true
                }]
            }
        );

        // Add a new container div to the page. Add the chart with specific
        // palette to this container.
        await page.evaluate((): void => {
            const div = document.createElement('div');
            document.body.appendChild(div);

            Highcharts.chart(div, {
                chart: {
                    className: 'specific-palette-chart'
                },
                series: [{
                    type: 'column',
                    data: [1, 3, 2, 4],
                    colorByPoint: true
                }],
                palette: {
                    light: {
                        backgroundColor: '#88ffff',
                        neutralColor: '#eeeeee',
                    }
                }
            });
        });

        const getBackgroundColor = async (
            className: string
        ): Promise<string> => {
            const [bgColorVar, bgColorComputed] = await page.locator(
                `.${className} .highcharts-background`
            )
                .evaluate((el): [string, string] => {
                    return [
                        el.getAttribute('fill') || '',
                        getComputedStyle(el).getPropertyValue('fill') || ''
                    ];
                });
            expect(bgColorVar).toBe('var(--highcharts-background-color)');
            return bgColorComputed;
        };

        // Check that the computed style is #ffffff (light mode)
        expect(await getBackgroundColor('global-palette-chart'))
            .toBe('rgb(255, 255, 255)');

        // Check that the computed style is #88ffff (light mode)
        expect(await getBackgroundColor('specific-palette-chart'))
            .toBe('rgb(136, 255, 255)');

        //--- Set global dark mode
        await page.evaluate((): void => {
            document.body.classList.add('highcharts-dark');
        });

        // Check that the computed style is #141414 (dark mode)
        expect(await getBackgroundColor('global-palette-chart'))
            .toBe('rgb(20, 20, 20)');

        // Check that the computed style is also #141414 (dark mode)
        expect(await getBackgroundColor('specific-palette-chart'))
            .toBe('rgb(20, 20, 20)');

        //--- Set specific dark mode
        await page.evaluate((): void => {
            document.body.classList.remove('highcharts-dark');
            document.querySelector(
                '.specific-palette-chart'
            )?.classList.add('highcharts-dark');
        });

        // The global chart should now be back to light mode
        expect(await getBackgroundColor('global-palette-chart'))
            .toBe('rgb(255, 255, 255)');

        // The specific chart should be in dark mode
        expect(await getBackgroundColor('specific-palette-chart'))
            .toBe('rgb(20, 20, 20)');

        //--- Reset class names, then set `palette.colorScheme` to dark
        await page.evaluate((): void => {
            document.body.classList.remove('highcharts-dark');
            document.querySelector(
                '.specific-palette-chart'
            )?.classList.remove('highcharts-dark');

            // Set specific chart palette to dark mode
            const specificChart = Highcharts.charts.find(
                chart => chart?.container.classList.contains(
                    'specific-palette-chart'
                )
            );
            specificChart?.update({
                palette: {
                    colorScheme: 'dark'
                }
            });
        });

        // The global chart should now be in light mode
        expect(await getBackgroundColor('global-palette-chart'))
            .toBe('rgb(255, 255, 255)');

        // The specific chart should also be in dark mode
        expect(await getBackgroundColor('specific-palette-chart'))
            .toBe('rgb(20, 20, 20)');
    });
});
