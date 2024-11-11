import React from 'https://esm.sh/react@18.3.1';
import ReactDOM from 'https://esm.sh/react-dom@18.3.1/client';
import { Chart, Series } from 'https://esm.sh/gh/highcharts/highcharts-react@v4-dev/index';
export default function ChartComponent() {
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Chart, {
        title: "hello"
    }, /*#__PURE__*/ React.createElement(Series, {
        type: "line",
        data: [
            1,
            2,
            3
        ]
    })));
}
const root = ReactDOM.createRoot(document.querySelector('#container'));
root.render(/*#__PURE__*/ React.createElement(ChartComponent, null));
