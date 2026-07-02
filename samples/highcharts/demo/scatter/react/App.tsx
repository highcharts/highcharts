import './App.css';
import Chart from './Chart';

export default function Scatter() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Scatter charts are often used to visualize the relationships
                between data in two dimensions. This chart is visualizing
                european olympic contestants by sport, showing how various
                sports prefer different characteristics.
            </p>
        </figure>
    );
}
