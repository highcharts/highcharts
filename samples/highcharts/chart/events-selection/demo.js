$(function () {

    // create the chart
    $('#container').highcharts({
        chart: {
            events: {
                selection: function (event) {
                    var text,
                        label;
                    if (event.xAxis) {
                        text = 'min: ' + Highcharts.numberFormat(event.xAxis[0].min, 2) + ', max: ' + Highcharts.numberFormat(event.xAxis[0].max, 2);
                    } else {
                        text = 'Selection reset';
                    }
                    label = this.renderer.label(text, 100, 120)
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
            },
            zoomType: 'x'
        },
        title: {
            text: 'Chart selection demo'
        },
        subtitle: {
            text: 'Click and drag the plot area to draw a selection'
        },

        series: [{
            type: 'column',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4].reverse()
        }]
    });
});