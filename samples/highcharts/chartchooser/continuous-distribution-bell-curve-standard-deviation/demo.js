var data = [
    111,
    107,
    100,
    107,
    114,
    115,
    111,
    97,
    100,
    112,
    104,
    89,
    104,
    102,
    91,
    114,
    114,
    103,
    106,
    105,
    113,
    109,
    108,
    113,
    130,
    128,
    128,
    118,
    113,
    120,
    132,
    111,
    124,
    127,
    128,
    136,
    106,
    118,
    119,
    123,
    124,
    126,
    116,
    127,
    119,
    97,
    86,
    102,
    110,
    120,
    103,
    115,
    93,
    72,
    111,
    103,
    123,
    79,
    119,
    110,
    110,
    107,
    74,
    105,
    112,
    105,
    110,
    107,
    103,
    77,
    98,
    90,
    96,
    112,
    112,
    114,
    93,
    106
];

var pointsInInterval = 5;

Highcharts.chart('container', {
    chart: {
        margin: [50, 0, 50, 50],
        events: {
            load: function () {
                this.series[0].data.forEach(function (point, i) {
                    var labels = ['4σ', '3σ', '2σ', 'σ', 'μ', 'σ', '2σ', '3σ', '4σ'];
                    if (i % pointsInInterval === 0) {
                        point.update({
                            color: 'black',
                            dataLabels: {
                                enabled: true,
                                // eslint-disable-next-line max-len
                                format: labels[Math.floor(i / pointsInInterval)],
                                overflow: 'none',
                                crop: false,
                                y: -2,
                                style: {
                                    fontSize: '13px'
                                }
                            }
                        });
                    }
                });
            }
        }
    },
    title: {
        text: 'Bell curve'
    },
    subtitle: {
        text:
        'Source:<a href="https://www.openintro.org/data/index.php?data=gpa_iq" target="_blank"> openintro</a> '
    },

    xAxis: {
        alignTicks: false
    },

    yAxis: {
        title: { text: null }
    },
    legend: {
        enabled: false
    },
    series: [
        {
            name: 'Bell curve',
            type: 'bellcurve',
            pointsInInterval: pointsInInterval,
            intervals: 4,
            baseSeries: 1,
            zIndex: -1,
            marker: {
                enabled: false
            }
        },
        {
            data: data,
            visible: false
        }
    ]
});
