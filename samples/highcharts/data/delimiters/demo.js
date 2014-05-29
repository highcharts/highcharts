$(function () {
    $('#container').highcharts({

        title: {
            text: 'Highcharts data delimiters demo'
        },

        data: {
            csv: document.getElementById('csv').innerHTML,
            itemDelimiter: ':',
            lineDelimiter: ';'
        }
    });
});