import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                The Highcharts Boost module can be used to plot large amounts of
                data on the client side. This chart is showing a dense scatter
                plot of 1 million data points.
            </p>
        </figure>
    );
}
