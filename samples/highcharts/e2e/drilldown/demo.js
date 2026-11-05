Highcharts.chart('container', {
    chart: {
        type: 'pie',
        animation: false
    },
    series: [
        {
            keys: ['name', 'y', 'drilldown'],
            data: [['a', 1], ['b', 2], ['c', 3, 'drill']]
        }
    ],
    drilldown: {
        series: [
            {
                id: 'drill',
                keys: ['name', 'y'],
                data: [['d', 4], ['e', 5], ['f', 6]]
            }
        ],
        animation: false
    },
    plotOptions: {
        series: {
            point: {
                events: {
                    mouseOver: function () {}
                }
            },
            animation: false
        },
        pie: {
            animation: false
        }
    }
});