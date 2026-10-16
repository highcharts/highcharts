import {
    Chart,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Tooltip,
    PlotOptions
} from '@highcharts/react';
import { SplineSeries } from '@highcharts/react/series/Spline';
import { SeriesLabel } from '@highcharts/react/modules/SeriesLabel';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

// Data retrieved https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature
export default function SplineSymbolsChart() {
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
                accessibility={{ description: 'Months of the year' }}
                crosshair={true}
            />
            <YAxis labels={{ format: '{value}°' }}>Temperature</YAxis>
            <Tooltip shared={true} />
            <PlotOptions
                spline={{
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                }}
            />
            <SeriesLabel />
            <Exporting />
            <Accessibility />
            <SplineSeries
                name="Tokyo"
                options={{ marker: { symbol: 'square' } }}
                data={[
                    5.2,
                    5.7,
                    8.7,
                    13.9,
                    18.2,
                    21.4,
                    25.0,
                    {
                        y: 26.4,
                        marker: {
                            symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
                        },
                        accessibility: {
                            description:
                                'Sunny symbol, this is the warmest point in the chart.'
                        }
                    },
                    22.8,
                    17.5,
                    12.1,
                    7.6
                ]}
            />
            <SplineSeries
                name="Bergen"
                options={{ marker: { symbol: 'diamond' } }}
                data={[
                    {
                        y: 1.5,
                        marker: {
                            symbol: 'url(https://www.highcharts.com/samples/graphics/snow.png)'
                        },
                        accessibility: {
                            description:
                                'Snowy symbol, this is the coldest point in the chart.'
                        }
                    },
                    1.6,
                    3.3,
                    5.9,
                    10.5,
                    13.5,
                    14.5,
                    14.4,
                    11.5,
                    8.7,
                    4.7,
                    2.6
                ]}
            />
        </Chart>
    );
}
