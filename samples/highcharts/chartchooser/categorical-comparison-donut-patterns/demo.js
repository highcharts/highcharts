Highcharts.chart('container', {
    colors: ['#01BAF2', '#71BF45', '#FAA74B', '#B37CD2'],
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
            y: 68.1,
            color: { patternIndex: 0 },
            borderColor: '#5997DE'
        }, {
            name: 'Hybrids',
            color: { patternIndex: 1 },
            y: 11.0,
            borderColor: '#949494'
        }, {
            name: 'Diesel',
            color: { patternIndex: 2 },
            y: 11.2,
            borderColor: '#69A550'
        }, {
            name: 'Petrol',
            color: { patternIndex: 3 },
            y: 9.7,
            borderColor: '#C9854A'
        }]
    }]
});