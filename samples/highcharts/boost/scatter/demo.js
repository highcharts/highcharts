function getDataTableOptions(n) {
    const xColumn = new Float64Array(n),
        yColumn = new Float64Array(n);
    for (let i = 0; i < n; i += 1) {
        xColumn[i] = Math.pow(Math.random(), 2) * 100;
        yColumn[i] = Math.pow(Math.random(), 2) * 100;
    }
    return {
        columns: {
            x: xColumn,
            y: yColumn
        }
    };
}
const n = 1000000,
    dataTable = getDataTableOptions(n);

if (!Highcharts.Series.prototype.renderCanvas) {
    throw 'Module not loaded';
}

console.time('scatter');
Highcharts.chart('container', {

    dataTable,

    chart: {
        zooming: {
            type: 'xy'
        },
        height: '100%'
    },

    boost: {
        useGPUTranslations: true,
        usePreAllocated: true
    },

    xAxis: {
        min: 0,
        max: 100,
        gridLineWidth: 1
    },

    yAxis: {
        // Renders faster when we don't have to compute min and max
        min: 0,
        max: 100,
        minPadding: 0,
        maxPadding: 0,
        title: {
            text: null
        }
    },

    title: {
        text: 'Scatter chart with ' +
            Highcharts.numberFormat(n, 0, ' ') + ' points'
    },

    legend: {
        enabled: false
    },

    series: [{
        type: 'scatter',
        color: 'rgb(152, 0, 67)',
        fillOpacity: 0.1,
        marker: {
            radius: 1
        },
        tooltip: {
            followPointer: false,
            pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
        }
    }]

});
console.timeEnd('scatter');
