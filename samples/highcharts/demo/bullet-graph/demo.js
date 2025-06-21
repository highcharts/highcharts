Highcharts.setOptions({
    chart: {
        inverted: true,
        marginLeft: 135,
        type: 'bullet'
    },
    title: {
        text: null
    },
    legend: {
        enabled: false
    },
    yAxis: {
        gridLineWidth: 0
    },
    plotOptions: {
        series: {
            pointPadding: 0.25,
            borderWidth: 0,
            targetOptions: {
                width: '200%'
            }
        }
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    }
});

Highcharts.chart('container1', {
    chart: {
        marginTop: 40
    },
    title: {
        text: '2024 YTD'
    },
    xAxis: {
        categories: [
            '<span class="hc-cat-title">Revenue</span><br/>U.S. $ ' +
            '(1,000s)'
        ]
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 150,
            color: '#aaa'
        }, {
            from: 150,
            to: 225,
            color: '#ccc'
        }, {
            from: 225,
            to: 9e9,
            color: '#eee'
        }],
        title: null
    },
    series: [{
        data: [{
            y: 275,
            target: 250
        }],
        color: '#66f'
    }],
    tooltip: {
        pointFormat: '<b>{point.y}</b> (with target at {point.target})'
    }
});

Highcharts.chart('container2', {
    xAxis: {
        categories: ['<span class="hc-cat-title">Profit</span><br/>%']
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 20,
            color: '#aaa'
        }, {
            from: 20,
            to: 25,
            color: '#ccc'
        }, {
            from: 25,
            to: 100,
            color: '#eee'
        }],
        labels: {
            format: '{value}%'
        },
        title: null
    },
    series: [{
        data: [{
            y: 22,
            target: 27
        }],
        color: '#F06D00'
    }],
    tooltip: {
        pointFormat: '<b>{point.y}</b> (with target at {point.target})'
    }
});


Highcharts.chart('container3', {
    xAxis: {
        categories: [
            '<span class="hc-cat-title">New Customers</span><br/>' +
            'Count'
        ]
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 1400,
            color: '#aaa'
        }, {
            from: 1400,
            to: 2000,
            color: '#ccc'
        }, {
            from: 2000,
            to: 9e9,
            color: '#eee'
        }],
        labels: {
            format: '{value}'
        },
        title: null
    },
    series: [{
        data: [{
            y: 1650,
            target: 2100
        }],
        color: '#F06D00'
    }],
    tooltip: {
        pointFormat: '<b>{point.y}</b> (with target at {point.target})'
    },
    credits: {
        enabled: true
    }
});