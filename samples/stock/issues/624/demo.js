$(function () {
    var chart = new Highcharts.StockChart({

        title: {
            text: 'Adding series dynamically failed in Highstock <= 1.3.7'
        },
        chart: {
            renderTo: 'container',
            events: {
                load: function () {
                    this.addSeries({
                        name: 'ADBE',
                        data: ADBE
                    });
                }
            }
        },

        rangeSelector: {
            selected: 1
        }
    });
});