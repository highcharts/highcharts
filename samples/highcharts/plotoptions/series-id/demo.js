$(function () {
    var chart = Highcharts.chart('container', {

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
    $('#button').click(function () {
        var series = chart.get('series-1'),
            text = 'The first series\' name is ' + series.name;
        if (!chart.lbl) {
            chart.lbl = chart.renderer.label(text, 100, 70)
                .attr({
                    padding: 10,
                    r: 5,
                    fill: Highcharts.getOptions().colors[1],
                    zIndex: 5
                })
                .css({
                    color: '#FFFFFF'
                })
                .add();
        } else {
            chart.lbl.attr({
                text: text
            });
        }
    });
});
