import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Spline charts are smoothed line charts, and this example shows
                an inverted spline chart. Inverting the chart means the X-axis
                is positioned as the vertical axis, and the Y-axis is positioned
                as the horizontal axis. This can be more intuitive for certain
                data sets, such as in this chart where the X-axis represents
                vertical altitude.
            </p>
        </figure>
    );
}
