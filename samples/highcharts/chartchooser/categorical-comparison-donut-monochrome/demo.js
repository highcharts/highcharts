Highcharts.chart('container', {
    colors: ['#10487F', '#346DA4', '#7CB5EC', '#a9cef2'],
    chart: {
        type: 'pie'
    },
    title: {
        text: 'February 2020 Norway passenger auto registrations'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    subtitle: {
        text: 'Source: <a href="https://cleantechnica.com/2020/03/07/pioneering-norway-rises-above-68-plug-in-vehicle-market-share-in-february/">CleanTechnica</a>'
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
                connectorColor: '#888',
                format: '{point.name}: {y} %'
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Registrations',
        colorByPoint: true,
        innerSize: '75%',
        data: [{
            name: 'EV',
            y: 68.1
        }, {
            name: 'Hybrids',
            y: 11.0
        }, {
            name: 'Diesel',
            y: 11.2
        }, {
            name: 'Petrol',
            y: 9.7
        }]
    }]
});