Highcharts.chart('container', {

    chart: {
        type: 'item'
    },

    title: {
        text: 'Distribution of seats'
    },

    subtitle: {
        text: 'Bundestag election 20221. Source: ' +
            '<a href="https://www.bundeswahlleiter.de/en/bundeswahlleiter.html"' +
            'target="_blank">Bundeswahlleiter</a> '
    },

    legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
    },

    series: [{
        name: 'Representatives',
        keys: ['name', 'y', 'color', 'label'],
        data: [
            ['The Left', 39, '#BE3075', 'DIE LINKE'],
            ['Social Democratic Party', 206, '#EB001F', 'SPD'],
            ['Alliance 90/The Greens', 118, '#64A12D', 'GRÜNE'],
            ['Free Democratic Party', 92, '#FFED00', 'FDP'],
            ['Christian Democratic Union', 152, '#000000', 'CDU'],
            ['Christian Social Union in Bavaria', 45, '#008AC5', 'CSU'],
            ['Alternative for Germany', 83, '#009EE0', 'AfD'],
            ['South Schleswig Voters\' Association', 1, '#284B63', 'SSW']
        ],
        dataLabels: {
            enabled: true,
            format: '{point.label}'
        },

        // Circular options
        center: ['50%', '88%'],
        size: '170%',
        startAngle: -100,
        endAngle: 100
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 600
            },
            chartOptions: {
                series: [{
                    dataLabels: {
                        distance: -30
                    }
                }]
            }
        }]
    }
});
