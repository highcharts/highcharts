import {
    Chart,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    PlotOptions
} from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

// Data retrieved https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature
export default function LineLabelsChart() {
    return (
        <Chart>
            <Title>Monthly Average Temperature</Title>
            <Subtitle>
                Source:{' '}
                <a
                    href="https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature"
                    target="_blank"
                >
                    Wikipedia.com
                </a>
            </Subtitle>
            <XAxis
                categories={[
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
                ]}
            />
            <YAxis>Temperature (°C)</YAxis>
            <PlotOptions
                line={{
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }}
            />
            <Exporting />
            <Accessibility />
            <LineSeries
                name="Reggane"
                data={[
                    16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2,
                    22.0, 17.8
                ]}
            />
            <LineSeries
                name="Tallinn"
                data={[
                    -2.9, -3.6, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12.0, 6.5,
                    2.0, -0.9
                ]}
            />
        </Chart>
    );
}
