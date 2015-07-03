$(function () {

    $('#container').highcharts({

        title: {
            text: 'Mouse events demo'
        },
        subtitle: {
            text: 'On point mouse over or mouse out, the values should be reported in top left'
        },
        plotOptions: {
            series: {
                point: {
                    events: {
                        mouseOver: function () {
                            var chart = this.series.chart;
                            if (!chart.lbl) {
                                chart.lbl = chart.renderer.label('')
                                    .attr({
                                        padding: 10,
                                        r: 10,
                                        fill: Highcharts.getOptions().colors[1]
                                    })
                                    .css({
                                        color: '#FFFFFF'
                                    })
                                    .add();
                            }
                            chart.lbl
                                .show()
                                .attr({
                                    text: 'x: ' + this.x + ', y: ' + this.y
                                });
                        }
                    }
                },
                events: {
                    mouseOut: function () {
                        if (this.chart.lbl) {
                            this.chart.lbl.hide();
                        }
                    }
                }
            }
        },

        tooltip: {
            enabled: false
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});