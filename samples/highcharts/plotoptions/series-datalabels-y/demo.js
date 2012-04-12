$(function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        this.series.options.dataLabels.y =
                            this.y >= 0 ? -6 : 12;
                        return this.y;
                    }
                }
            }
        },
        
        series: [{
            data: [29, -71, -10, 12, -14, 17, 13, -14, -21, 19, 95, 54]        
        }]
    });
});