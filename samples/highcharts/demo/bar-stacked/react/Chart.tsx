import {
    Chart,
    Highcharts,
    Title,
    XAxis,
    YAxis,
    Legend,
    PlotOptions
} from '@highcharts/react';
import { BarSeries } from '@highcharts/react/series/Bar';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

// Data retrieved from: https://ferjedatabanken.no/statistikk
const dataTable = new Highcharts.DataTable({
    columns: {
        'Month': ['January', 'February', 'March', 'April', 'May'],
        'Motorcycles': [74, 27, 52, 93, 1272],
        'Null-emission vehicles': [2106, 2398, 3046, 3195, 4916],
        'Conventional vehicles': [12213, 12721, 15242, 16518, 25037]
    }
});

export default function BarStackedChart() {
    return (
        <Chart
            dataTable={dataTable}
            containerProps={{ style: { height: '400px' } }}
        >
            <Title align="left">Ferry passengers by vehicle type 2024</Title>
            <XAxis type="category" />
            <YAxis min={0} title={{ text: '' }} />
            <Legend reversed={true} />
            <PlotOptions
                series={{
                    dataMapping: {
                        name: 'Month'
                    },
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        backgroundColor: 'contrast',
                        style: {
                            textOutline: 'none'
                        }
                    }
                }}
            />
            <Exporting />
            <Accessibility />
            <BarSeries options={{ dataMapping: { y: 'Motorcycles' } }} />
            <BarSeries
                options={{ dataMapping: { y: 'Null-emission vehicles' } }}
            />
            <BarSeries
                options={{ dataMapping: { y: 'Conventional vehicles' } }}
            />
        </Chart>
    );
}
