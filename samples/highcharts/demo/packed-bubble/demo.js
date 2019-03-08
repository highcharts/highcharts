Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: '80%'
    },
    title: {
        text: 'TEAM TASKS'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.y}m CO<sub>2</sub>'
    },
    plotOptions: {
        packedbubble: {
            useSimulation: true,
            minSize: '40%',
            maxSize: '80%',
            layoutAlgorithm: {
                mixSeries: false
            },
            dataLabels: {
                enabled: false
            }
        }
    },
    series: [{
        name: 'Josephine',
        data: (function () {
            var d = [],
                points = 40;
            for (var i = 0; i < points; i++) {
                d.push([i, i * 10]);
            }
            return d;
        }())
    }, {
        name: 'Sophie',
        data: (function () {
            var d = [],
                points = 40;
            for (var i = 0; i < points; i++) {
                d.push([i, i * 10]);
            }
            return d;
        }())
    }, {
        name: 'Michael',
        data: (function () {
            var d = [],
                points = 40;
            for (var i = 0; i < points; i++) {
                d.push([i, i * 10]);
            }
            return d;
        }())
    }, {
        name: 'Jon',
        data: (function () {
            var d = [],
                points = 10;
            for (var i = 0; i < points; i++) {
                d.push([i, i * 10]);
            }
            return d;
        }())
    }]
});
