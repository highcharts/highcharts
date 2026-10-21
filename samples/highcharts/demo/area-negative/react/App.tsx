import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                A simple demo showcasing an area chart with negative values and
                multiple data series. Note that interacting with one data series
                will dim the others, making it easier to distinguish between
                them.
            </p>
        </figure>
    );
}
