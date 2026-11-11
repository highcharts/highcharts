import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Charts can be styled using CSS, such as this example overriding
                the default styles for a pie chart. This can be done without the
                use of Javascript, allowing designers and developers to better
                collaborate on chart design.
            </p>
        </figure>
    );
}
