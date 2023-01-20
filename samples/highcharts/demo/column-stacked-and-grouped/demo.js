// Data retrieved from https://en.wikipedia.org/wiki/Winter_Olympic_Games
Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Olympic Games all-time medal table, grouped by continent',
        align: 'left'
    },

    xAxis: {
        categories: ['Gold', 'Silver', 'Bronze']
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: 'Count medals'
        }
    },

    tooltip: {
        formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
                this.series.name + ': ' + this.y + '<br/>' +
                'Total: ' + this.point.stackTotal;
        }
    },

    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },

    series: [{
        name: 'Norway',
        data: [148, 133, 124],
        stack: 'Europe'
    }, {
        name: 'Germany',
        data: [102, 98, 65],
        stack: 'Europe'
    }, {
        name: 'United States',
        data: [113, 122, 95],
        stack: 'North America'
    }, {
        name: 'Canada',
        data: [77, 72, 80],
        stack: 'North America'
    }]
});
