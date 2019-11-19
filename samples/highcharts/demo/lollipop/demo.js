Highcharts.chart('container', {

    chart: {
        type: 'lollipop'
    },

    legend: {
        enabled: false
    },

    subtitle: {
        text: '2018'
    },

    title: {
        text: 'Top 10 Countries by Population'
    },

    tooltip: {
        shared: true
    },

    xAxis: {
        type: 'category'
    },

    yAxis: {
        title: {
            text: 'Population'
        }
    },

    series: [{
        name: 'Population',
        data: [{
            name: 'China',
            low: 1427647786
        }, {
            name: 'India',
            low: 1352642280
        }, {
            name: 'United States',
            low: 327096265
        }, {
            name: 'Indonesia',
            low: 267670543
        }, {
            name: 'Pakistan',
            low: 212228286
        }, {
            name: 'Brazil',
            low: 209469323
        }, {
            name: 'Nigeria',
            low: 195874683
        }, {
            name: 'Bangladesh',
            low: 161376708
        }, {
            name: 'Russia',
            low: 145734038
        }, {
            name: 'Mexico',
            low: 126190788
        }]
    }]

});