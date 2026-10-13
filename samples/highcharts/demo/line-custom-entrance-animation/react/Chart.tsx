import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import { Chart, Title, Subtitle, YAxis, PlotOptions } from '@highcharts/react';
import { SplineSeries } from '@highcharts/react/series/Spline';
import { Data } from '@highcharts/react/modules/Data';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type {
    AnimatedPlotLineOptions,
    AxisInstance,
    HighchartsWithLineSeries
} from './types';
import { csv } from './data';

(function (H: HighchartsWithLineSeries) {
    const animateSVGPath = (
        svgElem: Highcharts.SVGElement,
        animation: Partial<Highcharts.AnimationOptionsObject>,
        callback: (() => void) | undefined = void 0
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

    H.seriesTypes.line.prototype.animate = function (init) {
        const series = this,
            animation = H.animObject(series.options.animation);
        if (!init) {
            animateSVGPath(series.graph, animation);
        }
    };

    H.addEvent(H.Axis, 'afterRender', function (this: Highcharts.Axis) {
        const axis = this as AxisInstance,
            chart = axis.chart,
            animation = H.animObject(chart.renderer.globalAnimation);

        axis.axisGroup
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
        if (axis.horiz) {
            axis.labelGroup
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
            axis.labelGroup
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

        axis.plotLines.forEach((plotLine) => {
            const animation = H.animObject(plotLine.options.animation);

            // Animate
            animateSVGPath(plotLine.svgElem, animation, () => {
                plotLine.label.css({
                    opacity: 1
                });
            });
        });
    });
})(Highcharts as HighchartsWithLineSeries);

const plotLine: AnimatedPlotLineOptions = {
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
};

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
            <YAxis plotLines={[plotLine]}>Inflation</YAxis>
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
            <Data csv={csv} />
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
