$(function () {
    $('#container').highcharts({

        chart: {
            marginBottom: 120,
            marginLeft: 80,
            width: 500
        },

        title: {
            text: 'Legend width aligned to plot area'
        },

        legend: {
            width: 400,
            floating: true,
            align: 'left',
            x: 70, // = marginLeft - default spacingLeft
            itemWidth: 70,
            borderWidth: 1
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