const commonBulletOptions = {
    chart: {
        inverted: true,
        marginLeft: 135,
        type: 'bullet',
        styledMode: true
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
};

Highcharts.chart('container1', Highcharts.merge(commonBulletOptions, {
    chart: {
        marginTop: 40
    },
    title: {
        text: '2017 YTD'
    },
    xAxis: {
        categories: ['<span class="hc-cat-title">Revenue</span><br/>U.S. $ (1,000s)']
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 150,
            className: 'plot-band-low'
        }, {
            from: 150,
            to: 225,
            className: 'plot-band-medium'
        }, {
            from: 225,
            to: 9e9,
            className: 'plot-band-high'
        }],
        title: null
    },
    series: [{
        data: [{
            y: 275,
            target: 250
        }]
    }],
    tooltip: {
        pointFormat: '<b>{point.y}</b> (with target at {point.target})'
    }
}));

Highcharts.chart('container2', Highcharts.merge(commonBulletOptions, {
    xAxis: {
        categories: ['<span class="hc-cat-title">Profit</span><br/>%']
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 150,
            className: 'plot-band-low'
        }, {
            from: 150,
            to: 225,
            className: 'plot-band-medium'
        }, {
            from: 225,
            to: 9e9,
            className: 'plot-band-high'
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
        }]
    }],
    tooltip: {
        pointFormat: '<b>{point.y}</b> (with target at {point.target})'
    }
}));


Highcharts.chart('container3', Highcharts.merge(commonBulletOptions, {
    xAxis: {
        categories: ['<span class="hc-cat-title">New Customers</span><br/>Count']
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 150,
            className: 'plot-band-low'
        }, {
            from: 150,
            to: 225,
            className: 'plot-band-medium'
        }, {
            from: 225,
            to: 9e9,
            className: 'plot-band-high'
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
        }]
    }],
    tooltip: {
        pointFormat: '<b>{point.y}</b> (with target at {point.target})'
    },
    credits: {
        enabled: true
    }
}));
