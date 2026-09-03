import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Basic line chart showing trends in a dataset. This chart
                includes the
                <code>series-label</code> module, which adds a label to each
                line for enhanced readability.
            </p>
        </figure>
    );
}
