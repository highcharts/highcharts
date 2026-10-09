import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing stacked columns for comparing quantities. Stacked
                charts are often used to visualize data that accumulates to a
                sum. This chart is showing data labels for each individual
                section of the stack.
            </p>
        </figure>
    );
}
