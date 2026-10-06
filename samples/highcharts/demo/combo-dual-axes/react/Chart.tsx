import {
    Chart,
    Highcharts,
    Title,
    Credits,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PlotOptions
} from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { SplineSeries } from '@highcharts/react/series/Spline';
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
        Precipitation: [
            45.7, 37.0, 28.9, 17.1, 39.2, 18.9, 90.2, 78.5, 74.6, 18.7, 17.1,
            16.0
        ],
        Temperature: [
            -11.4, -9.5, -14.2, 0.2, 7.0, 12.1, 13.5, 13.6, 8.2, -2.8, -12.0,
            -15.5
        ]
    }
});

export default function ComboDualAxesChart() {
    return (
        <Chart
            dataTable={dataTable}
            options={{
                chart: {
                    zooming: {
                        type: 'xy'
                    }
                }
            }}
            containerProps={{ style: { height: '400px' } }}
        >
            <Title align="left">Karasjok weather, 2023</Title>
            <Credits>
                Source:{' '}
                <a
                    href="https://www.yr.no/nb/historikk/graf/5-97251/Norge/Finnmark/Karasjok/Karasjok?q=2023"
                    target="_blank"
                >
                    YR
                </a>
            </Credits>
            <XAxis type="category" crosshair={true} />
            {/* Primary yAxis */}
            <YAxis
                labels={{
                    format: '{value}°C'
                }}
                lineColor="var(--highcharts-color-1)"
                lineWidth={2}
            >
                Temperature
            </YAxis>
            {/* Secondary yAxis */}
            <YAxis
                labels={{
                    format: '{value} mm'
                }}
                lineColor="var(--highcharts-color-0)"
                lineWidth={2}
                opposite={true}
            >
                Precipitation
            </YAxis>
            <Tooltip shared={true} />
            <Legend align="left" verticalAlign="top" />
            <PlotOptions
                series={{
                    dataMapping: {
                        name: 'Month'
                    }
                }}
            />
            <Exporting />
            <Accessibility />
            <ColumnSeries
                name="Precipitation"
                options={{
                    yAxis: 1,
                    dataMapping: {
                        y: 'Precipitation'
                    },
                    tooltip: {
                        valueSuffix: ' mm'
                    }
                }}
            />
            <SplineSeries
                name="Temperature"
                options={{
                    dataMapping: {
                        y: 'Temperature'
                    },
                    tooltip: {
                        valueSuffix: '°C'
                    }
                }}
            />
        </Chart>
    );
}
