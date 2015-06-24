$(function () {

    $('#container').highcharts({
        chart: {
            type: 'funnel',
            marginRight: 100
        },
        title: {
            text: 'Sales funnel'
        },
        subtitle: {
            text: 'Hidden points are not considered for layout'
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            verticalAlign: 'bottom'
        },
        series: [{
            name: 'Unique users',
            showInLegend: true,
            dataLabels: {
                enabled: false
            },
            keys: ['name', 'y', 'visible'],
            data: [
                ['Website visits',   15654],
                ['Downloads',       4064],
                ['Requested price list', 1987, false],
                ['Invoice sent',    976],
                ['Finalized',    846]
            ]
        }]
    });
});