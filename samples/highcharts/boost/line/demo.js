function getDataTableOptions(n) {
    const xColumn = new Float64Array(n),
        yColumn = new Float64Array(n);
    let a,
        b,
        c,
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
        xColumn[i] = i;
        yColumn[i] = 2 * Math.sin(i / 100) + a + b + c + spike + Math.random();
    }
    return {
        columns: {
            x: xColumn,
            y: yColumn
        }
    };
}
const n = 500000,
    dataTable = getDataTableOptions(n);


console.time('line');
Highcharts.chart('container', {

    dataTable,

    chart: {
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

    subtitle: {
        text: 'Using the Boost module'
    },

    tooltip: {
        valueDecimals: 2
    },

    series: [{
        lineWidth: 0.5
    }]

});
console.timeEnd('line');
