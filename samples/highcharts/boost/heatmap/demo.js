
var start;

Highcharts.chart('container', {

    data: {
        csv: document.getElementById('csv').innerHTML,
        parsed: function () {
            start = +new Date();
        }
    },

    chart: {
        type: 'heatmap',
        margin: [60, 10, 80, 50]
    },

    boost: {
        useGPUTranslations: true
    },

    title: {
        text: 'Highcharts boosted heat map',
        align: 'left',
        x: 40
    },

    subtitle: {
        text: 'Temperature variation by day and hour through 2013',
        align: 'left',
        x: 40
    },

    xAxis: {
        type: 'datetime',
        min: Date.UTC(2013, 0, 1),
        max: Date.UTC(2014, 0, 1),
        labels: {
            align: 'left',
            x: 5,
            y: 14,
            format: '{value:%B}' // long month
        },
        showLastLabel: false,
        tickLength: 16
    },

    yAxis: {
        title: {
            text: null
        },
        labels: {
            format: '{value}:00'
        },
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [0, 6, 12, 18, 24],
        tickWidth: 1,
        min: 0,
        max: 23,
        reversed: true
    },

    colorAxis: {
        stops: [
            [0, '#3060cf'],
            [0.5, '#fffbbc'],
            [0.9, '#c4463a'],
            [1, '#c4463a']
        ],
        min: -15,
        max: 25,
        startOnTick: false,
        endOnTick: false,
        labels: {
            format: '{value}℃'
        }
    },

    series: [{
        boostThreshold: 100,
        borderWidth: 0,
        nullColor: '#EFEFEF',
        colsize: 24 * 36e5, // one day
        tooltip: {
            headerFormat: 'Temperature<br/>',
            pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>'
        },
        turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
    }]

});

console.log('Rendered in ' + (new Date() - start) + ' ms'); // eslint-disable-line no-console