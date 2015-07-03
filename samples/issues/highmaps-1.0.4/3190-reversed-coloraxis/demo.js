$(function () {

    // Initiate the chart
    $('#container').highcharts('Map', {

        title: {
            text: 'Reversed color axis'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic',
            minColor: '#efecf3',
            maxColor: '#990041',
            reversed: true
        },

        series: [{
            data: [{
                path: 'M 0 0 L 1 0 1 1 0 1',
                value: 1
            }, {
                path: 'M 1 0 L 2 0 2 1 1 1',
                value: 999
            }]

        }]
    });
});