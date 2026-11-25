import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Timeline charts are used to place events on a time axis, such as
                this example showing some space exploration events from 2000 to
                2024.
            </p>
        </figure>
    );
}
