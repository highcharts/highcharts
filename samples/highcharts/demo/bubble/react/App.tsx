import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing basic use of bubble series with a custom tooltip
                formatter. The chart uses plot lines to show safe intake levels
                for sugar and fat. Bubble charts are great for comparing three
                dimensions of data without relying on color or 3D charts.
            </p>
        </figure>
    );
}
