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
        <Chart containerProps={{ style: { height: '400px' } }}>
            <Title align="left">
                Corn vs wheat estimated production for 2023
            </Title>
            {/* @ts-expect-error */}
            <Subtitle align="left">
                Source:{' '}
                <a
                    target="_blank"
                    href="https://www.indexmundi.com/agriculture/?commodity=corn"
                >
                    indexmundi
                </a>
            </Subtitle>
            <XAxis
                categories={[
                    'USA',
                    'China',
                    'Brazil',
                    'EU',
                    'Argentina',
                    'India'
                ]}
                crosshair={true}
                accessibility={{ description: 'Countries' }}
            />
            <YAxis min={0}>1000 metric tons (MT)</YAxis>
            <Legend symbolRadius={3} />
            <Tooltip
                shared={true}
                valueSuffix=" GT"
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
            <PlotOptions column={{ pointPadding: 0.1, borderWidth: 0 }} />
            <ColumnSeries
                name="Corn"
                data={[387749, 280000, 129000, 64300, 54000, 34300]}
            />
            <ColumnSeries
                name="Wheat"
                data={[45321, 140000, 10000, 140500, 19500, 113500]}
            />
            <Exporting />
            <Accessibility />
        </Chart>
    );
}
