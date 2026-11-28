import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                A vector plot can visualize vectors using four values: The x and
                y coordinates, the length, and the angle. This demo is showing a
                vector field, where vectors are given at regular intervals.
            </p>
        </figure>
    );
}
