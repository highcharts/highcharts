function getDataTableOptions(n) {
    const xColumn = new Float64Array(n),
        yColumn = new Float64Array(n);
    let i,
        x,
        a,
        b,
        c,
        spike;
    for (
        i = 0, x = Date.UTC(new Date().getUTCFullYear(), 0, 1) - n * 36e5;
        i < n;
        i = i + 1, x = x + 36e5
    ) {
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
        xColumn[i] = x;
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
        }
    },

    title: {
        text: 'Highcharts drawing ' + n + ' points',
        align: 'left'
    },

    subtitle: {
        text: 'Using the Boost module',
        align: 'left'
    },

    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<{headingTagName}>' +
                '{chartTitle}</{headingTagName}><div>{chartSubtitle}</div>' +
                '<div>{chartLongdesc}</div><div>{xAxisDescription}</div><div>' +
                '{yAxisDescription}</div>'
        }
    },

    tooltip: {
        valueDecimals: 2
    },

    xAxis: {
        type: 'datetime'
    },

    series: [{
        lineWidth: 0.5,
        name: 'Hourly data points',
        color: '#2caffe'
    }]

});
console.timeEnd('line');
