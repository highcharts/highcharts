$(function () {
    $('#container').highcharts({

        xAxis: {
            type: 'category',
            labels: {
                style: {
                    fontSize: '20px'
                }
            }
        },

        series: [{
            data: [{
                name: 'Eins',
                y: 1
            }, {
                name: 'Zwei',
                y: 2
            }, {
                name: 'Drei',
                y: 3
            }]
        }]

    });

    $('button').click(function () {
        $('#container').highcharts().series[0].points[0].update({
            name: 'Vier',
            y: 4
        });
    });
});