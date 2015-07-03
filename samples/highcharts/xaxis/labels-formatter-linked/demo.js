$(function () {
    var categoryLinks = {
        'Foo': 'http://www.bing.com/search?q=foo',
        'Bar': 'http://www.bing.com/search?q=foo+bar',
        'Foobar': 'http://www.bing.com/serach?q=foobar'
    };

    $('#container').highcharts({

        title: {
            text: 'Click categories to search'
        },

        xAxis: {
            categories: ['Foo', 'Bar', 'Foobar'],

            labels: {
                formatter: function () {
                    return '<a href="' + categoryLinks[this.value] + '">' +
                        this.value + '</a>';
                }
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4]
        }]
    });
});