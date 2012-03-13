// create the chart
var chart = new Highcharts.Chart({
    chart: {
        renderTo: 'container',
        events: {
            addSeries: function() {
                alert ('A series was added');
            }
        }        
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]        
    }]
});


// activate the button
$('#button').click(function() {
    chart.addSeries({
        data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]        
    });

    $('#button').unbind('click');
});