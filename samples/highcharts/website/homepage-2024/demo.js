const colors = [
    '#8087E8',
    '#A3EDBA',
    '#F19E53',
    '#6699A1',
    '#E1D369',
    '#87B4E7',
    '#DA6D85',
    '#BBBAC5'
];

Math.easeOutQuint = function (pos) {
    return Math.pow(pos - 1, 5) + 1;
};

let currentChart;

// data for Sankey (SK)
const dataSK = [
    ['Starling Bank', 'Digital Banking', 195.67],
    ['Alkami Technology', 'Digital Banking', 185.2],
    ['Checkout.com', 'Payments Processing & Networks', 380.0],
    ['Unqork', 'Financial Services', 365.2],
    ['LendInvest', 'Real Estate', 1300.0],
    ['AvidXchange', 'Accounting & Finance', 1100.0],
    ['N26', 'Digital Banking', 782.8],
    ['BlueVine', 'Business Lending & Finance', 767.5],
    ['Marqeta', 'Payments Processing & Networks', 528.0],
    ['Root Insurance', 'Insurance', 527.5],
    ['Cambridge Mobile Telematics', 'Insurance', 502.5],
    ['Petal', 'POS & Consumer Lending', 435.0],
    ['Monzo', 'Digital Banking', 419.32],
    ['Airwallex', 'Payments Processing & Networks', 402.7],
    ['Hippo', 'Insurance', 359.0],
    ['Paidy', 'POS & Consumer Lending', 277.9]
];

// data for column range (CR)
const dataCR = [
    [-13.9, 5.2],
    [-16.7, 10.6],
    [-4.7, 11.6],
    [-4.4, 16.8],
    [-2.1, 27.2],
    [5.9, 29.4],
    [6.5, 29.1],
    [4.7, 25.4],
    [4.3, 21.6],
    [-3.5, 15.1],
    [-9.8, 12.5],
    [-11.5, 8.4]
];

function changeOpacity(elements, opacity, transition) {
    [].forEach.call(elements, function (element) {
        element.style.opacity = opacity;
        element.style.transition = 'all ' + transition + 's';
    });
}

// arc
const arc = {
    chart: {
        backgroundColor: 'transparent',
        // height: 400,
        // width: '100%',
        animation: {
            duration: 2000,
            easing: ' easeOutQuint'
        },
        events: {
            load: function () {
                const links = document.querySelectorAll('.highcharts-link');
                setTimeout(function () {
                    changeOpacity(links, 1, 2);
                }, 700);
            }
        }
    },
    credits: {
        enabled: false
    },
    colors: ['#8087E8', '#A3EDBA', '#F19E53', '#6699A1'],

    title: {
        text: ''
    },

    accessibility: {
        description:
            'Arc diagram chart with circles of different sizes along the X ' +
            'axis, and connections drawn as arcs between them. From the ' +
            'chart we can see that Paris is the city with the most ' +
            'connections to other cities.',
        point: {
            valueDescriptionFormat:
                'Connection from {point.from} to {point.to}.'
        },
        keyboardNavigation: {
            enabled: false
        }
    },

    series: [
        {
            keys: ['from', 'to', 'weight'],
            animation: {
                duration: 3000,
                easing: 'easeOutQuint'
            },
            equalNodes: false,
            marker: {
                lineWidth: 1
            },
            opacity: 0.8,
            type: 'arcdiagram',
            name: 'Train connections',
            linkWeight: 1,
            centeredLinks: true,
            dataLabels: {
                enabled: false
            },
            data: [
                // ['Hamburg', 'Stuttgart', 1],
                // ['Hamburg', 'Frankfurt', 1],
                // ['Hamburg', 'München', 1],
                // ['Hannover', 'Wien', 1],
                // ['Hannover', 'München', 1],
                ['Berlin', 'Wien', 1],
                ['Berlin', 'München', 1],
                ['Berlin', 'Stuttgart', 1],
                // ['Berlin', 'Frankfurt', 1],
                // ['Berlin', 'Köln', 1],
                ['Berlin', 'Düsseldorf', 1],
                ['München', 'Düsseldorf', 1],
                ['München', 'Wien', 1],
                ['München', 'Frankfurt', 1],
                ['München', 'Köln', 1],
                ['München', 'Amsterdam', 1],
                ['Stuttgart', 'Wien', 1],
                // ['Frankfurt', 'Wien', 1],
                ['Frankfurt', 'Amsterdam', 1],
                // ['Frankfurt', 'Paris', 1],
                ['Frankfurt', 'Budapest', 1],
                ['Düsseldorf', 'Wien', 1]
                // ['Düsseldorf', 'Hamburg', 1],
                // ['Amsterdam', 'Paris', 1],
                // ['Paris', 'Brest', 1],
                // ['Paris', 'Nantes', 1],
                // ['Paris', 'Bayonne', 1],
                // ['Paris', 'Bordeaux', 1],
                // ['Paris', 'Toulouse', 1],
                // ['Paris', 'Montpellier', 1],
                // ['Paris', 'Marseille', 1],
                // ['Paris', 'Nice', 1]
            ]
        },
        {
            // when I remove this series, my css changes stop working
            keys: ['from', 'to', 'weight'],
            visible: false,
            equalNodes: true,
            type: 'arcdiagram',
            name: 'Train connections',
            linkWeight: 1,
            reversed: false,
            centeredLinks: true,
            dataLabels: {
                enabled: false,
                rotation: 90,
                y: 30,
                align: 'left',
                color: 'black'
            },
            offset: '50%',
            data: [
                ['Hamburg', 'Stuttgart', 1],
                ['Hamburg', 'Frankfurt', 1],
                ['Hamburg', 'München', 1],
                ['Hannover', 'Wien', 1],
                ['Hannover', 'München', 1],
                ['Berlin', 'Wien', 1],
                ['Berlin', 'München', 1],
                ['Berlin', 'Stuttgart', 1],
                ['Berlin', 'Frankfurt', 1],
                ['Berlin', 'Köln', 1],
                ['Berlin', 'Düsseldorf', 1],
                ['München', 'Düsseldorf', 1],
                ['München', 'Wien', 1],
                ['München', 'Frankfurt', 1],
                ['München', 'Köln', 1],
                ['München', 'Amsterdam', 1],
                ['Stuttgart', 'Wien', 1],
                ['Frankfurt', 'Wien', 1],
                ['Frankfurt', 'Amsterdam', 1],
                ['Frankfurt', 'Paris', 1],
                ['Frankfurt', 'Budapest', 1],
                ['Düsseldorf', 'Wien', 1],
                ['Düsseldorf', 'Hamburg', 1],
                ['Amsterdam', 'Paris', 1],
                ['Paris', 'Brest', 1],
                ['Paris', 'Nantes', 1],
                ['Paris', 'Bayonne', 1],
                ['Paris', 'Bordeaux', 1],
                ['Paris', 'Toulouse', 1],
                ['Paris', 'Montpellier', 1],
                ['Paris', 'Marseille', 1],
                ['Paris', 'Nice', 1],
                ['Paris', 'Milano', 1],
                ['Nantes', 'Nice', 1],
                ['Bordeaux', 'Lyon', 1],
                ['Nantes', 'Lyon', 1],
                ['Milano', 'München', 1],
                ['Milano', 'Roma', 1],
                ['Milano', 'Bari', 1],
                ['Milano', 'Napoli', 1],
                ['Milano', 'Brindisi', 1],
                ['Milano', 'Lamezia Terme', 1],
                ['Torino', 'Roma', 1],
                ['Venezia', 'Napoli', 1],
                ['Roma', 'Bari', 1],
                ['Roma', 'Catania', 1],
                ['Roma', 'Brindisi', 1],
                ['Catania', 'Milano', 1]
            ]
        }
    ],
    responsive: {
        rules: [
            {
                condition: {
                    maxWidth: 449
                },
                chartOptions: {
                    chart: {
                        margin: [0, 0, 200, 0]
                    }
                }
            },
            {
                condition: {
                    minWidth: 450
                },
                chartOptions: {
                    chart: {
                        margin: [100, 0, 100, 0]
                    }
                }
            },
            {
                condition: {
                    minWidth: 660
                },
                chartOptions: {
                    chart: {
                        margin: [0, 0, 100, 0]
                    }
                }
            },
            {
                condition: {
                    minWidth: 880
                },
                chartOptions: {
                    chart: {
                        margin: [0, 0, 50, 0]
                    }
                }
            }
        ]
    }
};

// column range
const cr = {
    chart: {
        type: 'columnrange',
        inverted: true,
        backgroundColor: 'transparent',
        margin: [50, 0, 30, 0],
        animation: {
            duration: 3000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                const labels = document.querySelectorAll('.highcharts-label');
                const seriesGroup = document.querySelector(
                    '.highcharts-series-group'
                );
                const gridLines = document.querySelectorAll(
                    '.highcharts-grid-line'
                );

                seriesGroup.style.opacity = 0;

                changeOpacity(labels, 0, 0);
                changeOpacity(gridLines, 0, 0);

                setTimeout(function () {
                    seriesGroup.style.opacity = 1;
                    seriesGroup.style.transition = 'all 2s';

                    changeOpacity(labels, 0, 2);
                    changeOpacity(gridLines, 0, 2);
                }, 500);

                setTimeout(function () {
                    chart.series[0].update({
                        data: dataCR
                    });
                }, 1500);
            }
        }
    },
    credits: {
        enabled: false
    },
    title: {
        text: ''
    },
    colors: colors,
    xAxis: {
        visible: false,
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ]
    },

    yAxis: {
        labels: {
            enabled: false
        },
        title: {
            text: ''
        },
        gridLineColor: 'transparent',
        min: -20,
        max: 30
    },

    tooltip: {
        valueSuffix: '°C'
    },

    plotOptions: {
        columnrange: {
            opacity: 0.9,
            borderRadius: 10,
            borderColor: null,
            dataLabels: {
                enabled: false,
                format: '{y}°C',
                style: {
                    textOutline: 'none',
                    color: 'rgba(255, 255, 255, 0.1)',
                    fontSize: '10px'
                }
            }
        }
    },

    legend: {
        enabled: false
    },

    series: [
        {
            animation: false,
            colorByPoint: true,
            name: 'Temperatures',
            data: [
                [4.7, 5.2],
                [4.7, 5.2],
                [4.7, 5.2],
                [4.7, 5.2],
                [4.7, 5.2],
                [4.7, 5.2],
                [4.7, 5.2],
                [4.7, 5.2],
                [4.7, 5.2],
                [4.7, 5.2],
                [4.7, 5.2],
                [4.7, 5.2]
            ]
        }
    ]
};

