
var chart = Highcharts.stockChart('container', {

    chart: {
        events: {
            redraw: function () {
                alert('The chart is being redrawn');
            }
        }
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'MSFT',
        data: MSFT
    }]
});


// activate the button
$('#button').click(function () {
    chart.addSeries({
        name: 'ADBE',
        data: ADBE
    });

    $(this).attr('disabled', true);
});
