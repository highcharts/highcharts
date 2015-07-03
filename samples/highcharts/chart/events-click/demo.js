$(function () {
    // create the chart
    $('#container').highcharts({
        chart: {
            events: {
                click: function (event) {
                    var label = this.renderer.label(
                            'x: ' + Highcharts.numberFormat(event.xAxis[0].value, 2) + ', y: ' + Highcharts.numberFormat(event.yAxis[0].value, 2),
                            event.xAxis[0].axis.toPixels(event.xAxis[0].value),
                            event.yAxis[0].axis.toPixels(event.yAxis[0].value)
                        )
                            .attr({
                                fill: Highcharts.getOptions().colors[0],
                                padding: 10,
                                r: 5,
                                zIndex: 8
                            })
                            .css({
                                color: '#FFFFFF'
                            })
                            .add();

                    setTimeout(function () {
                        label.fadeOut();
                    }, 1000);
                }
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});