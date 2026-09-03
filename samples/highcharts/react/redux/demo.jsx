import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Chart, Series, Title, XAxis, YAxis, Tooltip } from '@highcharts/react';
import { Accessibility } from '@highcharts/react/options/Accessibility';

// External Redux libraries via esm.sh
import { Provider, useSelector, useDispatch } from 'https://esm.sh/react-redux@9.1.0?external=react';
import { configureStore, createSlice } from 'https://esm.sh/@reduxjs/toolkit@2.2.1?external=react';

// --- 1. Redux Logic ---
const chartSlice = createSlice({
    name: 'chart',
    initialState: {
        points: [15, 12, 18, 22, 30, 25, 19, 24, 28, 32]
    },
    reducers: {
        randomize: (state) => {
            state.points = state.points.map(() => Math.floor(Math.random() * 40));
        },
        tick: (state) => {
            const lastPoint = state.points[state.points.length - 1];
            const nextPoint = Math.max(0, Math.min(50, lastPoint + (Math.random() - 0.5) * 10));
            // Immutable update for reactivity
            state.points = [...state.points.slice(1), Number(nextPoint.toFixed(2))];
        }
    }
});

const { randomize, tick } = chartSlice.actions;
const store = configureStore({
    reducer: { chart: chartSlice.reducer }
});

// --- 2. Component Logic ---
function ChartComponent() {
    const points = useSelector((state) => state.chart.points);
    const dispatch = useDispatch();
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        let interval;
        if (isLive) {
            interval = setInterval(() => {
                dispatch(tick());
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isLive, dispatch]);

    return (
        <div id="demo-container">
            <Chart>
                <Title>Advanced Reactive Redux Dashboard</Title>
                <Accessibility />
                <Tooltip shared={true} />
                <XAxis categories={['T-9', 'T-8', 'T-7', 'T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Now']} />
                <YAxis title={{ text: 'Metric Value' }} min={0} max={60} />

                <Series
                    type="areaspline"
                    name="Live Stream"
                    data={points}
                    color="#2c3e50"
                    fillColor={{
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, 'rgba(44, 62, 80, 0.5)'],
                            [1, 'rgba(44, 62, 80, 0)']
                        ]
                    }}
                />
            </Chart>

            <div className="button-wrapper">
                <button
                    className="btn btn-manual"
                    onClick={() => dispatch(randomize())}
                    disabled={isLive}
                >
                    Manual Randomize
                </button>

                <button
                    className={`btn ${isLive ? 'btn-stop' : 'btn-start'}`}
                    onClick={() => setIsLive(!isLive)}
                >
                    {isLive ? 'Stop Live Feed' : 'Start Live Feed'}
                </button>
            </div>

            <div className="demo-info-box">
                <strong>Redux + Highcharts React v4.2:</strong>
                <ul>
                    <li>The global store manages the <code>points</code> array.</li>
                    <li>React hooks (<code>useSelector</code>) provide a reactive subscription.</li>
                    <li>The chart updates via props, ensuring high-performance re-rendering.</li>
                </ul>
            </div>
        </div>
    );
}

// --- 3. Rendering ---
ReactDOM.createRoot(
    document.querySelector('#container')
)?.render(
    <Provider store={store}>
        <ChartComponent />
    </Provider>
);