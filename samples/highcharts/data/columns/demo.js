$(function () {
    $('#container').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Data input as column arrays'
        },

        data: {
            columns: [
                [null, 'Apples', 'Pears', 'Oranges'], // categories
                ['Ola', 1, 4, 3], // first series
                ['Kari', 5, 4, 2] // second series
            ]
        }
    });
});