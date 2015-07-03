$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },

        title: {
            text: 'Linked axes'
        },

        xAxis: [{ // master axis
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000
        }, { // slave axis
            type: 'datetime',
            linkedTo: 0,
            opposite: true,
            tickInterval: 24 * 3600 * 1000,
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat('%a', this.value);
                }
            }
        }],

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
            pointStart: Date.UTC(2010, 0, 1),
            pointInterval: 24 * 3600 * 1000 // one day
        }]
    });
});