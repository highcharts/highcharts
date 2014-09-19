jQuery(function () {
    jQuery('#container').highcharts({
        title : {
            text : 'Sliced pie'
        },
        series : [{
            type : 'pie',
            data : [{
                y : 20,
                name : 'Sliced serie',
                sliced : true
            }, {
                y : 80,
                dataLabels: {
                    enabled: false
                }
            }]
        }]
    });
});