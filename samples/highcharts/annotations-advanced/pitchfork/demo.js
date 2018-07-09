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
        type: 'pitchfork',
        typeOptions: {
            points: [{
                x: 4,
                y: 4,
                controlPoint: {
                    /* control point options */
                    style: {
                        fill: 'red'
                    }
                }
            }, {
                x: 10,
                y: 6
            }, {
                x: 10,
                y: 2
            }],
            innerBackground: {
                /* background shape options */
                fill: 'rgba(100, 170, 255, 0.8)'
            },
            outerBackground: { /* background shape options */ }
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
