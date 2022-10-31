/* eslint-disable no-use-before-define */

// import DataSeriesComposition from '../../../../code/es-modules/Data/DataSeriesComposition.js';
// DataSeriesComposition.compose(Highcharts.Series.types.line);
// DataSeriesComposition.compose(Highcharts.Series.types.column);
// DataSeriesComposition.compose(Highcharts.Series.types.pie);
// DataSeriesComposition.compose(Highcharts.Series.types.scatter);

import SeriesTable from '../../../../code/es-modules/Core/Series/SeriesTable.js';
SeriesTable.compose(Highcharts.Series.types.column);
SeriesTable.compose(Highcharts.Series.types.line);
SeriesTable.compose(Highcharts.Series.types.pie);
SeriesTable.compose(Highcharts.Series.types.scatter);

import DataTable from '../../../../code/es-modules/Data/DataTable.js';

const benchmarks = document.getElementById('benchmarks');
const benchmarkSeries = 'scatter';
const benchmarkSize = 1e5;
const chart = Highcharts.chart('chart', {
    debug: true,
    boost: false,
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
            allowMutatingData: true,
            boostThreshold: benchmarkSize < 1e5 ? benchmarkSize + 1 : 1,
            dataAsColumns: true,
            enableMouseTracking: false
        }
    },
    series: [{
        type: 'line',
        data: [
            [11, 12, 13, 14, 15, 16, 17],
            [13, 17, 19, 23, 29, 31, 37]
        ]
    }]
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

    chart.addSeries({
        type: e.target.innerText.toLowerCase(),
        table: {
            y: [
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
                43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
            ]
        }
    });

    window.setTimeout(() => {
        table.setRow([101]);
    }, 2000);

    window.setTimeout(() => {
        table.deleteRows(0, 1);
    }, 4000);

    window.setTimeout(() => {
        table.deleteRows(16, 1);
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
        benchmarking = window.setTimeout(benchmarkData, 1000);
    }
}

function benchmarkData(vs) {
    if (chart.series[0]) {
        chart.series[0].remove();
    }

    timestamp(true);

    chart.addSeries({
        type: benchmarkSeries,
        data
    });

    const result = timestamp();

    if (vs) {
        addResults(result, vs);
    }

    if (benchmarking) {
        benchmarking = window.setTimeout(
            benchmarkTable,
            2000,
            vs ? 0 : result
        );
    }

    return result;
}

function benchmarkTable(vs) {
    if (chart.series[0]) {
        chart.series[0].remove();
    }

    timestamp(true);

    chart.addSeries({
        type: benchmarkSeries,
        table: table.getColumns(void 0, true)
    });

    const result = timestamp();

    if (vs) {
        addResults(vs, result);
    }

    if (benchmarking) {
        benchmarking = window.setTimeout(
            benchmarkData,
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

console.log(chart);
