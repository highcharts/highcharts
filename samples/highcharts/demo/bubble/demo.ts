Highcharts.chart('container', {

    dataTable: {
        columns: {
            CountryCode: [
                'BE', 'DE', 'FI', 'NL', 'SE', 'ES', 'FR', 'NO', 'UK', 'IT',
                'RU', 'US', 'HU', 'PT', 'NZ'
            ],
            CountryName: [
                'Belgium', 'Germany', 'Finland', 'Netherlands', 'Sweden',
                'Spain', 'France', 'Norway', 'United Kingdom', 'Italy',
                'Russia', 'United States', 'Hungary', 'Portugal', 'New Zealand'
            ],
            FatIntake: [
                95, 86.5, 80.8, 80.4, 80.3, 78.4, 74.2, 73.5, 71, 69.2, 68.6,
                65.5, 65.4, 63.4, 64
            ],
            SugarIntake: [
                95, 102.9, 91.5, 102.5, 86.1, 70.1, 68.5, 83.1, 93.2, 57.6, 20,
                126.4, 50.8, 51.8, 82.9
            ],
            Obesity: [
                13.8, 14.7, 15.8, 12, 11.8, 16.6, 14.5, 10, 24.7, 10.4, 16,
                35.3, 28.5, 15.4, 31.3
            ]
        }
    },
    chart: {
        type: 'bubble',
        plotBorderWidth: 1,
        plotBorderRadius: 5,
        zooming: {
            type: 'xy'
        }
    },

    legend: {
        enabled: false
    },

    title: {
        text: 'Sugar and fat intake per country',
        align: 'left'
    },

    subtitle: {
        text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a>' +
            ' and <a href="https://data.oecd.org/">OECD</a>',
        align: 'left'
    },

    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. {point.name}, fat: {point.x}g, ' +
                'sugar: {point.y}g, obesity: {point.z}%.'
        }
    },

    xAxis: {
        gridLineWidth: 1,
        minPadding: 0.06,
        lineWidth: 3,
        title: {
            text: 'Daily fat intake'
        },
        labels: {
            format: '{value} gr'
        },
        plotLines: [{
            color: 'light-dark(#00b066, #007D49)',
            dashStyle: 'Dash',
            value: 65,
            zIndex: 3
        }],
        plotBands: [{
            from: 0,
            to: 65,
            label: {
                rotation: 0,
                verticalAlign: 'top',
                y: 40,
                style: {
                    fontStyle: 'italic',
                    color: 'light-dark(#007D49, #00b066)'
                },
                text: 'Safe zone'
            },
            color: '#00E28424',
            zIndex: 3
        }],
        accessibility: {
            rangeDescription: 'Range: 60 to 100 grams.'
        }
    },

    yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
            text: 'Daily sugar intake'
        },
        labels: {
            format: '{value} gr'
        },
        maxPadding: 0.2,
        min: 0,
        plotLines: [{
            color: 'light-dark(#00b066, #007D49)',
            dashStyle: 'Dash',
            value: 50,
            zIndex: 3
        }],
        plotBands: [{
            from: 0,
            to: 50,
            label: {
                align: 'right',
                style: {
                    fontStyle: 'italic',
                    color: 'light-dark(#007D49, #00b066)'
                },
                text: 'Safe zone',
                x: -10
            },
            color: '#00E28424',
            zIndex: 3
        }],
        accessibility: {
            rangeDescription: 'Range: 0 to 160 grams.'
        }
    },

    tooltip: {
        useHTML: true,
        headerFormat: '<table style="border-left: 3px solid {point.color};">',
        pointFormat:
            '<tr><th colspan="2">{point.custom.countryName}</th></tr>' +
            '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
            '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
            '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
        footerFormat: '</table>',
        followPointer: true
    },

    plotOptions: {
        bubble: {
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            minSize: 20
        }
    },

    series: [{
        dataMapping: {
            x: 'FatIntake',
            y: 'SugarIntake',
            z: 'Obesity',
            name: 'CountryCode',
            'custom.countryName': 'CountryName'
        },
        colorByPoint: true
    }]

});
