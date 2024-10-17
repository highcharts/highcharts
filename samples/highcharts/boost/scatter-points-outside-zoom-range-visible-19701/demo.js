// Prepare the data
const data = [],
    n = 100;

for (let i = 0; i < n; i += 1) {
    data.push([
        Math.pow(Math.random(), 2) * 100,
        Math.pow(Math.random(), 2) * 100
    ]);
}

Highcharts.chart('container', {

    chart: {
        zoomType: 'xy'
    },

    boost: {
        useGPUTranslations: true,
        usePreAllocated: true
    },

    xAxis: {
        min: 0,
        max: 100,
        gridLineWidth: 1,
        left: '20%',
        width: '80%'
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
        Highcharts.numberFormat(data.length, 0, ' ') + ' points'
    },

    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            boostThreshold: 1
        }
    },

    series: [{
        type: 'scatter',
        color: 'rgb(152, 0, 67)',
        data: data,
        marker: {
            radius: 3
        },
        tooltip: {
            followPointer: false,
            pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
        },
        sorted: true
    }]

});
