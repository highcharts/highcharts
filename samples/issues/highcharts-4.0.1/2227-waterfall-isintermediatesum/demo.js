$(function () {
    $('#container').highcharts({
        chart: {
            type: 'waterfall'
        },

        title: {
            text: 'Highcharts Waterfall'
        },

        xAxis: {
            type: 'category'
        },

        legend: {
            enabled: false
        },

        series: [{
            data: [{
                name: 'Val',
                y: 1
            }, {
                name: 'Val',
                y: 1
            }, {
                name: 'Intermediate',
                isIntermediateSum: true
            }, {
                name: 'Val',
                y: 1
            }, {
                name: 'Val',
                y: 1
            }, {
                name: 'Intermediate',
                isIntermediateSum: true
            }, {
                name: 'Val',
                y: 1
            }, {
                name: 'Sum',
                isSum: true
            }]

        }]
    });
});