// sankey
const sk = {
    accessibility: {
        description:
            'Sankey chart that shows the total funding for Fintech companies ' +
            'in the internet software & services through 2022.',
        point: {
            descriptionFormatter: function (point) {
                const nodeFrom = point.fromNode.name,
                    nodeTo = point.toNode.name,
                    nodeWeight = point.weight;
                return (
                    'From: ' +
                    nodeFrom +
                    ', to: ' +
                    nodeTo +
                    ', weight: ' +
                    nodeWeight
                );
            }
        }
    },
    chart: {
        animation: {
            duration: 3000,
            easing: 'easeOutQuint'
        },
        backgroundColor: 'transparent',
        events: {
            load: function () {
                const chart = this;

                setTimeout(function () {
                    chart.series[0].update({
                        nodeWidth: 20
                    }, false);
                    chart.series[0].update({
                        curveFactor: 0.5
                    }, false);

                    chart.update({
                        plotOptions: {
                            series: {
                                colorByPoint: true
                            }
                        }
                    }, false);

                    chart.redraw();
                }, 3500);
            }
        }
    },
    colors: ['#8087E8', '#6699A1', '#DA6D85', '#78758C'],
    title: {
        useHTML: true,
        text: '',
        align: 'left',
        y: 20,
        x: 100,
        style: {
            fontSize: '24px'
        }
    },
    credits: {
        enabled: false
    },
    tooltip: {
        headerFormat: null,
        valueDecimals: 2,
        backgroundColor: '#fff',
        pointFormat:
            '<b>{point.fromNode.name}</b> ({point.toNode.name})<br>' +
            '${point.weight} Total Funding Millions USD</span>',
        nodeFormat:
            '<p style="margin:6px 0;padding: 0;font-size: ' +
            '14px;line-height:24px"><span style="font-weight: ' +
            'bold;color:{point.color}">{point.name}:</span> ${point.sum} ' +
            'million USD</p>'
    },
    plotOptions: {
        series: {
            animation: {
                duration: 2500,
                easing: 'easeOutQuint',
                defer: 1000
            },
            // animation: false,
            nodePadding: 8,
            nodeWidth: '45%',
            colorByPoint: true,
            dataLabels: {
                enabled: false,
                rotation: 0,
                y: -10,
                style: {
                    color: '#f0f0f0',
                    textOutline: '1px #333',
                    fontSize: '11px',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series: [
        {
            type: 'sankey',
            curveFactor: 0.05,
            name: 'Top Internet Software & Services Companies',
            data: dataSK
        }
    ]
};

// rounded corners
const rc = {
    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        margin: [80, 30, 30, 30],
        animation: {
            duration: 3000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                const gridLines = document.querySelectorAll(
                    '.highcharts-grid-line'
                );
                let pointWidth;

                if (chart.chartWidth < 350) {
                    pointWidth = 10;
                } else if (chart.chartWidth > 570 && chart.chartWidth < 960) {
                    pointWidth = 50;
                } else if (chart.chartWidth >= 960) {
                    pointWidth = 80;
                } else {
                    pointWidth = 30;
                }

                [].forEach.call(gridLines, function (element) {
                    element.style.opacity = 0;
                });
                setTimeout(function () {
                    chart.update({
                        plotOptions: {
                            series: {
                                pointWidth: pointWidth,
                                borderRadius: 4,
                                opacity: 0.9,
                                dataLabels: {
                                    enabled: false,
                                    style: {
                                        fontSize: '10px',
                                        color: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        }
                    }, false);

                    chart.redraw();

                    [].forEach.call(gridLines, function (element, index) {
                        if (index !== 7) {
                            element.style.transition = 'all 2s';
                            element.style.opacity = 1;
                        }
                    });
                }, 2000);
            }
        }
    },
    credits: {
        enabled: false
    },
    colors: colors,
    xAxis: {
        visible: false,
        categories: [
            'Apples',
            'Pears',
            'Bananas',
            'Oranges',
            'Lemons',
            'Limes',
            'Grapes',
            'Kiwis',
            'Mangoes',
            'Strawberries'
        ]
    },
    yAxis: {
        gridLineColor: 'transparent',
        title: {
            text: ''
        },
        tickPositions: [-300, -200, -100, 0, 100, 200, 300, 400],
        labels: {
            enabled: false,
            style: {
                color: '#f0f0f0'
            }
        }
    },
    legend: {
        enabled: false
    },
    accessibility: {
        description:
            'The column chart is displaying fictional fruit consumption data.',
        enabled: true
    },
    title: {
        floating: true,
        useHTML: true,
        align: 'left',
        y: -30,
        verticalAlign: 'bottom',
        text: 'Highcharts Stacked Column Chart',
        style: {
            fontSize: '14px'
        }
    },
    subtitle: {
        floating: true,
        useHTML: true,
        verticalAlign: 'bottom',
        align: 'left',
        y: -15,
        style: {
            fontSize: '14px'
        },
        text: '<a href="https://www.highcharts.com/demo/highcharts/column-stacked">See full demo</a>'
    },
    plotOptions: {
        series: {
            borderRadius: 4,
            opacity: 0.8,
            groupPadding: 0,
            pointPadding: 0,
            pointWidth: 100,
            borderColor: 'transparent',
            borderWidth: 2,
            dataLabels: {
                enabled: false,
                style: {
                    textOutline: 'none',
                    color: 'rbga(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 300
                }
            },
            stacking: 'normal'
        }
    },
    series: [
        {
            data: [
                -71.5, -106.4, 129.2, -144.0, 176.0, -135.6, 148.5, -216.4,
                194.1, -95.6
            ],
            type: 'column'
        },
        {
            data: [
                -71.5, -106.4, 129.2, -144.0, 176.0, -135.6, 148.5, 216.4,
                194.1, 95.6
            ].reverse(),
            type: 'column'
        },
        {
            data: [
                71.5, 106.4, -129.2, 144.0, 176.0, -135.6, 148.5, 216.4, 194.1,
                95.6
            ]
        }
    ]
};

const strColors = [
    '#6975FF', // purple
    '#6EE7B7', // green
    '#A5ACFF', // purple 400
    '#34D399', // green 400
    '#F59E0B', // yellow 500
    '#FCD34D', // yellow 300
    '#D1FAE5', // green 100,
    '#F59E0B', // yellow 500
    '#F0F1FF',  // purple 100
    '#FCA5A5'  // red 300

];
// streamgraph
const str = {

    chart: {
        type: 'streamgraph',
        animation: {
            duration: 2000,
            easing: 'easeOutQuint'
        },
        margin: 0,
        spacing: 0,
        zooming: {
            type: 'x',
            resetButton: {
                theme: {
                    fill: 'red'
                }
            }
        },
        events: {
            load: function () {
                const chart = this;

                setTimeout(function () {
                    chart.xAxis[0].setExtremes(5, 12);
                    chart.yAxis[0].setExtremes(-50, 50);
                    chart.showResetZoom();
                }, 2000);
            }
        }
    },

    // Make sure connected countries have similar colors
    colors: [
        strColors[0],
        strColors[1],
        strColors[2],
        strColors[3],
        strColors[4],
        // East Germany, West Germany and Germany
        Highcharts.color(strColors[5]).brighten(0.2).get(),
        Highcharts.color(strColors[5]).brighten(0.1).get(),

        strColors[5],
        strColors[6],
        strColors[7],
        strColors[8],
        strColors[9],
        strColors[0],
        strColors[1],
        strColors[3],
        // Soviet Union, Russia
        Highcharts.color(strColors[2]).brighten(-0.1).get(),
        Highcharts.color(strColors[2]).brighten(-0.2).get(),
        Highcharts.color(strColors[2]).brighten(-0.3).get()
    ],
    credits: {
        enabled: false
    },
    title: {
        floating: true,
        align: 'left',
        y: -45,
        x: 10,
        verticalAlign: 'bottom',
        text: 'Highcharts Streamgraph',
        style: {
            fontSize: '14px'
        }
    },
    subtitle: {
        floating: true,
        useHTML: true,
        verticalAlign: 'bottom',
        align: 'left',
        y: -30,
        x: 10,
        style: {
            fontSize: '14px'
        },
        text: '<a style="color:#C8C7D1;" href="https://www.highcharts.com/demo/highcharts/streamgraph">See full demo</a>'
    },

    xAxis: {
        maxPadding: 0,
        height: '75%',
        visible: false,
        type: 'category',
        crosshair: true,
        categories: [
            '',
            '1924 Chamonix',
            '1928 St. Moritz',
            '1932 Lake Placid',
            '1936 Garmisch-Partenkirchen',
            '1940 <i>Cancelled (Sapporo)</i>',
            '1944 <i>Cancelled (Cortina d\'Ampezzo)</i>',
            '1948 St. Moritz',
            '1952 Oslo',
            '1956 Cortina d\'Ampezzo',
            '1960 Squaw Valley',
            '1964 Innsbruck',
            '1968 Grenoble',
            '1972 Sapporo',
            '1976 Innsbruck',
            '1980 Lake Placid',
            '1984 Sarajevo',
            '1988 Calgary',
            '1992 Albertville',
            '1994 Lillehammer',
            '1998 Nagano',
            '2002 Salt Lake City',
            '2006 Turin',
            '2010 Vancouver',
            '2014 Sochi'
        ],
        labels: {
            align: 'left',
            reserveSpace: false,
            rotation: 270,
            style: {
                color: '#ACABBA',
                fontWeight: 'normal'
            }
        },
        lineWidth: 0,
        margin: 20,
        tickWidth: 0
    },

    yAxis: {
        visible: false,
        startOnTick: false,
        endOnTick: false
    },

    legend: {
        enabled: false
    },

    // annotations: [{
    //     labels: [{
    //         point: {
    //             x: 5.5,
    //             xAxis: 0,
    //             y: 30,
    //             yAxis: 0
    //         },
    //         text: 'Cancelled<br>during<br>World War II'
    //     }, {
    //         point: {
    //             x: 18,
    //             xAxis: 0,
    //             y: 90,
    //             yAxis: 0
    //         },
    //         text: 'Soviet Union fell,<br>Germany united'
    //     }],
    //     labelOptions: {
    //         backgroundColor: 'rgba(255,255,255,0.5)',
    //         borderColor: 'silver'
    //     }
    // }],

    plotOptions: {
        series: {
            lineWidth: 1,
            animation: {
                duration: 2000
            },
            label: {
                minFontSize: 5,
                maxFontSize: 15,
                style: {
                    color: 'rgba(255,255,255,0.75)'
                }
            },
            accessibility: {
                exposeAsGroupOnly: true
            }
        }
    },

    // Data parsed with olympic-medals.node.js
    series: [{
        name: 'Finland',
        data: [
            0, 11, 4, 3, 6, 0, 0, 6, 9, 7, 8, 10, 5, 5, 7, 9, 13, 7,
            7, 6, 12, 7, 9, 5, 5
        ]
    }, {
        name: 'Austria',
        data: [
            0, 3, 4, 2, 4, 0, 0, 8, 8, 11, 6, 12, 11, 5, 6, 7, 1, 10,
            21, 9, 17, 17, 23, 16, 17
        ]
    }, {
        name: 'Sweden',
        data: [
            0, 2, 5, 3, 7, 0, 0, 10, 4, 10, 7, 7, 8, 4, 2, 4, 8, 6, 4,
            3, 3, 7, 14, 11, 15
        ]
    }, {
        name: 'Norway',
        data: [
            0, 17, 15, 10, 15, 0, 0, 10, 16, 4, 6, 15, 14, 12, 7, 10,
            9, 5, 20, 26, 25, 25, 19, 23, 26
        ]
    }, {
        name: 'U.S.',
        data: [
            0, 4, 6, 12, 4, 0, 0, 9, 11, 7, 10, 7, 7, 8, 10, 12, 8, 6,
            11, 13, 13, 34, 25, 37, 28
        ]
    }, {
        name: 'East Germany',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 14, 19, 23, 24, 25,
            0, 0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'West Germany',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 5, 10, 5, 4, 8, 0,
            0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'Germany',
        data: [
            0, 0, 1, 2, 6, 0, 0, 0, 7, 2, 8, 9, 0, 0, 0, 0, 0, 0, 26,
            24, 29, 36, 29, 30, 19
        ]
    }, {
        name: 'Netherlands',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 2, 9, 9, 6, 4, 0, 7, 4,
            4, 11, 8, 9, 8, 24
        ]
    }, {
        name: 'Italy',
        data: [
            0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 4, 4, 5, 4, 2, 2, 5, 14,
            20, 10, 13, 11, 5, 8
        ]
    }, {
        name: 'Canada',
        data: [
            0, 1, 1, 7, 1, 0, 0, 3, 2, 3, 4, 3, 3, 1, 3, 2, 4, 5, 7,
            13, 15, 17, 24, 26, 25
        ]
    }, {
        name: 'Switzerland',
        data: [
            0, 3, 1, 1, 3, 0, 0, 10, 2, 6, 2, 0, 6, 10, 5, 5, 5, 15,
            3, 9, 7, 11, 14, 9, 11
        ]
    }, {
        name: 'Great Britain',
        data: [
            0, 4, 1, 0, 3, 0, 0, 2, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0,
            2, 1, 2, 1, 1, 4
        ]
    }, {
        name: 'France',
        data: [
            0, 3, 1, 1, 1, 0, 0, 5, 1, 0, 3, 7, 9, 3, 1, 1, 3, 2, 9,
            5, 8, 11, 9, 11, 15
        ]
    }, {
        name: 'Hungary',
        data: [
            0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'Unified Team',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23,
            0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'Soviet Union',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 21, 25, 13, 16, 27, 22, 25,
            29, 0, 0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'Russia',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            23, 18, 13, 22, 15, 33
        ]
    }, {
        name: 'Japan',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 1, 1, 1, 7,
            5, 10, 2, 1, 5, 8
        ]
    }, {
        name: 'Czechoslovakia',
        data: [
            0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 4, 3, 1, 1, 6, 3, 3,
            0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'Poland',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0,
            0, 0, 2, 2, 6, 6
        ]
    }, {
        name: 'Spain',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
            0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'China',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3,
            3, 8, 8, 11, 11, 9
        ]
    }, {
        name: 'South Korea',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
            6, 6, 4, 11, 14, 8
        ]
    }, {
        name: 'Czech Republic',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 3, 3, 4, 6, 8
        ]
    }, {
        name: 'Belarus',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2, 2, 1, 1, 3, 6
        ]
    }, {
        name: 'Kazakhstan',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            3, 2, 0, 0, 1, 1
        ]
    }, {
        name: 'Bulgaria',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
            0, 1, 3, 1, 0, 0
        ]
    }, {
        name: 'Denmark',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 0, 0, 0
        ]
    }, {
        name: 'Ukraine',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2, 1, 0, 2, 0, 2
        ]
    }, {
        name: 'Australia',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 2, 2, 3, 3
        ]
    }, {
        name: 'Belgium',
        data: [
            0, 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 0, 0, 0
        ]
    }, {
        name: 'Romania',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'Liechtenstein',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 0,
            0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'Yugoslavia',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0,
            0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'Luxembourg',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
            0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'New Zealand',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'North Korea',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
            0, 0, 0, 0, 0, 0
        ]
    }, {
        name: 'Slovakia',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1, 3, 1
        ]
    }, {
        name: 'Croatia',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 4, 3, 3, 1
        ]
    }, {
        name: 'Slovenia',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            3, 0, 1, 0, 3, 8
        ]
    }, {
        name: 'Latvia',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1, 2, 4
        ]
    }, {
        name: 'Estonia',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 3, 3, 1, 0
        ]
    }, {
        name: 'Uzbekistan',
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0
        ]
    }],

    exporting: {
        sourceWidth: 800,
        sourceHeight: 600
    }

};


