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
import { SplineSeries } from '@highcharts/react/series/Spline';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function SplineInvertedChart() {
    return (
        <Chart inverted={true}>
            <Title>Atmosphere Temperature by Altitude</Title>
            <Subtitle>According to the Standard Atmosphere Model</Subtitle>
            <XAxis
                reversed={false}
                labels={{ format: '{value} km' }}
                accessibility={{ rangeDescription: 'Range: 0 to 80 km.' }}
                maxPadding={0.05}
                showLastLabel={true}
            >
                Altitude
            </XAxis>
            <YAxis
                labels={{ format: '{value}°' }}
                accessibility={{ rangeDescription: 'Range: -90°C to 20°C.' }}
                lineWidth={2}
            >
                Temperature
            </YAxis>
            <Legend enabled={false} />
            <Tooltip>
                <div data-hc-option="headerFormat">
                    <b>{'{series.name}'}</b>
                    <br />
                </div>
                <div data-hc-option="pointFormat">
                    {'{point.x} km: {point.y}°C'}
                </div>
            </Tooltip>
            <PlotOptions spline={{ marker: { enabled: false } }} />
            <Exporting />
            <Accessibility />
            <SplineSeries
                name="Temperature"
                data={[
                    [0, 15],
                    [10, -50],
                    [20, -56.5],
                    [30, -46.5],
                    [40, -22.1],
                    [50, -2.5],
                    [60, -27.7],
                    [70, -55.7],
                    [80, -76.5]
                ]}
            />
        </Chart>
    );
}
