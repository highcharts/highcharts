$(function () {

    $('#container').highcharts({
        chart: {
            inverted: true,
            width: 400,
            marginLeft: 300
        },
        xAxis: {
            categories: [
                'style="text-decoration:underline; color:#f00"',
                'Some <span style="text-decoration:underline; color:#f00">styled</span> text',
                'href="http://www.highcharts.com"',
                'Some <a href="http://www.highcharts.com">linked</a> text'
            ]
        },
        title: {
            text: 'Highcharts <= 3.0.9. Attributes were applied outside elements.'
        },
        series: [{
            data: [1,2,1,2]
        }]
    });
});