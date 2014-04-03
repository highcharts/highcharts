$(function () {
    $('#container').highcharts({
        title: {
            text: 'Browser market shares at a specific website, 2010Browser market shares at a specific website, 2010Browser market shares at a specific website, 2010Browser market shares at a specific website, 2010Browser market shares at a specific website, 2010'
        },
        series: [{
            type: 'pie',
            data: [1]
        }]
    });
    
    $('#small').click(function () {
        $('#container').highcharts().setSize(300);
    });

});
