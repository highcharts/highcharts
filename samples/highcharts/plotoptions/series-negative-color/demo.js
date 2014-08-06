$(function () {
    $('#container').highcharts({

        title: {
            text: 'Monthly temperatures in a random cold place'
        },
        subtitle: {
            text: 'All series should be blue below zero'
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
            name: 'Spline',
            type: 'spline',
            data: [-6.4, -5.2, -3.0, 0.2, 2.3, 5.5, 8.4, 8.3, 5.1, 0.9, -1.1, -4.0],
            pointStart: Date.UTC(2010, 0),
            pointInterval: 31 * 24 * 36e5,
            color: '#FF0000',
            negativeColor: '#0088FF'
        }, {
            name: 'Area',
            type: 'area',
            data: [-6.4, -5.2, -3.0, 0.2, 2.3, 5.5, 8.4, 8.3, 5.1, 0.9, -1.1, -4.0],
            pointStart: Date.UTC(2011, 0),
            pointInterval: 30 * 24 * 36e5,
            color: '#FF0000',
            negativeColor: '#0088FF'
        }, {
            name: 'Column',
            type: 'column',
            data: [-6.4, -5.2, -3.0, 0.2, 2.3, 5.5, 8.4, 8.3, 5.1, 0.9, -1.1, -4.0],
            pointStart: Date.UTC(2012, 0),
            pointInterval: 30 * 24 * 36e5,
            color: '#FF0000',
            negativeColor: '#0088FF'
        }]
    });
});