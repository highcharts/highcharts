

// Prepare the data
var data = [],
    n = 50000,
    i;
for (i = 0; i < n; i += 1) {
    data.push([
        Math.pow(Math.random(), 2) * 100,
        Math.pow(Math.random(), 2) * 100,
        Math.pow(Math.random(), 2) * 100
    ]);
}

if (!Highcharts.Series.prototype.renderCanvas) {
    throw 'Module not loaded';
}

console.time('bubble');
Highcharts.chart('container', {

    chart: {
        zoomType: 'xy'
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
        text: 'Bubble chart with ' + Highcharts.numberFormat(data.length, 0, ' ') + ' points'
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
        data: data,
        minSize: 1,
        maxSize: 10,
        tooltip: {
            followPointer: false,
            pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
        }
    }]

});
console.timeEnd('bubble');
