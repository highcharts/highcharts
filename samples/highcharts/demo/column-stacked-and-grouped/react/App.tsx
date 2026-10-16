import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing stacked columns with grouping, allowing specific
                series to be stacked on the same column. Stacking is often used
                to visualize data that accumulates to a sum.
            </p>
        </figure>
    );
}
