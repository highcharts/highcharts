Highcharts.setOptions({
    colors: [{ patternIndex: 0 }, { patternIndex: 1 }]
});

Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    title: {
        text: 'Swedish top 10 professions dominated by women (16-64 years) in 2017'
    },
    subtitle: {
        text:
        'Source: <a href="https://www.scb.se/">Swedish National Statistics</a>'
    },
    xAxis: {
        categories: [
            'Preschool teacher',
            'Home care nurse',
            'Nurse',
            'Nanny',
            'Nurse practitioner',
            'Finance Assistant',
            'Accountant',
            'Nurse assistant',
            'Office assistant/secretary'
        ],
        accessibility: {
            description: 'Profession'
        }
    },
    yAxis: {
        labels: {
            format: '{value} %'
        },
        min: 0,
        title: {
            text: null
        },
        accessibility: {
            description: 'Gender distribution percentage'
        }
    },
    tooltip: {
        pointFormat: '<b>{series.name}</b>: <b>{point.percentage:.0f}%</b><br/>',
        shared: true,
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
        borderColor: '#444'
    },
    plotOptions: {
        bar: {
            stacking: 'percent'
        }
    },
    series: [
        {
            name: 'Men',
            data: [4, 8, 9, 11, 11, 13, 21, 22, 22],
            borderColor: '#8294C9'
        },
        {
            name: 'Women',
            data: [96, 92, 91, 89, 89, 87, 79, 78, 78],
            borderColor: '#555'
        }
    ]
});
