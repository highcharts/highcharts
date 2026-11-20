import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing a dependency wheel, where each point consists of
                multiple weighted links to other points. This chart type is
                often used to visualize data flow, and can be a striking way to
                illustrate relationships in data.
            </p>
        </figure>
    );
}
