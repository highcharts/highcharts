$(function () {
    var chart = new Highcharts.Chart({

        chart: {
            renderTo: 'container'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        series: [{
            data: [1,3,2,4]
        }]
    });


    $('#settitle').click(function (event) {
        chart.setTitle({
            text: 'In Highcharts <= 3.0.9 the chart<br>didn\'t adapt to updated title size'
        }, {
            text: 'Now it does'
        });
    });

});