$(function () {
    $('#container').highcharts({

        title: {
            text: 'Hover color was brightened after repeated redraws'
        },


        chart: {
            type: 'pie'
        },
        
        series: [{
            data: [
                {
                    color: '#22aa11',
                    states: {},
                    y: 1
                }
            ]
        }]
    
    });
});