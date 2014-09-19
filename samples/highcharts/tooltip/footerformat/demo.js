$(function () {
    $('#container').highcharts({

        title: {
            text: 'Tooltip footer format demo'
        },

        subtitle: {
            text: 'The tooltip should provide a HTML table where the table is closed in the footerFormat'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: '<small>{point.key}</small><table>',
            pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
                '<td style="text-align: right"><b>{point.y} EUR</b></td></tr>',
            footerFormat: '</table>',
            valueDecimals: 2
        },

        series: [{
            name: 'Short',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            name: 'Long named series',
            data: [129.9, 171.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 195.6, 154.4].reverse()
        }]

    });
});