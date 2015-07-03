$(function () {
    $('#container').highcharts({

        title: {
            text: 'Highcharts data delimiters demo'
        },

        subtitle: {
            text: 'European style CSV'
        },

        xAxis: {
            type: 'category'
        },

        data: {
            csv: document.getElementById('csv').innerHTML,
            itemDelimiter: ';',
            lineDelimiter: '\n',
            decimalPoint: ','
        }
    });
});