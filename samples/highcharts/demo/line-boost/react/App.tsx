import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Using the Highcharts Boost module, it is possible to render
                large amounts of data on the client side. This chart shows a
                line series with 500,000 data points. The points represent
                hourly data since 1965. Click and drag in the chart to zoom in.
            </p>
        </figure>
    );
}
