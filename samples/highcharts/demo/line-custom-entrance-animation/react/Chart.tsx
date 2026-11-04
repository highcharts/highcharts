import {
    Chart,
    Highcharts,
    Title,
    Subtitle,
    YAxis,
    PlotOptions
} from '@highcharts/react';
import { SplineSeries } from '@highcharts/react/series/Spline';
import { Data } from '@highcharts/react/modules/Data';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type {
    AnimationOptionsObject,
    Axis,
    SeriesLineOptions,
    SVGElement
} from 'highcharts';
import { csv } from './data';
import type {
    AnimatedPlotLineOptions,
    AxisWithGroups,
    SeriesWithGraph,
    RendererWithGlobalAnimation
} from './types';

(({ addEvent, animObject, Axis, Series }) => {
    const animateSVGPath = (
        svgElem: SVGElement,
        animation: AnimationOptionsObject,
        callback?: Function
    ) => {
        const length = (svgElem.element as SVGPathElement).getTotalLength();
        svgElem.attr({
            'stroke-dasharray': length,
            'stroke-dashoffset': length,
            'opacity': 1
        });
        svgElem.animate(
            {
                'stroke-dashoffset': 0
            },
            animation,
            callback
        );
    };

    Series.types.line.prototype.animate = function (init) {
        const animation = animObject(
            (this.options as SeriesLineOptions).animation
        );
        if (!init) {
            animateSVGPath((this as SeriesWithGraph).graph, animation);
        }
    };

    addEvent(Axis, 'afterRender', function (this: Axis) {
        const chart = this.chart,
            animation = animObject(
                (chart.renderer as RendererWithGlobalAnimation).globalAnimation
            );

        (this as AxisWithGroups).axisGroup
            // Init
            .attr({
                opacity: 0,
                rotation: -3,
                scaleY: 0.9
            })

            // Animate
            .animate(
                {
                    opacity: 1,
                    rotation: 0,
                    scaleY: 1
                },
                animation
            );
        if (this.horiz) {
            (this as AxisWithGroups).labelGroup
                // Init
                .attr({
                    opacity: 0,
                    rotation: 3,
                    scaleY: 0.5
                })

                // Animate
                .animate(
                    {
                        opacity: 1,
                        rotation: 0,
                        scaleY: 1
                    },
                    animation
                );
        } else {
            (this as AxisWithGroups).labelGroup
                // Init
                .attr({
                    opacity: 0,
                    rotation: 3,
                    scaleX: -0.5
                })

                // Animate
                .animate(
                    {
                        opacity: 1,
                        rotation: 0,
                        scaleX: 1
                    },
                    animation
                );
        }

        (this as AxisWithGroups).plotLines.forEach((plotLine) => {
            const animation = animObject(
                (plotLine.options as AnimatedPlotLineOptions).animation
            );

            // Animate
            animateSVGPath(plotLine.svgElem, animation, () => {
                plotLine.label.css({
                    opacity: 1
                });
            });
        });
    });
})(Highcharts);

export default function LineCustomEntranceAnimationChart() {
    return (
        <Chart
            options={{
                responsive: {
                    rules: [
                        {
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                yAxis: [
                                    {
                                        tickAmount: 2,
                                        title: {
                                            x: 15,
                                            reserveSpace: false
                                        }
                                    },
                                    {
                                        tickAmount: 2,
                                        title: {
                                            x: 20,
                                            reserveSpace: false
                                        }
                                    },
                                    {
                                        tickAmount: 2,
                                        title: {
                                            x: -20,
                                            reserveSpace: false
                                        }
                                    },
                                    {
                                        tickAmount: 2,
                                        title: {
                                            x: -20,
                                            reserveSpace: false
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }}
        >
            <Title>
                United States of America's Inflation-related statistics
            </Title>
            <Subtitle>
                Source:{' '}
                <a href="https://www.worldbank.org/en/home">The World Bank</a>
            </Subtitle>
            <Data csv={csv} />
            <YAxis
                plotLines={[
                    {
                        color: 'var(--highcharts-neutral-color-100, black)',
                        width: 2,
                        value: 13.5492019749684,
                        animation: {
                            duration: 1000,
                            defer: 4000
                        },
                        label: {
                            text: 'Max Inflation',
                            align: 'right',
                            x: -20,
                            style: {
                                opacity: 0,
                                transition: 'opacity 0.5s ease-in-out'
                            }
                        }
                    } as AnimatedPlotLineOptions
                ]}
            >
                Inflation
            </YAxis>
            <YAxis>Claims on central government, etc.</YAxis>
            <YAxis opposite>Net foreign assets</YAxis>
            <YAxis opposite>Net domestic credit</YAxis>
            <PlotOptions
                series={{
                    animation: {
                        duration: 1000
                    },
                    marker: {
                        enabled: false
                    },
                    lineWidth: 2
                }}
            />
            <Exporting />
            <Accessibility />
            <SplineSeries
                options={{
                    yAxis: 0,
                    tooltip: {
                        valueDecimals: 1,
                        valueSuffix: '%'
                    }
                }}
            />
            <SplineSeries
                options={{
                    yAxis: 1,
                    animation: {
                        defer: 1000
                    },
                    tooltip: {
                        valueDecimals: 1,
                        valueSuffix: '%'
                    }
                }}
            />
            <SplineSeries
                options={{
                    yAxis: 2,
                    animation: {
                        defer: 2000
                    }
                }}
            />
            <SplineSeries
                options={{
                    yAxis: 3,
                    animation: {
                        defer: 3000
                    }
                }}
            />
        </Chart>
    );
}
