import {
    Chart,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    PlotOptions
} from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function ColumnBasicChart() {
    return (
        <Chart containerProps={{ id: 'container' }}>
            <Title align="left">
                Milano Cortina 2026 Winter Olympic medals, top six nations
            </Title>
            <Subtitle align="left">
                Source:{' '}
                <a
                    target="_blank"
                    href="https://www.olympics.com/en/olympic-games/milano-cortina-2026/medals"
                >
                    www.olympics.com
                </a>
            </Subtitle>
            <XAxis
                categories={[
                    'Norway',
                    'USA',
                    'Netherlands',
                    'Italy',
                    'Germany',
                    'France'
                ]}
                crosshair
                accessibility={{
                    description: 'Countries'
                }}
            />
            <YAxis min={0}>Medals</YAxis>
            <Legend symbolRadius={3} />
            <Tooltip
                shared
                headerFormat="<table><caption>{point.key}</caption>"
                pointFormat={`
                <tr>
                  <th>
                    <svg width="20" height="10">
                      <rect x="5" y="0" width="10" height="10" rx="3" ry="3"
                          fill="{series.color}" />
                    </svg>
                    {series.name}
                  </th>
                  <td>{point.y}</td>
                </tr>
                `}
                footerFormat="</table>"
            />
            <PlotOptions
                column={{
                    pointPadding: 0.1,
                    borderWidth: 0
                }}
            />
            <Exporting />
            <Accessibility />
            <ColumnSeries name="Gold medals" data={[18, 12, 10, 10, 8, 8]} />
            <ColumnSeries name="Silver medals" data={[12, 12, 7, 6, 10, 9]} />
            <ColumnSeries name="Bronze medals" data={[11, 9, 3, 14, 8, 6]} />
        </Chart>
    );
}
