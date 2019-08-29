Highcharts.chart('container', {
    chart: {
        events: {
            load: function () {
                this.annotations.forEach(function (annotation) {
                    annotation.setControlPointsVisibility(true);
                    annotation.cpVisibility = true;
                });
            }
        }
    },

    annotations: [{
        type: 'tunnel',
        typeOptions: {
            points: [{
                x: 4,
                y: 4,
                controlPoint: { /* control point options */ }
            }, {
                x: 10,
                y: 5
            }],
            background: { /* background shape options */ },
            line: { /* line shape options */ },
            // height: -2,
            heightControlPoint: {
                /* control point options */
                style: {
                    fill: 'blue'
                }
            }
            // yAxis: 0,
            // xAxis: 0
        }
    }],

    series: [{
        data: [
            1, 2, 3, { y: 4, id: 's' }, 5, { y: 6, id: 'm' },
            2, 3, 4, 5, 6, 7, 8, 3, 2, 4, 4, 4, 4, 3
        ]
    }]
});
