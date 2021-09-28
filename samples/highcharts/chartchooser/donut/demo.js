Highcharts.chart('container', {
    colors: ['#01BAF2', '#71BF45', '#FAA74B', '#B37CD2'],
    chart: {
        type: 'pie'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    title: {
        text: 'February 2020 Norway passenger auto registrations'
    },
    subtitle: {
        text: 'Source:<a href="https://cleantechnica.com/2020/03/07/pioneering-norway-rises-above-68-plug-in-vehicle-market-share-in-february/">cleantechnica</a>'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
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