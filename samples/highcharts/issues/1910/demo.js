$(function () {
    $('#container').highcharts({
        chart: {
            type: 'area'
        },

        title: {
            text: 'Stacking of mixed positive and negative values'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        tooltip: {
            shared: true
        },

        series: [{
            data: [40, -20, 40, -10, 100]
        }, {
            data: [20, 40, -20, -40, 30]
        }]

    });
});