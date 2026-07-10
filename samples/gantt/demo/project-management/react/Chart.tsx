import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import { Title, Tooltip, XAxis, YAxis, PlotOptions } from '@highcharts/react';
import { GanttChart } from '@highcharts/react/Gantt';
import { GanttSeries } from '@highcharts/react/series/Gantt';
import type { GanttSeriesProps } from '@highcharts/react/series/Gantt';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

import 'highcharts/es-modules/masters/modules/pattern-fill.src.js';

type GanttTaskPoint = NonNullable<GanttSeriesProps['data']>[number] & {
    owner?: string;
    pointWidth?: number;
    dataLabels?: {
        align?: string;
        format?: string;
        style?: {
            color?: string;
            fontWeight?: string;
            textOutline?: string;
            opacity?: number;
        };
        x?: number;
    };
};

type GanttPoint = Highcharts.Point & {
    completed?: { amount?: number } | number;
    dependency?: string;
    milestone?: boolean;
    owner?: string;
    yCategory?: string;
    x2?: number;
};

const day = 24 * 36e5;
const today = Math.floor(Date.now() / day) * day;

// Plug-in to render plot bands for the weekends
Highcharts.addEvent(
    Highcharts.Axis,
    'foundExtremes',
    function (this: Highcharts.Axis) {
        const axis = this as Highcharts.Axis & {
            options: Highcharts.XAxisOptions & {
                custom?: { weekendPlotBands?: { color: string } };
                plotBands?: Highcharts.XAxisPlotBandsOptions[];
            };
        };
        const weekendColor = axis.options.custom?.weekendPlotBands?.color;
        if (weekendColor) {
            const chart = axis.chart;
            const isWeekend = (t: number) =>
                /[06]/.test(chart.time.dateFormat('%w', t));
            const plotBands: Highcharts.XAxisPlotBandsOptions[] = [];

            let inWeekend = false;

            for (
                let x = Math.floor((axis.min ?? 0) / day) * day;
                x <= Math.ceil((axis.max ?? 0) / day) * day;
                x += day
            ) {
                const last = plotBands.at(-1);
                if (isWeekend(x) && !inWeekend) {
                    plotBands.push({ from: x, color: weekendColor });
                    inWeekend = true;
                }

                if (!isWeekend(x) && inWeekend && last) {
                    last.to = x;
                    inWeekend = false;
                }
            }
            axis.options.plotBands = plotBands;
        }
    }
);

