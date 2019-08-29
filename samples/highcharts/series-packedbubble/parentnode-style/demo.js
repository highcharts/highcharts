Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: '100%'
    },
    title: {
        text: 'Carbon emissions around the world (2014)'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.y}m CO<sub>2</sub>'
    },
    plotOptions: {
        packedbubble: {
            marker: {
                fillColor: {
                    radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                    stops: [
                        [0, 'rgba(255,255,255,0.5)'],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                    ]
                }
            },
            minSize: '20%',
            maxSize: '80%',
            layoutAlgorithm: {
                initialPositionRadius: 100,
                splitSeries: true,
                parentNodeLimit: true,
                parentNodeOptions: {
                    marker: {
                        fillColor: {
                            radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color('#00ff00').setOpacity(0.5).get('rgba')]
                            ]
                        },
                        fillOpacity: 0.5,
                        lineWidth: 0
                    }
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                filter: {
                    property: 'y',
                    operator: '>',
                    value: 250
                },
                style: {
                    color: 'black',
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series: [{
        name: 'Europe',
        color: '#220000',
        data: [{
            name: 'Germany',
            value: 767.1
        }, {
            name: 'Croatia',
            value: 20.7
        },
        {
            name: "Belgium",
            value: 97.2
        },
        {
            name: "Czech Republic",
            value: 111.7
        },
        {
            name: "Netherlands",
            value: 158.1
        },
        {
            name: "Spain",
            value: 241.6
        },
        {
            name: "Ukraine",
            value: 249.1
        },
        {
            name: "Poland",
            value: 298.1
        },
        {
            name: "France",
            value: 323.7
        },
        {
            name: "Romania",
            value: 78.3
        },
        {
            name: "United Kingdom",
            value: 415.4
        }, {
            name: "Turkey",
            value: 353.2
        }, {
            name: "Italy",
            value: 337.6
        },
        {
            name: "Greece",
            value: 71.1
        },
        {
            name: "Austria",
            value: 69.8
        },
        {
            name: "Belarus",
            value: 67.7
        },
        {
            name: "Serbia",
            value: 59.3
        },
        {
            name: "Finland",
            value: 54.8
        },
        {
            name: "Bulgaria",
            value: 51.2
        },
        {
            name: "Portugal",
            value: 48.3
        },
        {
            name: "Norway",
            value: 44.4
        },
        {
            name: "Sweden",
            value: 44.3
        },
        {
            name: "Hungary",
            value: 43.7
        },
        {
            name: "Switzerland",
            value: 40.2
        },
        {
            name: "Denmark",
            value: 40
        },
        {
            name: "Slovakia",
            value: 34.7
        },
        {
            name: "Ireland",
            value: 34.6
        },
        {
            name: "Croatia",
            value: 20.7
        },
        {
            name: "Estonia",
            value: 19.4
        },
        {
            name: "Slovenia",
            value: 16.7
        },
        {
            name: "Lithuania",
            value: 12.3
        },
        {
            name: "Luxembourg",
            value: 10.4
        },
        {
            name: "Macedonia",
            value: 9.5
        },
        {
            name: "Moldova",
            value: 7.8
        },
        {
            name: "Latvia",
            value: 7.5
        },
        {
            name: "Cyprus",
            value: 7.2
        }]
    }]
});
