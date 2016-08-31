$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },

        title: {
            text: 'Individually enabling/disabling data labels'
        },

        series: [{
            name: 'Generally enabled, one disabled',
            dataLabels: {
                enabled: true
            },
            data: [1, 1, {
                dataLabels: {
                    enabled: false
                },
                y: 1
            }, 1]
        }, {
            name: 'Generally disabled, one enabled',
            dataLabels: {
                enabled: false
            },
            data: [2, 2, {
                dataLabels: {
                    enabled: true
                },
                y: 2
            }, 2]
        }]
    });
});