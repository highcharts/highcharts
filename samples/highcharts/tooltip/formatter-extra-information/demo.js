Highcharts.chart('container', {

    tooltip: {
        formatter: function () {
            const basicInformation = 'The value for <b>' + this.x +
                '</b> is <b>' + this.y + '</b>',
                firstSeriesExtra = this.point.extraInfrmation || '',
                custom = this.series.options.custom,
                secondSeriesExtra = custom ? custom.extraTooltipInformation[this.point.x] : '',
                extraInformation = this.series.name === 'Series 1' ?
                    firstSeriesExtra :
                    `Some information: ${secondSeriesExtra} %`;

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
    }, {
        data: [
            194.1,
            95.6,
            54.4,
            29.9,
            71.5,
            106.4,
            129.2,
            144.0,
            176.0,
            135.6,
            148.5,
            216.4],
        custom: {
            extraTooltipInformation: [13, 1, 4, 5, -6, 8, 9, -1, 3, 1, 4, -2]
        }
    }]
});
