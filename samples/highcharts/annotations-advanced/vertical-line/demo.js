Highcharts.chart('container', {
    chart: {
        zoomType: 'xy',
        // inverted: true,
        events: {
            load: function () {
                this.annotations.forEach(function (annotation) {
                    annotation.setControlPointsVisibility(true);
                    annotation.cpVisibility = true;
                });
            }
        }
    },

    yAxis: {
        tickInterval: 0.5
    },

    annotations: [{
        type: 'verticalLine',
        typeOptions: {
            point: 's',
            label: {
                /* label options */
            }
        }
    }],

    series: [{
        data: [
            1, 2, 3, { y: 4, id: 's' }, 5, { y: 6, id: 'm' },
            2, 3, 4, 5, 6, 7, 8, 3, 2, 4, 4, 4, 4, 3
        ]
    }]
});
