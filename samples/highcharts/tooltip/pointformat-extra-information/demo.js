Highcharts.chart('container', {

    tooltip: {
        pointFormat: 'The value for <b>{point.x}</b> is <b>{point.y}</b><br>{point.custom.extraInformation}'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [
            29.9,
            {
                y: 71.5,
                custom: {
                    extraInformation: 'First month when XYZ introduced.'
                }
            },
            106.4,
            129.2,
            144.0,
            176.0,
            {
                y: 135.6,
                custom: {
                    extraInformation: 'The XYZ was missing.'
                }
            },
            148.5,
            216.4,
            {
                y: 194.1,
                custom: {
                    extraInformation: 'Changes to the XYZ introduced.'
                }
            },
            95.6,
            54.4
        ]
    }]
});
