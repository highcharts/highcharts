$(function () {
    $('#container').highcharts('StockChart', {

        plotOptions: {
            series: {
                events: {
                    click: function (event) {
                        alert(this.name + ' clicked\n' +
                            'Alt: ' + event.altKey + '\n' +
                            'Control: ' + event.ctrlKey + '\n' +
                              'Shift: ' + event.shiftKey + '\n');
                    }
                }
            }
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'ADBE',
            data: ADBE
        }, {
            name: 'MSFT',
            data: MSFT
        }]
    });
});