$(function () {
    $('#container').highcharts({
        chart: {
            type: 'bar',
            width: 316
        },
        title: {
            text: 'Highcharts <= 3.0.9, data labels on John series disappeared incertain sizes'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total fruit consumption'
            }
        },
        plotOptions: {
            bar: {
                stacking: 'percent',
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    color: 'white'
                }
            }
        },
        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 25]
        }, {
            name: 'Jane',
            data: [2, 2, 3, 2, 1]
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 68]
        }]
    });

});