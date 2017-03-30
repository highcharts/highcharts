
var chart = Highcharts.stockChart('container', {

    chart: {
        events: {
            addSeries: function () {
                alert('A series was added');
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
