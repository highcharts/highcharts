import Dashboard from './Dashboard';
import './App.css';

export default function App() {
    return (
        <div id="dashboard-container">
            <h1 id="title">Support load overview</h1>
            <Dashboard />
            <p className="highcharts-description">
                Basic dashboard with a shared dataset for all components with hover
                state syncronization enabled (highlight sync). Using Highcharts Core for
                charts and Highcharts Grid Pro for the data grid.
            </p>
        </div>
    );
}
