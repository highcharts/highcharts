import { Chart, Title, YAxis } from '@highcharts/react';
import { GaugeSeries } from '@highcharts/react/series/Gauge';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type { PaneBackgroundOptions } from 'highcharts';

import 'highcharts/es-modules/masters/themes/adaptive.src.js';

export default function GaugeChart() {
    return (
        <Chart
            options={{
                // Defines the gauge area
                pane: {
                    startAngle: -90,
                    endAngle: 90,
                    background: null as unknown as PaneBackgroundOptions
                }
            }}
        >
            <Title>Revenue this month</Title>
            <Exporting />
            <Accessibility />
            {/* The value axis */}
            <YAxis
                min={0}
                max={200000}
                plotBands={[
                    {
                        from: 0,
                        to: 110000,
                        color: 'rgba(128, 128, 128, 0.1)' // gray
                    },
                    {
                        from: 111000,
                        to: 149000,
                        color: '#FFBF00' // yellow
                    },
                    {
                        from: 150000,
                        to: 200000,
                        color: '#00A96B' // green
                    }
                ]}
            />
            <GaugeSeries
                name="Revenue"
                data={[80000]}
                options={{
                    tooltip: {
                        valuePrefix: '$'
                    },
                    dataLabels: {
                        format: '${y:,.0f}'
                    }
                }}
            />
        </Chart>
    );
}
