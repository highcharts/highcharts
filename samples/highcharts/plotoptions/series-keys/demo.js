$(function () {
    $('#container').highcharts({
        title: {
            text: 'The <em>series.keys</em> option'
        },
        subtitle: {
            text: 'Specifies which array options map to which keys'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                ['Chrome', 12.8, true, true],
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['Others',   0.7]
            ],
            keys: ['name', 'y', 'sliced', 'selected']
        }]
    });
});

