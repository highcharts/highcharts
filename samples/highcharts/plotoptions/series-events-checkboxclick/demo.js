$(function () {
    $('#container').highcharts({
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                events: {
                    checkboxClick: function (event) {
                        var text = 'The checkbox is now ' + event.checked;
                        if (!this.chart.lbl) {
                            this.chart.lbl = this.chart.renderer.label(text, 100, 70)
                                .attr({
                                    padding: 10,
                                    r: 5,
                                    fill: Highcharts.getOptions().colors[1],
                                    zIndex: 5
                                })
                                .css({
                                    color: '#FFFFFF'
                                })
                                .add();
                        } else {
                            this.chart.lbl.attr({
                                text: text
                            });
                        }
                    }
                },
                showCheckbox: true
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});