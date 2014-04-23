$(function () {
    $('#container').highcharts({
        title: {
            text: 'Halo options demonstrated'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                states: {
                    hover: {
                        halo: {
                            size: 9,
                            attributes: {
                                fill: Highcharts.getOptions().colors[2],
                                'stroke-width': 2,
                                stroke: Highcharts.getOptions().colors[1]
                            }
                        }

                    }
                }
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});