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
                x: 0,
                name: 'Val',
                y: 1
            }, {
                x: 1,
                name: 'Val',
                y: 1
            }, {
                x: 2,
                name: 'Intermediate',
                isIntermediateSum: true
            }, {
                x: 3,
                name: 'Val',
                y: 1
            }, {
                x: 4,
                name: 'Val',
                y: 1
            }, {
                x: 5,
                name: 'Intermediate',
                isIntermediateSum: true
            }, {
                x: 6,
                name: 'Val',
                y: 1
            }, {
                x: 7,
                name: 'Sum',
                isSum: true
            }]

        }]
    });
});
