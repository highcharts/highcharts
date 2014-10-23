$(function () {
    var chart = new Highcharts.Chart({

        chart: {
            renderTo: 'container',
            type: 'column'
        },
        title: {
            text: 'Z index changed after update'
        },
        plotOptions: {
            series: {
                groupPadding: 0.1,
                pointPadding: -0.2
            }
        },
        series: [{
            name: 'Series A',
            data: [1500],
            color: 'rgba(47,126,216,0.9)',
            index: 2,
            legendIndex: 0,
            zIndex: 10
        }, {
            name: 'Series B',
            data: [1000],
            color: 'rgba(139,188,33,0.9)',
            index: 1,
            legendIndex: 1,
            zIndex: 10

        }, {
            name: 'Series C',
            data: [1300],
            color: 'rgba(13,35,58,0.9)',
            index: 0,
            legendIndex: 2,
            zIndex: 10
        }]
    });

    $('#update').click(function () {
        chart.series[0].update({
            dataLabels: {
                enabled: true
            }
        });
    });
});