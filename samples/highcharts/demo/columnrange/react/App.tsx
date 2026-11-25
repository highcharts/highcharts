import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing ranges using horizontal columns. Each range is
                represented with a low and high value, with a bar between them.
            </p>
        </figure>
    );
}
