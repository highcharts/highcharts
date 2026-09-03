import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Bar chart showing horizontal columns. This chart type is often
                beneficial for smaller screens, as the user can scroll through
                the data vertically, and axis labels are easy to read.
            </p>
        </figure>
    );
}
