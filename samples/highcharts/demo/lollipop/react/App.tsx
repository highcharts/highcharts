import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Lollipop charts are variants of column charts, with a circle
                marker for the data value and a line extending to the axis.
            </p>
        </figure>
    );
}