// radial bar
const rb = {
    chart: {
        type: 'column',
        animation: {
            duration: 3000,
            easing: 'easeOutQuint'
        },
        margin: [0, 0, 0, 0],
        inverted: true,
        spacing: 0,
        polar: true,
        backgroundColor: 'transparent',
        events: {
            load: function () {
                const chart = this;

                setTimeout(function () {
                    chart.update({
                        pane: {
                            size: '100%',
                            innerSize: '0%',
                            startAngle: -90,
                            endAngle: 270
                        }


                    }, false);
                    chart.series[0].update({
                        groupPadding: 0.15
                    }, false);
                    chart.redraw();
                }, 0);
            }
        }
    },
    colors: colors,
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    title: {
        floating: true,
        useHTML: true,
        align: 'left',
        y: -55,
        x: 12,
        verticalAlign: 'bottom',
        text: 'Highcharts Radial Bar Chart',
        style: {
            fontSize: '14px'
        }
    },
    subtitle: {
        floating: true,
        useHTML: true,
        verticalAlign: 'bottom',
        align: 'left',
        y: -35,
        x: 12,
        style: {
            fontSize: '14px'
        },
        text: '<a href="https://www.highcharts.com/demo/highcharts/polar-radial-bar">See full demo</a>'
    },
    pane: {
        size: '1000%',
        innerSize: '20%',
        startAngle: 0,
        endAngle: 270
    },
    xAxis: {
        tickInterval: 1,
        visible: false,
        crosshair: {
            snap: false,
            width: 2,
            zIndex: 5,
            color: '#BBBAC5'
        }
    },
    yAxis: {
        visible: false,
        min: 0,
        max: 250,
        tickInterval: 25,
        crosshair: {
            snap: false,
            width: 2,
            zIndex: 5,
            color: '#BBBAC5'
        }
    },
    series: [{
        animation: false,
        borderWidth: 0,
        pointPadding: 0,
        groupPadding: 0,
        borderRadius: 10, // causes a cool animation effect
        colorByPoint: true,
        data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54]
    }]
};

// jellypus

const jellypus = {
    chart: {
        // styledMode: (true),
        margin: 0,
        animation: {
            duration: 12000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                const jpSeries = chart.series[0];

                setTimeout(function () {
                    jpSeries.nodes[12].update(
                        {
                            plotX: -2000,
                            plotY: 200
                        },
                        false
                    );

                    chart.redraw();

                }, 3000);

            }
        }
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    title: {
        floating: true,
        align: 'left',
        y: -30,
        verticalAlign: 'bottom',
        text: 'Highcharts Network Graph',
        style: {
            fontSize: '14px'
        }
    },
    subtitle: {
        floating: true,
        useHTML: true,
        verticalAlign: 'bottom',
        align: 'left',
        style: {
            fontSize: '14px'
        },
        y: -15,
        text: '<a style="color:#C8C7D1;" href="https://www.highcharts.com/blog/tutorials/drawing-with-data-part-1/">Read about this chart</a>'
    },
    plotOptions: {
        series: {
            animation: false,
            marker: {
                enabled: false
            },
            zIndex: 10
        },
        networkgraph: {
            keys: ['from', 'to']
        }
    },
    series: [
        // 0 jellypus
        {
            type: 'networkgraph',
            className: 'jellypus',
            zIndex: 2,
            marker: {
                enabled: true,
                radius: 5,
                symbol: 'circle'
            },
            layoutAlgorithm: {
                enableSimulation: true,
                initialPositions: 'random',
                // Applied only to links, should be 0
                attractiveForce: function () {
                    return 2;
                },
                repulsiveForce: function () {
                    return 1;
                },
                linkLength: 2,
                integration: 'euler',
                gravitationalConstant: 2
            },
            nodes: [
                {
                    id: '0',

                    marker: {
                        radius: 8
                    },
                    mass: 1
                },
                {
                    id: '1',
                    mass: 1,
                    marker: {
                        radius: 3
                    }
                },
                {
                    id: '2',
                    mass: 1,
                    marker: {
                        radius: 3
                    }
                },
                {
                    id: '3',
                    mass: 1,
                    marker: {
                        radius: 3
                    }
                },
                {
                    id: '4',
                    mass: 1,
                    marker: {
                        radius: 3
                    }
                },
                {
                    id: '5',
                    mass: 1,
                    marker: {
                        radius: 4
                    }
                },
                {
                    id: '6',
                    mass: 1,
                    marker: {
                        radius: 4
                    }
                },
                {
                    id: '7',
                    mass: 1,
                    marker: {
                        radius: 10
                    }
                },
                {
                    id: '8',
                    mass: 1,
                    marker: {
                        radius: 5
                    }
                },
                {
                    id: '9',
                    mass: 1,
                    marker: {
                        radius: 6
                    }
                },
                {
                    id: '10',
                    mass: 1,
                    marker: {
                        radius: 6
                    }
                },
                {
                    id: '11',
                    mass: 1,
                    marker: {
                        radius: 7
                    }
                },
                {
                    id: '12',
                    className: 'head',
                    mass: 200,
                    marker: {
                        radius: 20
                    }
                },
                {
                    id: '13',
                    mass: 1,
                    marker: {
                        radius: 8
                    }
                },
                {
                    id: '14',
                    mass: 1,
                    marker: {
                        radius: 8
                    }
                },
                {
                    id: '15',
                    mass: 1,
                    marker: {
                        radius: 9
                    }
                },
                {
                    id: '16',
                    mass: 1,
                    marker: {
                        radius: 9
                    }
                },
                {
                    id: '17',
                    mass: 1,
                    marker: {
                        radius: 10
                    }
                },
                {
                    id: '18',
                    mass: 1,
                    marker: {
                        radius: 10
                    }
                },
                {
                    id: '19',
                    mass: 1,
                    marker: {
                        radius: 1
                    }
                },
                {
                    id: '20',
                    mass: 1,
                    marker: {
                        radius: 1
                    }
                },
                {
                    id: '21',
                    mass: 1,
                    marker: {
                        radius: 2
                    }
                },
                {
                    id: '22',
                    mass: 1,
                    marker: {
                        radius: 2
                    }
                },
                {
                    id: '23',
                    mass: 1,
                    marker: {
                        radius: 3
                    }
                },
                {
                    id: '24',
                    mass: 1,
                    marker: {
                        radius: 3
                    }
                },
                {
                    id: '25',
                    mass: 1,
                    marker: {
                        radius: 4
                    }
                },
                {
                    id: '26',
                    mass: 1,
                    marker: {
                        radius: 4
                    }
                },
                {
                    id: '27',
                    mass: 1,
                    marker: {
                        radius: 5
                    }
                },
                {
                    id: '28',
                    mass: 1,
                    marker: {
                        radius: 5
                    }
                },
                {
                    id: '29',
                    mass: 1,
                    marker: {
                        radius: 6
                    }
                },
                {
                    id: '30',
                    mass: 1,
                    marker: {
                        radius: 6
                    }
                }
            ],
            data: [
                ['0', '1'],
                ['1', '2'],
                ['1', '3'],
                ['1', '4'],
                ['1', '5'],
                ['1', '6'],
                ['1', '7'],
                ['1', '8'],
                ['1', '9'],
                ['1', '10'],
                ['1', '11'],
                ['1', '12'],
                ['1', '13'],
                ['1', '14'],
                ['1', '15'],
                ['1', '16'],
                ['1', '17'],
                ['1', '18'],
                ['1', '19'],
                ['1', '20'],
                ['1', '21'],
                ['1', '22'],
                ['1', '23'],
                ['1', '24'],
                ['1', '25'],
                ['1', '26'],
                ['1', '27'],
                ['1', '28'],
                ['1', '29'],
                ['1', '30'],
                ['1', '31'],
                ['1', '32'],
                ['1', '33'],
                ['1', '34'],
                ['1', '35'],
                ['1', '36'],
                ['1', '37'],
                ['1', '38'],
                ['1', '39'],
                ['1', '40'],
                ['1', '41'],
                ['1', '42'],
                ['1', '43'],
                ['1', '44'],
                ['1', '45'],
                ['1', '46'],
                ['1', '47'],
                ['1', '48'],
                ['1', '49'],
                ['1', '50'],

                ['1', '51'],
                ['1', '52'],
                ['1', '53'],
                ['1', '54'],
                ['1', '55'],
                ['1', '56'],
                ['1', '57'],
                ['1', '58'],
                ['1', '59'],
                ['1', '60'],
                ['1', '61'],
                ['1', '62'],
                ['1', '63'],
                ['1', '64'],
                ['1', '65'],
                ['1', '66'],
                ['1', '67'],
                ['1', '68'],
                ['1', '69'],
                ['1', '70'],
                ['1', '71'],
                ['1', '72'],
                ['1', '73'],
                ['1', '74'],
                ['1', '75'],
                ['1', '76'],
                ['1', '77'],
                ['1', '78'],
                ['1', '79'],
                ['1', '80'],
                ['1', '81'],
                ['1', '82'],
                ['1', '83'],
                ['1', '84'],
                ['1', '85'],
                ['1', '86'],
                ['1', '87'],
                ['1', '88'],
                ['1', '89'],
                ['1', '90'],
                ['1', '91'],
                ['1', '92'],
                ['1', '93'],
                ['1', '94'],
                ['1', '95'],
                ['1', '96'],
                ['1', '97'],
                ['1', '98']
            ]
        }
    ]
};

