$(function () {
    $('#container').highcharts({
    
        chart: {
        },
    
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                                     'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
    
        tooltip: {
            formatter: function() {
                var s = '<b>'+ this.x +'</b>';
                
                $.each(this.points, function(i, point) {
                    s += '<br/>'+ point.series.name +': '+
                        point.y +'m';
                });
                
                return s;
            },
            shared: true
        },
    
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]},
        {
            data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]}]
    
    });
});