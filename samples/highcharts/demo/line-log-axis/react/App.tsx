import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                This chart shows the use of a logarithmic y-axis. Logarithmic
                axes can be useful when dealing with data with spikes or large
                value gaps, as they allow variance in the smaller values to
                remain visible.
            </p>
        </figure>
    );
}
