Highcharts.chart('container', {

    chart: {
        type: 'heatmap',
        marginTop: 80,
        marginBottom: 40,
        plotBorderWidth: 1
    },
    title: {
        text: 'How people with color blindness see colors'
    },

    xAxis: {
        categories: ['Red', 'Blue', 'Yellow', 'Green']
    },

    yAxis: {
        categories: ['Normal vision', 'Deuteranomalia', 'Protanopia', 'Tritanopia'],
        title: null
    },

    colorAxis: {},

    legend: {
        enabled: false
    },

    tooltip: {
        formatter: function () {
            return 'How people with <b>' + this.series.yAxis.categories[this.point.y] + '</b> see <b>' + this.series.xAxis.categories[this.point.x] + '</b>';
        }
    },
    plotOptions: {
        series: {
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    },
    series: [{
        name: 'Sales per employee',
        borderWidth: 1,
        data: [{
            x: 0,
            y: 0,
            color: 'red'
        }, {
            x: 0,
            y: 1,
            color: '#b65b0a'
        }, {
            x: 0,
            y: 2,
            color: '#877a2c'
        }, {
            x: 0,
            y: 3,
            color: '#ea3535'
        }, {
            x: 1,
            y: 0,
            color: 'blue'
        }, {
            x: 1,
            y: 1,
            color: '#0e4287'
        }, {
            x: 1,
            y: 2,
            color: '#00428e'
        }, {
            x: 1,
            y: 3,
            color: '#004d52'
        }, {
            x: 2,
            y: 0,
            color: 'yellow'
        }, {
            x: 2,
            y: 1,
            color: '#fae684'
        }, {
            x: 2,
            y: 2,
            color: '#fde87c'
        }, {
            x: 2,
            y: 3,
            color: '#fddeea'
        }, {
            x: 3,
            y: 0,
            color: 'green'
        }, {
            x: 3,
            y: 1,
            color: '#596a5f'
        }, {
            x: 3,
            y: 2,
            color: '#6d6756'
        }, {
            x: 3,
            y: 3,
            color: '#346f79'
        }],
        dataLabels: {
            enabled: false
        }
    }]

});
