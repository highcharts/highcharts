$(function () {
    $('#container').highcharts({
        chart: {
            type: 'waterfall'
        },

        xAxis: {
            categories: ['Start', 'Product Revenue', 'Service Revenue', 'Positive Balance', 'Fixed Costs', 'Variable Costs', 'Balance']
        },

        legend: {
            enabled: false
        },

        series: [{
            upColor: '#89A54E',
            color: '#AA4643',
            data: [
                120000,
                569000,
                231000,
                {
                    isIntermediateSum: true,
                    color: '#0066FF'
                },
                -342000,
                -233000,
                {
                    isSum: true,
                    color: '#0066FF'
                }
            ],
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return '$' + Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k';
                }
            }
        }]
    });
});
