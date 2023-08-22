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

        if (axis.isXAxis) {
            // Init
            axis.labelGroup.attr({
                scaleY: 0
            });

            // Animate
            axis.labelGroup.animate({
                scaleY: 1
            }, animation);
        } else {
            // Init
            axis.labelGroup.attr({
                scaleX: -1
            });

            // Animate
            axis.labelGroup.animate({
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
        text: 'United States of America\'s Inflation-related statistics'
    },

    subtitle: {
        text: 'Source: <a href="https://www.worldbank.org/en/home">The World Bank</a>'
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
                duration: 2000,
                defer: 8000
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
                duration: 2000
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
            defer: 2000
        }
    }, {
        yAxis: 2,
        animation: {
            defer: 4000
        }
    }, {
        yAxis: 3,
        animation: {
            defer: 6000
        }
    }]
});