export default function ProjectManagementChart() {
    return (
        <GanttChart
            options={{
                chart: {
                    plotBorderColor: 'rgba(128,128,128,0.1)',
                    plotBorderWidth: 1,
                    plotBorderRadius: 5
                },
                lang: {
                    accessibility: {
                        axis: {
                            xAxisDescriptionPlural:
                                'The chart has a two-part X axis showing time in both week numbers and days.'
                        }
                    }
                }
            }}
            containerProps={{
                style: { maxWidth: '1000px', margin: '1em auto' }
            }}
        >
            <Title align="left">Gantt Project Management</Title>
            <Tooltip
                pointFormat={
                    '<span style="font-weight: bold">{point.name}</span><br>' +
                    '{point.start:%e %b}' +
                    '{#unless point.milestone} → {point.end:%e %b}{/unless}' +
                    '<br>' +
                    '{#if point.completed}' +
                    'Completed: {multiply point.completed.amount 100}%<br>' +
                    '{/if}' +
                    'Owner: {#if point.owner}{point.owner}{else}unassigned{/if}'
                }
            />
            <XAxis
                dateTimeLabelFormats={
                    {
                        day: {
                            main: '%e<br><span style="opacity: 0.5; font-size: 0.7em">%a</span>',
                            list: null
                        }
                    } as unknown as Parameters<
                        typeof XAxis
                    >[0]['dateTimeLabelFormats']
                }
                grid={{ borderWidth: 0, cellHeight: 46 }}
                gridLineWidth={1}
                min={today - 3 * day}
                max={today + 19 * day}
                {...({
                    currentDateIndicator: {
                        color: '#ef4444',
                        dashStyle: 'ShortDot',
                        width: 2,
                        label: { format: '' }
                    },
                    custom: {
                        weekendPlotBands: {
                            color: 'var(--highcharts-neutral-color-5, #f2f2f2)'
                        }
                    }
                } as unknown as Partial<Parameters<typeof XAxis>[0]>)}
            />
            <XAxis
                dateTimeLabelFormats={
                    {
                        month: { main: '%[bY]', list: null }
                    } as unknown as Parameters<
                        typeof XAxis
                    >[0]['dateTimeLabelFormats']
                }
                labels={{
                    align: 'left',
                    x: 5,
                    style: {
                        fontSize: '0.7em',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }
                }}
                grid={{ borderWidth: 0, cellHeight: 24 }}
                tickInterval={30 * 24 * 36e5}
            />
            <YAxis
                grid={{
                    borderWidth: 0,
                    enabled: true,
                    columns: [
                        {
                            title: { text: 'Title', textAlign: 'left', x: 18 },
                            labels: { format: '{value}', indentation: 0 }
                        },
                        {
                            title: {
                                text: 'Duration',
                                textAlign: 'left',
                                x: 8
                            },
                            labels: {
                                format:
                                    '{#if point.x2}' +
                                    '{(divide (subtract point.x2 point.x) 86400000)} days' +
                                    '{else} - {/if}',
                                style: { opacity: 0.7 }
                            }
                        }
                    ]
                }}
                gridLineWidth={0}
                labels={
                    {
                        symbol: { width: 8, height: 6, x: -4, y: -2 }
                    } as unknown as Parameters<typeof YAxis>[0]['labels']
                }
                staticScale={30}
            />
            <PlotOptions
                series={
                    {
                        borderRadius: '50%',
                        connectors: {
                            lineWidth: 1,
                            lineColor:
                                'var(--highcharts-neutral-color-60, #666)',
                            radius: 10,
                            endMarker: {
                                verticalAlign: 'bottom',
                                align: 'center',
                                yOffset: 5
                            },
                            startMarker: {
                                symbol: 'arrow-half',
                                lineWidth: 1,
                                lineColor:
                                    'var(--highcharts-neutral-color-60, #666)',
                                xOffset: -5
                            }
                        },
                        groupPadding: 0,
                        dataLabels: [
                            {
                                enabled: true,
                                align: 'left',
                                format: '{point.name}',
                                padding: 10,
                                style: {
                                    fontWeight: 'normal',
                                    textOutline: 'none'
                                }
                            },
                            {
                                enabled: true,
                                align: 'right',
                                format: `{#if point.completed}
                                    {(multiply point.completed.amount 100):.0f}%
                                {/if}`,
                                padding: 10,
                                style: {
                                    fontWeight: 'normal',
                                    textOutline: 'none',
                                    opacity: 0.6
                                }
                            }
                        ]
                    } as unknown as Highcharts.PlotSeriesOptions
                }
            />
            <Accessibility
                keyboardNavigation={{ seriesNavigation: { mode: 'serialize' } }}
                point={{
                    descriptionFormatter: (point) => {
                        const ganttPoint = point as GanttPoint;
                        const completedValue =
                            typeof ganttPoint.completed === 'number'
                                ? ganttPoint.completed
                                : (ganttPoint.completed?.amount ?? null);
                        const completed = completedValue
                            ? ' Task ' +
                              Math.round(completedValue * 1000) / 10 +
                              '% completed.'
                            : '';
                        const dependency =
                            ganttPoint.dependency &&
                            (
                                ganttPoint.series.chart.get(
                                    ganttPoint.dependency
                                ) as GanttPoint | undefined
                            )?.name;
                        const dependsOn = dependency
                            ? ' Depends on ' + dependency + '.'
                            : '';

                        return Highcharts.format(
                            ganttPoint.milestone
                                ? '{point.yCategory}. Milestone at {point.x:%Y-%m-%d}. ' +
                                      'Owner: {point.owner}.{dependsOn}'
                                : '{point.yCategory}.{completed} Start ' +
                                      '{point.x:%Y-%m-%d}, end {point.x2:%Y-%m-%d}. Owner: ' +
                                      '{point.owner}.{dependsOn}',
                            { point: ganttPoint, completed, dependsOn }
                        );
                    }
                }}
            />
            <Exporting />
            <GanttSeries
                name="Offices"
                data={
                    [
                        {
                            name: 'New offices',
                            id: 'new_offices',
                            owner: 'Peter',
                            pointWidth: 3,
                            color: 'var(--highcharts-neutral-color-60, #666)',
                            dataLabels: {
                                align: 'right',
                                style: {
                                    color: 'var(--highcharts-neutral-color-60, #666)'
                                },
                                x: 72
                            }
                        },
                        {
                            name: 'Prepare office building',
                            id: 'prepare_building',
                            parent: 'new_offices',
                            start: today - 8 * day,
                            end: today + 6 * day,
                            completed: { amount: 0.5 },
                            owner: 'Linda'
                        },
                        {
                            name: 'Inspect building',
                            id: 'inspect_building',
                            dependency: 'prepare_building',
                            parent: 'new_offices',
                            start: today + 6 * day,
                            end: today + 8 * day,
                            owner: 'Ivy'
                        },
                        {
                            name: 'Passed inspection',
                            id: 'passed_inspection',
                            dependency: 'inspect_building',
                            parent: 'new_offices',
                            start: today + 9.5 * day,
                            milestone: true,
                            owner: 'Peter'
                        },
                        {
                            name: 'Relocate',
                            id: 'relocate',
                            owner: 'Josh',
                            pointWidth: 3,
                            color: 'var(--highcharts-neutral-color-60, #666)',
                            dataLabels: {
                                align: 'right',
                                style: {
                                    color: 'var(--highcharts-neutral-color-60, #666)'
                                },
                                x: 57
                            }
                        },
                        {
                            name: 'Relocate staff',
                            id: 'relocate_staff',
                            parent: 'relocate',
                            start: today + 10 * day,
                            end: today + 11 * day,
                            owner: 'Mark'
                        },
                        {
                            name: 'Relocate test facility',
                            dependency: 'relocate_staff',
                            parent: 'relocate',
                            start: today + 11 * day,
                            end: today + 13 * day,
                            owner: 'Anne'
                        },
                        {
                            name: 'Relocate cantina',
                            dependency: 'relocate_staff',
                            parent: 'relocate',
                            start: today + 11 * day,
                            end: today + 14 * day
                        }
                    ] as GanttTaskPoint[]
                }
            />
            <GanttSeries
                name="Product"
                data={
                    [
                        {
                            name: 'New product launch',
                            id: 'new_product',
                            owner: 'Peter',
                            pointWidth: 3,
                            color: 'var(--highcharts-neutral-color-60, #666)',
                            dataLabels: {
                                align: 'right',
                                style: {
                                    color: 'var(--highcharts-neutral-color-60, #666)'
                                },
                                format: 'Launch',
                                x: 50
                            }
                        },
                        {
                            name: 'Development',
                            id: 'development',
                            parent: 'new_product',
                            start: today - day,
                            end: today + 11 * day,
                            completed: { amount: 0.6 },
                            owner: 'Susan'
                        },
                        {
                            name: 'Beta',
                            id: 'beta',
                            dependency: 'development',
                            parent: 'new_product',
                            start: today + 12.5 * day,
                            milestone: true,
                            owner: 'Peter'
                        },
                        {
                            name: 'Final development',
                            id: 'finalize',
                            dependency: 'beta',
                            parent: 'new_product',
                            start: today + 13 * day,
                            end: today + 17 * day
                        },
                        {
                            name: 'Launch',
                            dependency: 'finalize',
                            parent: 'new_product',
                            start: today + 17.5 * day,
                            milestone: true,
                            owner: 'Peter'
                        }
                    ] as GanttTaskPoint[]
                }
            />
        </GanttChart>
    );
}
