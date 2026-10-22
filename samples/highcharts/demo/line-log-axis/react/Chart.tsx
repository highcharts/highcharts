import { Chart, Title, XAxis, YAxis, Tooltip } from '@highcharts/react';
import { LineSeries } from '@highcharts/react/series/Line';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';

export default function LineLogAxisChart() {
    return (
        <Chart>
            <Title>
                Growth of Internet Users Worldwide (logarithmic scale)
            </Title>
            <XAxis
                categories={[
                    '1995',
                    '2000',
                    '2005',
                    '2010',
                    '2015',
                    '2020',
                    '2023'
                ]}
            >
                Year
            </XAxis>
            <YAxis type="logarithmic">
                Number of Internet Users (in millions)
            </YAxis>
            <Tooltip>
                <div data-hc-option="headerFormat">
                    <b>{'{series.name}'}</b>
                    <br />
                </div>
                <div data-hc-option="pointFormat">{'{point.y} million(s)'}</div>
            </Tooltip>
            <LineSeries
                name="Internet Users"
                data={[16, 361, 1018, 2025, 3192, 4673, 5200]}
                color="var(--highcharts-color-1, #2caffe)"
            />
            <Exporting />
            <Accessibility
                point={{
                    valueDescriptionFormat:
                        '{xDescription}{separator}{value} million(s)'
                }}
            />
        </Chart>
    );
}
