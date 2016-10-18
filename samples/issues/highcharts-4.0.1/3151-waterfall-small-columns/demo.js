$(function () {
    $('#container').highcharts({
        chart: {
            type: 'waterfall'
        },

        title: {
            text: 'Highcharts Waterfall'
        },

        subtitle: {
            text: 'Issue: Small columns didn\'t display'
        },

        xAxis: {
            type: 'category'
        },

        yAxis: {
            title: {
                text: 'USD'
            }
        },

        legend: {
            enabled: false
        },

        tooltip: {
            pointFormat: '<b>${point.y:,.2f}</b> USD'
        },
        plotOptions: {
            waterfall: {
                borderWidth: 1,
                borderColor: 'black'
            }
        },
        series: [{

            data: [{
                name: 'Start',
                y: 1200,
                color: 'blue'
            }, {
                name: 'Product Revenue',
                y: 5690
            }, {
                name: 'Small factor',
                y: 15
            }, {
                name: 'Small factor 2',
                y: 15
            }, {
                name: 'Service Revenue',
                y: 2310
            }, {
                name: 'Positive Balance',
                isIntermediateSum: true,
                color: 'blue'
            }, {
                name: 'Fixed Costs',
                y: -3420
            }, {
                name: 'Variable Costs',
                y: -2330
            }, {
                name: 'Balance',
                isSum: true,
                color: 'blue'
            }]
        }]
    });
});