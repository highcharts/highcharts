import React from  'https://esm.sh/react@18.3.1';
import ReactDOM from 'https://esm.sh/react-dom@18.3.1/client';
import { Chart, Series } from 'https://esm.sh/gh/highcharts/highcharts-react@v4-dev/index';

export default function ChartComponent() {
    return (
        <div>
            <Chart title="hello">
                <Series type="line" data={[1, 2, 3]} />
            </Chart>
        </div>
    );
}

const root = ReactDOM.createRoot(document.querySelector('#container'));
root.render(<ChartComponent />);


