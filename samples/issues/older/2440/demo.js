$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            events: {
                load: function () {
                    this.series[0].update({ data: [1, 0, 1] });
                }
            }
        },
        title: {
            text: 'Bug in 3.0.7 caused orphaned stack labels after Series.update'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            stackLabels: {
                style: {
                    color: 'black'
                },
                enabled: true
            }
        },
        plotOptions: {
            column:{
                stacking: 'normal'
            }
        },

        series: [{
            data: [3, 3, 3]
        }, {
            data: [2, 1, 2]
        }]
    });

});