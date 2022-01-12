Highcharts.chart('container', {

    tooltip: {
        formatter: function () {
            const basicInformation = 'The value for <b>' + this.x +
            '</b> is <b>' + this.y + '</b>',
                extraInformation = this.point.extraInfrmation || '';

            return basicInformation + '<br>' + extraInformation;
        }
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [
            29.9,
            {
                y: 71.5,
                extraInfrmation: 'First month when XYZ introduced.'
            },
            106.4,
            129.2,
            144.0,
            176.0,
            {
                y: 135.6,
                extraInfrmation: 'The XYZ was missing.'
            },
            148.5,
            216.4,
            {
                y: 194.1,
                extraInfrmation: 'Changes to the XYZ introduced.'
            },
            95.6,
            54.4
        ]
    }]
});
