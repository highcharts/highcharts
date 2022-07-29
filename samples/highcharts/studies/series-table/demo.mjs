/* eslint-disable no-use-before-define */

import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import DataSeriesComposition from '../../../../code/es-modules/Data/DataSeriesComposition.js';
import DataTable from '../../../../code/es-modules/Data/DataTable.js';

DataSeriesComposition.compose(Highcharts.seriesTypes.line);
DataSeriesComposition.compose(Highcharts.seriesTypes.column);
DataSeriesComposition.compose(Highcharts.seriesTypes.pie);
DataSeriesComposition.compose(Highcharts.seriesTypes.scatter);

const benchmarks = document.getElementById('benchmarks');
const benchmarkSeries = 'scatter';
const benchmarkSize = 19e3;
const chart = Highcharts.chart('chart', {
    debug: true,
    chart: {
        width: 600
    },
    title: {
        text: 'Series.table study'
    },
    subtitle: {
        text: 'DataTable management'
    },
    plotOptions: {
        series: {
            enableMouseTracking: false
        }
    }
});

const data = [];

for (let i = 0; i < benchmarkSize; ++i) {
    data[i] = Math.random() * benchmarkSize;
}

const table = new DataTable({ y: [] });

for (let i = 0; i < benchmarkSize; ++i) {
    table.setRow([Math.random() * benchmarkSize], i);
}

function addResults(setData, setTable) {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');

    td1.innerText = '' + setData;

    td2.innerText = '' + setTable;
    td2.style.backgroundColor = setData > setTable ? '#CFC' : '#FCC';

    tr.appendChild(td1);
    tr.appendChild(td2);
    benchmarks.appendChild(tr);
}

function addSeries(e) {
    if (chart.series[0]) {
        chart.series[0].remove();
    }

    const series = chart.addSeries({
            type: e.target.innerText.toLowerCase()
        }),
        table = new DataTable({
            y: [
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
                43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
            ]
        });

    series.datas.setTable(table, true, true);

    window.setTimeout(() => {
        table.setRow([101]);
        series.redraw();
    }, 2000);

    window.setTimeout(() => {
        table.deleteRows(0, 1);
        series.redraw();
    }, 4000);

    window.setTimeout(() => {
        table.deleteRows(16, 1);
        series.redraw();
    }, 6000);
}

let benchmarking;

function benchmark(e) {
    if (chart.series[0]) {
        chart.series[0].remove();
    }

    if (benchmarking) {
        e.target.innerText = 'Benchmark';
        window.clearTimeout(benchmarking);
        benchmarking = 0;
    } else {
        chart.addSeries({
            type: benchmarkSeries,
            data: [[0, 0], [benchmarkSize, benchmarkSize]]
        });
        e.target.innerText = 'Benchmarking';
        benchmarking = window.setTimeout(benchmarkSetData, 1000);
    }
}

function benchmarkSetData(vs) {
    if (chart.series[0]) {
        chart.series[0].remove();
    }

    const series = chart.addSeries({
        type: benchmarkSeries
    });

    timestamp(true);

    series.setData(data, benchmarkSize < 1e5);

    const result = timestamp();

    if (vs) {
        addResults(result, vs);
    }

    if (benchmarking) {
        benchmarking = window.setTimeout(
            benchmarkSetTable,
            2000,
            vs ? 0 : result
        );
    }

    return result;
}

function benchmarkSetTable(vs) {
    if (chart.series[0]) {
        chart.series[0].remove();
    }

    const series = chart.addSeries({
        type: benchmarkSeries
    });

    timestamp(true);

    series.datas.setTable(table, benchmarkSize < 1e5);

    const result = timestamp();

    if (vs) {
        addResults(vs, result);
    }

    if (benchmarking) {
        benchmarking = window.setTimeout(
            benchmarkSetData,
            2000,
            vs ? 0 : result
        );
    }
}

let time;

function timestamp(init) {
    const now = new Date();

    if (!time || init) {
        time = now;
        return now;
    }

    const result = now - time;

    time = now;

    return result;
}

document
    .getElementById('line')
    .addEventListener('click', addSeries);

document
    .getElementById('column')
    .addEventListener('click', addSeries);

document
    .getElementById('pie')
    .addEventListener('click', addSeries);

document
    .getElementById('benchmark')
    .addEventListener('click', benchmark);
