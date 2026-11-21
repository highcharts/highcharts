import { Chart, PlotOptions, YAxis, type HighchartsReactRefObject } from '@highcharts/react';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import { LineSeries } from '@highcharts/react/series/Line';
import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    const [data, setData] = useState([1, 2]);
    const chart = useRef<HighchartsReactRefObject>(null);
    Object.assign(window, {
        chartValues: () => chart.current?.chart?.series[0].points.map(point => point.y)
    });

    return <>
        <button onClick={() => setData([3, 5])}>Update data</button>
        <Chart ref={chart} animation={false}>
            <Accessibility enabled={false} />
            <PlotOptions series={{ animation: false }} />
            <YAxis min={0} max={6} />
            <LineSeries data={data} />
        </Chart>
    </>;
}

createRoot(document.getElementById('root')!).render(<App />);
