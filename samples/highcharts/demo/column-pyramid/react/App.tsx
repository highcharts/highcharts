import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing use of the pyramid series type to visualize
                heights of pyramids. A pyramid series is similar to a column
                series, but with a different shape.
            </p>
        </figure>
    );
}
