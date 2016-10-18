$(function () {
    $('#container').highcharts({
        chart: {
            type: 'waterfall'
        },
        title: {
            text: 'Negative Sum was not rendered correctly.'
        },
        series: [{
            data: [
                { y: -1 },
                { y: -1 },
                { isSum: true }]
        }]
    });
});