$(function () {
    $('#container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'In Highcharts <= 3.0.8 and modern IE, large labels were not vertically centered.'
        },
        xAxis: {
            categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
            title: {
                text: null
            },
            labels: {
                style: {
                    fontSize: '20px'
                }
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'Year 1800',
            data: [31, { dataLabels : { style: { fontWeight: 'bold',  fontSize : '20px' } },
                                 y: 107 }, 635, 203, 2]
        }]
    });
});

