// Data retrieved from https://gs.statcounter.com/browser-market-share#monthly-202201-202201-bar

// Create the chart
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Granola recipe with nutritional information'
    },
    subtitle: {
        text: 'Click the columns to view nutritional information'
    },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    xAxis: {
        type: 'category'
    },
    yAxis: [{
        title: {
            text: 'Percent per weight'
        },
        showEmpty: false
    }, {
        title: {
            text: 'Grams in recipe'
        },
        showEmpty: false
    }],
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y:.1f}%'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: ' +
            '<b>{point.y:.2f}%</b> of weight<br/>'
    },

    series: [
        {
            name: 'Ingredients',
            colorByPoint: true,
            dataLabels: {
                enabled: true,
                format: '{point.y:.0f} g'
            },
            tooltip: {
                headerFormat:
                    '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat:
                    '<span style="color:{point.color}">{point.name}</span>: ' +
                    '<b>{point.y:.0f} g</b> in recipe<br/>'
            },
            yAxis: 1,
            data: [
                {
                    name: 'Rolled Oats',
                    y: 300,
                    drilldown: 'Rolled Oats'
                },
                {
                    name: 'Maple Syrup',
                    y: 170,
                    drilldown: 'Maple Syrup'
                },
                {
                    name: 'Flaked Almonds',
                    y: 100,
                    drilldown: 'Flaked Almonds'
                },
                {
                    name: 'Dried Berries',
                    y: 100,
                    drilldown: 'Dried Berries'
                },
                {
                    name: 'Sunflower Seeds',
                    y: 50,
                    drilldown: 'Sunflower Seeds'
                },
                {
                    name: 'Sesame Seeds',
                    y: 50,
                    drilldown: 'Sesame Seeds'
                },
                {
                    name: 'Pumpkin Seeds',
                    y: 50,
                    drilldown: 'Pumpkin Seeds'
                },
                {
                    name: 'Coconut',
                    y: 50,
                    drilldown: 'Coconut'
                },
                {
                    name: 'Honey',
                    y: 42,
                    drilldown: 'Honey'
                },
                {
                    name: 'Vegetable Oil',
                    y: 26,
                    drilldown: 'Vegetable Oil'
                },
                {
                    name: 'Vanilla Extract',
                    y: 5,
                    drilldown: 'Vanilla Extract'
                }
            ]
        }
    ],
    drilldown: {
        breadcrumbs: {
            position: {
                align: 'right'
            }
        },
        series: [
            {
                name: 'Rolled Oats',
                id: 'Rolled Oats',
                data: [
                    [
                        'Carbohydrates',
                        67.7
                    ],
                    [
                        'Fat',
                        6.52
                    ],
                    [
                        'Protein',
                        13.15
                    ]
                ]
            },
            {
                name: 'Maple Syrup',
                id: 'Maple Syrup',
                data: [
                    [
                        'Carbohydrates',
                        67
                    ],
                    [
                        'Fat',
                        0.06
                    ],
                    [
                        'Protein',
                        0.04
                    ]
                ]
            },
            {
                name: 'Flaked Almonds',
                id: 'Flaked Almonds',
                data: [
                    [
                        'Carbohydrates',
                        21.6
                    ],
                    [
                        'Fat',
                        49.9
                    ],
                    [
                        'Protein',
                        21.2
                    ]
                ]
            },
            {
                name: 'Dried Berries',
                id: 'Dried Berries',
                data: [
                    [
                        'Carbohydrates',
                        65
                    ],
                    [
                        'Fat',
                        1
                    ],
                    [
                        'Protein',
                        1
                    ]
                ]
            },
            {
                name: 'Sunflower Seeds',
                id: 'Sunflower Seeds',
                data: [
                    [
                        'Carbohydrates',
                        20
                    ],
                    [
                        'Fat',
                        51.46
                    ],
                    [
                        'Protein',
                        20.78
                    ]
                ]
            },
            {
                name: 'Sesame Seeds',
                id: 'Sesame Seeds',
                data: [
                    [
                        'Carbohydrates',
                        23.4
                    ],
                    [
                        'Fat',
                        49.7
                    ],
                    [
                        'Protein',
                        17.7
                    ]
                ]
            },
            {
                name: 'Pumpkin Seeds',
                id: 'Pumpkin Seeds',
                data: [
                    [
                        'Carbohydrates',
                        14.71
                    ],
                    [
                        'Fat',
                        49.05
                    ],
                    [
                        'Protein',
                        29.84
                    ]
                ]
            },
            {
                name: 'Coconut',
                id: 'Coconut',
                data: [
                    [
                        'Carbohydrates',
                        15.23
                    ],
                    [
                        'Fat',
                        33.49
                    ],
                    [
                        'Protein',
                        3.33
                    ]
                ]
            },
            {
                name: 'Honey',
                id: 'Honey',
                data: [
                    [
                        'Carbohydrates',
                        82
                    ],
                    [
                        'Fat',
                        0
                    ],
                    [
                        'Protein',
                        0.3
                    ]
                ]
            },
            {
                name: 'Vegetable Oil',
                id: 'Vegetable Oil',
                data: [
                    [
                        'Carbohydrates',
                        0
                    ],
                    [
                        'Fat',
                        96
                    ],
                    [
                        'Protein',
                        0
                    ]
                ]
            },
            {
                name: 'Vanilla Extract',
                id: 'Vanilla Extract',
                data: [
                    [
                        'Carbohydrates',
                        12.6
                    ],
                    [
                        'Fat',
                        0
                    ],
                    [
                        'Protein',
                        0
                    ]
                ]
            }
        ]
    }
});
