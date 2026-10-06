import React from 'react';
import {
    Chart,
    Highcharts,
    Title,
    Subtitle,
    Tooltip,
    XAxis
} from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import { Boost } from '@highcharts/react/modules/Boost';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import { getDataTableOptions } from './utils';

const n = 500000,
    dataTable = new Highcharts.DataTable(getDataTableOptions(n));

const LineBoostChart = React.memo(function LineBoostChart() {
    return (
        <Chart
            dataTable={dataTable}
            options={{
                chart: {
                    zooming: {
                        type: 'x'
                    }
                }
            }}
        >
            <Title align="left">{'Highcharts drawing ' + n + ' points'}</Title>
            <Subtitle align="left">Using the Boost module</Subtitle>
            <Tooltip valueDecimals={2} />
            <XAxis type="datetime" />
            <Boost />
            <Exporting />
            <Accessibility
                screenReaderSection={{
                    beforeChartFormat:
                        '<{headingTagName}>' +
                        '{chartTitle}</{headingTagName}><div>{chartSubtitle}</div>' +
                        '<div>{chartLongdesc}</div><div>{xAxisDescription}</div><div>' +
                        '{yAxisDescription}</div>'
                }}
            />
            <LineSeries
                name="Hourly data points"
                color="#2caffe"
                options={{ lineWidth: 0.5 }}
            />
        </Chart>
    );
});

export default LineBoostChart;
