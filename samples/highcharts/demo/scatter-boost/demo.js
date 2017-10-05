

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
Highcharts.chart('container', {

    chart: {
        zoomType: 'xy',
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
        text: 'Scatter chart with 1 million points'
    },

    legend: {
        enabled: false
    },

    series: [{
        type: 'scatter',
        color: 'rgba(152,0,67,0.1)',
        data: data,
        marker: {
            radius: 0.1
        },
        tooltip: {
            followPointer: false,
            pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
        }
    }]

});
console.timeEnd('scatter');
