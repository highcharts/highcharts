$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            location.href = this.options.url;
                        }
                    }
                }
            }
        },

        series: [{
            data: [{
                y: 29.9,
                url: 'http://bing.com/search?q=foo'
            }, {
                y: 71.5,
                url: 'http://bing.com/search?q=bar'
            }, {
                y: 106.4,
                url: 'http://bing.com/search?q=foo+bar'
            }]
        }]
    });
});