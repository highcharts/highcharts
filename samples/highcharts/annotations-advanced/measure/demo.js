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
                    y: 8,
                    controlPoint: { /* control point options */ }
                },
                crosshair: {
                    /* EXAMPLE
                    markerEnd: 'arrow',
                    dashStyle: 'solid',
                    color: 'red'
                    */
                },
                label: {
                    /* EXAMPLE
                    backgroundColor: 'yellow',
                    borderWidth: 2,
                    borderColor: 'red'
                    */
                    /*
                    formatter: function (target) {
                        return 'custom min: ' + target.annotation.min + '<br>custom max: ' + target.annotation.max;
                    }
                    */
                },
                background: {
                    width: 250,
                    height: 150
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
Highcharts.chart(
    'container2',
    Highcharts.merge(
        { xAxis: { tickInterval: 4 }, chart: { inverted: true } },
        getOptions()
    )
);
