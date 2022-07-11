Highcharts.chart('container', {

    chart: {
        type: 'item'
    },

    title: {
        text: 'Highcharts item chart'
    },

    subtitle: {
        text: 'Parliament visualization'
    },

    legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
    },

    series: [{
        name: 'Representatives',
        keys: ['name', 'y', 'color', 'label'],
        data: [
            ['The Left', 39, '#CC0099', 'Linke'],
            ['Social Democratic Party', 206, '#EE0011', 'SPD'],
            ['Alliance 90/The Greens', 118, '#448833', 'Grüne'],
            ['Free Democratic Party', 92, '#FFCC00', 'FDP'],
            ['Christian Democratic Union', 152, '#000000', 'CDU'],
            ['Christian Social Union in Bavaria', 45, '#3366CC', 'CSU'],
            ['Alternative for Germany', 81, '#3399FF', 'AfD'],
            ['South Schleswig Voters\' Association', 1, '#000099', 'SSW'],
            ['Centre Party', 1, '#6600CC', 'Zentrum'],
            ['Independent', 1, '#999999', 'Parteilos']
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
