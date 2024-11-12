import React from 'react';
import ReactDOM from 'react-dom';
import { Chart, Series } from 'highcharts-react-official';
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
