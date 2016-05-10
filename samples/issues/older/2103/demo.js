$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie'
        },

        title: {
            text: 'All zeroes or all null pies.<br/>Caused infinite loop.'
        },

        series: [{
            data: [0,0,0],
            center: ['30%', '30%']
        }, {
            data: [null, null, null],
            center: ['70%', '30%']
        }, {
            data: [],
            center: ['30%', '70%']
        }, {
            center: ['70%', '70%']
        }]

    });
});