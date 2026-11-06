import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Variable radius pie charts can be used to visualize a second
                dimension in a pie chart. In this chart, the more densely
                populated countries are drawn further out, while the slice width
                is determined by the size of the country.
            </p>
        </figure>
    );
}