// live candlestick

let csInterval;

function cs() {
    const options = {
        title: {
            floating: true,
            align: 'left',
            y: -30,
            verticalAlign: 'bottom',
            text: 'Highstock Dynamic Candlestick Chart',
            style: {
                fontSize: '14px'
            }
        },
        subtitle: {
            floating: true,
            useHTML: true,
            verticalAlign: 'bottom',
            align: 'left',
            y: -15,
            style: {
                fontSize: '14px'
            },
            text: '<a href="https://www.highcharts.com/demo/stock/live-candlestick">See full demo</a>'
        },

        xAxis: {
            overscroll: 500000,
            range: 4 * 200000,
            gridLineWidth: 0,
            visible: false
        },

        yAxis: {
            visible: false,
            height: '80%'
        },
        credits: {
            enabled: false
        },

        rangeSelector: {
            buttons: [{
                type: 'minute',
                count: 15,
                text: '15m'
            }, {
                type: 'hour',
                count: 1,
                text: '1h'
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }],
            selected: 0,
            inputEnabled: false,
            buttonTheme: { // styles for the buttons
                fill: '#474554',
                stroke: '#474554',
                'stroke-width': 1,
                r: 4,
                style: {
                    color: '#ACABBA',
                    fontWeight: 'bold'
                },
                states: {
                    hover: {
                    },
                    select: {
                        fill: '#474554',
                        style: {
                            color: '#E3E3E8'
                        }
                    }
                // disabled: { ... }
                }
            }
        },

        navigator: {
            top: 300,
            series: {
                color: '#545ECC',
                fillOpacity: 1
            },
            xAxis: {
                labels: {
                    style: {
                        textOutline: 'none',
                        color: 'white'
                    }
                }
            }
        },

        series: [{
            type: 'candlestick',
            color: '#EF4444',
            upColor: '#90EE90',
            lineColor: '#FEF3C7',
            lastPrice: {
                enabled: true,
                label: {
                    enabled: true,
                    backgroundColor: '#EF4444'
                }
            }
        }]
    };

    // Imitate getting point from backend
    function getNewPoint(i, data) {
        const lastPoint = data[data.length - 1];

        // Add new point
        if (i === 0 || i % 10 === 0) {
            return [
                lastPoint[0] + 60000,
                lastPoint[4],
                lastPoint[4],
                lastPoint[4],
                lastPoint[4]
            ];
        }
        const updatedLastPoint = data[data.length - 1],
            newClose = Highcharts.correctFloat(
                lastPoint[4] + Highcharts.correctFloat(Math.random() - 0.5, 2),
                4
            );

        // Modify last data point
        return [
            updatedLastPoint[0],
            data[data.length - 2][4],
            newClose >= updatedLastPoint[2] ? newClose : updatedLastPoint[2],
            newClose <= updatedLastPoint[3] ? newClose : updatedLastPoint[3],
            newClose
        ];
    }

    // On load, start the interval that adds points
    options.chart = {
        events: {
            load() {
                const chart = this,
                    series = chart.series[0];

                let i = 0;

                csInterval = setInterval(() => {
                    const data = series.options.data,
                        newPoint = getNewPoint(i, data),
                        lastPoint = data[data.length - 1];

                    // Different x-value, we need to add a new point
                    if (lastPoint[0] !== newPoint[0]) {
                        series.addPoint(newPoint);
                    } else {
                    // Existing point, update it
                        series.options.data[data.length - 1] = newPoint;

                        series.setData(data);
                    }
                    i++;
                }, 100);
            }
        },
        marginTop: 50
    };

    // Apply the data to the options
    options.series[0].data = [
        [
            1317888000000,
            372.5101,
            375,
            372.2,
            372.52
        ],
        [
            1317888060000,
            372.4,
            373,
            372.01,
            372.16
        ],
        [
            1317888120000,
            372.16,
            372.4,
            371.39,
            371.62
        ],
        [
            1317888180000,
            371.62,
            372.16,
            371.55,
            371.75
        ],
        [
            1317888240000,
            371.75,
            372.4,
            371.57,
            372
        ],
        [
            1317888300000,
            372,
            372.3,
            371.8,
            372.24
        ],
        [
            1317888360000,
            372.22,
            372.45,
            372.22,
            372.3
        ],
        [
            1317888420000,
            372.3,
            373.25,
            372.3,
            373.15
        ],
        [
            1317888480000,
            373.01,
            373.5,
            373,
            373.24
        ],
        [
            1317888540000,
            373.36,
            373.88,
            373.19,
            373.88
        ],
        [
            1317888600000,
            373.8,
            374.34,
            373.75,
            374.29
        ],
        [
            1317888660000,
            374.29,
            374.43,
            374,
            374.01
        ],
        [
            1317888720000,
            374.05,
            374.35,
            373.76,
            374.35
        ],
        [
            1317888780000,
            374.41,
            375.24,
            374.37,
            374.9
        ],
        [
            1317888840000,
            374.83,
            375.73,
            374.81,
            374.96
        ],
        [
            1317888900000,
            374.81,
            375.4,
            374.81,
            375.25
        ],
        [
            1317888960000,
            375.2,
            375.7,
            375.14,
            375.19
        ],
        [
            1317889020000,
            375.43,
            375.43,
            374.75,
            374.76
        ],
        [
            1317889080000,
            374.94,
            375.5,
            374.81,
            375.13
        ],
        [
            1317889140000,
            375.12,
            375.48,
            375,
            375.04
        ],
        [
            1317889200000,
            375.24,
            375.24,
            375,
            375.08
        ],
        [
            1317889260000,
            375.16,
            375.16,
            374.51,
            374.51
        ],
        [
            1317889320000,
            374.51,
            374.75,
            374.2,
            374.27
        ],
        [
            1317889380000,
            374.22,
            374.55,
            373.83,
            374.55
        ],
        [
            1317889440000,
            374.69,
            374.86,
            374.01,
            374.2
        ],
        [
            1317889500000,
            374.32,
            374.65,
            374.31,
            374.51
        ],
        [
            1317889560000,
            374.65,
            375.12,
            374.51,
            375.12
        ],
        [
            1317889620000,
            375.13,
            375.25,
            374.83,
            375.22
        ],
        [
            1317889680000,
            375.16,
            375.22,
            375,
            375
        ],
        [
            1317889740000,
            375,
            375,
            374.66,
            374.8
        ],
        [
            1317889800000,
            374.88,
            375,
            374.5,
            374.85
        ],
        [
            1317889860000,
            374.41,
            374.67,
            374.25,
            374.67
        ],
        [
            1317889920000,
            374.5,
            374.75,
            374.27,
            374.42
        ],
        [
            1317889980000,
            374.4,
            374.93,
            374.38,
            374.85
        ],
        [
            1317890040000,
            374.86,
            375.3,
            374.8,
            375.09
        ],
        [
            1317890100000,
            375,
            375.18,
            374.9,
            375.02
        ],
        [
            1317890160000,
            375.02,
            375.08,
            374.86,
            374.87
        ],
        [
            1317890220000,
            374.93,
            375.75,
            374.93,
            375.75
        ],
        [
            1317890280000,
            375.75,
            376.5,
            375.75,
            376.31
        ],
        [
            1317890340000,
            376.31,
            377.2,
            376.19,
            377.04
        ],
        [
            1317890400000,
            377.2,
            377.33,
            376.45,
            376.47
        ],
        [
            1317890460000,
            376.75,
            376.99,
            376.53,
            376.54
        ],
        [
            1317890520000,
            376.54,
            376.67,
            376.08,
            376.35
        ],
        [
            1317890580000,
            376.41,
            376.94,
            376.2,
            376.5
        ],
        [
            1317890640000,
            376.46,
            376.51,
            376.06,
            376.09
        ],
        [
            1317890700000,
            376.38,
            376.84,
            376.09,
            376.78
        ],
        [
            1317890760000,
            376.55,
            376.6,
            376.41,
            376.44
        ],
        [
            1317890820000,
            376.45,
            376.87,
            376.31,
            376.87
        ],
        [
            1317890880000,
            376.83,
            377,
            376.63,
            376.95
        ],
        [
            1317890940000,
            376.95,
            377,
            376.1,
            376.1
        ],
        [
            1317891000000,
            376.1,
            376.17,
            375.64,
            375.65
        ],
        [
            1317891060000,
            375.68,
            376.05,
            375.32,
            376.05
        ],
        [
            1317891120000,
            376.03,
            376.04,
            375.5,
            375.72
        ],
        [
            1317891180000,
            375.83,
            376.195,
            375.7,
            376
        ],
        [
            1317891240000,
            376.01,
            376.6,
            376,
            376.5
        ],
        [
            1317891300000,
            376.5,
            376.53,
            376.11,
            376.21
        ],
        [
            1317891360000,
            376.17,
            376.3,
            376.1,
            376.25
        ],
        [
            1317891420000,
            376.4,
            376.4,
            376.13,
            376.29
        ],
        [
            1317891480000,
            376.15,
            376.39,
            376.1,
            376.39
        ],
        [
            1317891540000,
            376.4,
            377.11,
            376.4,
            377
        ],
        [
            1317891600000,
            377.01,
            377.15,
            376.79,
            377.15
        ],
        [
            1317891660000,
            377.02,
            377.15,
            376.55,
            376.88
        ],
        [
            1317891720000,
            376.67,
            376.76,
            376.52,
            376.53
        ],
        [
            1317891780000,
            376.78,
            376.91,
            376.53,
            376.82
        ],
        [
            1317891840000,
            376.73,
            376.86,
            376.7,
            376.75
        ],
        [
            1317891900000,
            376.7,
            376.71,
            376.5,
            376.57
        ],
        [
            1317891960000,
            376.53,
            376.74,
            376.2,
            376.2
        ],
        [
            1317892020000,
            376.17,
            376.17,
            375.91,
            376
        ],
        [
            1317892080000,
            376,
            376,
            375.77,
            375.77
        ],
        [
            1317892140000,
            375.78,
            375.88,
            375.51,
            375.57
        ],
        [
            1317892200000,
            375.57,
            375.79,
            375.34,
            375.63
        ],
        [
            1317892260000,
            375.63,
            375.78,
            375.35,
            375.41
        ],
        [
            1317892320000,
            375.38,
            375.61,
            375.35,
            375.58
        ],
        [
            1317892380000,
            375.55,
            375.57,
            375.34,
            375.48
        ],
        [
            1317892440000,
            375.43,
            375.57,
            375.12,
            375.13
        ],
        [
            1317892500000,
            375.15,
            375.3,
            374.86,
            375
        ],
        [
            1317892560000,
            374.9,
            375.31,
            374.72,
            375.14
        ],
        [
            1317892620000,
            375,
            375.2,
            374.9,
            375.06
        ],
        [
            1317892680000,
            375.18,
            375.6,
            375.12,
            375.6
        ],
        [
            1317892740000,
            375.6,
            375.87,
            375.5,
            375.5
        ],
        [
            1317892800000,
            375.49,
            375.49,
            375.04,
            375.25
        ],
        [
            1317892860000,
            375.25,
            375.46,
            375,
            375.24
        ],
        [
            1317892920000,
            375.38,
            375.45,
            375,
            375.1
        ],
        [
            1317892980000,
            375.09,
            375.24,
            374.83,
            374.97
        ],
        [
            1317893040000,
            375.01,
            375.01,
            374.8,
            374.87
        ],
        [
            1317893100000,
            374.98,
            375.12,
            374.98,
            375
        ],
        [
            1317893160000,
            374.9,
            374.95,
            374.75,
            374.87
        ],
        [
            1317893220000,
            374.89,
            375.44,
            374.87,
            375.12
        ],
        [
            1317893280000,
            375.06,
            375.12,
            373.56,
            374.05
        ],
        [
            1317893340000,
            374.1,
            374.3,
            373.16,
            373.21
        ],
        [
            1317893400000,
            373.39,
            375,
            372.58,
            374.8
        ],
        [
            1317893460000,
            374.899,
            375.23,
            374.33,
            374.75
        ],
        [
            1317893520000,
            374.79,
            376.71,
            374.69,
            376.31
        ],
        [
            1317893580000,
            376.32,
            376.37,
            375.27,
            375.331
        ],
        [
            1317893640000,
            375.3301,
            377.44,
            375.33,
            377.43
        ],
        [
            1317893700000,
            377.43,
            378.14,
            376.83,
            377.08
        ],
        [
            1317893760000,
            377.18,
            378,
            376.5,
            376.7
        ],
        [
            1317893820000,
            376.83,
            377,
            375.51,
            375.79
        ],
        [
            1317893880000,
            375.6501,
            376.74,
            375.23,
            376.39
        ],
        [
            1317893940000,
            376.38,
            378.75,
            376.25,
            378.5
        ],
        [
            1317894000000,
            378.54,
            378.63,
            376.75,
            376.87
        ],
        [
            1317894060000,
            376.8664,
            377.62,
            376.64,
            376.908
        ],
        [
            1317894120000,
            376.8336,
            377.88,
            376.8289,
            377.55
        ],
        [
            1317894180000,
            377.36,
            377.9,
            376.52,
            376.75
        ],
        [
            1317894240000,
            376.83,
            377.73,
            376.71,
            376.98
        ],
        [
            1317894300000,
            377,
            377.69,
            376.87,
            377.1212
        ],
        [
            1317894360000,
            377.225,
            377.33,
            376.01,
            376.26
        ],
        [
            1317894420000,
            376.42,
            376.64,
            375.55,
            375.5534
        ],
        [
            1317894480000,
            375.74,
            375.94,
            374.77,
            375.3
        ],
        [
            1317894540000,
            375.3313,
            376,
            374.92,
            375.06
        ],
        [
            1317894600000,
            375.11,
            375.46,
            374.82,
            374.92
        ],
        [
            1317894660000,
            374.82,
            375.68,
            374.64,
            375.668
        ],
        [
            1317894720000,
            375.62,
            376.13,
            375.46,
            376.13
        ],
        [
            1317894780000,
            376.14,
            376.6,
            375.89,
            376.34
        ],
        [
            1317894840000,
            376.39,
            376.39,
            375.55,
            375.99
        ],
        [
            1317894900000,
            376,
            376.28,
            375.42,
            376.21
        ],
        [
            1317894960000,
            376,
            377.38,
            375.7,
            376.591
        ],
        [
            1317895020000,
            376.59,
            377.46,
            376.57,
            376.9348
        ],
        [
            1317895080000,
            376.9481,
            377.749,
            376.84,
            377.563
        ],
        [
            1317895140000,
            377.452,
            377.65,
            376.43,
            376.78
        ],
        [
            1317895200000,
            376.94,
            377.01,
            375.75,
            375.98
        ],
        [
            1317895260000,
            376.27,
            377.29,
            375.95,
            376.98
        ],
        [
            1317895320000,
            376.9962,
            377.3,
            376.69,
            376.71
        ],
        [
            1317895380000,
            376.75,
            377.5,
            376.75,
            377.41
        ],
        [
            1317895440000,
            377.26,
            377.49,
            376.89,
            377.368
        ],
        [
            1317895500000,
            377.345,
            378,
            377.17,
            378
        ],
        [
            1317895560000,
            377.97,
            378.3199,
            377.68,
            377.97
        ],
        [
            1317895620000,
            378.01,
            378.07,
            377.25,
            377.37
        ],
        [
            1317895680000,
            377.37,
            377.75,
            377.05,
            377.12
        ],
        [
            1317895740000,
            377.16,
            377.79,
            377.01,
            377.4512
        ]
    ];

    // Create the chart
    currentChart = Highcharts.stockChart('container', options);
}

