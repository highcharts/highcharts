import React from 'react';
import {
    Chart,
    Highcharts,
    XAxis,
    YAxis,
    Title,
    Legend
} from '@highcharts/react';
import { ScatterSeries } from '@highcharts/react/series/Scatter';
import { Boost } from '@highcharts/react/modules/Boost';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import { getDataTableOptions } from './utils';

const dataTable = new Highcharts.DataTable(getDataTableOptions(1000000));

const ScatterBoostChart = React.memo(function ScatterBoostChart() {
    return (
        <Chart
            dataTable={dataTable}
            height="100%"
            options={{
                chart: {
                    zooming: {
                        type: 'xy'
                    }
                }
            }}
        >
            <XAxis min={0} max={100} gridLineWidth={1} tickWidth={0} />
            <YAxis
                lineWidth={1}
                // Renders faster when we don't have to compute min and max
                min={0}
                max={100}
                minPadding={0}
                maxPadding={0}
                title={{ text: null }}
            />
            <Title align="left">Scatter chart with 1 million points</Title>
            <Legend enabled={false} />
            <Boost useGPUTranslations={true} usePreallocated={true} />
            <Exporting />
            <Accessibility
                screenReaderSection={{
                    beforeChartFormat:
                        '<{headingTagName}>' +
                        '{chartTitle}</{headingTagName}><div>{chartLongdesc}</div>' +
                        '<div>{xAxisDescription}</div><div>{yAxisDescription}</div>'
                }}
            />
            <ScatterSeries
                color="rgba(222, 73, 138, 0.1)"
                options={{
                    marker: {
                        radius: 0.5
                    },
                    tooltip: {
                        followPointer: false,
                        pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
                    }
                }}
            />
        </Chart>
    );
});

export default ScatterBoostChart;
