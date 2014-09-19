$(function () {
    $('#container').highcharts({

        chart: {
            events: {
                load: function () {
                    // Add before
                    this.series[0].addPoint({
                        x: -1,
                        y: 1000
                    });
                    // Add in the middle
                    this.series[0].addPoint({
                        x: 5.5,
                        y: 1000
                    });
                    // Append
                    this.series[0].addPoint({
                        y: 1000
                    });

                }
            }
        },

        title: {
            text: 'Series.addPoint() in the midddle didn\'t work in Highcharts 3.0.8'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });

});
