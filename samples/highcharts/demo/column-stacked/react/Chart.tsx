import {
    Chart,
    Highcharts,
    Title,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    PlotOptions
} from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

// Data retrieved from:
// - https://en.as.com/soccer/which-teams-have-won-the-premier-league-the-most-times-n/
// - https://www.statista.com/statistics/383679/fa-cup-wins-by-team/
// - https://www.uefa.com/uefachampionsleague/history/winners/
const dataTable = new Highcharts.DataTable({
    columns: {
        'Team': ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United'],
        'BPL': [3, 5, 1, 13],
        'FA Cup': [14, 8, 8, 12],
        'CL': [0, 2, 6, 3]
    }
});

export default function ColumnStackedChart() {
    return (
        <Chart
            dataTable={dataTable}
            containerProps={{ style: { height: '400px' } }}
        >
            <Title align="left">Major trophies for some English teams</Title>
            <XAxis type="category" />
            <YAxis min={0} stackLabels={{ enabled: true }}>
                Count trophies
            </YAxis>
            <Legend
                align="left"
                x={70}
                verticalAlign="top"
                y={70}
                floating={true}
                backgroundColor="var(--highcharts-background-color, #ffffff)"
                borderColor="var(--highcharts-neutral-color-20, #cccccc)"
                borderWidth={1}
                shadow={false}
            />
            <Tooltip>
                <div data-hc-option="headerFormat">
                    <b>{'{name}'}</b>
                    <br />
                </div>
                <div data-hc-option="pointFormat">
                    {'{series.name}: {point.y}'}
                    <br />
                    {'Total: {point.stackTotal}'}
                </div>
            </Tooltip>
            <PlotOptions
                column={{
                    dataMapping: {
                        name: 'Team'
                    },
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }}
            />
            <Exporting />
            <Accessibility />
            <ColumnSeries options={{ dataMapping: { y: 'BPL' } }} />
            <ColumnSeries options={{ dataMapping: { y: 'FA Cup' } }} />
            <ColumnSeries options={{ dataMapping: { y: 'CL' } }} />
        </Chart>
    );
}
