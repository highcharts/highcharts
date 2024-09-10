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

(async () => {
    const fetchedData = await fetch('https://demo-live-data.highcharts.com/ecint/v1/timeseries/price?id=US30303M1027|US0231351067|US64110L1061|US02079K3059&idType=ISIN&endDate=2020-12-31&startDate=2000-01-01&currency=EUR')
        .then(res => (res.ok ? res.json() : []));

    const securityData = fetchedData.TimeSeries.Security;

    const facebookData = securityData[0].HistoryDetail.map(
        detail => [Date.parse(detail.EndDate), +detail.Value]
    );

    const amazonData = securityData[1].HistoryDetail.map(
        detail => [Date.parse(detail.EndDate), +detail.Value]
    );

    const netflixData = securityData[2].HistoryDetail.map(
        detail => [Date.parse(detail.EndDate), +detail.Value]
    );

    const googleData = securityData[3].HistoryDetail.map(
        detail => [Date.parse(detail.EndDate), +detail.Value]
    );

    Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },

        title: {
            text: 'FANG Stock Prices',
            align: 'left'
        },

        subtitle: {
            text: 'Source: Morningstar',
            align: 'left'
        },

        xAxis: {
            type: 'datetime'
        },

        yAxis: [{
            title: {
                text: 'Facebook'
            }
        }, {
            title: {
                text: 'Amazon'
            }
        }, {
            opposite: true,
            title: {
                text: 'Netflix'
            }
        }, {
            opposite: true,
            title: {
                text: 'Google'
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
            name: 'Facebook',
            data: facebookData,
            yAxis: 0
        }, {
            name: 'Amazon',
            data: amazonData,
            yAxis: 1,
            animation: {
                defer: 1000
            }
        }, {
            name: 'Netflix',
            data: netflixData,
            yAxis: 2,
            animation: {
                defer: 2000
            }
        }, {
            name: 'Google',
            data: googleData,
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
})();
