var chart = Highcharts.chart('container', {
    pathfinder: {
        marker: {
            enabled: true
        }
    },
    series: [{
        data: [{
            y: 29.9,
            connect: 'bob'
        }, {
            id: 'bernard',
            connect: {
            //    to: 'johan',
                type: 'fastAvoid',
                dashStyle: 'shortdash',
                lineWidth: 2,
                color: '#d99',
                endMarker: {
                    verticalAlign: 'top',
                    align: 'left'
                }
            },
            y: 71.5
        }, 106.4, 144.0, 176.0, {
            id: 'bob',
            y: 135.6
        }, 148.5, 150, 216.4, {
            id: 'alfred',
            y: 194.1
        }, {
            connect: {
                to: 'alfred',
                type: 'fastAvoid'
            },
            y: 95.6
        }, 54.4],
        type: 'scatter'
    }, {
        data: [19.9, 11.5, 16.4, 19.2, 94.0, 12, 85, 16.0, {
            id: 'johan',
            connect: {
                to: 'bernard',
                type: 'fastAvoid'
            },
            y: 55.6
        }, 18.5, 26.4, 44.4],
        type: 'column'
    }]
});

document.getElementById('btn').onclick = function () {
    chart.series[0].points[0].update(180);
};