import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing stacked percentage columns, where each column
                totals 100%, and each element value is visualized by giving it a
                size relative to the other elements.
            </p>
        </figure>
    );
}
