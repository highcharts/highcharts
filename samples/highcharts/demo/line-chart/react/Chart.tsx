import {
    Chart,
    Title,
    Subtitle,
    YAxis,
    XAxis,
    Legend,
    Tooltip,
    PlotOptions
} from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

import 'highcharts/es-modules/masters/modules/series-label.src.js';

export default function LineChart() {
    return (
        <Chart
            options={{
                chart: {
                    plotBorderColor:
                        'var(--highcharts-neutral-color-10, #e6e6e6)',
                    plotBorderWidth: 1,
                    plotBorderRadius: 5
                }
            }}
        >
            <Title align="left">Application users last 24 hours</Title>
            <Subtitle>All traffic sources combined</Subtitle>
            <YAxis>Unique users</YAxis>
            <XAxis
                type="datetime"
                crosshair={true}
                dateTimeLabelFormats={{
                    // Don't show the date
                    day: {
                        boundary: '%H:%M',
                        main: '%H:%M'
                    }
                }}
                lineWidth={0}
                tickLength={6}
                tickColor="var(--highcharts-neutral-color-10, #e6e6e6)"
            />
            <Legend enabled={false} />
            <Tooltip
                shared={true}
                headerFormat={`<table>
                <caption>{point.x:%[HM]} → {(add point.x 3540000):%[HM]}</caption>`}
                pointFormat={`
                <tr>
                  <th>
                    <svg width="20" height="10">
                      <path d="M 5 5 L 13 5" stroke="{series.color}" stroke-width="5"
                        stroke-linecap="round" />
                    </svg>
                    {series.name}
                  </th>
                  <td>{point.y}</td>
                </tr>
                `}
                footerFormat="</table>"
            />
            {/* Common options for all series */}
            <PlotOptions
                series={{
                    // There are many ways to handle time data in Highcharts.
                    // This way we omit the timestamp from each data point, and
                    // rely on each data point being one hour apart.
                    pointInterval: 36e5, // one hour
                    marker: {
                        enabled: false
                    }
                }}
            />
            <LineSeries
                name="Users"
                color="light-dark(#0097FF, #27A6FE)"
                data={[
                    990, 652, 965, 1048, 939, 1012, 2089, 3995, 4123, 4302,
                    5289, 6115, 7723, 8162, 10089, 7812, 4127, 3812, 4156, 3805,
                    2958, 1984, 1432, 1299
                ]}
            />
            <LineSeries
                name="Average"
                color="#8791BA"
                options={{ dashStyle: 'ShortDot' }}
                data={[
                    865, 832, 775, 728, 779, 812, 989, 1095, 1623, 2102, 2289,
                    2315, 2412, 2662, 3089, 2812, 2427, 2112, 2356, 2305, 1858,
                    1084, 932, 899
                ]}
            />
            <Exporting />
            <Accessibility />
        </Chart>
    );
}