// bar chart race
let barInterval;

function barchartRace() {

    const startYear = 2000,
        endYear = 2018,
        controls = document.getElementById('play-controls'),
        btn = document.getElementById('play-pause-button'),
        input = document.getElementById('play-range'),
        nbr = 20;

    controls.style.visibility = 'visible';

    let dataset, chart;


    /*
    * Animate dataLabels functionality
    */
    (function (H) {
        const FLOAT = /^-?\d+\.?\d*$/;

        // Add animated textSetter, just like fill/strokeSetters
        H.Fx.prototype.textSetter = function () {
            let startValue = this.start.replace(/ /g, ''),
                endValue = this.end.replace(/ /g, ''),
                currentValue = this.end.replace(/ /g, '');

            if ((startValue || '').match(FLOAT)) {
                startValue = parseInt(startValue, 10);
                endValue = parseInt(endValue, 10);

                // No support for float
                currentValue = Highcharts.numberFormat(
                    Math.round(startValue + (endValue - startValue) * this.pos),
                    0
                );
            }

            this.elem.endText = this.end;

            this.elem.attr(this.prop, currentValue, null, true);
        };

        // Add textGetter, not supported at all at this moment:
        H.SVGElement.prototype.textGetter = function () {
            const ct = this.text.element.textContent || '';
            return this.endText ? this.endText : ct.substring(0, ct.length / 2);
        };

        // Temporary change label.attr() with label.animate():
        // In core it's simple change attr(...) => animate(...) for text prop
        H.wrap(H.Series.prototype, 'drawDataLabels', function (proceed) {
            const attr = H.SVGElement.prototype.attr,
                chart = this.chart;

            if (chart.sequenceTimer) {
                barInterval = chart.sequenceTimer;
                this.points.forEach(point =>
                    (point.dataLabels || []).forEach(
                        label =>
                            (label.attr = function (hash) {
                                if (
                                    hash &&
                                hash.text !== undefined &&
                                chart.isResizing === 0
                                ) {
                                    const text = hash.text;

                                    delete hash.text;

                                    return this
                                        .attr(hash)
                                        .animate({ text });
                                }
                                return attr.apply(this, arguments);

                            })
                    )
                );
            }

            const ret = proceed.apply(
                this,
                Array.prototype.slice.call(arguments, 1)
            );

            this.points.forEach(p =>
                (p.dataLabels || []).forEach(d => (d.attr = attr))
            );

            return ret;
        });
    }(Highcharts));


    function getData(year) {
        const output = Object.entries(dataset)
            .map(country => {
                const [countryName, countryData] = country;
                return [countryName, Number(countryData[year])];
            })
            .sort((a, b) => b[1] - a[1]);
        return [output[0], output.slice(1, nbr)];
    }

    // function getSubtitle() {
    //     const population =
    //      (getData(input.value)[0][1] / 1000000000).toFixed(2);
    //     return `<div style="font-weight:200;font-size: 3em;opacity: 0.4">
    //      ${input.value}</div>
    //     <div style="font-size: 22px;opacity: 0.4">
    //         Total: ${population} billion
    //     </div>`;
    // }

    (async () => {

        dataset = await fetch(
            'https://demo-live-data.highcharts.com/population.json'
        ).then(response => response.json());


        chart = Highcharts.chart('container', {
            chart: {
                animation: {
                    duration: 500
                },
                margin: [50, 0, 0, 0],
                events: {
                    load: function () {

                        document.getElementById('play-range').value = startYear;
                        setTimeout(() => {
                            // eslint-disable-next-line max-len
                            document.getElementById('play-pause-button').click();
                        }, 10);

                    }
                }
            },
            credits: {
                enabled: false
            },
            title: {
                floating: true,
                align: 'left',
                y: -30,
                verticalAlign: 'bottom',
                text: 'Highcharts Bar Chart Race',
                style: {
                    fontSize: '14px'
                }
            },
            subtitle: {
                floating: true,
                useHTML: true,
                verticalAlign: 'bottom',
                align: 'left',
                style: {
                    fontSize: '14px'
                },
                y: -15,
                text: '<a href="https://www.highcharts.com/demo/highcharts/bar-race">See full demo</a>'
            },

            legend: {
                enabled: false
            },
            xAxis: {
                type: 'category',
                visible: false,
                height: '75%',
                min: 6,
                max: 18
            },
            yAxis: {
                visible: false,
                opposite: true,
                tickPixelInterval: 150,
                title: {
                    text: null
                }
            },
            plotOptions: {
                series: {
                    animation: false,
                    groupPadding: 0,
                    pointPadding: 0.1,
                    borderWidth: 0,
                    borderColor: 'transparent',
                    colorByPoint: true,
                    dataSorting: {
                        enabled: true,
                        matchByName: true
                    },
                    type: 'bar',
                    dataLabels: {
                        enabled: true,
                        style: {
                            textOutline: false,
                            color: 'white',
                            fontWeight: 'normal',
                            fontSize: '10px'
                        }
                    }
                }
            },
            series: [
                {
                    type: 'bar',
                    name: startYear,
                    data: getData(startYear)[1]
                }
            ],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 550
                    },
                    chartOptions: {
                        xAxis: {
                            visible: false
                        },
                        subtitle: {
                            x: 0
                        },
                        plotOptions: {
                            series: {
                                dataLabels: [{
                                    enabled: true,
                                    y: 8
                                }, {
                                    enabled: true,
                                    format: '{point.name}',
                                    y: -8,
                                    style: {
                                        fontWeight: 'normal',
                                        opacity: 0.7
                                    }
                                }]
                            }
                        }
                    }
                }]
            }
        });
        currentChart = chart;
    })();

    /*
 * Pause the timeline, either when the range is ended, or when clicking the
 * pause button. Pausing stops the timer and resets the button to play mode.
 */
    function pause(button) {
        button.title = 'play';
        // button.className = 'fa fa-play';
        document.getElementById('play-arrow').style.display = 'block';
        document.getElementById('pause-bars').style.display = 'none';
        clearTimeout(chart.sequenceTimer);
        chart.sequenceTimer = undefined;
    }

    /*
 * Update the chart. This happens either on updating (moving) the range input,
 * or from a timer when the timeline is playing.
 */
    function update(increment) {
        if (increment) {
            input.value = parseInt(input.value, 10) + increment;
        }
        if (input.value >= endYear) {
        // Auto-pause
            pause(btn);
        }

        // chart.update(
        //     {
        //         subtitle: {
        //             text: getSubtitle()
        //         }
        //     },
        //     false,
        //     false,
        //     false
        // );

        chart.series[0].update({
            name: input.value,
            data: getData(input.value)[1]
        });
    }

    /*
 * Play the timeline.
 */
    function play(button) {
        button.title = 'pause';
        // button.className = 'fa fa-pause';
        document.getElementById('play-arrow').style.display = 'none';
        document.getElementById('pause-bars').style.display = 'block';
        chart.sequenceTimer = setInterval(function () {
            update(1);
        }, 500);
    }

    btn.addEventListener('click', function () {
        if (chart.sequenceTimer) {
            pause(this);
        } else {
            play(this);
        }
    });
    /*
 * Trigger the update on the range bar click.
 */
    input.addEventListener('click', function () {
        update();
    });

}

