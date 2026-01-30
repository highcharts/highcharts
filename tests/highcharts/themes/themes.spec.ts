import type Highcharts from '~code/esm/highcharts.src';

import { test, expect, createChart } from '~/fixtures.ts';

type ThemeDetails = {
    themeType: string;
    titleColor: string | null;
    titleTextTransform: string | null;
    themeTitleColor: string | null;
    themeTitleTextTransform: string | null;
};

type ThemeExpectations = {
    titleColor: string | null;
    titleTextTransform: string | null;
    themeTitleColor: string | null;
    themeTitleTextTransform: string | null;
};

type ThemeCase = {
    name: string;
    expected: ThemeExpectations;
};

const themeCases: ThemeCase[] = [
    {
        name: 'dark-blue',
        expected: {
            titleColor: '#C0C0C0',
            titleTextTransform: null,
            themeTitleColor: '#C0C0C0',
            themeTitleTextTransform: null
        }
    },
    {
        name: 'dark-green',
        expected: {
            titleColor: '#C0C0C0',
            titleTextTransform: null,
            themeTitleColor: '#C0C0C0',
            themeTitleTextTransform: null
        }
    },
    {
        name: 'dark-unica',
        expected: {
            titleColor: '#E0E0E3',
            titleTextTransform: 'uppercase',
            themeTitleColor: '#E0E0E3',
            themeTitleTextTransform: 'uppercase'
        }
    },
    {
        name: 'gray',
        expected: {
            titleColor: '#FFF',
            titleTextTransform: null,
            themeTitleColor: '#FFF',
            themeTitleTextTransform: null
        }
    },
    {
        name: 'grid',
        expected: {
            titleColor: '#000',
            titleTextTransform: null,
            themeTitleColor: '#000',
            themeTitleTextTransform: null
        }
    },
    {
        name: 'grid-light',
        expected: {
            titleColor: 'var(--highcharts-neutral-color-80)',
            titleTextTransform: 'uppercase',
            themeTitleColor: null,
            themeTitleTextTransform: 'uppercase'
        }
    },
    {
        name: 'sand-signika',
        expected: {
            titleColor: 'black',
            titleTextTransform: null,
            themeTitleColor: 'black',
            themeTitleTextTransform: null
        }
    },
    {
        name: 'skies',
        expected: {
            titleColor: '#3E576F',
            titleTextTransform: null,
            themeTitleColor: '#3E576F',
            themeTitleTextTransform: null
        }
    }
];

for (const themeCase of themeCases) {
    const { name, expected } = themeCase;
    test.describe(`themes/${name}`, {
        annotation: [
            {
                type: 'qunit-sample',
                description: `samples/unit-tests/themes/${name}`
            }
        ]
    }, () => {
        test(`applies ${name} theme when loaded`, async ({ page }) => {
            const chart = await createChart(
                page,
                {
                    title: {
                        text: 'Theme check'
                    },
                    series: [
                        {
                            type: 'line',
                            data: [1, 2, 3]
                        }
                    ]
                } as Highcharts.Options,
                {
                    modules: [`themes/${name}.js`]
                }
            );

            const themeDetails = await chart.evaluate<ThemeDetails>(
                (chartInstance: Highcharts.Chart) => {
                    const titleStyle = chartInstance.options.title?.style || {};
                    const themeTitleStyle =
                        Highcharts.theme?.title?.style || {};

                    return {
                        themeType: typeof Highcharts.theme,
                        titleColor: typeof titleStyle.color === 'string' ?
                            titleStyle.color :
                            null,
                        titleTextTransform:
                            typeof titleStyle.textTransform === 'string' ?
                                titleStyle.textTransform :
                                null,
                        themeTitleColor:
                            typeof themeTitleStyle.color === 'string' ?
                                themeTitleStyle.color :
                                null,
                        themeTitleTextTransform:
                            typeof themeTitleStyle.textTransform === 'string' ?
                                themeTitleStyle.textTransform :
                                null
                    };
                }
            );

            expect(themeDetails.themeType).toBe('object');
            expect(themeDetails.titleColor).toBe(expected.titleColor);
            expect(themeDetails.themeTitleColor)
                .toBe(expected.themeTitleColor);
            expect(themeDetails.titleTextTransform)
                .toBe(expected.titleTextTransform);
            expect(themeDetails.themeTitleTextTransform)
                .toBe(expected.themeTitleTextTransform);
        });
    });
}
