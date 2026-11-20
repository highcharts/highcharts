import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                A variation of a 3D pie chart with an inner radius added. These
                charts are often referred to as donut charts.
            </p>
        </figure>
    );
}
