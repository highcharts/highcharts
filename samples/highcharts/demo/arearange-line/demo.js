function createChart(medians, quantiles) {
    Highcharts.chart('container', {

        title: {
            text: 'Median earnings in Norway with quantiles',
            align: 'left'
        },

        subtitle: {
            text: 'Source: ' +
                '<a href="https://www.ssb.no/en/statbank/table/11419"' +
                'target="_blank">YR</a>',
            align: 'left'
        },

        xAxis: {
            type: 'datetime',
            accessibility: {
                rangeDescription: 'Range: 2015 to 2025.'
            }
        },

        yAxis: {
            title: {
                text: null
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: 'NOK'
        },

        plotOptions: {
            series: {
                pointStart: '2015-01-01',
                pointIntervalUnit: 'year'
            }
        },

        series: [{
            name: 'Median earnings',
            data: medians,
            zIndex: 1,
            marker: {
                fillColor: 'var(--highcharts-background-color)',
                lineWidth: 2,
                lineColor: null
            }
        }, {
            name: 'Quantiles',
            data: quantiles,
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            color: 'var(--highcharts-color-0)',
            fillOpacity: 0.3,
            zIndex: 0,
            marker: {
                enabled: false
            }
        }]
    });
}

const quantiles = [
        [31600, 47480],
        [32610, 48710],
        [33330, 50000],
        [34280, 51380],
        [35520, 53380],
        [36250, 54570],
        [37580, 56890],
        [39200, 59630],
        [41630, 63280],
        [43880, 66670],
        [45650, 69940]

    ],
    medians = [
        [38350],
        [39490],
        [40450],
        [41560],
        [43170],
        [44150],
        [45830],
        [47680],
        [50660],
        [53490],
        [55800]
    ];

createChart(medians, quantiles);