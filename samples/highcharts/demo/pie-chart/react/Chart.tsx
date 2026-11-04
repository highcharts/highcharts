import { Chart, Title, Tooltip, Palette } from '@highcharts/react';
import { PieSeries } from '@highcharts/react/series/Pie';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function PieChart() {
    return (
        <Chart>
            <Title>Support requests</Title>
            <Palette
                light={{
                    colors: [
                        '#014CE5',
                        '#A5AFB6',
                        '#D6DBDE',
                        '#E8EEF1',
                        '#F5FCFF'
                    ]
                }}
                dark={{
                    colors: [
                        '#216AFF',
                        '#AABAC4',
                        '#929FA7',
                        '#818C93',
                        '#697278'
                    ]
                }}
            />
            <Tooltip valueSuffix="%" />
            <PieSeries
                name="Requests"
                data={[
                    ['Webform', 55],
                    ['Call', 17],
                    ['Email', 7],
                    ['Webchat', 5],
                    ['Other', 3]
                ]}
                options={{
                    // We can show multiple data labels per point
                    dataLabels: [
                        {
                            format: '{point.name}',
                            connectorColor:
                                'var(--highcharts-neutral-color-80, #333)'
                        },
                        {
                            format: '{point.percentage:.0f}%',
                            backgroundColor: 'contrast',
                            distance: -30, // Placing the label inside
                            style: {
                                fontSize: '0.9em',
                                textOutline: 'none'
                            }
                        }
                    ]
                }}
            />
            <Exporting />
            <Accessibility />
        </Chart>
    );
}
