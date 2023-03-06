Highcharts.chart('container', {

    chart: {
        type: 'streamgraph',
        marginBottom: 30,
        zoomType: 'x'
    },
    title: {
        floating: true,
        align: 'left',
        text: 'JS Frameworks Trends'
    },
    subtitle: {
        floating: true,
        align: 'left',
        y: 30,
        text: 'Source: <a href="https://trends.google.com/trends/" target="_blank">Google trends</a>'
    },

    xAxis: {
        maxPadding: 0,
        crosshair: true,
        labels: {
            align: 'left',
            reserveSpace: false,
            rotation: 270
        },
        lineWidth: 0,
        margin: 20,
        tickWidth: 0
    },

    yAxis: {
        visible: false,
        startOnTick: false,
        endOnTick: false
    },

    legend: {
        enabled: false
    },

    tooltip: {
        xDateFormat: '%B %Y',
        shared: true
    },

    data: {
        csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@24912efc85/samples/data/js-frameworks-trends.csv',
        endColumn: 4
    },

    series: [{
        color: '#a0d9ff'
    }, {
        color: '#5891c8'
    }, {
        color: '#346da4'
    }, {
        color: '#0F487F'
    }]
});