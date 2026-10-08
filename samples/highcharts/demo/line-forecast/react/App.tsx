import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Data points plotted on the chart connect to form a line,
                illustrating the fluctuations in temperature throughout the day.
                This graphical representation allows for an easy and quick
                understanding of how temperatures are expected to vary hourly,
                highlighting peaks and troughs in the day's forecast.
            </p>
        </figure>
    );
}
