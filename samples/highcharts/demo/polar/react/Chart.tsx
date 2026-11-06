import {
    Chart,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    PlotOptions
} from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { LineSeries } from '@highcharts/react/series/Line';
import { AreaSeries } from '@highcharts/react/series/Area';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

import 'highcharts/es-modules/masters/highcharts-more.src.js';

export default function PolarChart() {
    return (
        <Chart
            options={{
                chart: {
                    polar: true
                },
                pane: {
                    startAngle: 0,
                    endAngle: 360
                }
            }}
        >
            <Title>Highcharts Polar Chart</Title>
            <Subtitle>Also known as Radar Chart</Subtitle>
            <XAxis
                tickInterval={45}
                min={0}
                max={360}
                labels={{
                    format: '{value}°'
                }}
            />
            <YAxis min={0} />
            <PlotOptions
                series={{
                    pointStart: 0,
                    pointInterval: 45
                }}
                column={{
                    pointPadding: 0,
                    groupPadding: 0
                }}
            />
            <Exporting />
            <Accessibility />
            <ColumnSeries
                name="Column"
                data={[8, 7, 6, 5, 4, 3, 2, 1]}
                options={{
                    pointPlacement: 'between'
                }}
            />
            <LineSeries name="Line" data={[1, 2, 3, 4, 5, 6, 7, 8]} />
            <AreaSeries name="Area" data={[1, 8, 2, 7, 3, 6, 4, 5]} />
        </Chart>
    );
}
