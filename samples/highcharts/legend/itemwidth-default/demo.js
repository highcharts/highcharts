$(function () {
    $('#container').highcharts({

        chart: {
            marginBottom: 120,
            width: 500
        },

        legend: {
        },

        series: [{
            data: [6, 4, 2],
            name: 'First'
        }, {
            data: [7, 3, 2],
            name: 'Second'
        }, {
            data: [9, 4, 8],
            name: 'Third'
        }, {
            data: [1, 2, 6],
            name: 'Fourth'
        }, {
            data: [4, 6, 4],
            name: 'Fifth'
        }, {
            data: [1, 2, 7],
            name: 'Sixth'
        }, {
            data: [4, 2, 5],
            name: 'Seventh'
        }, {
            data: [8, 3, 2],
            name: 'Eighth'
        }, {
            data: [4, 5, 6],
            name: 'Ninth'
        }]
    });
});