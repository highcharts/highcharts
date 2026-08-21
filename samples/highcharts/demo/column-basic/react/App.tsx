import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                A basic column chart comparing estimated corn and wheat
                production in some countries. The chart is making use of the
                axis crosshair feature, to highlight the hovered country.
            </p>
        </figure>
    );
}
