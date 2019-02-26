var chart = Highcharts.chart('container', {
    title: {
        text: 'Dynamic data'
    },
    subtitle: {
        text: 'Click button to add point to chart'
    },
    accessibility: {
        description: 'A test case for dynamic data in charts.',
        announceNewData: {
            enabled: true
        }
    },
    tooltip: {
        dateTimeLabelFormats: {
            day: '%H:%M',
            hour: '%H:%M'
        }
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            day: '%H:%M',
            hour: '%H:%M'
        }
    },
    plotOptions: {
        series: {
            pointStart: 0,
            pointInterval: 1000 * 60 * 60
        }
    },
    series: [{
        name: 'Random data',
        data: [1, 3, 4, 6, 7, 5, 3, 4, 8, 9, 7, 6, 4, 3]
    }]
});

// Add random point when clicking button
var button = document.getElementById('add');
button.onclick = function () {
    button.focus();
    chart.series[0].addPoint(Math.round(Math.random() * 10));
};
