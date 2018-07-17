
var chart = Highcharts.stockChart('container', {

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});

$('#button').click(function () {
    chart.series[0].remove();
    this.disabled = true;

});
