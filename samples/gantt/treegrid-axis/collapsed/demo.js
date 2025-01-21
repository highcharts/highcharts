// THE CHART
Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        marginLeft: 150,
        marginRight: 150
    },
    title: {
        text: 'Highcharts TreeGrid'
    },
    xAxis: [{
        type: 'datetime'
    }],
    yAxis: [{
        title: '',
        type: 'treegrid',
        labels: {
            align: 'left'
        }
    }],
    series: [{
        name: 'Project 1',
        data: [{
            collapsed: true,
            id: '1',
            name: 'Node 1',
            x: '2014-11-18'
        }, {
            collapsed: true,
            id: '2',
            parent: '1',
            name: 'Node 2',
            x: '2014-11-20'
        }, {
            id: '3',
            parent: '2',
            name: 'Node 3',
            x: '2014-11-26'
        }]
    }]
});
