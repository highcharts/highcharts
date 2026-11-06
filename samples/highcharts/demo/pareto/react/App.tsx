import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                A Pareto Chart is a chart type based on the Pareto principle,
                commonly used to maximize business efficiency. Highcharts can
                calculate the Pareto line automatically based on a series, as
                shown in this chart.
            </p>
        </figure>
    );
}
