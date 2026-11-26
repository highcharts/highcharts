import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                This line chart demo shows a custom entrance animation
                presenting the statistics related to the United States of
                America's Inflation.
            </p>
        </figure>
    );
}
