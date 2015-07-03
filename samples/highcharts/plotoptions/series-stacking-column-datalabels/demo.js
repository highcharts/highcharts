$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },

        title: {
            text: 'Stacked column with labels'
        },

        subtitle: {
            text: 'Overlapping labels should be hidden'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        yAxis: {
            stackLabels: {
                enabled: true
            }
        },

        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },

        series: [{
            data: [1, 5, 2, 4]
        }, {
            data: [6, 5, -1, 1]
        }, {
            data: [-6, 5, -1, 1.1]
        }],

        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
        }
    });
});