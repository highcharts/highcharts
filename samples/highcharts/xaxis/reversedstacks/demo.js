
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    title: {
        text: 'Different xAxis.reversedStacks behaviour.'
    },

    xAxis: [{
        height: '50%',
        opposite: true,
        reversed: true,
        reversedStacks: false,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }, {
        top: '50%',
        height: '50%',
        reversed: true,
        reversedStacks: true,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }],

    yAxis: [{
        height: '50%',
        offset: 0,
        title: {
            text: 'reversedStacks: <br>false'
        }
    }, {
        height: '50%',
        top: '50%',
        offset: 0,
        title: {
            text: 'reversedStacks: <br>true'
        }
    }],

    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },

    series: [{
        stack: 'first',
        color: Highcharts.getOptions().colors[0],
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }, {
        stack: 'second',
        color: Highcharts.getOptions().colors[1],
        data: [144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2]
    }, {
        xAxis: 1,
        yAxis: 1,
        stack: 'third',
        color: Highcharts.getOptions().colors[0],
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }, {
        xAxis: 1,
        yAxis: 1,
        stack: 'fourth',
        color: Highcharts.getOptions().colors[1],
        data: [144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2]
    }]
});