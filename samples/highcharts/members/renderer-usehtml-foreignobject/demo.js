Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'HTML title <i class="fa fa-check"></i>',
        useHTML: true
    },

    subtitle: {
        text: `<table style="border: 1px solid silver">
            <tr><th>This</th><td>is</td></tr>
            <tr><th>a</th><td>table</td></tr>
        </table>`,
        useHTML: true
    },

    yAxis: {
        labels: {
            useHTML: true
        },
        title: {
            text: 'HTML y-axis <i class="fa fa-check"></i>',
            useHTML: true
        }
    },

    xAxis: {
        type: 'category',
        labels: {
            useHTML: true,
            format: '{value} <i class="fa fa-check"></i>',
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },

    legend: {
        useHTML: true
    },

    tooltip: {
        useHTML: true,
        footerFormat: `<table style="border: 1px solid silver">
            <tr><th>This</th><td>is</td></tr>
            <tr><th>a</th><td>table</td></tr>
        </table>`
    },

    series: [{
        data: [
            ['Ein', 1234],
            ['To', 4567],
            ['Tre', 2345],
            ['Fire', 3456]
        ],
        dataLabels: {
            enabled: true,
            useHTML: true,
            format: '{y} <i class="fa fa-check"></i>',
            rotation: -45
        },
        name: 'HTML Series <i class="fa fa-check"></i>'
    }],

    exporting: {
        allowHTML: true
    }

});
