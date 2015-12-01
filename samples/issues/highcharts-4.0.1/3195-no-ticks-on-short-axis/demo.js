$(function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            height: 180,
            width: 400
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            title: null,
            labels: {
                style: {
                    color: '#000000',
                    width: 70,
                    font: '11px Verdana, Arial, sans-serif'
                },
                enabled: true,
                y: 10,
                rotation: -45
            },
            categories: ['Jan FY2014', 'Feb  FY2014', 'Mar FY2014', 'Apr  FY2014', 'May FY2014', 'Jun FY2014',
                'Jul FY2014', 'Aug FY2014', 'Sep FY2014', 'Oct FY2014', 'Nov FY2014', 'Dec FY2014']
        },
        yAxis: {
            minorTickInterval: 'auto',
            endOnTick: false,
            startOnTick: false, //WHEN YOU START AND STOP = FALSE, Firefox/Chrome will not render
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0);
                }
            }
        },
        series: [{
            name: 'Chargeback',
            data: [380884, 380894, 380894.19, 381027.93, 386350.57, 381027.93, 343328.53, 343560.03, 343364.04, 343364.04, 343364.04, 343364.04]
        }, {
            name: 'Cost',
            data: [370207, 367742, 367309, 370140, 374598, 369605, 332312, 330942.6462461687, 331200, 333260, 332632, 329863]
        }, {
            name: 'Budget',
            data: [217020, 217020, 217020, 217020, 217020, 217020, 217020, 217020.83795782478, 217020, 217020, 217020, 217020]
        }]
    });
});