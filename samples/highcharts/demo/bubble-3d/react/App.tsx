import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Bubble chart demonstrating a decorative 3D rendering effect
                using gradient fills on the bubbles.
            </p>
        </figure>
    );
}
