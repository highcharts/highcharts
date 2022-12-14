Highcharts.setOptions({
    colors: [
        { patternIndex: 0 },
        { patternIndex: 1 },
        { patternIndex: 2 },
        { patternIndex: 3 },
        { patternIndex: 4 }
    ]
});

Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Honey Composition'
    },
    subtitle: {
        text: 'Source: <a href="https://en.wikipedia.org/wiki/Honey">Wikipedia</a>'
    },
    xAxis: {
        categories: ['Honey composition'],
        visible: false
    },
    yAxis: {
        labels: {
            enabled: false
        },
        visible: false,
        reversed: true,
        min: 0,
        title: {
            text: null
        }
    },
    tooltip: {
        headerFormat: null,
        pointFormat:
      '<b>{series.name}</b>: <b>{point.percentage:.0f}%</b><br/>',
        shared: true
    },
    plotOptions: {
        bar: {
            stacking: 'percent',
            borderColor: '#000000',
            dataLabels: {
                enabled: true,
                format: '{series.name}: {y}%',
                color: 'black',
                y: -80
            }
        }
    },
    series: [
        {
            name: 'Fructose',
            data: [38.2]
        },
        {
            name: 'Glucose',
            data: [31.3]
        },
        {
            name: 'Water',
            data: [17.2]
        },
        {
            name: 'Maltose',
            data: [7.1]
        },
        { name: 'Other', data: [6.2] }
    ]
});
