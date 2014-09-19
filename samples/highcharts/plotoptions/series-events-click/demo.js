$(function () {
    $('#container').highcharts({
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                cursor: 'pointer',
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

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});