import { Chart, Title, XAxis, YAxis, Tooltip } from '@highcharts/react';
import { ColumnPyramidSeries } from '@highcharts/react/series/ColumnPyramid';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function ColumnPyramidChart() {
    return (
        <Chart
            colors={['#C79D6D', '#B5927B', '#CE9B84', '#B7A58C', '#C7A58C']}
            containerProps={{ style: { height: '400px' } }}
        >
            <Title>The 5 highest pyramids in the World</Title>
            <XAxis
                crosshair
                labels={{ style: { fontSize: '14px' } }}
                type="category"
            />
            <YAxis min={0}>Height (m)</YAxis>
            <Tooltip valueSuffix=" m" />
            <Exporting />
            <Accessibility />
            <ColumnPyramidSeries
                name="Height"
                data={[
                    ['Pyramid of Khufu', 138.8],
                    ['Pyramid of Khafre', 136.4],
                    ['Red Pyramid', 104],
                    ['Bent Pyramid', 101.1],
                    ['Pyramid of the Sun', 75]
                ]}
                options={{ colorByPoint: true, showInLegend: false }}
            />
        </Chart>
    );
}
