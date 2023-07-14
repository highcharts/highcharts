const chart = Highcharts.chart('container', {
    chart: {
        type: 'treemap'
    },
    plotOptions: {
        treemap: {
            layoutAlgorithm: 'stripes',
            alternateStartingDirection: true,
            levels: [{
                level: 1,
                layoutAlgorithm: 'sliceAndDice',
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'top',
                    style: {
                        fontSize: '15px',
                        fontWeight: 'bold'
                    }
                }
            }]
        },
        treegraph: {
            marker: {
                symbol: 'rect',
                width: '25%'
            }
        }
    },
    series: [{
        data: [{
            id: 'root',
            name: 'Norway'
        }, {
            id: 'A',
            name: 'Nord-Norge',
            color: '#50FFB1',
            parent: 'root'
        }, {
            id: 'B',
            name: 'Trøndelag',
            color: '#F5FBEF',
            parent: 'root'
        }, {
            id: 'C',
            name: 'Vestlandet',
            color: '#A09FA8',
            parent: 'root'
        }, {
            id: 'D',
            name: 'Østlandet',
            color: '#E7ECEF',
            parent: 'root'
        }, {
            id: 'E',
            name: 'Sørlandet',
            color: '#A9B4C2',
            parent: 'root'
        }, {
            name: 'Troms og Finnmark',
            parent: 'A',
            value: 70923
        }, {
            name: 'Nordland',
            parent: 'A',
            value: 35759
        }, {
            name: 'Trøndelag',
            parent: 'B',
            value: 39494
        }, {
            name: 'Møre og Romsdal',
            parent: 'C',
            value: 13840
        }, {
            name: 'Vestland',
            parent: 'C',
            value: 31969
        }, {
            name: 'Rogaland',
            parent: 'C',
            value: 8576
        }, {
            name: 'Viken',
            parent: 'D',
            value: 22768
        }, {
            name: 'Innlandet',
            parent: 'D',
            value: 49391
        },
        {
            name: 'Oslo',
            parent: 'D',
            value: 454
        },
        {
            name: 'Vestfold og Telemark',
            parent: 'D',
            value: 15925
        },
        {
            name: 'Agder',
            parent: 'E',
            value: 14981
        }]
    }],
    title: {
        text: 'Norwegian regions and counties',
        align: 'left'
    },
    subtitle: {
        text:
            'Source: <a href="https://snl.no/Norge" target="_blank">SNL</a>',
        align: 'left'
    },
    tooltip: {
        useHTML: true,
        pointFormat:
            'The area of <b>{point.name}</b> is <b>{point.value} km<sup>2</sup></b>'
    }
});

Array.from(document.querySelectorAll('.highcharts-figure button'))
    .forEach(btn => {
        btn.addEventListener('click', e => {
            chart.update({
                chart: {
                    type: e.target.id
                }
            });
        });
    });
