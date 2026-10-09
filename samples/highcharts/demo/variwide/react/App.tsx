import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Variwide charts can be used to visualize a second dimension in a
                column chart. Each data point is given a weight, in addition to
                its value, determining the width of the column. In this chart,
                the Y-Axis represents the labor cost of the country, while the
                column width is proportional to the country's GDP.
            </p>
        </figure>
    );
}
