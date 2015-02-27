$(function () {
    $('#container').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Annual precipitation'
        },

        subtitle: {
            text: 'Highcharts data labels with callout shape'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                dataLabels: {
                    shape: 'callout',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    style: {
                        color: '#FFFFFF',
                        textShadow: 'none'
                    }
                }
            }
        },

        series: [{
            data: [{
                y: 29.9,
                dataLabels: {
                    enabled: true,
                    format: 'January<br><span style="font-size: 1.3em">Dryest</span>',
                    verticalAlign: 'bottom',
                    y: -10
                }
            }, {
                y: 71.5
            }, {
                y: 106.4
            }, {
                y: 129.2
            }, {
                y: 144.0
            }, {
                y: 176.0
            }, {
                y: 135.6
            }, {
                y: 148.5
            }, {
                y: 216.4,
                dataLabels: {
                    enabled: true,
                    format: 'September<br><span style="font-size: 1.3em">Wettest</span>',
                    align: 'right',
                    verticalAlign: 'middle',
                    x: -35

                }
            }, {
                y: 194.1
            }, {
                y: 95.6
            }, {
                y: 54.4
            }]
        }]
    });
});