(function (H) {
    H.seriesTypes.pie.prototype.animate = function (init) {
        const series = this,
            chart = series.chart,
            points = series.points,
            {
                animation
            } = series.options,
            {
                startAngleRad
            } = series;

        function fanAnimate(point, startAngleRad) {
            const graphic = point.graphic,
                args = point.shapeArgs;

            if (graphic && args) {
                // Set inital animation values
                point.graphic.attr({
                    start: startAngleRad,
                    end: startAngleRad,
                    opacity: 1
                });
                // Animate
                graphic.animate({
                    start: args.start,
                    end: args.end
                }, {
                    duration: animation.duration / points.length
                }, function () {
                    if (points[point.index + 1]) {
                        fanAnimate(points[point.index + 1], args.end);
                    }
                    if (point.index === series.points.length - 1) {
                        series.dataLabelsGroup.animate({
                            opacity: 1
                        },
                        void 0,
                        function () {
                            points.forEach(point => {
                                point.opacity = 1;
                            });
                            series.update({
                                enableMouseTracking: true
                            }, false);
                            chart.update({
                                plotOptions: {
                                    pie: {
                                        innerSize: '40%',
                                        borderRadius: 8
                                    }
                                }
                            });
                        });
                    }
                });
            }
        }

        if (init) {
            // Hide points on init
            points.forEach(point => {
                point.opacity = 0;
            });
        } else {
            fanAnimate(points[0], startAngleRad);
        }
    };
}(Highcharts));

Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Departamental Strength of the Company'
    },
    subtitle: {
        text: 'Custom animation of pie series'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            borderWidth: 2,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage}%'
            }
        }
    },
    series: [{
        // Disable mouse tracking on load, enable after custom animation
        enableMouseTracking: false,
        animation: {
            duration: 2000
        },
        colorByPoint: true,
        data: [{
            name: 'Customer Support',
            y: 21.3
        }, {
            name: 'Development',
            y: 18.7
        }, {
            name: 'Sales',
            y: 20.2
        }, {
            name: 'Marketing',
            y: 14.2
        }, {
            name: 'Other',
            y: 25.6
        }]
    }]
});
