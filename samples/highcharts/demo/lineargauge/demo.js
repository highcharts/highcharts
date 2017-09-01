Highcharts.setOptions({
    chart: {
        type: 'lineargauge',
        marginLeft: 20,
        plotBorderWidth: 0.5,
        plotBorderColor: '#5C5C5C'
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: true
    },
    legend: {
        enabled: false
    },
    xAxis: {
        tickWidth: 0,
        lineWidth: 0,
        labels: {
            enabled: false
        }
    },
    yAxis: {
        min: 0,
        max: 100,
        tickInterval: 10,
        tickLength: 10,
        tickWidth: 1,
        tickColor: '#5C5C5C',
        minorGridLineWidth: 0,
        minorTickInterval: 'auto',
        minorTickLength: 5,
        minorTickWidth: 1,
        gridLineColor: '#5C5C5C',
        title: {
            text: ''
        }
    },
    plotOptions: {
        series: {
            pointPadding: 0,
            borderWidth: 1,
            borderColor: '#000000',
            targetTotalLength: '150%',
            targetWidth: '100%',
            targetBaseLength: '0%',
            targetIndent: '20%',
            targetLineWidth: 1,
            targetLineZIndex: 1,
            dataLabels: {
                enabled: true
            }
        }
    }
});

Highcharts.chart('container1', {
    title: {
        text: 'Target on axis, with line enabled, column disabled'
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 20,
            color: '#E35D5D'
        }, {
            from: 20,
            to: 70,
            color: '#E3BF5D'
        }, {
            from: 70,
            to: 100,
            color: '#5DE35D'
        }]
    },
    series: [{
        color: Highcharts.getOptions().colors[0],
        showColumn: false,
        targetLine: true,
        targetOnPoint: false,
        data: [85]
    }]
});

Highcharts.chart('container2', {
    title: {
        text: 'Target on point, with line disabled, column disabled'
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 20,
            color: '#E35D5D'
        }, {
            from: 20,
            to: 70,
            color: '#E3BF5D'
        }, {
            from: 70,
            to: 100,
            color: '#5DE35D'
        }]
    },
    series: [{
        color: Highcharts.getOptions().colors[1],
        showColumn: false,
        targetLine: false,
        targetOnPoint: true,
        data: [36]
    }]
});

Highcharts.chart('container3', {
    title: {
        text: 'Target on point, with line disabled, column enabled'
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 20,
            color: '#E35D5D'
        }, {
            from: 20,
            to: 70,
            color: '#E3BF5D'
        }, {
            from: 70,
            to: 100,
            color: '#5DE35D'
        }]
    },
    series: [{
        color: Highcharts.getOptions().colors[7],
        showColumn: true,
        targetLine: false,
        targetOnPoint: true,
        data: [73]
    }]
});

Highcharts.chart('container4', {
    title: {
        text: 'Multiple targets on one chart with different options each'
    },
    xAxis: {
        type: 'category',
        categories: ['I', 'II', 'III', 'IV'],
        gridLineWidth: 1,
        gridLineColor: '#5C5C5C',
        tickColor: '#5C5C5C',
        tickWidth: 1,
        labels: {
            enabled: true,
            align: 'left'
        }
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 20,
            color: '#E35D5D'
        }, {
            from: 20,
            to: 70,
            color: '#E3BF5D'
        }, {
            from: 70,
            to: 100,
            color: '#5DE35D'
        }]
    },
    series: [{
        showColumn: true,
        pointPadding: 0.3,
        colorByPoint: true,
        data: [{
            y: 33,
            showColumn: true,
            targetLine: false,
            targetOnPoint: true,
            targetTotalLength: '200%',
            targetWidth: '150%',
            targetBaseLength: '50%',
            targetIndent: '-50%',
            targetLineWidth: 1,
            targetLineZIndex: 1,
            targetBorderWidth: 5,
            targetColor: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, '#0000ff'],
                    [1, '#ff00ff']
                ]
            },
            targetBorderColor: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, '#ff00ff'],
                    [1, '#0000ff']
                ]
            },
            dataLabels: {
                enabled: false
            }
        }, {
            y: 92,
            showColumn: false,
            targetLine: false,
            targetOnPoint: true,
            targetTotalLength: '250%',
            targetWidth: '250%',
            targetBaseLength: '50%',
            targetIndent: '20%',
            targetLineWidth: 1,
            targetLineZIndex: 1,
            targetColor: '#9951DB'
        }, {
            y: 67,
            showColumn: false,
            targetLine: true,
            targetOnPoint: false,
            targetTotalLength: 20,
            targetWidth: 20,
            targetBaseLength: '0%',
            targetIndent: '0%',
            targetLineWidth: 1,
            targetLineZIndex: 1,
            targetColor: '#FF0000'
        }, {
            y: 15,
            showColumn: true,
            targetLine: true,
            targetOnPoint: true,
            targetTotalLength: 50,
            targetWidth: 10,
            targetBaseLength: '50%',
            targetIndent: '10%',
            targetLineWidth: 1,
            targetLineZIndex: 1,
            targetColor: '#2FA312'
        }]
    }]
});