import { Chart, Title } from '@highcharts/react';
import { TreemapSeries } from '@highcharts/react/series/Treemap';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

import 'highcharts/es-modules/masters/modules/heatmap.src.js';

export default function TreemapColoraxisChart() {
    return (
        <Chart
            options={{
                colorAxis: {
                    minColor: '#FFFFFF',
                    maxColor: 'var(--highcharts-color-0)'
                }
            }}
        >
            <Title>Simple Treemap</Title>
            <Exporting />
            <Accessibility />
            <TreemapSeries
                options={{
                    layoutAlgorithm: 'squarified',
                    clip: false
                }}
                data={[
                    { name: 'A', value: 6, colorValue: 1 },
                    { name: 'B', value: 6, colorValue: 2 },
                    { name: 'C', value: 4, colorValue: 3 },
                    { name: 'D', value: 3, colorValue: 4 },
                    { name: 'E', value: 2, colorValue: 5 },
                    { name: 'F', value: 2, colorValue: 6 },
                    { name: 'G', value: 1, colorValue: 7 }
                ]}
            />
        </Chart>
    );
}
