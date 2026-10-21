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
                // Data retrieved from https://gs.statcounter.com/vendor-market-share/mobile/
                data={[
                    { name: 'Apple', y: 27.16, selected: true, sliced: true },
                    { name: 'Samsung', y: 23.72, selected: false },
                    { name: 'Xiaomi', y: 11.92, selected: false },
                    { name: 'Unknown', y: 6.86, selected: false },
                    { name: 'Oppo', y: 6.12, selected: false },
                    { name: 'Vivo', y: 5.48, selected: false },
                    { name: 'Realme', y: 3.89, selected: false },
                    { name: 'Huawei', y: 3.49, selected: false },
                    { name: 'Motorola', y: 2.38, selected: false },
                    { name: 'Infinix', y: 1.59, selected: false },
                    { name: 'Other', y: 7.39, selected: false }
                ]}
                options={{ allowPointSelect: true, showInLegend: true }}
            />
        </Chart>
    );
}
