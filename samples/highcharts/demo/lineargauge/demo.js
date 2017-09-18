Highcharts.setOptions({
    chart: {
        inverted: true,
        type: 'lineargauge',
        marginLeft: 20,
        plotBorderWidth: 0.5
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
        minorGridLineWidth: 0,
        minorTickInterval: 'auto',
        minorTickLength: 5,
        minorTickWidth: 1,
        title: {
            text: ''
        }
    },
    plotOptions: {
        series: {
            pointPadding: 0,
            borderWidth: 1,
            borderColor: '#FFFFFF',
            color: '#000000',
            targetOptions: {
                length: '150%',
                width: '100%',
                baseLength: '0%',
                indent: '20%',
                lineWidth: 1,
                lineZIndex: 1
            },
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
            color: '#666'
        }, {
            from: 20,
            to: 70,
            color: '#999'
        }, {
            from: 70,
            to: 100,
            color: '#bbb'
        }]
    },
    series: [{
        onPoint: false,
        showColumn: false,
        showLine: true,
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
            color: '#666'
        }, {
            from: 20,
            to: 70,
            color: '#999'
        }, {
            from: 70,
            to: 100,
            color: '#bbb'
        }]
    },
    series: [{
        onPoint: true,
        showColumn: false,
        showLine: false,
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
            color: '#666'
        }, {
            from: 20,
            to: 70,
            color: '#999'
        }, {
            from: 70,
            to: 100,
            color: '#bbb'
        }]
    },
    series: [{
        onPoint: true,
        showColumn: true,
        showLine: false,
        data: [73]
    }]
});