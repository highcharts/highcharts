$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            margin: 75,
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                frame: {
                    bottom: {
                        size: 1,
                        color: '#C0C0C0'
                    },
                    side: {
                        size: 1,
                        color: '#C0C0C0'
                    },
                    back: {
                        size: 1,
                        color: '#D0D0D0'
                    }
                }
            }
        },
        plotOptions: {
            column: {
                depth: 5,
                groupZPadding: 15
            }
        },
        series: [{
            data: [2, 3, null, 4, 0, 5]
        }]
    });
});