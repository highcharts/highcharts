$(function () {
    var margin = 40;
    var options = {
        chart: {
            marginRight: margin,
            marginLeft: margin,
            backgroundColor: '#e0e0e0'
        },

        xAxis: [{
            labels: {
                format: 'ThisIsALongText',
                align: 'left',
                autoRotationLimit: 10
            }
        }, { // Top X axis
            linkedTo: 0,
            labels: {
                format: 'ThisIsALongText',
                align: 'center',
                autoRotationLimit: 10
            }
        }, { // Top X axis
            linkedTo: 0,
            labels: {
                format: 'ThisIsALongText',
                align: 'right',
                autoRotationLimit: 10
            }
        }],

        yAxis: {
            title: null,
            labels: {
                enabled: false
            }
        },

        series: [{
            data: [1,2,3,4],
            animation: false
        }]
    };

    $('#container').highcharts(options);

    $('#margin').bind('input', function (e) {
        options.chart.marginRight = this.value;
        options.chart.marginLeft = this.value;
        $('#value').html(this.value);
        $('#container').highcharts(options);
    })
    .attr({
        value: margin
    });
    $('#value').html(margin);

});