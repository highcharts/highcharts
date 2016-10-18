$(function () {
    $('#container').highcharts({
        chart: {
            type: 'columnrange',
            inverted: true
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: [
                '<b>Category 1</b><br/>Category 1 subtitle',
                '<b>Category 2</b><br/>Category 2 subtitle',
                '<b>Category 3</b><br/>Category 3 subtitle',
                '<b>Category 4</b><br/>Category 4 subtitle',
                '<b>Category 5</b><br/>Category 5 subtitle',
                '<b>Category 6</b><br/>Category 6 subtitle',
                '<b>Category 7</b><br/>Category 7 subtitle',
                '<b>Category 8</b><br/>Category 8 subtitle',
                '<b>Category 9</b><br/>Category 9 subtitle'
            ]
        },
        yAxis: {
            type: 'datetime',
            min: 1388570331920,
            max: 1672567131920,
            tickInterval: 31536000000,
            title: {
                text: ''
            }
        },
        series: [{
            data: [{
                name: 100000,
                low: 1409565531926,
                high: 1693562331926
            }, {
                name: 10000,
                low: 1567331931926,
                high: 1725184731926
            }, {
                name: 10000,
                low: 1380621531926,
                high: 1569923931926
            }, {
                name: 600,
                low: 1396346331926,
                high: 1533117531926
            }, {
                name: 30000,
                low: 1380621531927,
                high: 1506851931927
            }, {
                name: 0,
                low: 1393667931927,
                high: 1412157531927
            }, {
                name: 1220,
                low: 1383299931927,
                high: 1446371931927
            }, {
                name: 40000,
                low: 1451642331927,
                high: 1606816731927
            }, {
                name: 48800,
                low: 1420106331927,
                high: 1543658331927
            }],
            dataLabels: {
                enabled: true,
                inside: true,
                align: 'center',
                formatter: function () {
                    return this.y > this.point.low ? this.point.name : null;
                },
                style: {
                    color: 'white'
                }
            }
        }]
    });
});