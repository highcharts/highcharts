$(function () {
    $('#container').highcharts({
        chart: {
            type: 'columnrange',
            margin: 75,
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50
            }
        },
        title: {
            text: 'Temperature variation by month'
        },
        subtitle: {
            text: 'Observed in Vik i Sogn, Norway, 2009'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature ( °C )'
            }
        },
        tooltip: {
            valueSuffix: '°C'
        },
        plotOptions: {
            columnrange: {
                depth: 25
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Temperatures',
            data: [
                [-9.7, 9.4],
                [-8.7, 6.5],
                [-3.5, 9.4],
                [-1.4, 19.9],
                [0.0, 22.6],
                [2.9, 29.5],
                [9.2, 30.7],
                [7.3, 26.5],
                [4.4, 18.0],
                [-3.1, 11.4],
                [-5.2, 10.4],
                [-13.5, 9.8]
            ]
        }]

    });

});