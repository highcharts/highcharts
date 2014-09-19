$(function () {
    $('#container').highcharts({

        title: {
            text: 'Highcharts data delimiters demo'
        },

        xAxis: {
            type: 'category'
        },

        data: {
            csv: document.getElementById('csv').innerHTML,
            itemDelimiter: ':',
            lineDelimiter: ';'
        }
    });
});