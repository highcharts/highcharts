import React from  'react';
import ReactDOM from 'react-dom';
import { Chart, Series, Title } from 'highcharts-react-official';

export default function ChartComponent() {
    return (
        <div>
            <Chart>
                <Title>Line chart</Title>
                <Series type="line" data={[1, 2, 3]} />
            </Chart>
        </div>
    );
}

ReactDOM.createRoot(
    document.querySelector('#container')
)?.render(<ChartComponent />);


