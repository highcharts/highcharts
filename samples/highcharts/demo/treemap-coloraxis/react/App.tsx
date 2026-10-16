import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <figure className="highcharts-figure">
            <Chart />
            <p className="highcharts-description">
                Treemaps are great tools for comparing values that are part of a
                whole, or for showing hierarchical data. This example is a
                simple tree map with no hierarchy, showing the value differences
                with rectangle sizes and using a color axis.
            </p>
        </figure>
    );
}
