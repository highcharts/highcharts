$(function () {
    $('#container').highcharts({
    
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            id: 'series-1',
            name: 'First series',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            id: 'series-1',
            name: 'Second series',
            data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]
        }]
    });


    // The button action
    $('#button').click(function() {
        var chart = $('#container').highcharts(),
            series = chart.get('series-1');
        alert ('The first series\' name is '+ series.name);
    });
});