// packed bubble chart
const spb = {
    chart: {
        type: 'packedbubble',
        height: '70%'
    },
    credits: {
        enabled: false
    },
    colors: [
        '#6975FF',
        '#34D399',
        '#F59E0B',
        '#EF4444',
        '#87B4E7',
        '#6699A1'
    ],
    title: {
        floating: true,
        useHTML: true,
        align: 'left',
        y: -40,
        verticalAlign: 'bottom',
        text: 'Highcharts Split Packed<br>Bubble Chart',
        style: {
            fontSize: '14px'
        }
    },
    subtitle: {
        floating: true,
        useHTML: true,
        verticalAlign: 'bottom',
        align: 'left',
        style: {
            fontSize: '14px'
        },
        y: -25,
        text: '<a style="color:#C8C7D1;" href="https://www.highcharts.com/demo/highcharts/packed-bubble-split">See full demo</a>'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value}m CO<sub>2</sub>'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        packedbubble: {
            minSize: '20%',
            maxSize: '100%',
            zMin: 0,
            zMax: 1000,
            layoutAlgorithm: {
                gravitationalConstant: 0.05,
                splitSeries: true,
                seriesInteraction: false,
                dragBetweenSeries: true,
                parentNodeLimit: true
            },
            dataLabels: {
                enabled: false,
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
        data: [{
            name: 'Germany',
            value: 767.1
        }, {
            name: 'Croatia',
            value: 20.7
        },
        {
            name: 'Belgium',
            value: 97.2
        },
        {
            name: 'Czech Republic',
            value: 111.7
        },
        {
            name: 'Netherlands',
            value: 158.1
        },
        {
            name: 'Spain',
            value: 241.6
        },
        {
            name: 'Ukraine',
            value: 249.1
        },
        {
            name: 'Poland',
            value: 298.1
        },
        {
            name: 'France',
            value: 323.7
        },
        {
            name: 'Romania',
            value: 78.3
        },
        {
            name: 'United Kingdom',
            value: 415.4
        }, {
            name: 'Turkey',
            value: 353.2
        }, {
            name: 'Italy',
            value: 337.6
        },
        {
            name: 'Greece',
            value: 71.1
        },
        {
            name: 'Austria',
            value: 69.8
        },
        {
            name: 'Belarus',
            value: 67.7
        },
        {
            name: 'Serbia',
            value: 59.3
        },
        {
            name: 'Finland',
            value: 54.8
        },
        {
            name: 'Bulgaria',
            value: 51.2
        },
        {
            name: 'Portugal',
            value: 48.3
        },
        {
            name: 'Norway',
            value: 44.4
        },
        {
            name: 'Sweden',
            value: 44.3
        },
        {
            name: 'Hungary',
            value: 43.7
        },
        {
            name: 'Switzerland',
            value: 40.2
        },
        {
            name: 'Denmark',
            value: 40
        },
        {
            name: 'Slovakia',
            value: 34.7
        },
        {
            name: 'Ireland',
            value: 34.6
        },
        {
            name: 'Croatia',
            value: 20.7
        },
        {
            name: 'Estonia',
            value: 19.4
        },
        {
            name: 'Slovenia',
            value: 16.7
        },
        {
            name: 'Lithuania',
            value: 12.3
        },
        {
            name: 'Luxembourg',
            value: 10.4
        },
        {
            name: 'Macedonia',
            value: 9.5
        },
        {
            name: 'Moldova',
            value: 7.8
        },
        {
            name: 'Latvia',
            value: 7.5
        },
        {
            name: 'Cyprus',
            value: 7.2
        }]
    }, {
        name: 'Africa',
        data: [{
            name: 'Senegal',
            value: 8.2
        },
        {
            name: 'Cameroon',
            value: 9.2
        },
        {
            name: 'Zimbabwe',
            value: 13.1
        },
        {
            name: 'Ghana',
            value: 14.1
        },
        {
            name: 'Kenya',
            value: 14.1
        },
        {
            name: 'Sudan',
            value: 17.3
        },
        {
            name: 'Tunisia',
            value: 24.3
        },
        {
            name: 'Angola',
            value: 25
        },
        {
            name: 'Libya',
            value: 50.6
        },
        {
            name: 'Ivory Coast',
            value: 7.3
        },
        {
            name: 'Morocco',
            value: 60.7
        },
        {
            name: 'Ethiopia',
            value: 8.9
        },
        {
            name: 'United Republic of Tanzania',
            value: 9.1
        },
        {
            name: 'Nigeria',
            value: 93.9
        },
        {
            name: 'South Africa',
            value: 392.7
        }, {
            name: 'Egypt',
            value: 225.1
        }, {
            name: 'Algeria',
            value: 141.5
        }]
    }, {
        name: 'Oceania',
        data: [{
            name: 'Australia',
            value: 409.4
        },
        {
            name: 'New Zealand',
            value: 34.1
        },
        {
            name: 'Papua New Guinea',
            value: 7.1
        }]
    }, {
        name: 'North America',
        data: [{
            name: 'Costa Rica',
            value: 7.6
        },
        {
            name: 'Honduras',
            value: 8.4
        },
        {
            name: 'Jamaica',
            value: 8.3
        },
        {
            name: 'Panama',
            value: 10.2
        },
        {
            name: 'Guatemala',
            value: 12
        },
        {
            name: 'Dominican Republic',
            value: 23.4
        },
        {
            name: 'Cuba',
            value: 30.2
        },
        {
            name: 'USA',
            value: 5334.5
        }, {
            name: 'Canada',
            value: 566
        }, {
            name: 'Mexico',
            value: 456.3
        }]
    }, {
        name: 'South America',
        data: [{
            name: 'El Salvador',
            value: 7.2
        },
        {
            name: 'Uruguay',
            value: 8.1
        },
        {
            name: 'Bolivia',
            value: 17.8
        },
        {
            name: 'Trinidad and Tobago',
            value: 34
        },
        {
            name: 'Ecuador',
            value: 43
        },
        {
            name: 'Chile',
            value: 78.6
        },
        {
            name: 'Peru',
            value: 52
        },
        {
            name: 'Colombia',
            value: 74.1
        },
        {
            name: 'Brazil',
            value: 501.1
        }, {
            name: 'Argentina',
            value: 199
        },
        {
            name: 'Venezuela',
            value: 195.2
        }]
    }, {
        name: 'Asia',
        data: [{
            name: 'Nepal',
            value: 6.5
        },
        {
            name: 'Georgia',
            value: 6.5
        },
        {
            name: 'Brunei Darussalam',
            value: 7.4
        },
        {
            name: 'Kyrgyzstan',
            value: 7.4
        },
        {
            name: 'Afghanistan',
            value: 7.9
        },
        {
            name: 'Myanmar',
            value: 9.1
        },
        {
            name: 'Mongolia',
            value: 14.7
        },
        {
            name: 'Sri Lanka',
            value: 16.6
        },
        {
            name: 'Bahrain',
            value: 20.5
        },
        {
            name: 'Yemen',
            value: 22.6
        },
        {
            name: 'Jordan',
            value: 22.3
        },
        {
            name: 'Lebanon',
            value: 21.1
        },
        {
            name: 'Azerbaijan',
            value: 31.7
        },
        {
            name: 'Singapore',
            value: 47.8
        },
        {
            name: 'Hong Kong',
            value: 49.9
        },
        {
            name: 'Syria',
            value: 52.7
        },
        {
            name: 'DPR Korea',
            value: 59.9
        },
        {
            name: 'Israel',
            value: 64.8
        },
        {
            name: 'Turkmenistan',
            value: 70.6
        },
        {
            name: 'Oman',
            value: 74.3
        },
        {
            name: 'Qatar',
            value: 88.8
        },
        {
            name: 'Philippines',
            value: 96.9
        },
        {
            name: 'Kuwait',
            value: 98.6
        },
        {
            name: 'Uzbekistan',
            value: 122.6
        },
        {
            name: 'Iraq',
            value: 139.9
        },
        {
            name: 'Pakistan',
            value: 158.1
        },
        {
            name: 'Vietnam',
            value: 190.2
        },
        {
            name: 'United Arab Emirates',
            value: 201.1
        },
        {
            name: 'Malaysia',
            value: 227.5
        },
        {
            name: 'Kazakhstan',
            value: 236.2
        },
        {
            name: 'Thailand',
            value: 272
        },
        {
            name: 'Taiwan',
            value: 276.7
        },
        {
            name: 'Indonesia',
            value: 453
        },
        {
            name: 'Saudi Arabia',
            value: 494.8
        },
        {
            name: 'Japan',
            value: 1278.9
        },
        {
            name: 'China',
            value: 10540.8
        },
        {
            name: 'India',
            value: 2341.9
        },
        {
            name: 'Russia',
            value: 1766.4
        },
        {
            name: 'Iran',
            value: 618.2
        },
        {
            name: 'Korea',
            value: 610.1
        }]
    }]
};

