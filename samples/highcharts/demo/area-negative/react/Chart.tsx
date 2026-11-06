import {
    Chart,
    Highcharts,
    Title,
    Subtitle,
    Tooltip,
    XAxis,
    YAxis,
    PlotOptions,
    Credits
} from '@highcharts/react';
import { AreaSeries } from '@highcharts/react/series/Area';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

import 'highcharts/es-modules/masters/modules/data.src.js';
import { csv } from './data';

const dataTable = new Highcharts.Data({
    csv
}).getDataTable();

const imports = dataTable.getColumn('Imports') as number[],
    exports = dataTable.getColumn('Exports') as number[];

dataTable.setColumns({
    'Trade Balance': exports.map((x, i) => x + imports[i])
});

export default function AreaNegativeChart() {
    return (
        <Chart
            dataTable={dataTable}
            options={{
                chart: {
                    plotBorderRadius: 4,
                    plotBorderWidth: 1
                }
            }}
            containerProps={{ style: { height: '400px' } }}
        >
            <Title>Import, Export of goods in Norway (NOK million)</Title>
            <Subtitle>
                Source:{' '}
                <a
                    href="https://www.ssb.no/en/statbank/table/08792"
                    target="_blank"
                >
                    SSB
                </a>
            </Subtitle>
            <Tooltip
                shared
                valuePrefix="NOK "
                valueSuffix=" M"
                headerFormat="<table><caption>{point.key}</caption>"
                pointFormat={`<tr>
                  <th><span style="color:{point.color}">●</span> {series.name}</th>
                  <td style="text-align: right;">{point.y}</td>
                </tr>`}
                footerFormat="</table>"
            />
            <XAxis
                type="datetime"
                crosshair
                lineWidth={0}
                tickColor="var(--highcharts-neutral-color-20)"
            />
            <YAxis
                plotLines={[
                    {
                        color: 'var(--highcharts-neutral-color-100, black)',
                        value: 0,
                        width: 2
                    }
                ]}
            >
                MNOK
            </YAxis>
            <PlotOptions
                series={{
                    marker: {
                        enabled: false
                    },
                    dataMapping: {
                        x: 'Month'
                    }
                }}
            />
            <Credits enabled={false} />
            <Exporting
                csv={{
                    dateFormat: '%b %Y'
                }}
            />
            <Accessibility />
            <AreaSeries
                options={{
                    dataMapping: {
                        y: 'Exports'
                    }
                }}
            />
            <AreaSeries
                options={{
                    dataMapping: {
                        y: 'Imports'
                    }
                }}
            />
            <AreaSeries
                options={{
                    dataMapping: {
                        y: 'Trade Balance'
                    }
                }}
            />
        </Chart>
    );
}
