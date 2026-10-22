import {
    Chart,
    Highcharts,
    Title,
    XAxis,
    YAxis,
    Tooltip,
    PlotOptions
} from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { ErrorBarSeries } from '@highcharts/react/series/ErrorBar';
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
        Rainfall: [
            49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ],
        RainfallErrorLow: [
            48, 68, 92, 128, 140, 171, 135, 142, 204, 189, 95, 52
        ],
        RainfallErrorHigh: [
            51, 73, 110, 136, 150, 179, 143, 149, 220, 199, 110, 56
        ],
        Temperature: [
            7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6
        ],
        TemperatureErrorLow: [
            6, 5.9, 9.4, 14.1, 18.0, 21.0, 23.2, 26.1, 23.2, 18.0, 12.9, 7.6
        ],
        TemperatureErrorHigh: [
            8, 7.6, 10.4, 15.9, 20.1, 24.0, 25.3, 27.8, 23.9, 21.1, 14.0, 10.0
        ]
    }
});

export default function ErrorBarChart() {
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
            <Title>Temperature vs Rainfall</Title>
            <XAxis type="category" />
            {/* Primary yAxis */}
            <YAxis
                labels={{
                    format: '{value} °C'
                }}
                lineColor="#CC8800"
                lineWidth={2}
            >
                Temperature
            </YAxis>
            {/* Secondary yAxis */}
            <YAxis
                labels={{
                    format: '{value} mm'
                }}
                lineColor="#6b8abc"
                lineWidth={2}
                opposite
            >
                Rainfall
            </YAxis>
            <Tooltip shared />
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
                name="Rainfall"
                color="#6b8abc"
                options={{
                    yAxis: 1,
                    dataMapping: {
                        y: 'Rainfall'
                    },
                    tooltip: {
                        pointFormat:
                            '<span style="font-weight: bold; color: {series.color}">' +
                            '{series.name}</span>: <b>{point.y:.1f} mm</b> '
                    }
                }}
            />
            <ErrorBarSeries
                name="Rainfall error"
                options={{
                    yAxis: 1,
                    dataMapping: {
                        low: 'RainfallErrorLow',
                        high: 'RainfallErrorHigh'
                    },
                    tooltip: {
                        pointFormat:
                            '(error range: {point.low}-{point.high} mm)<br/>'
                    },
                    pointPlacement: -0.2
                }}
            />
            <SplineSeries
                name="Temperature"
                color="#CC8800"
                options={{
                    lineWidth: 2,
                    dataMapping: {
                        y: 'Temperature'
                    },
                    tooltip: {
                        pointFormat:
                            '<span style="font-weight: bold; color: {series.color}">' +
                            '{series.name}</span>: <b>{point.y:.1f}°C</b> '
                    }
                }}
            />
            <ErrorBarSeries
                name="Temperature error"
                options={{
                    dataMapping: {
                        low: 'TemperatureErrorLow',
                        high: 'TemperatureErrorHigh'
                    },
                    tooltip: {
                        pointFormat:
                            '(error range: {point.low}-{point.high}°C)<br/>'
                    },
                    pointPlacement: 0.1
                }}
            />
        </Chart>
    );
}
