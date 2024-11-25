// THE CHART
Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        marginLeft: 150,
        marginRight: 150
    },
    title: {
        text: 'Highcharts Grid axis'
    },
    xAxis: [{
        id: 'bottom-datetime-axis',
        grid: {
            enabled: true
        },
        type: 'datetime',
        tickInterval: 1000 * 60 * 60 * 24, // Day
        labels: {
            format: '{value:%E}'
        },
        min: '2014-11-17',
        max: '2014-11-30'
    }, {
        id: 'bottom-linear-axis',
        grid: {
            enabled: true
        }
    }, {
        id: 'bottom-categories-axis',
        grid: {
            enabled: true
        },
        categories: [
            'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F',
            'S', 'S'
        ],
        min: 0,
        max: 12
    }, {
        grid: {
            enabled: true
        },
        type: 'datetime',
        opposite: true,
        tickInterval: 1000 * 60 * 60 * 24, // Day
        labels: {
            format: '{value:%E}',
            style: {
                fontSize: '1.2em'
            }
        },
        linkedTo: 0
    }, {
        grid: {
            enabled: true
        },
        type: 'datetime',
        opposite: true,
        tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
        labels: {
            format: '{value:Week %W}',
            style: {
                fontSize: '1.2em'
            }
        },
        linkedTo: 0
    }],
    yAxis: [{
        title: '',
        categories: ['Prototyping', 'Development', 'Testing'],
        reversed: true,
        opposite: true,
        grid: {
            enabled: true
        }
    }, {
        title: '',
        grid: {
            enabled: true
        },
        reversed: true,
        tickInterval: 1000 * 60 * 60 * 24, // Day
        type: 'datetime',
        labels: {
            format: '{value:%E}',
            style: {
                fontSize: '1.6em'
            }
        },
        min: '2014-11-19',
        max: '2014-11-22'
    }, {
        grid: {
            enabled: true
        },
        reversed: true,
        tickInterval: 1000 * 60 * 60 * 24, // Day
        type: 'datetime',
        labels: {
            format: '{value:%E}',
            style: {
                fontSize: '24px'
            }
        },
        min: '2014-11-19',
        max: '2014-11-22'
    }],
    series: [{
        name: 'Project 1',
        borderRadius: 10,
        xAxis: 0,
        data: [{
            x: '2014-11-18',
            y: 0
        }, {
            x: '2014-11-20',
            y: 1
        }, {
            x: '2014-11-26',
            y: 0
        }, {
            x: '2014-11-23',
            y: 2
        }]
    }, {
        name: 'Project 2',
        borderRadius: 10,
        visible: false,
        xAxis: 0,
        data: [{
            x: '2014-11-24',
            y: 1
        }, {
            x: '2014-11-27',
            y: 2
        }, {
            x: '2014-11-27',
            y: 1
        }, {
            x: '2014-11-18',
            y: 2
        }]
    }, {
        name: 'Project 3',
        borderRadius: 10,
        xAxis: 2,
        yAxis: 2,
        data: [{
            x: 7,
            y: '2014-11-19'
        }, {
            x: 7,
            y: '2014-11-20'
        }, {
            x: 12,
            y: '2014-11-21'
        }]
    }, {
        name: 'Project 4',
        borderRadius: 10,
        xAxis: 1,
        data: [{
            x: 1,
            y: 1
        }, {
            x: 3,
            y: 2
        }]
    }]
});
