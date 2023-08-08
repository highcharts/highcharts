Highcharts.chart(
    'container',
    {
        chart: {
            marginRight: 150,
            type: 'line'
        },
        title: {
            text: 'Goals scored over games played for top footballers (after 2016)'
        },

        subtitle: {
            // eslint-disable-next-line quotes
            text: "Source: <a href='https://fbref.com/en/players/'> Sports Reference</a>"
        },

        xAxis: {
            allowDecimals: false,
            max: 200,
            title: {
                text: 'Number of games played'
            }
        },
        yAxis: {
            title: {
                text: 'Goals'
            },
            max: 300
        },

        plotOptions: {
            series: {
                animation: false,

                // With the series label pointIndex feature
                label: {
                    enabled: false,
                    pointIndex: -1
                },

                // With the data labels keyPoints feature
                dataLabels: {
                    align: 'left',
                    verticalAlign: 'middle',
                    allowOverlap: true,
                    enabled: true,
                    format: '{series.name}: {point.y}',
                    keyPoints: {
                        last: true
                    },
                    overflow: 'allow',
                    crop: false
                },
                marker: {
                    enabled: false
                },

                states: {
                    hover: {
                        enabled: false // Disable hover state
                    }
                }
                // step: true
            }
        },
        series: [
            {
                name: 'Lionel Messi',
                data: []
            },
            {
                name: 'Cristiano Ronaldo',
                data: []
            },
            {
                name: 'Erling Braut Haaland',
                data: []
            },
            {
                name: 'Robert Lewandowski',
                data: []
            },
            {
                name: 'Kylian Mbappé',
                data: []
            }
        ]
    },
    function (chart) {
        var dataset = [
            {
                player: 'Lionel Messi',
                data: [
                    [34, 37],
                    [70, 71],
                    [104, 107],
                    [137, 132],
                    [172, 162],
                    [198, 168],
                    [230, 184]
                ]
            },
            {
                player: 'Cristiano Ronaldo',
                data: [
                    [29, 25],
                    [56, 51],
                    [87, 72],
                    [120, 103],
                    [153, 132],
                    [184, 150],
                    [210, 165]
                ]
            },
            {
                player: 'Erling Haaland',
                data: [
                    [14, 2],
                    [39, 14],
                    [41, 15],
                    [55, 31],
                    [70, 44],
                    [98, 71],
                    [122, 93],
                    [157, 129]
                ]
            },
            {
                player: 'Robert Lewandowski',
                data: [
                    [33, 30],
                    [63, 59],
                    [96, 81],
                    [127, 115],
                    [156, 156],
                    [190, 191],
                    [224, 214]
                ]
            },
            {
                player: 'Kylian Mbappé',
                data: [
                    [29, 15],
                    [57, 28],
                    [86, 61],
                    [106, 79],
                    [137, 106],
                    [172, 134],
                    [206, 163]
                ]
            }
        ];

        var currentIndex = 0;

        function addDataPoint() {
            if (currentIndex < dataset[0].data.length) {
                dataset.forEach(function (playerData) {
                    var series = chart.get(playerData.player);
                    var dataPoint = playerData.data[currentIndex];
                    series.addPoint(dataPoint, false, series.data.length >= 5);
                });

                chart.redraw(); // Redraw after adding points

                currentIndex++;

                setTimeout(addDataPoint, 1000); // Add next point after 1 second
            }
        }

        addDataPoint(); // Start the animation
    }
);
