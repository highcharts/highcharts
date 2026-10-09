import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Highcharts has extensive support for time series, and will adapt
                intelligently to the input data. Click and drag in the chart to
                zoom in and inspect the data.
            </p>
        </figure>
    );
}
