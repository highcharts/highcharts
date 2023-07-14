Highcharts.setOptions({
    colors: ['#b9d4f8', '#f8b9d4']
});

Highcharts.chart('container', {
    chart: {
        type: 'bar'
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
        min: 0,
        max: 130000,
        title: {
            text: null
        },
        accessibility: {
            description: 'Gender distribution percentage'
        }
    },
    tooltip: {
        pointFormat:
        '<span style="color:{series.options.contrastColor}">{series.name}</span>: <b>{point.y}</b><br/>',
        shared: true
    },
    plotOptions: {
        bar: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [
        {
            contrastColor: '#327AB8',
            borderColor: '#8294C9',
            name: 'Men',
            data: [3100, 11200, 3400, 9500, 5000, 5000, 5600, 16800, 16400]
        },
        {
            contrastColor: '#CE22C0',
            borderColor: '#C67BC4',
            name: 'Women',
            data: [
                67500,
                125300,
                33700,
                79100,
                41200,
                34000,
                20400,
                61300,
                59000
            ]
        }
    ]
});
