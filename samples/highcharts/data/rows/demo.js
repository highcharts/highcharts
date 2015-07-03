$(function () {
    $('#container').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Data input as row arrays'
        },

        data: {
            rows: [
                [null, 'Ola', 'Kari'], // series names
                ['Apples', 1, 5], // category and values
                ['Pears', 4, 4], // category and values
                ['Oranges', 3, 2] // category and values
            ]
        }
    });
});