$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Rounding error in Highcharts 3.0.8 caused too many decimals for Oranges'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total fruit consumption'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    rotation: 0
                }
            }
        },
        series: [{
            data: [5, 3, 4.00, 7.13, 2.134]
        }, {
            data: [2.123, 2.423, 3, 2, 1]
        }, {
            data: [3.913, 12.000, 18.371, 7.333, 18.372]
        }]
    });
});

