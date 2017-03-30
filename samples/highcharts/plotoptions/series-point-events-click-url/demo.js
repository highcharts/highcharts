
Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Click points to go to URL'
    },

    xAxis: {
        type: 'category'
    },

    plotOptions: {
        series: {
            cursor: 'pointer',
            point: {
                events: {
                    click: function () {
                        location.href = 'https://en.wikipedia.org/wiki/' +
                            this.options.key;
                    }
                }
            }
        }
    },

    series: [{
        data: [{
            y: 29.9,
            name: 'USA',
            key: 'United_States'
        }, {
            y: 71.5,
            name: 'Canada',
            key: 'Canada'
        }, {
            y: 106.4,
            name: 'Mexico',
            key: 'Mexico'
        }]
    }]
});