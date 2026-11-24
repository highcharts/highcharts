import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                This chart shows how data labels can be added to the data
                series. This can increase readability and comprehension for
                small datasets.
            </p>
        </figure>
    );
}
