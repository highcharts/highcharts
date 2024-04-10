Highcharts.chart('container', {

    chart: {
        type: 'lollipop',
        inverted: true
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
            y: 1427647786
        }, {
            name: 'India',
            y: 1352642280
        }, {
            name: 'United States',
            y: 327096265
        }, {
            name: 'Indonesia',
            y: 267670543
        }, {
            name: 'Pakistan',
            y: 212228286
        }, {
            name: 'Brazil',
            y: 209469323
        }, {
            name: 'Nigeria',
            y: 195874683
        }, {
            name: 'Bangladesh',
            y: 161376708
        }, {
            name: 'Russia',
            y: 145734038
        }, {
            name: 'Mexico',
            y: 126190788
        }]
    }]

});