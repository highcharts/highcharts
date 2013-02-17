$(function () {
    var categoryLinks = {
        'Foo': 'http://www.google.com/search?q=foo',
        'Bar': 'http://www.google.com/search?q=foo+bar',
        'Foobar': 'http://www.google.com/serach?q=foobar'
    };
    
    $('#container').highcharts({
        chart: {
        },
        
        xAxis: {
            categories: ['Foo', 'Bar', 'Foobar'],
            
            labels: {
                formatter: function() {
                    return '<a href="'+ categoryLinks[this.value] +'">'+
                        this.value +'</a>';
                }
            }
        },
        
        series: [{
            data: [29.9, 71.5, 106.4]        
        }]
    });
});