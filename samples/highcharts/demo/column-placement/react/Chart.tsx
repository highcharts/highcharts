import {
    Chart,
    Title,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    PlotOptions
} from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function ColumnPlacementChart() {
    return (
        <Chart containerProps={{ style: { height: '400px' } }}>
            <Title>Efficiency Optimization by Branch</Title>
            <XAxis categories={['Seattle HQ', 'San Francisco', 'Tokyo']} />
            <YAxis min={0}>Employees</YAxis>
            <YAxis opposite={true}>Profit (millions)</YAxis>
            <Legend shadow={false} />
            <Tooltip shared={true} />
            <PlotOptions
                column={{
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                }}
            />
            <Exporting />
            <Accessibility />
            <ColumnSeries
                name="Employees Optimized"
                color="rgba(126,86,134,1)"
                data={[140, 90, 40]}
                options={{
                    pointPadding: 0.3,
                    pointPlacement: -0.2
                }}
            />
            <ColumnSeries
                name="Profit Optimized"
                color="rgba(186,60,61,.9)"
                data={[203.6, 198.8, 208.5]}
                options={{
                    tooltip: {
                        valuePrefix: '$',
                        valueSuffix: ' M'
                    },
                    pointPadding: 0.3,
                    pointPlacement: 0.2,
                    yAxis: 1
                }}
            />
            <ColumnSeries
                name="Employees"
                color="rgba(165,170,217,1)"
                data={[150, 73, 20]}
                options={{
                    pointPadding: 0.4,
                    pointPlacement: -0.2
                }}
            />
            <ColumnSeries
                name="Profit"
                color="rgba(248,161,63,.9)"
                data={[183.6, 178.8, 198.5]}
                options={{
                    tooltip: {
                        valuePrefix: '$',
                        valueSuffix: ' M'
                    },
                    pointPadding: 0.4,
                    pointPlacement: 0.2,
                    yAxis: 1
                }}
            />
        </Chart>
    );
}
