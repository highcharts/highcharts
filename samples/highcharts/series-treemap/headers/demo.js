const chart = Highcharts.chart('container', {
    chart: {
        width: 600
    },
    series: [{
        type: 'treemap',
        name: 'Norge',
        allowTraversingTree: true,
        alternateStartingDirection: true,
        dataLabels: {
            format: '{point.name}',
            style: {
                textOutline: 'none'
            }
        },
        borderColor: '#ffffff',
        borderRadius: 3,
        levels: [{
            level: 1,
            layoutAlgorithm: 'sliceAndDice',
            groupPadding: 3,
            dataLabels: {
                allowOverlap: true,
                enabled: true,
                inside: false,
                style: {
                    fontSize: '0.6em',
                    fontWeight: 'normal',
                    textTransform: 'uppercase'
                }
            },
            borderColor: '#333',
            borderRadius: 3,
            borderWidth: 1,
            colorByPoint: true

        }, {
            level: 2,
            dataLabels: {
                enabled: true,
                inside: false
            }
        }],
        data: [{
            id: 'A',
            name: 'Nord-Norge',
            color: '#50FFB1'
        }, {
            id: 'B',
            name: 'Trøndelag',
            color: '#F5FBEF'
        }, {
            id: 'C',
            name: 'Vestlandet',
            color: '#A09FA8'
        }, {
            id: 'D',
            name: 'Østlandet',
            color: '#E7ECEF'
        }, {
            id: 'E',
            name: 'Sørlandet',
            color: '#A9B4C2'
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
        text: 'Norwegian regions and counties by area',
        align: 'left'
    },
    subtitle: {
        text:
            'Source: <a href="https://snl.no/Norge" target="_blank">SNL</a>',
        align: 'left'
    },
    tooltip: {
        useHTML: true,
        pointFormat: 'The area of <b>{point.name}</b> is \
            <b>{point.value} km<sup>2</sup></b>'
    }
});

// Enable the radio buttons
document.querySelectorAll('input[name=dataLabels\\.inside]').forEach(input => {
    input.addEventListener('change', () => {
        chart.series[0].update({
            levels: [Highcharts.merge(
                chart.series[0].options.levels[0],
                {
                    dataLabels: {
                        inside: input.value === 'true'
                    }
                }
            )]
        });
    });
});
