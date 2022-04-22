Highcharts.setOptions({
    colors: ['#b9d4f8', '#f8b9d4']
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
        pointFormat:
        '<span style="color:{series.options.contrastColor}">{series.name}</span>: <b>{point.percentage:.0f}%</b><br/>',
        shared: true
    },
    plotOptions: {
        bar: {
            stacking: 'percent'
        }
    },
    series: [
        {
            contrastColor: '#327AB8',
            borderColor: '#8294C9',
            name: 'Men',
            data: [4, 8, 9, 11, 11, 13, 21, 22, 22]
        },
        {
            contrastColor: '#CE22C0',
            borderColor: '#C67BC4',
            name: 'Women',
            data: [96, 92, 91, 89, 89, 87, 79, 78, 78]
        }
    ]
});
