import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                In Highcharts, pie charts can also feature an empty center, they
                are often referred to as donut charts.
            </p>
        </figure>
    );
}
