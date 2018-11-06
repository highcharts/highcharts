var today = +(new Date().setHours(0, 0, 0, 0)),
    msDay = 24 * 60 * 60 * 1000;

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
            indentation: 0
        }
    }],
    series: [{
        name: 'Project 1',
        data: [{
            id: 'a1',
            name: 'Node 1',
            x: today
        }, {
            id: 'a2',
            parent: 'a1',
            name: 'Node 1.1',
            x: today + 1 * msDay
        }, {
            id: 'a3',
            parent: 'a2',
            name: 'Node 1.1.1',
            x: today + 2 * msDay
        }, {
            id: 'a4',
            parent: 'a2',
            name: 'Node 1.1.1',
            x: today + 3 * msDay
        }]
    }, {
        name: 'Project 2',
        data: [{
            id: 'b1',
            name: 'Node 1',
            x: today + 4 * msDay
        }, {
            id: 'b2',
            parent: 'b1',
            name: 'Node 1.2',
            x: today + 5 * msDay
        }, {
            id: 'b3',
            parent: 'b1',
            name: 'Node 1.1',
            x: today + 6 * msDay
        }, {
            id: 'b4',
            parent: 'b2',
            name: 'Node 1.2.1',
            x: today + 7 * msDay
        }]
    }]
});
