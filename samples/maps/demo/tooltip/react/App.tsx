import './App.css';
import Chart from './Chart';

export default function App() {
    return (
        <>
            {/* Flag sprites service provided by Martijn Lafeber, https://github.com/lafeber/world-flags-sprite/blob/master/LICENSE */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/gh/lafeber/world-flags-sprite/stylesheets/flags32-both.css"
                precedence="default"
            />
            <Chart />
        </>
    );
}
