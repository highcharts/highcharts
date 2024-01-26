Highcharts.addEvent(Highcharts.Chart, 'render', function () {
    const chart = this;
    this.series.forEach(function (s) {
        s.points.forEach(function (p) {
            const drilldownConnector = p.drilldownConnector &&
                 chart.get(p.drilldownConnector.seriesId);
            let path;
            if (drilldownConnector) {

                path = [
                    'M',
                    chart.plotLeft + p.shapeArgs.x +
                         Math.cos(p.shapeArgs.start) * p.shapeArgs.r,
                    chart.plotTop + p.shapeArgs.y +
                         Math.sin(p.shapeArgs.start) * p.shapeArgs.r,
                    'L',
                    chart.plotLeft + drilldownConnector.center[0],
                    chart.plotTop + drilldownConnector.center[1] -
                         drilldownConnector.center[2] / 2,
                    'M',
                    chart.plotLeft + p.shapeArgs.x +
                         Math.cos(p.shapeArgs.end) * p.shapeArgs.r,
                    chart.plotTop + p.shapeArgs.y +
                         Math.sin(p.shapeArgs.end) * p.shapeArgs.r,
                    'L',
                    chart.plotLeft + drilldownConnector.center[0],
                    chart.plotTop + drilldownConnector.center[1] +
                         drilldownConnector.center[2] / 2
                ];

                if (!p.drilldownConnectorGraphicUnbind) {
                    p.drilldownConnectorGraphicUnbind = Highcharts.addEvent(s, 'afterAnimate', function () {
                        if (!p.drilldownConnectorGraphic) {
                            p.drilldownConnectorGraphic = chart.renderer
                                .path([
                                    'M',
                                    path[1], path[2],
                                    'L',
                                    path[1], path[2],
                                    'M',
                                    path[7], path[8],
                                    'L',
                                    path[7], path[8]
                                ])
                                .attr({
                                    stroke: 'gray',
                                    'stroke-width': 1
                                })
                                .animate({
                                    d: path
                                })
                                .add();
                        }
                    });
                }

                if (p.drilldownConnectorGraphic) {
                    p.drilldownConnectorGraphic.animate({
                        d: path
                    });
                }

            }
        });
    });
});


Highcharts.chart('container', {

    title: {
        text: 'Drilldown connector'
    },

    subtitle: {
        text: 'A Highcharts study'
    },

    plotOptions: {
        pie: {
            dataLabels: {
                distance: -30
            }
        }
    },
    series: [{
        data: [1, {
            drilldownConnector: {
                seriesId: 'secondary'
            },
            y: 1
        }, 1, 1, 1],
        type: 'pie',
        center: ['25%', '50%']
    }, {
        data: [1, 4, 3, 5],
        colors: [
            Highcharts.getOptions().colors[1],
            Highcharts.color(
                Highcharts.getOptions().colors[1]).brighten(0.1).get(),
            Highcharts.color(
                Highcharts.getOptions().colors[1]).brighten(0.2).get(),
            Highcharts.color(
                Highcharts.getOptions().colors[1]).brighten(0.3).get()
        ],
        type: 'pie',
        center: ['75%', '50%'],
        id: 'secondary'
    }]
});
