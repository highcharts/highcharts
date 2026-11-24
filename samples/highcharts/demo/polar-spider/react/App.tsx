import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                A spiderweb chart or radar chart is a variant of the polar
                chart. Spiderweb charts are commonly used to compare
                multivariate data sets, like this demo using six variables of
                comparison.
            </p>
        </figure>
    );
}
