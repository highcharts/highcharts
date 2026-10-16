import {
    Chart,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Legend,
    Tooltip
} from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function ColumnRotatedLabelsChart() {
    return (
        <Chart containerProps={{ style: { height: '400px' } }}>
            <Title>World's largest cities per 2021</Title>
            <Subtitle>
                Source:{' '}
                <a
                    href="https://worldpopulationreview.com/world-cities"
                    target="_blank"
                >
                    World Population Review
                </a>
            </Subtitle>
            <XAxis
                type="category"
                labels={{
                    autoRotation: [-45, -90],
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }}
            />
            <YAxis min={0}>Population (millions)</YAxis>
            <Legend enabled={false} />
            <Tooltip pointFormat="Population in 2021: <b>{point.y:.1f} millions</b>" />
            <Exporting />
            <Accessibility />
            <ColumnSeries
                name="Population"
                data={[
                    ['Tokyo', 37.33],
                    ['Delhi', 31.18],
                    ['Shanghai', 27.79],
                    ['Sao Paulo', 22.23],
                    ['Mexico City', 21.91],
                    ['Dhaka', 21.74],
                    ['Cairo', 21.32],
                    ['Beijing', 20.89],
                    ['Mumbai', 20.67],
                    ['Osaka', 19.11],
                    ['Karachi', 16.45],
                    ['Chongqing', 16.38],
                    ['Istanbul', 15.41],
                    ['Buenos Aires', 15.25],
                    ['Kolkata', 14.974],
                    ['Kinshasa', 14.97],
                    ['Lagos', 14.86],
                    ['Manila', 14.16],
                    ['Tianjin', 13.79],
                    ['Guangzhou', 13.64]
                ]}
                options={{
                    colors: [
                        '#9b20d9',
                        '#9215ac',
                        '#861ec9',
                        '#7a17e6',
                        '#7010f9',
                        '#691af3',
                        '#6225ed',
                        '#5b30e7',
                        '#533be1',
                        '#4c46db',
                        '#4551d5',
                        '#3e5ccf',
                        '#3667c9',
                        '#2f72c3',
                        '#277dbd',
                        '#1f88b7',
                        '#1693b1',
                        '#0a9eaa',
                        '#03c69b',
                        '#00f194'
                    ],
                    colorByPoint: true,
                    groupPadding: 0,
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        inside: true,
                        verticalAlign: 'top',
                        format: '{point.y:.1f}', // one decimal
                        backgroundColor: 'contrast',
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif',
                            textOutline: 'none'
                        }
                    }
                }}
            />
        </Chart>
    );
}
