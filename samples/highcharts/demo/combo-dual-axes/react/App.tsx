import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing a combination of a column and a line chart, using
                multiple y-axes. Using multiple axes allows for data within
                different ranges to be visualized together.
            </p>
        </figure>
    );
}