// depedency wheel
const dw = {
    chart: {
        animation: {
            duration: 2000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                setTimeout(() => {
                    chart.series[0].update({
                        curveFactor: 0.85
                    });
                }, 1000);
            }
        }
    },
    title: {
        floating: true,
        useHTML: true,
        align: 'left',
        y: -30,
        verticalAlign: 'bottom',
        text: 'Highcharts<br>Dependency Wheel',
        style: {
            fontSize: '14px'
        }
    },
    subtitle: {
        floating: true,
        useHTML: true,
        verticalAlign: 'bottom',
        align: 'left',
        style: {
            fontSize: '14px'
        },
        y: -15,
        text: '<a style="color:#C8C7D1;" href="https://www.highcharts.com/demo/highcharts/dependency-wheel">See full demo</a>'
    },

    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. From ' +
                '{point.from} to {point.to}: {point.weight}.'
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        curveFactor: 0,
        keys: ['from', 'to', 'weight'],
        data: [
            ['Brazil', 'Portugal', 5],
            ['Brazil', 'France', 1],
            ['Brazil', 'Spain', 1],
            ['Brazil', 'England', 1],
            ['Canada', 'Portugal', 1],
            ['Canada', 'France', 5],
            ['Canada', 'England', 1],
            ['Mexico', 'Portugal', 1],
            ['Mexico', 'France', 1],
            ['Mexico', 'Spain', 5],
            ['Mexico', 'England', 1],
            ['USA', 'Portugal', 1],
            ['USA', 'France', 1],
            ['USA', 'Spain', 1],
            ['USA', 'England', 5],
            ['Portugal', 'Angola', 2],
            ['Portugal', 'Senegal', 1],
            ['Portugal', 'Morocco', 1],
            ['Portugal', 'South Africa', 3],
            ['France', 'Angola', 1],
            ['France', 'Senegal', 3],
            ['France', 'Mali', 3],
            ['France', 'Morocco', 3],
            ['France', 'South Africa', 1],
            ['Spain', 'Senegal', 1],
            ['Spain', 'Morocco', 3],
            ['Spain', 'South Africa', 1],
            ['England', 'Angola', 1],
            ['England', 'Senegal', 1],
            ['England', 'Morocco', 2],
            ['England', 'South Africa', 7],
            ['South Africa', 'China', 5],
            ['South Africa', 'India', 1],
            ['South Africa', 'Japan', 3],
            ['Angola', 'China', 5],
            ['Angola', 'India', 1],
            ['Angola', 'Japan', 3],
            ['Senegal', 'China', 5],
            ['Senegal', 'India', 1],
            ['Senegal', 'Japan', 3],
            ['Mali', 'China', 5],
            ['Mali', 'India', 1],
            ['Mali', 'Japan', 3],
            ['Morocco', 'China', 5],
            ['Morocco', 'India', 1],
            ['Morocco', 'Japan', 3],
            ['Japan', 'Brazil', 1]
        ],
        type: 'dependencywheel',
        name: 'Dependency wheel series',
        dataLabels: {
            enabled: false,
            color: '#333',
            style: {
                textOutline: 'none'
            },
            textPath: {
                enabled: true
            },
            distance: 10
        },
        size: '95%'
    }]

};

// funnel
const fc = {
    chart: {
        type: 'funnel',
        marginTop: 50,
        animation: {
            duration: 2000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;

                setTimeout(() => {
                    chart.series[0].update({
                        width: '70%',
                        neckWidth: '25%'
                    });
                }, 1000);
            }
        }
    },
    credits: {
        enabled: false
    },
    title: {
        floating: true,
        useHTML: true,
        align: 'left',
        y: -30,
        verticalAlign: 'bottom',
        text: 'Highcharts Funnel Chart',
        style: {
            fontSize: '14px'
        }
    },
    subtitle: {
        floating: true,
        useHTML: true,
        verticalAlign: 'bottom',
        align: 'left',
        y: -15,
        style: {
            fontSize: '14px'
        },
        text: '<a href="https://www.highcharts.com/demo/highcharts/funnel">See full demo</a>'
    },
    plotOptions: {
        series: {
            dataLabels: {
                distance: 100,
                enabled: true,
                format: '<b style="color:{point.color}">{point.color}</b>',
                softConnector: true,
                style: {
                    color: 'white',
                    textOutline: 'none'
                }
            },
            center: ['40%', '50%'],
            neckWidth: '1%',
            neckHeight: '25%',
            width: '1%',
            borderColor: '#18171C',
            borderWidth: 3,
            borderRadius: 8
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Unique users',
        data: [
            ['Website visits', 15654],
            ['Downloads', 4064],
            ['Requested price list', 1987],
            ['Invoice sent', 976],
            ['Finalized', 846]
        ]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                plotOptions: {
                    series: {
                        dataLabels: {
                            inside: true
                        },
                        center: ['50%', '50%'],
                        width: '100%'
                    }
                }
            }
        }]
    }
};

// geo heatmap
function geoHeatMap() {
    let globe;
    (async () => {
        const topology = await fetch(
                'https://code.highcharts.com/mapdata/custom/world.topo.json'
            ).then(response => response.json()),

            data = await fetch(
                'https://cdn.jsdelivr.net/gh/highcharts/highcharts@5c536debb0/samples/data/geoheatmap-cities-dataset.json'
            ).then(response => response.json());

        globe = Highcharts.mapChart('container', {
            chart: {
                map: topology,
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuint'
                },
                events: {
                    load: function () {
                        const chart = this;
                        const viewLinks = document.querySelectorAll(
                            '.preset-rotations a'
                        );
                        const stop = 2;
                        let start = 0;

                        setTimeout(() => {
                            viewLinks[0].click();
                            setInterval(() => {
                                if (start < stop) {
                                    viewLinks[start].click();
                                    start = start + 1;
                                } else {
                                    // nothing
                                }

                            }, 1000);
                        }, 410);

                    }

                }
            },
            credits: {
                enabled: false
            },
            title: {
                floating: true,
                useHTML: true,
                align: 'left',
                y: -30,
                verticalAlign: 'bottom',
                text: 'Highcharts<br>GeoHeatMap',
                style: {
                    fontSize: '14px'
                }
            },
            subtitle: {
                floating: true,
                useHTML: true,
                verticalAlign: 'bottom',
                align: 'left',
                y: -15,
                style: {
                    fontSize: '14px'
                },
                text: '<a style="color:#C8C7D1;" href="https://www.highcharts.com/demo/maps/geoheatmap-orthographic">See full demo</a>'
            },

            legend: {
                enabled: false,
                floating: true
            },

            mapNavigation: {
                enabled: false,
                buttonOptions: {
                    verticalAlign: 'top'
                }
            },

            mapView: {
                maxZoom: 30,
                // zoom: 2.5,
                projection: {
                    name: 'Orthographic',
                    rotation: [0, 85]
                }
            },

            colorAxis: {
                dataClasses: [{
                    to: 100,
                    color: 'rgba(51,132,51,0.5)'
                }, {
                    from: 100,
                    to: 1e3,
                    color: 'rgba(173,255,91,0.5)'
                }, {
                    from: 1e3,
                    to: 5e3,
                    color: 'rgba(255,173,51,0.5)'
                }, {
                    from: 5e3,
                    color: 'rgba(214,51,51,0.5)'
                }]
            },

            series: [{
                name: 'Othographic projection',
                states: {
                    inactive: {
                        enabled: false
                    }
                },
                accessibility: {
                    exposeAsGroupOnly: true
                }
            }, {
                name: 'GeoHeatMap',
                type: 'geoheatmap',
                borderWidth: 1,
                borderColor: 'grey',
                colsize: 10,
                rowsize: 10,
                data: data
            }]
        });
        currentChart = globe;
    })();

    document.querySelectorAll('.preset-rotations a').forEach(input => {
        input.addEventListener('click', () => {
            const rotation = input.getAttribute('data-rotation')
                .split(',')
                .map(Number);
            rotation.push(0);

            // Get the distance between the current rotation and the new one
            // with 1000 steps so that we can animate it using the built-in
            // easing functions.
            const distance = Highcharts.Projection.distance(
                    globe.mapView.projection.options.rotation,
                    rotation
                ),
                stepDistance = distance / 1000,
                geodesic = Highcharts.Projection.geodesic(
                    globe.mapView.projection.options.rotation,
                    rotation,
                    true,
                    stepDistance
                );

            // Use a custom animator property. For each step of the
            // animation, get the point along the animation trajectory and
            // update the projection with it.
            if (geodesic.length === 1000) {
                globe.renderer.boxWrapper.animator = 0;
                Highcharts.animate(
                    globe.renderer.boxWrapper,
                    { animator: 999 }, {
                        duration: 1000,
                        step: now => {
                            const rotation = geodesic[Math.round(now)];
                            globe.mapView.update({
                                projection: {
                                    rotation
                                }
                            }, true, false);

                            rotation.forEach((value, i) => {
                                const name = ['lambda', 'phi', 'gamma'][i];
                                document.getElementById(`rotation-${name}`)
                                    .value = Math.round(value);
                                document.getElementById(
                                    `rotation-${name}-output`
                                ).innerText = Math.round(value);
                            });
                        }
                    }
                );
            }
        });
    });
}

