import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing use of multiple y-axes, where each series has a
                separate axis. Multiple axes allows data in different ranges to
                be visualized together. While this in some cases can cause
                charts to be hard to read, it can also be a powerful tool to
                illustrate correlations.
            </p>
        </figure>
    );
}
