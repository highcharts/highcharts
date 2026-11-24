import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                This chart demonstrates an inverted area chart with a floating
                legend. Inverted charts can often be a good choice on smaller
                screens, as most users find it easier to scroll vertically to
                see more data compared to scrolling horizontally.
            </p>
        </figure>
    );
}
