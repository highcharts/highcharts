import {
    Chart,
    Highcharts,
    Title,
    Subtitle,
    XAxis,
    YAxis,
    Tooltip,
    PlotOptions,
    Legend
} from '@highcharts/react';
import { ColumnRangeSeries } from '@highcharts/react/series/ColumnRange';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

const dataTable = new Highcharts.DataTable({
    columns: {
        Month: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        TempLow: [
            -11, -10.4, -4.5, -0.5, 0.9, 4.6, 7.9, 6.6, 2.6, -1.7, -7.8, -5.2
        ],
        TempHigh: [
            9.6, 9.9, 16.5, 17.6, 22.3, 24.8, 30.3, 24.6, 24.3, 16.6, 12.1, 10.3
        ]
    }
});

export default function ColumnrangeChart() {
    return (
        <Chart
            dataTable={dataTable}
            inverted
            containerProps={{ style: { height: '400px' } }}
        >
            <Title>Temperature variation by month</Title>
            <Subtitle>
                Observed in Vik i Sogn, Norway, 2025 | Source:{' '}
                <a href="https://www.vikjavev.no/ver/" target="_blank">
                    Vikjavev
                </a>
            </Subtitle>
            <XAxis type="category" />
            <YAxis>Temperature ( °C )</YAxis>
            <Tooltip valueSuffix="°C" />
            <PlotOptions
                columnrange={{
                    borderRadius: '50%',
                    dataLabels: {
                        enabled: true,
                        format: '{y}°C'
                    },
                    dataMapping: {
                        name: 'Month'
                    }
                }}
            />
            <Legend enabled={false} />
            <Exporting />
            <Accessibility
                description={
                    'Image description: A column range chart compares the ' +
                    'monthly temperature variations throughout 2025 in Vik i Sogn, ' +
                    'Norway. The chart is interactive and displays the temperature ' +
                    'range for each month when hovering over the data. The ' +
                    'temperature is measured in degrees Celsius on the X-axis and ' +
                    'the months are plotted on the Y-axis. The lowest temperature is ' +
                    'recorded in January at minus 11 Celsius. The lowest range of ' +
                    'temperatures is found in December ranging from a low of -5.2 ' +
                    'to a high of 10.3 Celsius. The highest temperature is found in ' +
                    'July at 28.4 Celsius, and has the highest range of temperatures ' +
                    'from 7.9 up to 30.3'
                }
            />
            <ColumnRangeSeries
                name="Temperatures"
                options={{
                    dataMapping: {
                        low: 'TempLow',
                        high: 'TempHigh'
                    }
                }}
            />
        </Chart>
    );
}
