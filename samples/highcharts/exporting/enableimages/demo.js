$(function () {
    var chart = new Highcharts.Chart({
    
        chart: {
            renderTo: 'container',
            events: {
                load: function() {
                    this.renderer.image('http://highsoft.com/images/media/Highsoft-Solutions-143px.png', 80, 40, 143, 57)
                        .add();
                }
            }
        },
    
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
    
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],
        
        exporting: {
            enableImages: true
        }
    
    });
});