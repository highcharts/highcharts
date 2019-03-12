Highcharts.chart('container', {

    title: {
        text: 'Highcharts with a split tooltip formatter'
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        crosshair: true
    },

    tooltip: {
        formatter: function () {
            // The first returned item is the header, subsequent items are the
            // points
            return ['<b>' + this.x + '</b>'].concat(
                this.points.map(function (point) {
                    return point.series.name + ': ' + point.y + 'm';
                })
            );
        },
        split: true
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }, {
        data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]
    }]
});