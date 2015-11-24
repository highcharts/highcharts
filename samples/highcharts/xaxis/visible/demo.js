$(function () {

    // Configure the chart
    $('#container').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'Highcharts axis visibility'
        },

        xAxis: {
            categories: ['Apples', 'Pears', 'Oranges', 'Peaches']
        },

        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Fruit'
            },
            visible: false
        },

        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },

        series: [{
            data: [1, 3, 2, 4],
            name: 'Ola'
        }, {
            data: [5, 4, 5, 2],
            name: 'Kari'
        }]

    });

    var yVis = false,
        xVis = true;
    $('#toggle-y').click(function () {
        yVis = !yVis;
        $('#container').highcharts().yAxis[0].update({
            visible: yVis
        });
    });
    $('#toggle-x').click(function () {
        xVis = !xVis;
        $('#container').highcharts().xAxis[0].update({
            visible: xVis
        });
    });
});