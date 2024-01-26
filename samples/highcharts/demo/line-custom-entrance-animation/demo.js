(function (H) {
    const animateSVGPath = (svgElem, animation, callback = void 0) => {
        const length = svgElem.element.getTotalLength();
        svgElem.attr({
            'stroke-dasharray': length,
            'stroke-dashoffset': length,
            opacity: 1
        });
        svgElem.animate({
            'stroke-dashoffset': 0
        }, animation, callback);
    };

    H.seriesTypes.line.prototype.animate = function (init) {
        const series = this,
            animation = H.animObject(series.options.animation);
        if (!init) {
            animateSVGPath(series.graph, animation);
        }
    };

    H.addEvent(H.Axis, 'afterRender', function () {
        const axis = this,
            chart = axis.chart,
            animation = H.animObject(chart.renderer.globalAnimation);

        axis.axisGroup
            // Init
            .attr({
                opacity: 0,
                rotation: -3,
                scaleY: 0.9
            })

            // Animate
            .animate({
                opacity: 1,
                rotation: 0,
                scaleY: 1
            }, animation);
        if (axis.horiz) {
            axis.labelGroup
                // Init
                .attr({
                    opacity: 0,
                    rotation: 3,
                    scaleY: 0.5
                })

                // Animate
                .animate({
                    opacity: 1,
                    rotation: 0,
                    scaleY: 1
                }, animation);
        } else {
            axis.labelGroup
                // Init
                .attr({
                    opacity: 0,
                    rotation: 3,
                    scaleX: -0.5
                })

                // Animate
                .animate({
                    opacity: 1,
                    rotation: 0,
                    scaleX: 1
                }, animation);
        }

        if (axis.plotLinesAndBands) {
            axis.plotLinesAndBands.forEach(plotLine => {
                const animation = H.animObject(plotLine.options.animation);

                // Init
                plotLine.label.attr({
                    opacity: 0
                });

                // Animate
                animateSVGPath(
                    plotLine.svgElem,
                    animation,
                    function () {
                        plotLine.label.animate({
                            opacity: 1
                        });
                    }
                );
            });
        }
    });
}(Highcharts));

Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },

    title: {
        text: 'United States of America\'s Inflation-related statistics',
        align: 'left'
    },

    subtitle: {
        text: 'Source: <a href="https://www.worldbank.org/en/home">The World Bank</a>',
        align: 'left'
    },

    data: {
        csv: document.getElementById('csv').innerHTML
    },

    yAxis: [{
        title: {
            text: 'Inflation'
        },
        plotLines: [{
            color: 'black',
            width: 2,
            value: 13.5492019749684,
            animation: {
                duration: 1000,
                defer: 4000
            },
            label: {
                text: 'Max Inflation',
                align: 'right',
                x: -20
            }
        }]
    }, {
        title: {
            text: 'Claims on central government, etc.'
        }
    }, {
        opposite: true,
        title: {
            text: 'Net foreign assets'
        }
    }, {
        opposite: true,
        title: {
            text: 'Net domestic credit'
        }
    }],

    plotOptions: {
        series: {
            animation: {
                duration: 1000
            },
            marker: {
                enabled: false
            },
            lineWidth: 2
        }
    },

    series: [{
        yAxis: 0
    }, {
        yAxis: 1,
        animation: {
            defer: 1000
        }
    }, {
        yAxis: 2,
        animation: {
            defer: 2000
        }
    }, {
        yAxis: 3,
        animation: {
            defer: 3000
        }
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                yAxis: [{
                    tickAmount: 2,
                    title: {
                        x: 15,
                        reserveSpace: false
                    }
                }, {
                    tickAmount: 2,
                    title: {
                        x: 20,
                        reserveSpace: false
                    }
                }, {
                    tickAmount: 2,
                    title: {
                        x: -20,
                        reserveSpace: false
                    }
                }, {
                    tickAmount: 2,
                    title: {
                        x: -20,
                        reserveSpace: false
                    }
                }]
            }
        }]
    }
});