function gantt() {
    const day = 24 * 36e5,
        today = Math.floor(Date.now() / day) * day;

    const options = {
        chart: {
            // plotBackgroundColor: 'rgba(128,128,128,0.02)',
            // plotBorderColor: 'rgba(128,128,128,0.1)',
            // plotBorderWidth: 1
            animation: {
                duration: 2000,
                easing: 'easeOutQuint'
            }
        },

        plotOptions: {
            series: {
                borderRadius: '50%',
                borderColor: 'transparent',
                connectors: {
                    dashStyle: 'ShortDot',
                    lineWidth: 2,
                    radius: 5,
                    startMarker: {
                        enabled: false
                    }
                },
                groupPadding: 0,
                dataLabels: [{
                    enabled: false,
                    align: 'left',
                    format: '{point.name}',
                    padding: 10,
                    style: {
                        fontWeight: 'normal',
                        textOutline: 'none'
                    }
                }, {
                    enabled: false,
                    align: 'right',
                    // eslint-disable-next-line max-len
                    format: '{#if point.completed}{(multiply point.completed.amount 100):.0f}%{/if}',
                    padding: 10,
                    style: {
                        fontWeight: 'normal',
                        textOutline: 'none',
                        opacity: 0.6
                    }
                }]
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Offices',
            data: [{
                name: 'New offices',
                id: 'new_offices',
                owner: 'Peter'
            }, {
                name: 'Prepare office building',
                id: 'prepare_building',
                parent: 'new_offices',
                start: today - (2 * day),
                end: today + (6 * day),
                completed: {
                    amount: 0.2
                },
                owner: 'Linda'
            }, {
                name: 'Inspect building',
                id: 'inspect_building',
                dependency: 'prepare_building',
                parent: 'new_offices',
                start: today + 6 * day,
                end: today + 8 * day,
                owner: 'Ivy'
            }, {
                name: 'Passed inspection',
                id: 'passed_inspection',
                dependency: 'inspect_building',
                parent: 'new_offices',
                start: today + 9.5 * day,
                milestone: true,
                owner: 'Peter'
            }, {
                name: 'Relocate',
                id: 'relocate',
                dependency: 'passed_inspection',
                parent: 'new_offices',
                owner: 'Josh'
            }, {
                name: 'Relocate staff',
                id: 'relocate_staff',
                parent: 'relocate',
                start: today + 10 * day,
                end: today + 11 * day,
                owner: 'Mark'
            }, {
                name: 'Relocate test facility',
                dependency: 'relocate_staff',
                parent: 'relocate',
                start: today + 11 * day,
                end: today + 13 * day,
                owner: 'Anne'
            }, {
                name: 'Relocate cantina',
                dependency: 'relocate_staff',
                parent: 'relocate',
                start: today + 11 * day,
                end: today + 14 * day
            }]
        }
        ],
        tooltip: {
            pointFormat: '<span style="font-weight: bold">' +
            '{point.name}</span><br>' +
            '{point.start:%e %b}' +
            '{#unless point.milestone} → {point.end:%e %b}{/unless}' +
            '<br>' +
            '{#if point.completed}' +
            'Completed: {multiply point.completed.amount 100}%<br>' +
            '{/if}' +
            'Owner: {#if point.owner}{point.owner}{else}unassigned{/if}'
        },
        title: {
            floating: true,
            useHTML: true,
            align: 'left',
            y: -20,
            verticalAlign: 'bottom',
            text: 'Highcharts Gantt Chart',
            style: {
                fontSize: '14px'
            }
        },
        subtitle: {
            floating: true,
            useHTML: true,
            verticalAlign: 'bottom',
            align: 'left',
            y: -5,
            style: {
                fontSize: '14px'
            },
            text: '<a style="color:#C8C7D1;" href="https://www.highcharts.com/demo/gantt/project-management">See full demo</a>'
        },
        xAxis: [{
            labels: {
                enabled: false
            },
            // currentDateIndicator: {
            //     color: '#5E5C70',
            //     dashStyle: 'ShortDot',
            //     width: 2,
            //     label: {
            //         format: ''
            //     }
            // },
            dateTimeLabelFormats: {
                day: '%e<br><span style="opacity: 0.5; font-size: 0.7em">' +
                     '%a</span>'
            },
            grid: {
                borderWidth: 0
            },
            gridLineWidth: 0,
            min: today - 3 * day,
            max: today + 18 * day,
            custom: {
                today,
                weekendPlotBands: true
            }
        }],
        yAxis: {
            visible: false,
            grid: {
                borderWidth: 0
            },
            gridLineWidth: 0,
            labels: {
                symbol: {
                    width: 8,
                    height: 6,
                    x: -4,
                    y: -2
                }
            }
            // staticScale: 30
        },
        accessibility: {
            keyboardNavigation: {
                seriesNavigation: {
                    mode: 'serialize'
                }
            },
            point: {
                descriptionFormatter: function (point) {
                    const completedValue = point.completed ?
                            point.completed.amount || point.completed : null,
                        completed = completedValue ?
                            ' Task ' + Math.round(completedValue * 1000) / 10 +
                            '% completed.' :
                            '',
                        dependency = point.dependency &&
                            point.series.chart.get(point.dependency).name,
                        dependsOn = dependency ? ' Depends on ' +
                        dependency + '.' : '';
                    return Highcharts.format(
                        point.milestone ?
                            // eslint-disable-next-line max-len
                            '{point.yCategory}. Milestone at {point.x:%Y-%m-%d}. Owner: {point.owner}.{dependsOn}' :
                            // eslint-disable-next-line max-len
                            '{point.yCategory}.{completed} Start {point.x:%Y-%m-%d}, end {point.x2:%Y-%m-%d}. Owner: {point.owner}.{dependsOn}',
                        { point, completed, dependsOn }
                    );
                }
            }
        },
        lang: {
            accessibility: {
                axis: {
                    // eslint-disable-next-line max-len
                    xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.'
                }
            }
        }
    };

    // Plug-in to render plot bands for the weekends
    Highcharts.addEvent(Highcharts.Axis, 'foundExtremes', e => {
        // eslint-disable-next-line max-len
        if (e.target.options.custom && e.target.options.custom.weekendPlotBands) {
            const axis = e.target,
                chart = axis.chart,
                day = 24 * 36e5,
                isWeekend = t => /[06]/.test(chart.time.dateFormat('%w', t)),
                plotBands = [];

            let inWeekend = false;

            for (
                let x = Math.floor(axis.min / day) * day;
                x <= Math.ceil(axis.max / day) * day;
                x += day
            ) {
                const last = plotBands.at(-1);
                if (isWeekend(x) && !inWeekend) {
                    plotBands.push({
                        from: x,
                        color: {
                            pattern: {
                                // eslint-disable-next-line max-len
                                path: 'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9',
                                width: 10,
                                height: 10,
                                color: 'rgba(128,128,128,0.15)'
                            }
                        }
                    });
                    inWeekend = true;
                }

                if (!isWeekend(x) && inWeekend && last) {
                    last.to = x;
                    inWeekend = false;
                }
            }
            axis.options.plotBands = plotBands;
        }
    });

    currentChart = Highcharts.ganttChart('container', options);

}

const charts = [
    jellypus,  str, cs, barchartRace,
    spb, dw, fc, geoHeatMap, gantt, rb, rc
];


let chartNum = 0;

function makeChart() {

    document.getElementById('play-controls').style.visibility = 'hidden';
    clearInterval(barInterval);
    clearInterval(csInterval);

    console.log(currentChart);

    if (currentChart !== undefined) {
        currentChart.destroy();
    }

    const chartToMake = charts[chartNum];

    if (chartNum < charts.length - 1) {
        chartNum = chartNum + 1;
    } else {
        chartNum = 0;
    }

    if (typeof chartToMake === 'function') {
        chartToMake();
    } else {
        currentChart = Highcharts.chart('container', chartToMake);
    }
}


makeChart();

// button
document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.button-container');
    const button = document.querySelector('.chart-button');
    let confetti = []; // Array to hold confetti elements
    let exploding = false;

    const colors = [
        '#8087E8',
        '#A3EDBA',
        '#F19E53',
        '#6699A1',
        '#E1D369',
        '#87B4E7',
        '#DA6D85',
        '#BBBAC5'
    ]; // Array of predefined colors

    fillButton(80); // Initially fill the button with 40 confetti pieces

    button.addEventListener('click', function () {
        explodeConfetti(); // Explode confetti on click
        this.disabled = true;
        setTimeout(function () {
            button.disabled = false;
        }, 3000);
    });

    button.addEventListener('mouseenter', function () {
        hoverEffect(true); // Apply hover effect
    });

    button.addEventListener('mouseleave', function () {
        hoverEffect(false); // Remove hover effect
    });

    function fillButton(num) {
        clearConfetti(); // Clear existing confetti first
        for (let i = 0; i < num; i++) {
            const confettiPiece = createConfetti(false);
            confetti.push(confettiPiece);
            container.appendChild(confettiPiece);
            placeConfetti(confettiPiece);
        }
    }

    function createConfetti() {
        const confettiPiece = document.createElement('div');
        confettiPiece.className = 'confetti';
        // Random size between 8px and 3px
        let size = Math.random() * (8 - 3) + 5;
        const shapeType = Math.floor(Math.random() * 4);
        let borderColor;
        // 0 = triangle, 1 = circle, 2 = square, 3 = line
        switch (shapeType) {
        case 0: // Triangle
            // eslint-disable-next-line max-len
            borderColor = colors[Math.floor(Math.random() * colors.length)];
            size = Math.random() * (8 - 3) + 2;
            confettiPiece.style.borderLeft = `${size}px solid transparent`;
            confettiPiece.style.borderRight = `${size}px solid transparent`;
            confettiPiece.style.borderBottom =
                `${size * 2}px ${borderColor} solid`;
            break;
        case 1: // Circle
            confettiPiece.style.width = `${size}px`;
            confettiPiece.style.height = `${size}px`;
            confettiPiece.style.borderRadius = '50%';
            confettiPiece.style.opacity = 0.5;
            confettiPiece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
            break;
        case 2: // Square
            confettiPiece.style.width = `${size}px`;
            confettiPiece.style.height = `${size}px`;
            confettiPiece.style.opacity = 0.5;
            confettiPiece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
            break;
        case 3: // Line
            // confettiPiece.style.width = `${size / 5}px`;
            // confettiPiece.style.height = `${size * 2}px`;
            // confettiPiece.style.backgroundColor =
            // colors[Math.floor(Math.random() * colors.length)];
            // Rotate line randomly
            // confettiPiece.style.transform =
            // `rotate(${Math.random() * 180 - 90}deg)`;
            // confettiPiece.style.opacity = 0.5;
            break;
        default: // Default case
            break;
        }
        confettiPiece.style.position = 'absolute';
        confettiPiece.style.opacity = 0;

        return confettiPiece;
    }

    function placeConfetti(confettiPiece) {
        const horizontalPadding = 16; // 16px padding on left and right
        const verticalPadding = 8; // 8px padding on top and bottom
        let posX, posY;

        if (Math.random() < 0.3) {
            posX = Math.random() * button.offsetWidth  + horizontalPadding;
            posY = Math.random() * button.offsetHeight;
        } else {
            posX = Math.random() * button.offsetWidth;
            posY = Math.random() * button.offsetHeight + verticalPadding;
        }

        const distance = 10; // Small movement range
        const angle = Math.random() * 360;
        const deltaX = distance * Math.cos(angle * Math.PI / 180);
        const deltaY = distance * Math.sin(angle * Math.PI / 180);
        confettiPiece.style.left = `${posX}px`;
        confettiPiece.style.top = `${posY}px`;

        confettiPiece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;


        confettiPiece.style.transition = 'all 0.5s ease';
        confettiPiece.style.opacity = 0.4;


    }

    function hoverEffect(apply) {
        confetti.forEach(piece => {

            let distance = 25; // Small movement range
            const angle = Math.random() * 360;
            const deltaX = distance * Math.cos(angle * Math.PI / 180);
            const deltaY = distance * Math.sin(angle * Math.PI / 180);
            if (apply) {
                piece.style.transition = 'all 0.5s ease';
                piece.style.opacity = 0.4;
                piece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            } else {
                if (!exploding) {
                    distance = 10;
                    piece.style.transform =
                        `translate(${deltaX}px, ${deltaY}px)`;
                    piece.style.transition = 'all 0.5s ease';
                    piece.style.opacity = 0.4;

                }
            }
        });
    }

    function explodeConfetti() {
        exploding = true;
        confetti.forEach(piece => {
            animateConfetti(piece);
        });

        makeChart();

        // Refill the button with confetti after explosion
        setTimeout(function () {
            fillButton(80);
            exploding = false;
        }, 3000);
    }

    function clearConfetti() {
        confetti.forEach(piece => piece.remove());
        confetti = [];
    }

    function animateConfetti(confettiPiece) {
        const angle = Math.random() * 360; // Explode in all directions
        const distance = Math.random() * 150;
        const finalX = parseFloat(confettiPiece.style.left) +
        distance * Math.sin(angle * Math.PI / 180);
        const finalY = parseFloat(confettiPiece.style.top) -
        distance * Math.cos(angle * Math.PI / 180);

        confettiPiece.style.transition = 'all 1s ease-out';
        confettiPiece.style.left = `${finalX}px`;
        confettiPiece.style.top = `${finalY}px`;
        confettiPiece.style.opacity = 0;

        setTimeout(() => {
            confettiPiece.remove();
        }, 1000);
    }
});
