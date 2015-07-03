$(function () {
    $('#container').highcharts({
        title: {
            text: 'Data labels were messed up, Highcharts <= 3.0.9'
        },
        plotOptions: {
            series: {
                allowPointSelect: true,
                dataLabels: {
                    enabled: true,
                    distance: 40
                },

                center: ['50%', '50%'],
                size: '75%'
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            startAngle: 180,
            endAngle: 360,
            innerSize: '50%',
            data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                ['Chrome', 12.8],
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['Others',   0.7]
            ]
        }]
    });
});

