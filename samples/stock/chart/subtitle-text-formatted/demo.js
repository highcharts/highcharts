$(function () {
    $('#container').highcharts('StockChart', {

        title: {
            text: 'The title'
        },

        subtitle: {
            text: 'This text has <b>bold</b>, <i>italic</i>, <span style="color: red">coloured</span>, <a href="http://example.com">linked</a> and <br/>line-broken text.'
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});