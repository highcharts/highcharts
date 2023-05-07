var chart = Highcharts.chart('container', {
    title: {
        text: 'Mapping zones',
        align: 'left',
        margin: 25
    },
    legend: {
        enabled: false
    },
    yAxis: {
        plotLines: [{
            value: 6,
            color: '#565',
            width: 3,
            zIndex: 2
        }, {
            value: 10,
            color: '#565',
            width: 3,
            zIndex: 2
        }]
    },
    series: [{
        sonification: {
            tracks: [{
                // Use vibraphone instrument when y = 5 or less
                instrument: 'vibraphone',
                activeWhen: {
                    prop: 'y',
                    max: 6
                }
            }, {
                // Use piano above that, until we get to 10
                instrument: 'piano',
                activeWhen: {
                    prop: 'y',
                    min: 6.1,
                    max: 10
                }
            }, {
                // Then a sax
                instrument: 'saxophone',
                activeWhen: {
                    prop: 'y',
                    min: 10.1
                }
            }]
        },
        // Get some visual zones as well
        zones: [{
            color: '#3C3CC3',
            value: 6.1
        }, {
            color: '#34A866',
            value: 10.1
        }, {
            color: '#DD1903'
        }],
        data: [4, 5, 6, 5, 7, 8, 7, 9, 11, 13, 14, 11, 8,
            7, 5, 2, 2, 1, 6, 8, 9, 11]
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
