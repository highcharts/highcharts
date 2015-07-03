$(function () {
    $('#container').highcharts({

        title: {
            text: 'Series afterAnimate event demo'
        },

        subtitle: {
            text: 'A label should appear on the plot area after animate'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                events: {
                    afterAnimate: function () {
                        this.chart.renderer.label(this.name + ' has appeared', 100, 70)
                            .attr({
                                padding: 10,
                                fill: Highcharts.getOptions().colors[0]
                            })
                            .css({
                                color: 'white'
                            })
                            .add();
                    }
                }
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});