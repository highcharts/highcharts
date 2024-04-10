Highcharts.chart('container', {
    data: {
        table: 'datatable'
    },
    chart: {
        type: 'column'
    },
    title: {
        text: 'Vitamins purchased by men vs. women'
    },
    subtitle: {
        text:
      'Source:<a href="http://www.roymorgan.com/findings/7956-australian-vitamin-market-december-2018-201904260734" target="_blank">Roy Morgan</a>'
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{y} %'
            }
        }
    },
    yAxis: {
        labels: { format: '{text}%' },

        title: {
            text: null
        }
    },
    colors: ['#058DC7', '#c7058d'],
    tooltip: {
        valueSuffix: ' %'
    }
});
