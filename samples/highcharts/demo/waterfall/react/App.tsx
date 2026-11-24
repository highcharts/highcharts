import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Waterfall charts are used to visualize cumulative values, where
                each data point contributes to a total. In this example, points
                showing intermediate sums are used to indicate the progression
                of the total.
            </p>
        </figure>
    );
}
