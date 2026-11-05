import { Chart, Title } from '@highcharts/react';
import { PieSeries } from '@highcharts/react/series/Pie';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function StyledModePieChart() {
    return (
        <Chart styledMode>
            <Title>Mobile vendor market share, June 2024</Title>
            <Exporting />
            <Accessibility />
            <PieSeries
                options={{
                    allowPointSelect: true,
                    keys: ['name', 'y', 'selected', 'sliced'],
                    showInLegend: true
                }}
                // Data retrieved from https://gs.statcounter.com/vendor-market-share/mobile/
                data={[
                    ['Apple', 27.16, true, true],
                    ['Samsung', 23.72, false],
                    ['Xiaomi', 11.92, false],
                    ['Unknown', 6.86, false],
                    ['Oppo', 6.12, false],
                    ['Vivo', 5.48, false],
                    ['Realme', 3.89, false],
                    ['Huawei', 3.49, false],
                    ['Motorola', 2.38, false],
                    ['Infinix', 1.59, false],
                    ['Other', 7.39, false]
                ]}
            />
        </Chart>
    );
}
