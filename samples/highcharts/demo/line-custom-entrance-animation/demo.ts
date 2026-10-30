declare namespace Highcharts {
    interface YAxisPlotLinesOptions {
        animation?: Highcharts.AnimationOptionsObject;
    }
}

(({ addEvent, animObject, Axis, Series }) => {
    const animateSVGPath = (
        svgElem: Highcharts.SVGElement,
        animation: Highcharts.AnimationOptionsObject,
        callback: Function = void 0
    ) => {
        const length = (svgElem.element as SVGPathElement).getTotalLength();
        svgElem.attr({
            'stroke-dasharray': length,
            'stroke-dashoffset': length,
            opacity: 1
        });
        svgElem.animate({
            'stroke-dashoffset': 0
        }, animation, callback);
    };

    Series.types.line.prototype.animate = function (init) {
        const animation = animObject(
            (this.options as Highcharts.SeriesLineOptions).animation
        );
        if (!init) {
            animateSVGPath(this.graph, animation);
        }
    };

    addEvent(Axis, 'afterRender', function () {
        const chart = this.chart,
            animation = animObject(chart.renderer.globalAnimation);

        this.axisGroup
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
        if (this.horiz) {
            this.labelGroup
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
            this.labelGroup
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

        this.plotLines.forEach(plotLine => {
            const animation = animObject(
                (plotLine.options as Highcharts.YAxisPlotLinesOptions).animation
            );

            // Animate
            animateSVGPath(
                plotLine.svgElem,
                animation,
                () => {
                    plotLine.label.css({
                        opacity: 1
                    });
                }
            );
        });
    });
})(Highcharts);

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
            color: 'var(--highcharts-neutral-color-100, black)',
            width: 2,
            value: 13.5492019749684,
            animation: {
                duration: 1000,
                defer: 4000
            },
            label: {
                text: 'Max Inflation',
                align: 'right',
                x: -20,
                style: {
                    opacity: 0,
                    transition: 'opacity 0.5s ease-in-out'
                }
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
        yAxis: 0,
        tooltip: {
            valueDecimals: 1,
            valueSuffix: '%'
        }
    }, {
        yAxis: 1,
        animation: {
            defer: 1000
        },
        tooltip: {
            valueDecimals: 1,
            valueSuffix: '%'
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
} satisfies Highcharts.Options);
