
var chart = Highcharts.stockChart('container', {
    xAxis: {
        id: 'x-axis'
    },
    rangeSelector: {
        selected: 1
    },
    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});

// the button action
$('#button').click(function () {
    alert('The axis object: ' + chart.get('x-axis'));
});
