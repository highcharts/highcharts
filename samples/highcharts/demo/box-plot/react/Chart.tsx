import {
    Chart,
    Highcharts,
    Title,
    Legend,
    XAxis,
    YAxis
} from '@highcharts/react';
import { BoxPlotSeries } from '@highcharts/react/series/BoxPlot';
import { ScatterSeries } from '@highcharts/react/series/Scatter';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function BoxPlotChart() {
    return (
        <Chart containerProps={{ style: { height: '400px' } }}>
            <Title>Highcharts Box Plot Example</Title>
            <Legend enabled={false} />
            <XAxis categories={['1', '2', '3', '4', '5']}>Experiment No.</XAxis>
            <YAxis
                plotLines={[
                    {
                        value: 932,
                        color: 'red',
                        width: 1,
                        label: {
                            text: 'Theoretical mean: 932',
                            align: 'center',
                            style: {
                                color: 'gray'
                            }
                        }
                    }
                ]}
            >
                Observations
            </YAxis>
            <Exporting />
            <Accessibility />
            <BoxPlotSeries
                name="Observations"
                data={[
                    [760, 801, 848, 895, 965],
                    [733, 853, 939, 980, 1080],
                    [714, 762, 817, 870, 918],
                    [724, 802, 806, 871, 950],
                    [834, 836, 864, 882, 910]
                ]}
                options={{
                    tooltip: {
                        headerFormat: '<em>Experiment No {point.key}</em><br/>'
                    }
                }}
                color={Highcharts.defaultOptions.colors?.[1]}
            />
            <ScatterSeries
                name="Outliers"
                color={Highcharts.defaultOptions.colors?.[1]}
                data={[
                    // x, y positions where 0 is the first category
                    [0, 644],
                    [4, 718],
                    [4, 951],
                    [4, 969]
                ]}
                options={{
                    marker: {
                        fillColor: 'white',
                        lineWidth: 1,
                        lineColor: Highcharts.defaultOptions.colors?.[1]
                    },
                    tooltip: {
                        pointFormat: 'Observation: {point.y}'
                    }
                }}
            />
        </Chart>
    );
}
