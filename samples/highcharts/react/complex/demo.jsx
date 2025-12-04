import React from 'react';
import ReactDOM from 'react-dom/client';
import { Chart, Series, Title, getHighcharts } from '@highcharts/react/index';
import {
    Tooltip,
    PlotOptions,
    Legend,
    Subtitle,
    Credits,
    YAxis,
    XAxis
} from '@highcharts/react/options';

import {
    Data
} from '@highcharts/react/options/Data';
import {
    Exporting
} from '@highcharts/react/options/Exporting';
import {
    Accessibility
} from '@highcharts/react/options/Accessibility';

export default function ChartComponent() {
    return (
        <div>
            <Chart>
                <Title>Fruit collection</Title>
                <Subtitle>Comparing apples, pears, and oranges</Subtitle>

                <Credits href="https://www.highcharts.com">Credit text</Credits>

                <Legend>
                    {'{name}\'s fruits'}
                </Legend>

                <PlotOptions series={{
                    animation: false
                }} />


                <Tooltip useHTML>
                    <div data-hc-option='headerFormat'>
                        <strong style={{ color: 'dimgray' }}>{'Series {series.name}'}</strong>
                    </div>
                    <div data-hc-option='pointFormat'>
                        {'X: {point.x}, Y: {point.y}'}
                    </div>
                    <div data-hc-option='footerFormat'>
                        <em>Footer text</em>
                    </div>
                </Tooltip>

                <XAxis gridLineWidth={2} >Fruit</XAxis>
                <YAxis gridLineWidth={2} gridLineDashStyle={'Dash'}>Number of fruits</YAxis>

                <Data columns={
                    [
                        [null, 'Apples', 'Pears', 'Oranges'],
                        ['Ola', 1, 4, 3],
                        ['Kari', 5, 4, 2]
                    ]
                } />

                <Series type={'column'} /> {/* configures the first series of the data above */}
                <Series type={'column'} /> {/* configures the second series of the data above */}

                <Series type={'column'} options={{ name: 'Espen' }} data={[['Apples', 4]]} />

                {/* Enable the exporting and accessibility modules by including their components */}
                <Exporting />
                <Accessibility />
            </Chart>
        </div>
    );
}

ReactDOM.createRoot(
    document.querySelector('#container')
)?.render(<ChartComponent />);


