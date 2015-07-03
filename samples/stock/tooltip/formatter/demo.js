$(function () {
    $('#container').highcharts('StockChart', {

        tooltip: {
            formatter: function () {
                var s = '<b>' + Highcharts.dateFormat('%A, %b %e, %Y', this.x) + '</b>';

                $.each(this.points, function () {
                    s += '<br/>1 USD = ' + this.y + ' EUR';
                });

                return s;
            }
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});