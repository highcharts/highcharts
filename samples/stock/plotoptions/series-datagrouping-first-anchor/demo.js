var hour = 3600 * 1000;
var data = [
    [0.2 * hour, 1], // first group
    [1 * hour, 2], // first group
    [1.3 * hour, 2], // first group
    [2 * hour, 3], // second group
    [3 * hour, 4], // second group
    [4 * hour, 1],
    [5 * hour, 2],
    [6 * hour, 3],
    [7 * hour, 4],
    [8 * hour, 1],
    [9 * hour, 2],
    [10.3 * hour, 3], // last group
    [11 * hour, 2], // last group
    [11.7 * hour, 4] // last group
];

Highcharts.stockChart('container', {
    chart: {
        height: 800
    },
    xAxis: {
        max: 12 * hour,
        plotLines: [{
            value: 0.2 * hour,
            label: {
                text: 'First point in group'
            }
        }, {
            value: 1.3 * hour,
            label: {
                text: 'Last point in group'
            }
        }, {
            value: 10.3 * hour,
            label: {
                text: 'First point in group'
            }
        }, {
            value: 11.7 * hour,
            label: {
                text: 'Last point in group'
            }
        }],
        plotBands: [{
            from: 0,
            to: 2 * hour,
            color: '#dedede',
            label: {
                text: 'First group'
            },
            zIndex: -3
        }, {
            from: 10 * hour,
            to: 12 * hour,
            color: '#dedede',
            label: {
                text: 'Last group'
            },
            zIndex: -3
        }]
    },
    yAxis: [{
        height: '10%',
        offset: 0,
        title: {
            text: 'Raw data'
        }
    }, {
        height: '18%',
        top: '10%',
        offset: 0,
        title: {
            text: 'start'
        }
    }, {
        height: '18%',
        top: '28%',
        offset: 0,
        title: {
            text: 'middle'
        }
    }, {
        height: '18%',
        top: '46%',
        offset: 0,
        title: {
            text: 'end'
        }
    }, {
        height: '18%',
        top: '64%',
        offset: 0,
        title: {
            text: 'firstPoint'
        }
    }, {
        height: '18%',
        top: '82%',
        offset: 0,
        title: {
            text: 'lastPoint'
        }
    }],
    plotOptions: {
        series: {
            data: data,
            dataGrouping: {
                approximation: 'average',
                enabled: true,
                forced: true,
                units: [
                    ['hour', [2]]
                ]
            }
        }
    },
    series: [{
        yAxis: 0,
        dataGrouping: {
            enabled: false
        }
    }, {
        yAxis: 1,
        dataGrouping: {
            firstAnchor: 'start',
            lastAnchor: 'start'
        }
    }, {
        yAxis: 2,
        dataGrouping: {
            firstAnchor: 'middle',
            lastAnchor: 'middle'
        }
    }, {
        yAxis: 3,
        dataGrouping: {
            firstAnchor: 'end',
            lastAnchor: 'end'
        }
    }, {
        yAxis: 4,
        dataGrouping: {
            firstAnchor: 'firstPoint',
            lastAnchor: 'firstPoint'
        }
    }, {
        yAxis: 5,
        dataGrouping: {
            firstAnchor: 'lastPoint',
            lastAnchor: 'lastPoint'
        }
    }]
});
