import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                This chart shows how symbols and shapes can be used in charts.
                Highcharts includes several common symbol shapes, such as
                squares, circles and triangles, but it is also possible to add
                your own custom symbols. In this chart, custom weather symbols
                are used on data points to highlight that certain temperatures
                are warm while others are cold.
            </p>
        </figure>
    );
}
