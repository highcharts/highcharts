const chart = Highcharts.chart('container', {
    chart: {
        _animation: {
            duration: 2000
        },
        type: 'bar'
    },
    series: [{
        data: [{
            name: 'A',
            y: 100
        }, {
            name: 'B',
            y: 80
        }, {
            name: 'C',
            y: 60
        }, {
            name: 'D',
            y: 40
        }],
        dataSorting: {
            enabled: true,
            matchByName: true
        }
    }],
    xAxis: {
        type: 'category',
        labels: {
            style: {
                fontSize: '2em'
            }
        }
        // gridLineWidth: 1,
        // tickWidth: 1
    },
    yAxis: {
        visible: false
    }
});

setTimeout(() => {
    chart.series[0].setData([{
        name: 'A',
        y: 100
    }, {
        name: 'B',
        y: 60
    }, {
        name: 'F',
        //name: 'C',
        y: 80
    }, {
        name: 'E',
        //name: 'D',
        y: 40
    }]);
}, 1234);
