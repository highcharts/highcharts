import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing overlapping placement of columns, using different
                data series. The chart is also using multiple y-axes, allowing
                data in different ranges to be visualized on the same chart.
            </p>
        </figure>
    );
}
