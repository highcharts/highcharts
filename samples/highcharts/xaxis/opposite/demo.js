
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    xAxis: {
        opposite: true,
        categories: ['Prod AAA AAA', 'Prod BBB', 'Prod CCC', 'Prod DDD', 'Prod EEE', 'Prod FFF'],
        //categories: ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF'],
        labels: {
            autoRotation: 0,
            style: {
                color: 'red'
                //fontSize: '24px'
            }
        }


    },

    series: [{
        data: [-29.9, -71.5, -106.4, -129.2, -144.0, -176.0]
    }]
});
