
// Prepare the data
var data = [],
    n = 1000000,
    i;
for (i = 0; i < n; i += 1) {
    data.push([
        Math.pow(Math.random(), 2) * 100,
        Math.pow(Math.random(), 2) * 100
    ]);
}

if (!Highcharts.Series.prototype.renderCanvas) {
    throw 'Module not loaded';
}

console.time('scatter');
console.time('asyncRender');
Highcharts.chart('container', {

    chart: {
        zoomType: 'xy'
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
        maxPadding: 0
    },

    boost: {
        useGPUTranslations: true,
        usePreallocated: true
    },

    title: {
        text: 'Scatter chart with ' + Highcharts.numberFormat(data.length, 0, ' ') + ' points'
    },

    subtitle: {
        text: '(and comparing lobsters with canaries)'
    },

    legend: {
        enabled: false
    },

    series: [{
        boostThreshold: 1,
        type: 'scatter',
        color: 'rgb(152, 0, 67)',
        fillOpacity: 0.1,
        data: data,
        marker: {
            radius: 0.1
        },
        tooltip: {
            followPointer: false,
            pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
        },
        events: {
            renderedCanvas: function () {
                console.timeEnd('asyncRender');
            }
        }
    },
    {
        type: 'pie',
        size: '30%',
        data: [
            ['Lobsters', 50],
            ['Canaries', 50]
        ]
    }]

});
console.timeEnd('scatter');
