import {
    Chart,
    Highcharts,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PlotOptions
} from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { SplineSeries } from '@highcharts/react/series/Spline';
import { SeriesLabel } from '@highcharts/react/modules/SeriesLabel';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

const dataTable = new Highcharts.DataTable({
    columns: {
        Month: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        Rainfall: [
            49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ],
        Pressure: [
            1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1,
            1016.9, 1018.2, 1016.7
        ],
        Temperature: [
            7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6
        ]
    }
});

export default function ComboMultiAxesChart() {
    return (
        <Chart
            dataTable={dataTable}
            options={{
                chart: {
                    zooming: {
                        type: 'xy'
                    }
                },
                responsive: {
                    rules: [
                        {
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    floating: false,
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    x: 0,
                                    y: 0
                                },
                                yAxis: [
                                    {
                                        labels: {
                                            align: 'right',
                                            x: 0,
                                            y: -6
                                        },
                                        showLastLabel: false
                                    },
                                    {
                                        labels: {
                                            align: 'left',
                                            x: 0,
                                            y: -6
                                        },
                                        showLastLabel: false
                                    },
                                    {
                                        visible: false
                                    }
                                ]
                            }
                        }
                    ]
                }
            }}
            containerProps={{ style: { height: '400px' } }}
        >
            <Title>Average Monthly Weather Data for Tokyo</Title>
            <Subtitle>Source: WorldClimate.com</Subtitle>
            <XAxis type="category" crosshair={true} />
            {/* Primary yAxis */}
            <YAxis
                labels={{
                    format: '{value}°C',
                    style: {
                        color: 'var(--highcharts-color-2)'
                    }
                }}
                title={{
                    style: {
                        color: 'var(--highcharts-color-2)'
                    }
                }}
                opposite={true}
            >
                Temperature
            </YAxis>
            {/* Secondary yAxis */}
            <YAxis
                gridLineWidth={0}
                title={{
                    style: {
                        color: 'var(--highcharts-color-0)'
                    }
                }}
                labels={{
                    format: '{value} mm',
                    style: {
                        color: 'var(--highcharts-color-0)'
                    }
                }}
            >
                Rainfall
            </YAxis>
            {/* Tertiary yAxis */}
            <YAxis
                gridLineWidth={0}
                title={{
                    style: {
                        color: 'var(--highcharts-color-1)'
                    }
                }}
                labels={{
                    format: '{value} mb',
                    style: {
                        color: 'var(--highcharts-color-1)'
                    }
                }}
                opposite={true}
            >
                Sea-Level Pressure
            </YAxis>
            <Tooltip shared={true} />
            <Legend
                layout="vertical"
                align="left"
                x={80}
                verticalAlign="top"
                y={55}
                floating={true}
                backgroundColor={`color-mix(
                    var(--highcharts-neutral-color-40) 25%,
                    transparent
                )`}
            />
            <PlotOptions
                series={{
                    dataMapping: {
                        name: 'Month'
                    }
                }}
            />
            <SeriesLabel />
            <Exporting />
            <Accessibility />
            <ColumnSeries
                options={{
                    yAxis: 1,
                    dataMapping: {
                        y: 'Rainfall'
                    },
                    tooltip: {
                        valueSuffix: ' mm'
                    }
                }}
            />
            <SplineSeries
                name="Sea-Level Pressure"
                options={{
                    yAxis: 2,
                    dataMapping: {
                        y: 'Pressure'
                    },
                    marker: {
                        enabled: false
                    },
                    dashStyle: 'ShortDot',
                    tooltip: {
                        valueSuffix: ' mb'
                    }
                }}
            />
            <SplineSeries
                options={{
                    dataMapping: {
                        y: 'Temperature'
                    },
                    tooltip: {
                        valueSuffix: ' °C'
                    }
                }}
            />
        </Chart>
    );
}
