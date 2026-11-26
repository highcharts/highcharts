import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                A basic column chart comparing the gold, silver and bronze
                medals won by the top six nations at the Milano Cortina 2026
                Winter Olympics. The chart is making use of the axis crosshair
                feature, to highlight the hovered country.
            </p>
        </figure>
    );
}
