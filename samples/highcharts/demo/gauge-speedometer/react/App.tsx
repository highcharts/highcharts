import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing use of plot bands with a gauge series. The chart
                is updated dynamically every few seconds.
            </p>
        </figure>
    );
}
