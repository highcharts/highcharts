import Grid from './Grid';
import './App.css';

export default function App() {
    return (
        <div className="demo">
            <Grid />

            <div className="highcharts-description">
                <p>
                    This demo showcases the use of sparklines in Highcharts Grid.
                    The sparklines are small, simple charts that provide a visual
                    representation of data trends within the grid cells.
                    They are particularly useful for displaying trends in time series data
                    or other sequential datasets without taking up much space.
                </p>
                <p>
                    Read more about
                    <a href="https://www.highcharts.com/docs/grid/sparklines" target="_top">
                        Sparklines in Grid Pro</a>
                    or check out this
                    <a href="https://www.highcharts.com/demo/grid/sparklines" target="_top">
                        more advanced demo</a>.
                </p>
            </div>
        </div>
    );
}
