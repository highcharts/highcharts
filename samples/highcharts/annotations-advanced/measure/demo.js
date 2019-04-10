function getOptions() {
    var options = {
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
            type: 'measure',
            typeOptions: {
                point: {
                    x: 0,
                    y: 6,
                    controlPoint: { /* control point options */ }
                },
                label: {
                    enabled: true
                },
                background: {
                    width: 300 + 'px',
                    height: 150 + 'px'
                }
            }
        }],

        series: [{
            data: [
                1, 2, 3, { y: 4, id: 's' }, 5, { y: 6, id: 'm' },
                2, 3, 4, 5, 6, 7, 8, 3, 2, 4, 4, 4, 4, 3
            ]
        }]
    };

    return options;
}

Highcharts.chart('container1', getOptions());
