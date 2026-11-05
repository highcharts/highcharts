import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Heatmap showing employee data per weekday. Heatmaps are commonly
                used to visualize hot spots within data sets, and to show
                patterns or correlations. Due to their compact nature, they are
                often used with large sets of data.
            </p>
        </figure>
    );
}
