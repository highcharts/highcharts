import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Packed bubble charts are visualizations where the size and
                optionally the color of the bubbles are used to visualize the
                data. The positioning of the bubbles is not significant, but is
                optimized for compactness. Try dragging the bubbles in this
                chart around, and see the effects.
            </p>
        </figure>
    );
}
