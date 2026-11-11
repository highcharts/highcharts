import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing use of rotated axis labels and data labels. This
                can be a way to include more labels in the chart, but note that
                more labels can sometimes make charts harder to read.
            </p>
        </figure>
    );
}
