import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                A polar chart showing different series types on a radial axis.
                Polar charts, also known as a radar charts, are often used to
                compare multivariate data sets. A polar chart in Highcharts is
                simply a cartesian chart where the X axis is wrapped around the
                perimeter. It can render common cartesian series types like
                line, column, area or arearange.
            </p>
        </figure>
    );
}
