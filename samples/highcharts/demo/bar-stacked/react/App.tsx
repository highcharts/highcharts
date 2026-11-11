import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Chart showing stacked horizontal bars. This type of
                visualization is great for comparing data that accumulates up to
                a sum.
            </p>
        </figure>
    );
}
