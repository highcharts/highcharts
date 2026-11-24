import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing the use of box plots with outliers. The chart
                makes use of a plot line to show the theoretical mean value
                across the y-axis.
            </p>
        </figure>
    );
}
