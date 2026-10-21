import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing the use of error bar series to visualize
                uncertainty or error in datasets. In this demo, both the line
                series and the column series have error bars attached to them,
                showing the uncertainty range.
            </p>
        </figure>
    );
}
