$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie'
        },

        plotOptions: {
            pie: {
                point: {
                    events: {
                        legendItemClick: function () {
                            if (!confirm('Do you want to toggle the visibility of this slice?')) {
                                return false;
                            }
                        }
                    }
                },
                showInLegend: true
            }
        },

        series: [{
            data: [
                ['Firefox',   44.2],
                ['IE7',       26.6],
                ['IE6',       20],
                ['Chrome',    3.1],
                ['Other',    5.4]
            ]
        }]
    });
});