Highcharts.chart('container', {

    chart: {
        type: 'heatmap'
    },

    title: {
        text: 'Conditional tooltip'
    },

    subtitle: {
        text: 'The black (null) point has custom tooltip, the others default'
    },

    plotOptions: {
        heatmap: {
            nullColor: 'black'
        }
    },
    colorAxis: {
        min: 0,
        max: 9
    },

    tooltip: {
        formatter: function (tooltip) {
            if (this.point.isNull) {
                return 'Null';
            }
            // If not null, use the default formatter
            return tooltip.defaultFormatter.call(this, tooltip);
        }
    },

    series: [{
        data: [
            [0, 0, 1],
            [0, 1, 2],
            [0, 2, 3],
            [1, 0, 4],
            [1, 1, null],
            [1, 2, 6],
            [2, 0, 7],
            [2, 1, 8],
            [2, 2, 9]
        ]
    }]

});
