import { Chart, Title, Subtitle, PlotOptions } from '@highcharts/react';
import { PieSeries } from '@highcharts/react/series/Pie';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

import 'highcharts/es-modules/masters/highcharts-3d.src.js';

// Data retrieved from https://olympics.com/en/olympic-games/beijing-2022/medals
export default function PieDonutChart() {
    return (
        <Chart
            options={{
                chart: {
                    options3d: {
                        enabled: true,
                        alpha: 45
                    }
                }
            }}
            containerProps={{ style: { height: '400px' } }}
        >
            <Title>Beijing 2022 gold medals by country</Title>
            <Subtitle>3D donut in Highcharts</Subtitle>
            <PlotOptions
                pie={{
                    innerSize: 100,
                    depth: 45
                }}
            />
            <Exporting />
            <Accessibility />
            <PieSeries
                name="Medals"
                data={[
                    ['Norway', 16],
                    ['Germany', 12],
                    ['USA', 8],
                    ['Sweden', 8],
                    ['Netherlands', 8],
                    ['ROC', 6],
                    ['Austria', 7],
                    ['Canada', 4],
                    ['Japan', 3]
                ]}
            />
        </Chart>
    );
}
