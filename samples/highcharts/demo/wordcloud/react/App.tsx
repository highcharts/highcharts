import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Word clouds are used to visualize how often each word in a text
                occurs. This example uses an excerpt from the book Alice's
                Adventures in Wonderland. Words that appear often will appear
                larger.
            </p>
        </figure>
    );
}
