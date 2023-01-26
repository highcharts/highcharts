Highcharts.chart('container', {

    chart: {
        zoomType: 'x',
        events: {
            render: function () {
                const info = this.xAxis[0].tickPositions.info;

                if (info) {
                    this.setTitle({
                        text: `Current tick every: ${info.count + ' ' +
                            info.unitName + (info.count !== 1 ? 's' : '')}`
                    });
                }
            }
        }
    },

    xAxis: {
        type: 'datetime',
        minRange: 1000 * 60 * 60 * 24 * 2, // maximum zoom allowed: 2 days
        units: [
            ['day', [1, 4]],
            ['month', [1]]
        ]
    },

    subtitle: {
        text: `Allowed ticks every: 1 month, 4 days, 1 day.<br/>Zoom in to see
        different ticks.`
    },

    series: [{
        data: [
            [1609846680000, 1],
            [1609847280000, 3],
            [1609848480000, 2],
            [1609850820000, 4],
            [1609855266000, 3],
            [1609863491000, 5],
            [1609878296000, 4],
            [1609904205000, 6],
            [1609948250000, 5],
            [1610020925000, 7],
            [1610137205000, 6],
            [1610317439000, 8],
            [1610587790000, 7],
            [1610979798000, 9],
            [1611528610000, 8],
            [1612269506000, 10],
            [1613232671000, 9],
            [1614436628000, 11],
            [1615881375000, 10],
            [1617542835000, 12],
            [1619370440000, 11],
            [1621289426000, 13]
        ]
    }]

});
