Highcharts.chart('container', {
    colors: ['rgba(124, 181, 236, 0.3)', 'rgba(144, 237, 125, 0.3)'],
    chart: {
        type: 'waterfall'
    },
    title: {
        text: 'Highcharts stacked waterfall (overlap)'
    },
    tooltip: {
        shared: true
    },
    xAxis: {
        categories: ['0', '1', '2', '1. Intermediate Sum', '4',  '2. Intermediate Sum', '6', 'Sum']
    },
    yAxis: {
        tickInterval: 10
    },
    plotOptions: {
        series: {
            stacking: 'overlap',
            lineWidth: 1
        }
    },
    series: [{
        zIndex: 1,
        upColor: {
            pattern: {
                color: '#15af15',
                width: 20,
                height: 20,
                opacity: 0.6,
                path: {
                    d: 'M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18',
                    strokeWidth: 4
                }
            }
        },
        color: {
            pattern: {
                color: '#0088ff',
                width: 20,
                height: 20,
                opacity: 0.6,
                path: {
                    d: 'M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18',
                    strokeWidth: 4
                }
            }
        },
        data: [20, -10, 40, {
            isIntermediateSum: true,
            color: {
                pattern: {
                    color: '#0A500A',
                    width: 20,
                    height: 20,
                    opacity: 0.6,
                    path: {
                        d: 'M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18',
                        strokeWidth: 4
                    }
                }
            }
        }, -10, {
            isIntermediateSum: true,
            color: {
                pattern: {
                    color: '#003E74',
                    width: 20,
                    height: 20,
                    opacity: 0.6,
                    path: {
                        d: 'M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18',
                        strokeWidth: 4
                    }
                }
            }
        }, -20, {
            isSum: true,
            color: {
                pattern: {
                    color: '#0A500A',
                    width: 20,
                    height: 20,
                    opacity: 0.6,
                    path: {
                        d: 'M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18',
                        strokeWidth: 4
                    }
                }
            }
        }]
    }, {
        zIndex: 0,
        upColor: 'rgba(21, 175, 21, 0.3)',
        color: 'rgba(0, 136, 255, 0.3)',
        data: [20, 40, -10, {
            isIntermediateSum: true,
            color: 'rgba(10, 80, 10, 0.3)'
        }, 30, {
            isIntermediateSum: true,
            color: 'rgba(10, 80, 10, 0.3)'
        }, -20, {
            isSum: true,
            color: 'rgba(10, 80, 10, 0.3)'
        }]
    }]
});