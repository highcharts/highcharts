function getDataTableOptions(n) {
    const xColumn = new Float64Array(n),
        yColumn = new Float64Array(n),
        zColumn = new Float64Array(n);
    for (let i = 0; i < n; i += 1) {
        xColumn[i] = Math.pow(Math.random(), 2) * 100;
        yColumn[i] = Math.pow(Math.random(), 2) * 100;
        zColumn[i] = Math.pow(Math.random(), 2) * 100;
    }
    return {
        columns: {
            x: xColumn,
            y: yColumn,
            z: zColumn
        }
    };
}
const n = 50000,
    dataTable = getDataTableOptions(n);

if (!Highcharts.Series.prototype.renderCanvas) {
    throw 'Module not loaded';
}

console.time('bubble');
Highcharts.chart('container', {

    dataTable,

    chart: {
        zooming: {
            type: 'xy'
        }
    },

    xAxis: {
        gridLineWidth: 1,
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false
    },

    yAxis: {
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false
    },

    title: {
        text: 'Bubble chart with ' +
            Highcharts.numberFormat(n, 0, ' ') + ' points'
    },

    legend: {
        enabled: false
    },

    boost: {
        useGPUTranslations: true,
        usePreallocated: true
    },

    series: [{
        type: 'bubble',
        boostBlending: 'alpha',
        color: 'rgb(152, 0, 67)',
        fillOpacity: 0.1,
        minSize: 1,
        maxSize: 10,
        tooltip: {
            followPointer: false,
            pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
        }
    }]

});
console.timeEnd('bubble');
