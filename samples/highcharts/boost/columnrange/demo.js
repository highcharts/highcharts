function getDataTableOptions(n) {
    const xColumn = new Float64Array(n),
        lowColumn = new Float64Array(n),
        highColumn = new Float64Array(n);
    let a,
        b,
        c,
        low,
        spike;
    for (let i = 0; i < n; i = i + 1) {
        if (i % 100 === 0) {
            a = 2 * Math.random();
        }
        if (i % 1000 === 0) {
            b = 2 * Math.random();
        }
        if (i % 10000 === 0) {
            c = 2 * Math.random();
        }
        if (i % 50000 === 0) {
            spike = 10;
        } else {
            spike = 0;
        }
        low = 2 * Math.sin(i / 100) + a + b + c + spike + Math.random();
        xColumn[i] = i;
        lowColumn[i] = low;
        highColumn[i] = low + 5 + 5 * Math.random();
    }
    return {
        columns: {
            x: xColumn,
            low: lowColumn,
            high: highColumn
        }
    };
}
const n = 500000,
    dataTable = getDataTableOptions(n);


console.time('columnrange');
Highcharts.chart('container', {

    dataTable,

    chart: {
        type: 'columnrange',
        zooming: {
            type: 'x'
        },
        panning: true,
        panKey: 'shift'
    },

    boost: {
        useGPUTranslations: true
    },

    title: {
        text: 'Highcharts drawing ' + n + ' points'
    },

    xAxis: {
        crosshair: true
    },

    subtitle: {
        text: 'Using the Boost module'
    },

    tooltip: {
        valueDecimals: 2
    },

    series: [{}]

});
console.timeEnd('columnrange');
