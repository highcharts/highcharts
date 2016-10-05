console.clear();
$(function () {

    // THE CHART
    Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Highcharts PartFillPoint'
        },
        series: [{
            data: [{
                x: 0,
                y: 107,
                partialFill: 25
            }, {
                x: 1,
                y: 31,
                partialFill: 50
            }, {
                x: 2,
                y: 635,
                partialFill: 75
            }]
        }]
    });
});
