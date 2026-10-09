import type Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import {
    Chart,
    Title,
    Subtitle,
    Tooltip,
    Legend,
    PlotOptions
} from '@highcharts/react';
import { PieSeries } from '@highcharts/react/series/Pie';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type { DonutChartOptions } from './types';

export default function DonutChart() {
    return (
        <Chart
            options={{
                chart: {
                    custom: {},
                    events: {
                        render() {
                            const chart = this,
                                series = chart.series[0],
                                chartOptions = chart.options
                                    .chart as DonutChartOptions;
                            let customLabel = chartOptions.custom.label;

                            if (!customLabel) {
                                customLabel = chartOptions.custom.label =
                                    chart.renderer
                                        .label(
                                            'Total<br/>' +
                                                '<strong>2 877 820</strong>',
                                            0
                                        )
                                        .css({
                                            color: 'var(--highcharts-neutral-color-100, #000)',
                                            textAnchor: 'middle'
                                        })
                                        .add();
                            }

                            const x = series.center[0] + chart.plotLeft,
                                y =
                                    series.center[1] +
                                    chart.plotTop -
                                    Number(customLabel.attr('height')) / 2;

                            customLabel.attr({
                                x,
                                y
                            });
                            // Set font size based on chart diameter
                            customLabel.css({
                                fontSize: `${series.center[2] / 12}px`
                            });
                        }
                    }
                } as DonutChartOptions
            }}
        >
            <Title>2023 Norway car registrations</Title>
            <Subtitle>
                Source:{' '}
                <a href="https://www.ssb.no/transport-og-reiseliv/faktaside/bil-og-transport">
                    SSB
                </a>
            </Subtitle>
            <Tooltip pointFormat="{series.name}: <b>{point.percentage:.0f}%</b>" />
            <Legend enabled={false} />
            <PlotOptions
                series={
                    {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        borderRadius: 8,
                        dataLabels: [
                            {
                                enabled: true,
                                distance: 20,
                                format: '{point.name}'
                            },
                            {
                                enabled: true,
                                backgroundColor: 'contrast',
                                distance: -18,
                                format: '{point.percentage:.0f}%',
                                style: {
                                    fontSize: '0.9em'
                                }
                            }
                        ],
                        showInLegend: true
                    } as unknown as Highcharts.PlotSeriesOptions
                }
            />
            <Exporting />
            <Accessibility point={{ valueSuffix: '%' }} />
            <PieSeries
                name="Registrations"
                data={[
                    {
                        name: 'EV',
                        y: 23.9
                    },
                    {
                        name: 'Hybrids',
                        y: 12.6
                    },
                    {
                        name: 'Diesel',
                        y: 37.0
                    },
                    {
                        name: 'Petrol',
                        y: 26.4
                    }
                ]}
                options={{
                    innerSize: '75%'
                }}
            />
        </Chart>
    );
}
