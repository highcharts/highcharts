// Data retrieved from https://companiesmarketcap.com/
Highcharts.chart('container', {
    chart: {
        type: 'area',
        inverted: true
    },
    title: {
        text: 'Alibaba and Meta (Facebook) revenue'
    },
    accessibility: {
        keyboardNavigation: {
            seriesNavigation: {
                mode: 'serialize'
            }
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -150,
        y: 100,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
    },
    xAxis: {
        categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']
    },
    yAxis: {
        labels: {
            formatter(axis) {
                return axis.value / 100 + ' B';
            }
        },
        title: {
            text: 'Revenue ($)'
        }
    },
    plotOptions: {
        area: {
            fillOpacity: 0.5
        }
    },
    series: [{
        name: 'Alibaba',
        data: [1144, 1489, 2140, 3403, 5152, 7049, 9446, 12944]
    }, {
        name: 'Meta (Facebook)',
        data: [1149, 1708, 2688, 3994, 5501, 6965, 8417, 11793]
    }]
});
