// const  colors = [
//     '#2caffe',
//     '#544fc5',
//     '#00e272',
//     '#fe6a35',
//     '#6b8abc',
//     '#d568fb',
//     '#2ee0ca',
//     '#fa4b42',
//     '#feb56a',
//     '#91e8e1'
// ];

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

Math.easeOutQuint = function (pos) {
    return Math.pow(pos - 1, 5) + 1;
};

function changeOpacity(elements, opacity, transition) {
    [].forEach.call(elements, function (element) {
        element.style.opacity = opacity;
        element.style.transition = 'all ' + transition + 's';
    });
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
// arc
const arc = {
    chart: {
        backgroundColor: 'transparent',
        // margin: [60, 60, 0, 60],
        height: 400,
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
            'Arc diagram chart with circles of different sizes along the X axis, and connections drawn as arcs between them. From the chart we can see that Paris is the city with the most connections to other cities.',
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
                ['Paris', 'Nice', 1]
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
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        margin: [0, 0, 0, 0]
                    }
                }
            },
            {
                condition: {
                    minWidth: 501
                },
                chartOptions: {
                    chart: {
                        margin: [60, 60, 0, 60]
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
            borderRadius: '30%',
            borderColor: null,
            dataLabels: {
                enabled: true,
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
            'Sankey chart that shows the total funding for Fintech companies in the internet software & services through 2022.',
        point: {
            descriptionFormatter: function (point) {
                var nodeFrom = point.fromNode.name,
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
            '<b>{point.fromNode.name}</b> ({point.toNode.name})<br>${point.weight} Total Funding Millions USD</span>',
        nodeFormat:
            '<p style="margin:6px 0;padding: 0;font-size: 14px;line-height:24px"><span style="font-weight: bold;color:{point.color}">{point.name}:</span> ${point.sum} million USD</p>'
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
        gridLineColor: 'rgba(255, 255, 255, 0.1)',
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
        text: ''
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

// streamgraph
const str = {
    chart: {
        type: 'streamgraph',
        marginBottom: 30,
        height: 430,
        zoomType: 'x',
        backgroundColor: 'transparent',
        animation: {
            duration: 2000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                let count = 0;
                setTimeout(function () {
                    setInterval(function () {
                        if (count < chart.series.length) {
                            chart.series[count].update({
                                fillOpacity: 0.85
                            });
                            count = count + 1;
                        }
                    }, 300);
                }, 500);

                setTimeout(function () {
                    chart.series[0].points[132].onMouseOver();
                }, 4000);
            }
        }
    },
    accessibility: {
        description:
            'Streamgraphs are a type of stacked area charts where the areas are displaced around a central axis. This chart is showing price indices for air freight, importing and exporting.'
    },
    responsive: {
        rules: [
            {
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    xAxis: {
                        min: Date.UTC(2017, 1, 1)
                    }
                }
            }
        ]
    },
    colors: [
        '#8087E8',
        '#A3EDBA',
        '#F19E53',
        '#30426B',
        '#6699A1',
        '#BBBAC5',
        '#87B4E7',
        '#DA6D85',
        '#BBBAC5'
    ],

    credits: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    title: {
        floating: true,
        align: 'left',
        text: ''
    },

    xAxis: {
        min: Date.UTC(2011, 1, 1),
        max: Date.UTC(2020, 1, 1),
        visible: false,
        reversed: false,
        maxPadding: 0,
        type: 'datetime',
        labels: {
            align: 'left',
            reserveSpace: false,
            rotation: 0,
            style: {
                color: '#BBBAC5'
            }
        },
        lineWidth: 1,
        margin: 20,
        tickWidth: 1
    },

    yAxis: {
        visible: false,
        title: {
            text: ''
        },
        min: -40,
        max: 40,
        startOnTick: false,
        endOnTick: false,
        gridLineColor: 'transparent',
        labels: {
            style: {
                color: '#BBBAC5'
            }
        }
    },

    legend: {
        enabled: false
    },

    plotOptions: {
        series: {
            lineWidth: 1,
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

    series: [
        {
            name: 'West Germany',
            visible: true,
            fillOpacity: 0,
            data: [
                [Date.UTC(2002, 4, 1), 0.5],
                [Date.UTC(2002, 5, 1), 1.9],
                [Date.UTC(2002, 6, 1), 2.8],
                [Date.UTC(2002, 7, 1), 7.5],
                [Date.UTC(2002, 8, 1), 10.0],
                [Date.UTC(2002, 9, 1), 5.5],
                [Date.UTC(2002, 10, 1), 2.3],
                [Date.UTC(2002, 11, 1), 4.5],
                [Date.UTC(2002, 12, 1), 4.9],
                [Date.UTC(2003, 1, 1), 9.2],
                [Date.UTC(2003, 2, 1), 9.0],
                [Date.UTC(2003, 3, 1), 11.2],
                [Date.UTC(2003, 4, 1), 10.9],
                [Date.UTC(2003, 5, 1), 10.5],
                [Date.UTC(2003, 6, 1), 13.4],
                [Date.UTC(2003, 7, 1), 11.9],
                [Date.UTC(2003, 8, 1), 10.2],
                [Date.UTC(2003, 9, 1), 9.2],
                [Date.UTC(2003, 10, 1), 15.1],
                [Date.UTC(2003, 11, 1), 14.8],
                [Date.UTC(2003, 12, 1), 14.7],
                [Date.UTC(2004, 1, 1), 15.7],
                [Date.UTC(2004, 2, 1), 15.1],
                [Date.UTC(2004, 3, 1), 13.7],
                [Date.UTC(2004, 4, 1), 13.7],
                [Date.UTC(2004, 5, 1), 8.3],
                [Date.UTC(2004, 6, 1), 5.8],
                [Date.UTC(2004, 7, 1), 4.9],
                [Date.UTC(2004, 8, 1), 9.3],
                [Date.UTC(2004, 9, 1), 10.3],
                [Date.UTC(2004, 10, 1), 6.2],
                [Date.UTC(2004, 11, 1), 9.8],
                [Date.UTC(2004, 12, 1), 13.2],
                [Date.UTC(2005, 1, 1), 10.3],
                [Date.UTC(2005, 2, 1), 9.1],
                [Date.UTC(2005, 3, 1), 10.6],
                [Date.UTC(2005, 4, 1), 7.8],
                [Date.UTC(2005, 5, 1), 15.5],
                [Date.UTC(2005, 6, 1), 10.0],
                [Date.UTC(2005, 7, 1), 13.7],
                [Date.UTC(2005, 8, 1), 11.0],
                [Date.UTC(2005, 9, 1), 7.2],
                [Date.UTC(2005, 10, 1), 6.3],
                [Date.UTC(2005, 11, 1), -1.6],
                [Date.UTC(2005, 12, 1), -4.3],
                [Date.UTC(2006, 1, 1), -6.0],
                [Date.UTC(2006, 2, 1), 0.2],
                [Date.UTC(2006, 3, 1), -4.0],
                [Date.UTC(2006, 4, 1), -1.3],
                [Date.UTC(2006, 5, 1), -2.5],
                [Date.UTC(2006, 6, 1), 2.3],
                [Date.UTC(2006, 7, 1), -0.5],
                [Date.UTC(2006, 8, 1), -0.5],
                [Date.UTC(2006, 9, 1), 2.1],
                [Date.UTC(2006, 10, 1), 3.0],
                [Date.UTC(2006, 11, 1), 6.4],
                [Date.UTC(2006, 12, 1), 7.0],
                [Date.UTC(2007, 1, 1), 6.9],
                [Date.UTC(2007, 2, 1), 3.2],
                [Date.UTC(2007, 3, 1), 7.2],
                [Date.UTC(2007, 4, 1), 9.3],
                [Date.UTC(2007, 5, 1), 7.5],
                [Date.UTC(2007, 6, 1), 5.7],
                [Date.UTC(2007, 7, 1), 5.7],
                [Date.UTC(2007, 8, 1), 3.9],
                [Date.UTC(2007, 9, 1), 8.6],
                [Date.UTC(2007, 10, 1), 10.0],
                [Date.UTC(2007, 11, 1), 11.5],
                [Date.UTC(2007, 12, 1), 13.4],
                [Date.UTC(2008, 1, 1), 14.3],
                [Date.UTC(2008, 2, 1), 9.8],
                [Date.UTC(2008, 3, 1), 11.6],
                [Date.UTC(2008, 4, 1), 6.3],
                [Date.UTC(2008, 5, 1), 6.0],
                [Date.UTC(2008, 6, 1), 16.4],
                [Date.UTC(2008, 7, 1), 17.6],
                [Date.UTC(2008, 8, 1), 20.6],
                [Date.UTC(2008, 9, 1), 11.2],
                [Date.UTC(2008, 10, 1), 5.5],
                [Date.UTC(2008, 11, 1), 5.2],
                [Date.UTC(2008, 12, 1), 5.7],
                [Date.UTC(2009, 1, 1), 1.9],
                [Date.UTC(2009, 2, 1), -3.5],
                [Date.UTC(2009, 3, 1), -9.4],
                [Date.UTC(2009, 4, 1), -11.0],
                [Date.UTC(2009, 5, 1), -15.5],
                [Date.UTC(2009, 6, 1), -19.4],
                [Date.UTC(2009, 7, 1), -21.8],
                [Date.UTC(2009, 8, 1), -19.5],
                [Date.UTC(2009, 9, 1), -17.8],
                [Date.UTC(2009, 10, 1), -14.4],
                [Date.UTC(2009, 11, 1), -11.3],
                [Date.UTC(2009, 12, 1), -5.2],
                [Date.UTC(2010, 1, 1), -4.4],
                [Date.UTC(2010, 2, 1), 5.1],
                [Date.UTC(2010, 3, 1), 11.3],
                [Date.UTC(2010, 4, 1), 19.2],
                [Date.UTC(2010, 5, 1), 22.0],
                [Date.UTC(2010, 6, 1), 27.6],
                [Date.UTC(2010, 7, 1), 30.5],
                [Date.UTC(2010, 8, 1), 21.2],
                [Date.UTC(2010, 9, 1), 21.9],
                [Date.UTC(2010, 10, 1), 21.2],
                [Date.UTC(2010, 11, 1), 15.0],
                [Date.UTC(2010, 12, 1), 8.3],
                [Date.UTC(2011, 1, 1), 13.2],
                [Date.UTC(2011, 2, 1), 4.1],
                [Date.UTC(2011, 3, 1), 9.6],
                [Date.UTC(2011, 4, 1), 8.1],
                [Date.UTC(2011, 5, 1), 12.2],
                [Date.UTC(2011, 6, 1), 5.8],
                [Date.UTC(2011, 7, 1), 10.2],
                [Date.UTC(2011, 8, 1), 18.1],
                [Date.UTC(2011, 9, 1), 11.9],
                [Date.UTC(2011, 10, 1), 11.9],
                [Date.UTC(2011, 11, 1), 13.0],
                [Date.UTC(2011, 12, 1), 13.1],
                [Date.UTC(2012, 1, 1), 9.5],
                [Date.UTC(2012, 2, 1), 15.6],
                [Date.UTC(2012, 3, 1), 7.1],
                [Date.UTC(2012, 4, 1), 6.2],
                [Date.UTC(2012, 5, 1), 8.4],
                [Date.UTC(2012, 6, 1), 8.7],
                [Date.UTC(2012, 7, 1), 3.8],
                [Date.UTC(2012, 8, 1), -3.6],
                [Date.UTC(2012, 9, 1), -2.5],
                [Date.UTC(2012, 10, 1), -0.7],
                [Date.UTC(2012, 11, 1), -0.7],
                [Date.UTC(2012, 12, 1), -2.5],
                [Date.UTC(2013, 1, 1), 2.6],
                [Date.UTC(2013, 2, 1), -1.4],
                [Date.UTC(2013, 3, 1), 0.1],
                [Date.UTC(2013, 4, 1), -3.2],
                [Date.UTC(2013, 5, 1), -4.4],
                [Date.UTC(2013, 6, 1), -3.4],
                [Date.UTC(2013, 7, 1), -4.7],
                [Date.UTC(2013, 8, 1), -3.6],
                [Date.UTC(2013, 9, 1), -1.2],
                [Date.UTC(2013, 10, 1), -3.6],
                [Date.UTC(2013, 11, 1), -3.1],
                [Date.UTC(2013, 12, 1), 3.2],
                [Date.UTC(2014, 1, 1), -1.6],
                [Date.UTC(2014, 2, 1), -6.3],
                [Date.UTC(2014, 3, 1), -3.6],
                [Date.UTC(2014, 4, 1), 1.9],
                [Date.UTC(2014, 5, 1), -1.2],
                [Date.UTC(2014, 6, 1), 0.4],
                [Date.UTC(2014, 7, 1), 0.5],
                [Date.UTC(2014, 8, 1), 3.9],
                [Date.UTC(2014, 9, 1), 1.8],
                [Date.UTC(2014, 10, 1), 1.6],
                [Date.UTC(2014, 11, 1), -1.8],
                [Date.UTC(2014, 12, 1), -2.0],
                [Date.UTC(2015, 1, 1), -4.0],
                [Date.UTC(2015, 2, 1), -5.1],
                [Date.UTC(2015, 3, 1), -7.8],
                [Date.UTC(2015, 4, 1), -13.8],
                [Date.UTC(2015, 5, 1), -13.1],
                [Date.UTC(2015, 6, 1), -14.2],
                [Date.UTC(2015, 7, 1), -14.2],
                [Date.UTC(2015, 8, 1), -17.5],
                [Date.UTC(2015, 9, 1), -17.0],
                [Date.UTC(2015, 10, 1), -15.6],
                [Date.UTC(2015, 11, 1), -11.5],
                [Date.UTC(2015, 12, 1), -14.6],
                [Date.UTC(2016, 1, 1), -11.0],
                [Date.UTC(2016, 2, 1), -10.9],
                [Date.UTC(2016, 3, 1), -4.9],
                [Date.UTC(2016, 4, 1), -7.2],
                [Date.UTC(2016, 5, 1), -10.2],
                [Date.UTC(2016, 6, 1), -9.2],
                [Date.UTC(2016, 7, 1), -9.9],
                [Date.UTC(2016, 8, 1), -7.1],
                [Date.UTC(2016, 9, 1), -6.7],
                [Date.UTC(2016, 10, 1), -3.0],
                [Date.UTC(2016, 11, 1), 1.4],
                [Date.UTC(2016, 12, 1), 4.7],
                [Date.UTC(2017, 1, 1), 0.5],
                [Date.UTC(2017, 2, 1), 2.7],
                [Date.UTC(2017, 3, 1), -0.5],
                [Date.UTC(2017, 4, 1), -0.5],
                [Date.UTC(2017, 5, 1), 1.9],
                [Date.UTC(2017, 6, 1), 2.2],
                [Date.UTC(2017, 7, 1), 4.4],
                [Date.UTC(2017, 8, 1), -2.2],
                [Date.UTC(2017, 9, 1), 1.0],
                [Date.UTC(2017, 10, 1), 2.0],
                [Date.UTC(2017, 11, 1), -1.6],
                [Date.UTC(2017, 12, 1), -5.8],
                [Date.UTC(2018, 1, 1), -1.9],
                [Date.UTC(2018, 2, 1), 2.3],
                [Date.UTC(2018, 3, 1), 1.7],
                [Date.UTC(2018, 4, 1), 4.1],
                [Date.UTC(2018, 5, 1), 1.4],
                [Date.UTC(2018, 6, 1), 1.5],
                [Date.UTC(2018, 7, 1), -1.8],
                [Date.UTC(2018, 8, 1), -3.3],
                [Date.UTC(2018, 9, 1), 2.4],
                [Date.UTC(2018, 10, 1), -2.9],
                [Date.UTC(2018, 11, 1), -3.3],
                [Date.UTC(2018, 12, 1), -5.0],
                [Date.UTC(2019, 1, 1), -2.9],
                [Date.UTC(2019, 2, 1), -4.0],
                [Date.UTC(2019, 3, 1), -5.8],
                [Date.UTC(2019, 4, 1), -3.5],
                [Date.UTC(2019, 5, 1), -2.1],
                [Date.UTC(2019, 6, 1), -3.0],
                [Date.UTC(2019, 7, 1), -1.4],
                [Date.UTC(2019, 8, 1), -0.8],
                [Date.UTC(2019, 9, 1), -3.2],
                [Date.UTC(2019, 10, 1), -3.6],
                [Date.UTC(2019, 11, 1), -0.5],
                [Date.UTC(2019, 12, 1), -2.6],
                [Date.UTC(2020, 1, 1), -2.2],
                [Date.UTC(2020, 2, 1), -2.6],
                [Date.UTC(2020, 3, 1), -8.1],
                [Date.UTC(2020, 4, 1), -14.1]
            ]
        },
        {
            name: 'Germany',
            fillOpacity: 0,
            visible: true,
            data: [
                [Date.UTC(2002, 4, 1), 0.0],
                [Date.UTC(2002, 5, 1), 0.3],
                [Date.UTC(2002, 6, 1), 0.8],
                [Date.UTC(2002, 7, 1), 1.2],
                [Date.UTC(2002, 8, 1), 1.8],
                [Date.UTC(2002, 9, 1), 1.5],
                [Date.UTC(2002, 10, 1), 0.7],
                [Date.UTC(2002, 11, 1), 3.3],
                [Date.UTC(2002, 12, 1), 3.3],
                [Date.UTC(2003, 1, 1), 1.6],
                [Date.UTC(2003, 2, 1), 3.5],
                [Date.UTC(2003, 3, 1), 5.6],
                [Date.UTC(2003, 4, 1), 5.6],
                [Date.UTC(2003, 5, 1), 4.0],
                [Date.UTC(2003, 6, 1), 0.3],
                [Date.UTC(2003, 7, 1), -0.5],
                [Date.UTC(2003, 8, 1), -1.1],
                [Date.UTC(2003, 9, 1), -1.1],
                [Date.UTC(2003, 10, 1), -4.3],
                [Date.UTC(2003, 11, 1), -2.0],
                [Date.UTC(2003, 12, 1), -3.2],
                [Date.UTC(2004, 1, 1), -3.7],
                [Date.UTC(2004, 2, 1), -3.5],
                [Date.UTC(2004, 3, 1), -5.5],
                [Date.UTC(2004, 4, 1), -8.6],
                [Date.UTC(2004, 5, 1), -8.2],
                [Date.UTC(2004, 6, 1), -1.6],
                [Date.UTC(2004, 7, 1), -6.4],
                [Date.UTC(2004, 8, 1), -7.4],
                [Date.UTC(2004, 9, 1), -7.1],
                [Date.UTC(2004, 10, 1), 0.6],
                [Date.UTC(2004, 11, 1), 2.8],
                [Date.UTC(2004, 12, 1), 5.6],
                [Date.UTC(2005, 1, 1), 5.8],
                [Date.UTC(2005, 2, 1), 6.1],
                [Date.UTC(2005, 3, 1), 5.3],
                [Date.UTC(2005, 4, 1), 3.1],
                [Date.UTC(2005, 5, 1), 3.5],
                [Date.UTC(2005, 6, 1), 5.0],
                [Date.UTC(2005, 7, 1), 4.6],
                [Date.UTC(2005, 8, 1), 5.0],
                [Date.UTC(2005, 9, 1), 3.0],
                [Date.UTC(2005, 10, 1), 2.5],
                [Date.UTC(2005, 11, 1), 4.6],
                [Date.UTC(2005, 12, 1), 3.4],
                [Date.UTC(2006, 1, 1), 4.0],
                [Date.UTC(2006, 2, 1), 4.9],
                [Date.UTC(2006, 3, 1), 5.5],
                [Date.UTC(2006, 4, 1), 5.3],
                [Date.UTC(2006, 5, 1), 4.7],
                [Date.UTC(2006, 6, 1), 5.8],
                [Date.UTC(2006, 7, 1), 5.1],
                [Date.UTC(2006, 8, 1), 4.6],
                [Date.UTC(2006, 9, 1), 5.1],
                [Date.UTC(2006, 10, 1), 5.0],
                [Date.UTC(2006, 11, 1), 8.8],
                [Date.UTC(2006, 12, 1), 8.9],
                [Date.UTC(2007, 1, 1), 8.6],
                [Date.UTC(2007, 2, 1), 10.3],
                [Date.UTC(2007, 3, 1), 10.5],
                [Date.UTC(2007, 4, 1), 11.2],
                [Date.UTC(2007, 5, 1), 11.5],
                [Date.UTC(2007, 6, 1), 15.5],
                [Date.UTC(2007, 7, 1), 15.5],
                [Date.UTC(2007, 8, 1), 17.0],
                [Date.UTC(2007, 9, 1), 18.8],
                [Date.UTC(2007, 10, 1), 11.3],
                [Date.UTC(2007, 11, 1), 7.4],
                [Date.UTC(2007, 12, 1), 8.9],
                [Date.UTC(2008, 1, 1), 8.5],
                [Date.UTC(2008, 2, 1), 5.2],
                [Date.UTC(2008, 3, 1), 5.0],
                [Date.UTC(2008, 4, 1), 13.3],
                [Date.UTC(2008, 5, 1), 12.5],
                [Date.UTC(2008, 6, 1), 21.2],
                [Date.UTC(2008, 7, 1), 24.0],
                [Date.UTC(2008, 8, 1), 20.8],
                [Date.UTC(2008, 9, 1), 11.3],
                [Date.UTC(2008, 10, 1), 32.7],
                [Date.UTC(2008, 11, 1), 33.9],
                [Date.UTC(2008, 12, 1), 18.5],
                [Date.UTC(2009, 1, 1), 24.2],
                [Date.UTC(2009, 2, 1), 17.6],
                [Date.UTC(2009, 3, 1), 8.1],
                [Date.UTC(2009, 4, 1), -9.0],
                [Date.UTC(2009, 5, 1), -14.9],
                [Date.UTC(2009, 6, 1), -13.9],
                [Date.UTC(2009, 7, 1), -21.1],
                [Date.UTC(2009, 8, 1), -23.9],
                [Date.UTC(2009, 9, 1), -13.1],
                [Date.UTC(2009, 10, 1), -9.4],
                [Date.UTC(2009, 11, 1), -2.5],
                [Date.UTC(2009, 12, 1), 6.1],
                [Date.UTC(2010, 1, 1), -0.8],
                [Date.UTC(2010, 2, 1), 1.3],
                [Date.UTC(2010, 3, 1), 20.8],
                [Date.UTC(2010, 4, 1), 28.7],
                [Date.UTC(2010, 5, 1), 42.0],
                [Date.UTC(2010, 6, 1), 25.6],
                [Date.UTC(2010, 7, 1), 28.4],
                [Date.UTC(2010, 8, 1), 27.6],
                [Date.UTC(2010, 9, 1), 20.4],
                [Date.UTC(2010, 10, 1), 17.3],
                [Date.UTC(2010, 11, 1), 13.6],
                [Date.UTC(2010, 12, 1), 9.4],
                [Date.UTC(2011, 1, 1), 15.2],
                [Date.UTC(2011, 2, 1), 16.4],
                [Date.UTC(2011, 3, 1), 2.2],
                [Date.UTC(2011, 4, 1), -0.1],
                [Date.UTC(2011, 5, 1), 4.2],
                [Date.UTC(2011, 6, 1), 2.1],
                [Date.UTC(2011, 7, 1), 1.0],
                [Date.UTC(2011, 8, 1), 0.3],
                [Date.UTC(2011, 9, 1), 3.3],
                [Date.UTC(2011, 10, 1), -0.4],
                [Date.UTC(2011, 11, 1), -0.7],
                [Date.UTC(2011, 12, 1), 3.3],
                [Date.UTC(2012, 1, 1), 4.5],
                [Date.UTC(2012, 2, 1), 7.6],
                [Date.UTC(2012, 3, 1), 8.8],
                [Date.UTC(2012, 4, 1), 9.8],
                [Date.UTC(2012, 5, 1), 0.2],
                [Date.UTC(2012, 6, 1), 7.9],
                [Date.UTC(2012, 7, 1), 5.5],
                [Date.UTC(2012, 8, 1), 3.9],
                [Date.UTC(2012, 9, 1), 4.5],
                [Date.UTC(2012, 10, 1), 6.3],
                [Date.UTC(2012, 11, 1), 12.7],
                [Date.UTC(2012, 12, 1), 17.5],
                [Date.UTC(2013, 1, 1), 14.1],
                [Date.UTC(2013, 2, 1), 16.6],
                [Date.UTC(2013, 3, 1), 14.2],
                [Date.UTC(2013, 4, 1), 11.6],
                [Date.UTC(2013, 5, 1), 12.4],
                [Date.UTC(2013, 6, 1), 7.4],
                [Date.UTC(2013, 7, 1), 6.4],
                [Date.UTC(2013, 8, 1), 6.2],
                [Date.UTC(2013, 9, 1), 10.5],
                [Date.UTC(2013, 10, 1), 10.3],
                [Date.UTC(2013, 11, 1), 10.3],
                [Date.UTC(2013, 12, 1), 5.4],
                [Date.UTC(2014, 1, 1), 2.8],
                [Date.UTC(2014, 2, 1), 3.6],
                [Date.UTC(2014, 3, 1), 3.0],
                [Date.UTC(2014, 4, 1), 0.1],
                [Date.UTC(2014, 5, 1), 4.3],
                [Date.UTC(2014, 6, 1), -1.1],
                [Date.UTC(2014, 7, 1), 1.8],
                [Date.UTC(2014, 8, 1), 3.1],
                [Date.UTC(2014, 9, 1), 2.0],
                [Date.UTC(2014, 10, 1), 0.8],
                [Date.UTC(2014, 11, 1), 1.2],
                [Date.UTC(2014, 12, 1), 4.5],
                [Date.UTC(2015, 1, 1), 8.6],
                [Date.UTC(2015, 2, 1), 8.1],
                [Date.UTC(2015, 3, 1), 9.5],
                [Date.UTC(2015, 4, 1), 5.0],
                [Date.UTC(2015, 5, 1), 4.6],
                [Date.UTC(2015, 6, 1), 2.4],
                [Date.UTC(2015, 7, 1), 0.7],
                [Date.UTC(2015, 8, 1), -1.5],
                [Date.UTC(2015, 9, 1), -1.1],
                [Date.UTC(2015, 10, 1), 0.4],
                [Date.UTC(2015, 11, 1), 2.6],
                [Date.UTC(2015, 12, 1), -9.9],
                [Date.UTC(2016, 1, 1), -3.0],
                [Date.UTC(2016, 2, 1), -2.2],
                [Date.UTC(2016, 3, 1), -9.7],
                [Date.UTC(2016, 4, 1), 0.3],
                [Date.UTC(2016, 5, 1), -2.6],
                [Date.UTC(2016, 6, 1), -7.4],
                [Date.UTC(2016, 7, 1), -8.9],
                [Date.UTC(2016, 8, 1), -8.4],
                [Date.UTC(2016, 9, 1), -3.1],
                [Date.UTC(2016, 10, 1), -0.3],
                [Date.UTC(2016, 11, 1), -6.3],
                [Date.UTC(2016, 12, 1), -4.4],
                [Date.UTC(2017, 1, 1), -5.6],
                [Date.UTC(2017, 2, 1), -8.6],
                [Date.UTC(2017, 3, 1), -5.9],
                [Date.UTC(2017, 4, 1), -17.1],
                [Date.UTC(2017, 5, 1), -14.4],
                [Date.UTC(2017, 6, 1), -11.9],
                [Date.UTC(2017, 7, 1), -9.6],
                [Date.UTC(2017, 8, 1), -13.5],
                [Date.UTC(2017, 9, 1), -6.5],
                [Date.UTC(2017, 10, 1), -3.9],
                [Date.UTC(2017, 11, 1), 0.4],
                [Date.UTC(2017, 12, 1), 10.3],
                [Date.UTC(2018, 1, 1), 8.6],
                [Date.UTC(2018, 2, 1), 10.3],
                [Date.UTC(2018, 3, 1), 3.1],
                [Date.UTC(2018, 4, 1), 16.9],
                [Date.UTC(2018, 5, 1), 7.1],
                [Date.UTC(2018, 6, 1), 10.9],
                [Date.UTC(2018, 7, 1), 8.0],
                [Date.UTC(2018, 8, 1), 8.3],
                [Date.UTC(2018, 9, 1), 9.6],
                [Date.UTC(2018, 10, 1), 2.5],
                [Date.UTC(2018, 11, 1), 1.5],
                [Date.UTC(2018, 12, 1), 1.3],
                [Date.UTC(2019, 1, 1), -2.2],
                [Date.UTC(2019, 2, 1), -5.6],
                [Date.UTC(2019, 3, 1), 1.1],
                [Date.UTC(2019, 4, 1), -14.7],
                [Date.UTC(2019, 5, 1), -3.0],
                [Date.UTC(2019, 6, 1), -3.5],
                [Date.UTC(2019, 7, 1), -7.9],
                [Date.UTC(2019, 8, 1), -7.8],
                [Date.UTC(2019, 9, 1), -8.9],
                [Date.UTC(2019, 10, 1), -11.3],
                [Date.UTC(2019, 11, 1), -6.3],
                [Date.UTC(2019, 12, 1), -6.5],
                [Date.UTC(2020, 1, 1), -9.5],
                [Date.UTC(2020, 2, 1), -7.5],
                [Date.UTC(2020, 3, 1), -11.9],
                [Date.UTC(2020, 4, 1), -26.3]
            ]
        },
        {
            name: 'Soviet Union',
            fillOpacity: 0,
            data: [
                [Date.UTC(2002, 4, 1), -8.0],
                [Date.UTC(2002, 5, 1), -1.1],
                [Date.UTC(2002, 6, 1), -2.7],
                [Date.UTC(2002, 7, 1), 4.7],
                [Date.UTC(2002, 8, 1), 17.1],
                [Date.UTC(2002, 9, 1), 5.3],
                [Date.UTC(2002, 10, 1), -2.4],
                [Date.UTC(2002, 11, 1), -0.3],
                [Date.UTC(2002, 12, 1), 2.3],
                [Date.UTC(2003, 1, 1), 7.4],
                [Date.UTC(2003, 2, 1), 10.8],
                [Date.UTC(2003, 3, 1), 11.6],
                [Date.UTC(2003, 4, 1), 11.5],
                [Date.UTC(2003, 5, 1), 5.7],
                [Date.UTC(2003, 6, 1), 8.9],
                [Date.UTC(2003, 7, 1), 4.8],
                [Date.UTC(2003, 8, 1), -1.0],
                [Date.UTC(2003, 9, 1), 2.1],
                [Date.UTC(2003, 10, 1), 13.3],
                [Date.UTC(2003, 11, 1), 15.7],
                [Date.UTC(2003, 12, 1), 12.7],
                [Date.UTC(2004, 1, 1), 12.9],
                [Date.UTC(2004, 2, 1), 12.2],
                [Date.UTC(2004, 3, 1), 10.1],
                [Date.UTC(2004, 4, 1), 14.8],
                [Date.UTC(2004, 5, 1), 8.0],
                [Date.UTC(2004, 6, 1), 6.2],
                [Date.UTC(2004, 7, 1), 8.8],
                [Date.UTC(2004, 8, 1), 19.4],
                [Date.UTC(2004, 9, 1), 16.0],
                [Date.UTC(2004, 10, 1), 8.2],
                [Date.UTC(2004, 11, 1), 9.9],
                [Date.UTC(2004, 12, 1), 13.5],
                [Date.UTC(2005, 1, 1), 10.3],
                [Date.UTC(2005, 2, 1), 11.5],
                [Date.UTC(2005, 3, 1), 12.9],
                [Date.UTC(2005, 4, 1), 5.6],
                [Date.UTC(2005, 5, 1), 14.6],
                [Date.UTC(2005, 6, 1), 8.3],
                [Date.UTC(2005, 7, 1), 8.7],
                [Date.UTC(2005, 8, 1), 4.0],
                [Date.UTC(2005, 9, 1), -0.7],
                [Date.UTC(2005, 10, 1), -1.1],
                [Date.UTC(2005, 11, 1), -5.5],
                [Date.UTC(2005, 12, 1), -9.2],
                [Date.UTC(2006, 1, 1), -10.5],
                [Date.UTC(2006, 2, 1), -2.7],
                [Date.UTC(2006, 3, 1), -8.1],
                [Date.UTC(2006, 4, 1), -6.6],
                [Date.UTC(2006, 5, 1), -7.6],
                [Date.UTC(2006, 6, 1), -2.4],
                [Date.UTC(2006, 7, 1), -4.3],
                [Date.UTC(2006, 8, 1), -4.7],
                [Date.UTC(2006, 9, 1), -4.3],
                [Date.UTC(2006, 10, 1), -2.4],
                [Date.UTC(2006, 11, 1), -0.5],
                [Date.UTC(2006, 12, 1), 1.5],
                [Date.UTC(2007, 1, 1), 0.8],
                [Date.UTC(2007, 2, 1), -5.3],
                [Date.UTC(2007, 3, 1), -1.3],
                [Date.UTC(2007, 4, 1), 3.7],
                [Date.UTC(2007, 5, 1), 3.9],
                [Date.UTC(2007, 6, 1), 3.2],
                [Date.UTC(2007, 7, 1), 3.1],
                [Date.UTC(2007, 8, 1), -1.9],
                [Date.UTC(2007, 9, 1), 10.8],
                [Date.UTC(2007, 10, 1), 11.5],
                [Date.UTC(2007, 11, 1), 9.9],
                [Date.UTC(2007, 12, 1), 16.7],
                [Date.UTC(2008, 1, 1), 23.4],
                [Date.UTC(2008, 2, 1), 17.1],
                [Date.UTC(2008, 3, 1), 21.4],
                [Date.UTC(2008, 4, 1), 18.2],
                [Date.UTC(2008, 5, 1), 9.6],
                [Date.UTC(2008, 6, 1), 17.0],
                [Date.UTC(2008, 7, 1), 19.7],
                [Date.UTC(2008, 8, 1), 29.8],
                [Date.UTC(2008, 9, 1), 15.3],
                [Date.UTC(2008, 10, 1), 7.6],
                [Date.UTC(2008, 11, 1), 14.6],
                [Date.UTC(2008, 12, 1), 14.8],
                [Date.UTC(2009, 1, 1), 5.4],
                [Date.UTC(2009, 2, 1), -1.1],
                [Date.UTC(2009, 3, 1), -3.7],
                [Date.UTC(2009, 4, 1), -9.3],
                [Date.UTC(2009, 5, 1), -9.1],
                [Date.UTC(2009, 6, 1), -20.0],
                [Date.UTC(2009, 7, 1), -21.6],
                [Date.UTC(2009, 8, 1), -19.7],
                [Date.UTC(2009, 9, 1), -16.4],
                [Date.UTC(2009, 10, 1), -12.9],
                [Date.UTC(2009, 11, 1), -15.8],
                [Date.UTC(2009, 12, 1), -12.3],
                [Date.UTC(2010, 1, 1), -9.2],
                [Date.UTC(2010, 2, 1), 4.9],
                [Date.UTC(2010, 3, 1), 11.4],
                [Date.UTC(2010, 4, 1), 21.4],
                [Date.UTC(2010, 5, 1), 24.8],
                [Date.UTC(2010, 6, 1), 42.2],
                [Date.UTC(2010, 7, 1), 45.7],
                [Date.UTC(2010, 8, 1), 42.0],
                [Date.UTC(2010, 9, 1), 33.6],
                [Date.UTC(2010, 10, 1), 34.1],
                [Date.UTC(2010, 11, 1), 38.8],
                [Date.UTC(2010, 12, 1), 23.8],
                [Date.UTC(2011, 1, 1), 30.5],
                [Date.UTC(2011, 2, 1), 9.7],
                [Date.UTC(2011, 3, 1), 14.2],
                [Date.UTC(2011, 4, 1), 9.2],
                [Date.UTC(2011, 5, 1), 16.2],
                [Date.UTC(2011, 6, 1), 5.0],
                [Date.UTC(2011, 7, 1), 7.9],
                [Date.UTC(2011, 8, 1), 11.4],
                [Date.UTC(2011, 9, 1), 10.8],
                [Date.UTC(2011, 10, 1), 11.9],
                [Date.UTC(2011, 11, 1), 9.4],
                [Date.UTC(2011, 12, 1), 13.5],
                [Date.UTC(2012, 1, 1), 7.9],
                [Date.UTC(2012, 2, 1), 10.0],
                [Date.UTC(2012, 3, 1), 2.3],
                [Date.UTC(2012, 4, 1), 7.8],
                [Date.UTC(2012, 5, 1), 1.8],
                [Date.UTC(2012, 6, 1), 9.7],
                [Date.UTC(2012, 7, 1), 4.4],
                [Date.UTC(2012, 8, 1), 5.2],
                [Date.UTC(2012, 9, 1), -3.7],
                [Date.UTC(2012, 10, 1), 0.7],
                [Date.UTC(2012, 11, 1), -4.9],
                [Date.UTC(2012, 12, 1), 0.7],
                [Date.UTC(2013, 1, 1), 4.3],
                [Date.UTC(2013, 2, 1), 0.4],
                [Date.UTC(2013, 3, 1), -3.9],
                [Date.UTC(2013, 4, 1), -8.6],
                [Date.UTC(2013, 5, 1), -7.1],
                [Date.UTC(2013, 6, 1), -6.4],
                [Date.UTC(2013, 7, 1), -10.0],
                [Date.UTC(2013, 8, 1), -11.8],
                [Date.UTC(2013, 9, 1), -10.9],
                [Date.UTC(2013, 10, 1), -13.5],
                [Date.UTC(2013, 11, 1), -10.3],
                [Date.UTC(2013, 12, 1), -9.6],
                [Date.UTC(2014, 1, 1), -8.0],
                [Date.UTC(2014, 2, 1), -11.8],
                [Date.UTC(2014, 3, 1), -6.9],
                [Date.UTC(2014, 4, 1), -0.7],
                [Date.UTC(2014, 5, 1), -0.3],
                [Date.UTC(2014, 6, 1), 0.5],
                [Date.UTC(2014, 7, 1), 3.3],
                [Date.UTC(2014, 8, 1), 1.0],
                [Date.UTC(2014, 9, 1), 0.7],
                [Date.UTC(2014, 10, 1), 1.1],
                [Date.UTC(2014, 11, 1), 2.4],
                [Date.UTC(2014, 12, 1), 0.2],
                [Date.UTC(2015, 1, 1), -8.3],
                [Date.UTC(2015, 2, 1), -3.8],
                [Date.UTC(2015, 3, 1), -7.8],
                [Date.UTC(2015, 4, 1), -14.7],
                [Date.UTC(2015, 5, 1), -14.5],
                [Date.UTC(2015, 6, 1), -14.9],
                [Date.UTC(2015, 7, 1), -16.2],
                [Date.UTC(2015, 8, 1), -15.2],
                [Date.UTC(2015, 9, 1), -14.6],
                [Date.UTC(2015, 10, 1), -11.3],
                [Date.UTC(2015, 11, 1), -12.9],
                [Date.UTC(2015, 12, 1), -14.6],
                [Date.UTC(2016, 1, 1), -9.1],
                [Date.UTC(2016, 2, 1), -7.9],
                [Date.UTC(2016, 3, 1), -6.7],
                [Date.UTC(2016, 4, 1), -4.8],
                [Date.UTC(2016, 5, 1), -6.1],
                [Date.UTC(2016, 6, 1), -6.6],
                [Date.UTC(2016, 7, 1), -5.7],
                [Date.UTC(2016, 8, 1), -4.3],
                [Date.UTC(2016, 9, 1), -6.4],
                [Date.UTC(2016, 10, 1), -5.7],
                [Date.UTC(2016, 11, 1), 1.5],
                [Date.UTC(2016, 12, 1), 1.3],
                [Date.UTC(2017, 1, 1), 2.2],
                [Date.UTC(2017, 2, 1), -2.7],
                [Date.UTC(2017, 3, 1), -1.7],
                [Date.UTC(2017, 4, 1), 0.2],
                [Date.UTC(2017, 5, 1), -7.5],
                [Date.UTC(2017, 6, 1), -4.2],
                [Date.UTC(2017, 7, 1), -5.2],
                [Date.UTC(2017, 8, 1), -9.9],
                [Date.UTC(2017, 9, 1), -4.9],
                [Date.UTC(2017, 10, 1), -8.3],
                [Date.UTC(2017, 11, 1), -11.4],
                [Date.UTC(2017, 12, 1), -5.0],
                [Date.UTC(2018, 1, 1), -2.8],
                [Date.UTC(2018, 2, 1), 4.5],
                [Date.UTC(2018, 3, 1), 4.4],
                [Date.UTC(2018, 4, 1), 0.5],
                [Date.UTC(2018, 5, 1), 3.2],
                [Date.UTC(2018, 6, 1), 6.3],
                [Date.UTC(2018, 7, 1), 10.7],
                [Date.UTC(2018, 8, 1), -2.9],
                [Date.UTC(2018, 9, 1), 13.5],
                [Date.UTC(2018, 10, 1), 9.3],
                [Date.UTC(2018, 11, 1), 7.4],
                [Date.UTC(2018, 12, 1), -0.7],
                [Date.UTC(2019, 1, 1), -0.7],
                [Date.UTC(2019, 2, 1), 0.3],
                [Date.UTC(2019, 3, 1), -0.5],
                [Date.UTC(2019, 4, 1), 0.0],
                [Date.UTC(2019, 5, 1), 3.4],
                [Date.UTC(2019, 6, 1), 1.9],
                [Date.UTC(2019, 7, 1), -0.8],
                [Date.UTC(2019, 8, 1), 0.3],
                [Date.UTC(2019, 9, 1), -3.2],
                [Date.UTC(2019, 10, 1), -1.3],
                [Date.UTC(2019, 11, 1), 2.8],
                [Date.UTC(2019, 12, 1), -3.1],
                [Date.UTC(2020, 1, 1), -1.5],
                [Date.UTC(2020, 2, 1), -1.9],
                [Date.UTC(2020, 3, 1), -7.9],
                [Date.UTC(2020, 4, 1), -9.7]
            ]
        },
        {
            name: 'Unified Team',
            fillOpacity: 0,
            data: [
                [Date.UTC(2002, 4, 1), 5.0],
                [Date.UTC(2002, 5, 1), 6.8],
                [Date.UTC(2002, 6, 1), 9.0],
                [Date.UTC(2002, 7, 1), 10.8],
                [Date.UTC(2002, 8, 1), 11.1],
                [Date.UTC(2002, 9, 1), 8.3],
                [Date.UTC(2002, 10, 1), 8.0],
                [Date.UTC(2002, 11, 1), 10.3],
                [Date.UTC(2002, 12, 1), 11.4],
                [Date.UTC(2003, 1, 1), 14.2],
                [Date.UTC(2003, 2, 1), 15.2],
                [Date.UTC(2003, 3, 1), 18.2],
                [Date.UTC(2003, 4, 1), 17.4],
                [Date.UTC(2003, 5, 1), 19.3],
                [Date.UTC(2003, 6, 1), 25.8],
                [Date.UTC(2003, 7, 1), 23.9],
                [Date.UTC(2003, 8, 1), 19.3],
                [Date.UTC(2003, 9, 1), 15.4],
                [Date.UTC(2003, 10, 1), 21.4],
                [Date.UTC(2003, 11, 1), 19.2],
                [Date.UTC(2003, 12, 1), 18.5],
                [Date.UTC(2004, 1, 1), 19.2],
                [Date.UTC(2004, 2, 1), 20.8],
                [Date.UTC(2004, 3, 1), 19.8],
                [Date.UTC(2004, 4, 1), 13.2],
                [Date.UTC(2004, 5, 1), 6.7],
                [Date.UTC(2004, 6, 1), 2.7],
                [Date.UTC(2004, 7, 1), -1.1],
                [Date.UTC(2004, 8, 1), -1.0],
                [Date.UTC(2004, 9, 1), 7.9],
                [Date.UTC(2004, 10, 1), 3.8],
                [Date.UTC(2004, 11, 1), 9.7],
                [Date.UTC(2004, 12, 1), 13.6],
                [Date.UTC(2005, 1, 1), 10.6],
                [Date.UTC(2005, 2, 1), 6.0],
                [Date.UTC(2005, 3, 1), 8.0],
                [Date.UTC(2005, 4, 1), 8.1],
                [Date.UTC(2005, 5, 1), 18.8],
                [Date.UTC(2005, 6, 1), 10.6],
                [Date.UTC(2005, 7, 1), 18.6],
                [Date.UTC(2005, 8, 1), 19.1],
                [Date.UTC(2005, 9, 1), 9.1],
                [Date.UTC(2005, 10, 1), 6.5],
                [Date.UTC(2005, 11, 1), -5.0],
                [Date.UTC(2005, 12, 1), -9.4],
                [Date.UTC(2006, 1, 1), -11.6],
                [Date.UTC(2006, 2, 1), -4.6],
                [Date.UTC(2006, 3, 1), -10.5],
                [Date.UTC(2006, 4, 1), 0.5],
                [Date.UTC(2006, 5, 1), -4.6],
                [Date.UTC(2006, 6, 1), 1.7],
                [Date.UTC(2006, 7, 1), -2.2],
                [Date.UTC(2006, 8, 1), 0.3],
                [Date.UTC(2006, 9, 1), 6.0],
                [Date.UTC(2006, 10, 1), 7.1],
                [Date.UTC(2006, 11, 1), 11.0],
                [Date.UTC(2006, 12, 1), 12.7],
                [Date.UTC(2007, 1, 1), 14.2],
                [Date.UTC(2007, 2, 1), 8.0],
                [Date.UTC(2007, 3, 1), 12.9],
                [Date.UTC(2007, 4, 1), 11.1],
                [Date.UTC(2007, 5, 1), 10.1],
                [Date.UTC(2007, 6, 1), 6.3],
                [Date.UTC(2007, 7, 1), 6.3],
                [Date.UTC(2007, 8, 1), 6.7],
                [Date.UTC(2007, 9, 1), 7.3],
                [Date.UTC(2007, 10, 1), 7.8],
                [Date.UTC(2007, 11, 1), 9.6],
                [Date.UTC(2007, 12, 1), 12.6],
                [Date.UTC(2008, 1, 1), 11.5],
                [Date.UTC(2008, 2, 1), 7.9],
                [Date.UTC(2008, 3, 1), 8.0],
                [Date.UTC(2008, 4, 1), 4.8],
                [Date.UTC(2008, 5, 1), 7.0],
                [Date.UTC(2008, 6, 1), 24.8],
                [Date.UTC(2008, 7, 1), 21.3],
                [Date.UTC(2008, 8, 1), 17.4],
                [Date.UTC(2008, 9, 1), 12.9],
                [Date.UTC(2008, 10, 1), 9.9],
                [Date.UTC(2008, 11, 1), 9.7],
                [Date.UTC(2008, 12, 1), 2.2],
                [Date.UTC(2009, 1, 1), -0.2],
                [Date.UTC(2009, 2, 1), -5.7],
                [Date.UTC(2009, 3, 1), -13.7],
                [Date.UTC(2009, 4, 1), -17.5],
                [Date.UTC(2009, 5, 1), -22.1],
                [Date.UTC(2009, 6, 1), -22.4],
                [Date.UTC(2009, 7, 1), -22.1],
                [Date.UTC(2009, 8, 1), -22.0],
                [Date.UTC(2009, 9, 1), -21.2],
                [Date.UTC(2009, 10, 1), -15.5],
                [Date.UTC(2009, 11, 1), -8.0],
                [Date.UTC(2009, 12, 1), 0.4],
                [Date.UTC(2010, 1, 1), 1.5],
                [Date.UTC(2010, 2, 1), 17.8],
                [Date.UTC(2010, 3, 1), 27.9],
                [Date.UTC(2010, 4, 1), 33.4],
                [Date.UTC(2010, 5, 1), 37.2],
                [Date.UTC(2010, 6, 1), 38.1],
                [Date.UTC(2010, 7, 1), 33.4],
                [Date.UTC(2010, 8, 1), 24.9],
                [Date.UTC(2010, 9, 1), 29.5],
                [Date.UTC(2010, 10, 1), 23.6],
                [Date.UTC(2010, 11, 1), 4.0],
                [Date.UTC(2010, 12, 1), 1.0],
                [Date.UTC(2011, 1, 1), -0.8],
                [Date.UTC(2011, 2, 1), -6.6],
                [Date.UTC(2011, 3, 1), -7.2],
                [Date.UTC(2011, 4, 1), -3.2],
                [Date.UTC(2011, 5, 1), 2.8],
                [Date.UTC(2011, 6, 1), 0.5],
                [Date.UTC(2011, 7, 1), 7.8],
                [Date.UTC(2011, 8, 1), 13.3],
                [Date.UTC(2011, 9, 1), 6.8],
                [Date.UTC(2011, 10, 1), 7.1],
                [Date.UTC(2011, 11, 1), 14.8],
                [Date.UTC(2011, 12, 1), 9.3],
                [Date.UTC(2012, 1, 1), 12.8],
                [Date.UTC(2012, 2, 1), 20.4],
                [Date.UTC(2012, 3, 1), 14.6],
                [Date.UTC(2012, 4, 1), 13.1],
                [Date.UTC(2012, 5, 1), 5.2],
                [Date.UTC(2012, 6, 1), 4.9],
                [Date.UTC(2012, 7, 1), -4.1],
                [Date.UTC(2012, 8, 1), -7.5],
                [Date.UTC(2012, 9, 1), -4.6],
                [Date.UTC(2012, 10, 1), -6.2],
                [Date.UTC(2012, 11, 1), 1.8],
                [Date.UTC(2012, 12, 1), 4.5],
                [Date.UTC(2013, 1, 1), 4.0],
                [Date.UTC(2013, 2, 1), -0.3],
                [Date.UTC(2013, 3, 1), 6.1],
                [Date.UTC(2013, 4, 1), -5.7],
                [Date.UTC(2013, 5, 1), -0.8],
                [Date.UTC(2013, 6, 1), 1.9],
                [Date.UTC(2013, 7, 1), 2.7],
                [Date.UTC(2013, 8, 1), 2.9],
                [Date.UTC(2013, 9, 1), 1.8],
                [Date.UTC(2013, 10, 1), 0.5],
                [Date.UTC(2013, 11, 1), 2.3],
                [Date.UTC(2013, 12, 1), -0.1],
                [Date.UTC(2014, 1, 1), -3.0],
                [Date.UTC(2014, 2, 1), -3.8],
                [Date.UTC(2014, 3, 1), -2.4],
                [Date.UTC(2014, 4, 1), 5.2],
                [Date.UTC(2014, 5, 1), 5.0],
                [Date.UTC(2014, 6, 1), 1.8],
                [Date.UTC(2014, 7, 1), -0.7],
                [Date.UTC(2014, 8, 1), -4.6],
                [Date.UTC(2014, 9, 1), 4.4],
                [Date.UTC(2014, 10, 1), 7.0],
                [Date.UTC(2014, 11, 1), -2.2],
                [Date.UTC(2014, 12, 1), 4.4],
                [Date.UTC(2015, 1, 1), 1.5],
                [Date.UTC(2015, 2, 1), -0.8],
                [Date.UTC(2015, 3, 1), -3.1],
                [Date.UTC(2015, 4, 1), -9.8],
                [Date.UTC(2015, 5, 1), -9.8],
                [Date.UTC(2015, 6, 1), -13.0],
                [Date.UTC(2015, 7, 1), -9.0],
                [Date.UTC(2015, 8, 1), -10.3],
                [Date.UTC(2015, 9, 1), -8.6],
                [Date.UTC(2015, 10, 1), -10.8],
                [Date.UTC(2015, 11, 1), -2.3],
                [Date.UTC(2015, 12, 1), -11.7],
                [Date.UTC(2016, 1, 1), -7.3],
                [Date.UTC(2016, 2, 1), -6.7],
                [Date.UTC(2016, 3, 1), 6.5],
                [Date.UTC(2016, 4, 1), -1.7],
                [Date.UTC(2016, 5, 1), -9.0],
                [Date.UTC(2016, 6, 1), -7.1],
                [Date.UTC(2016, 7, 1), -13.6],
                [Date.UTC(2016, 8, 1), -9.9],
                [Date.UTC(2016, 9, 1), -9.3],
                [Date.UTC(2016, 10, 1), -3.6],
                [Date.UTC(2016, 11, 1), -3.7],
                [Date.UTC(2016, 12, 1), 9.3],
                [Date.UTC(2017, 1, 1), 3.1],
                [Date.UTC(2017, 2, 1), 10.5],
                [Date.UTC(2017, 3, 1), -8.0],
                [Date.UTC(2017, 4, 1), -5.7],
                [Date.UTC(2017, 5, 1), 0.9],
                [Date.UTC(2017, 6, 1), -2.4],
                [Date.UTC(2017, 7, 1), 2.8],
                [Date.UTC(2017, 8, 1), -5.9],
                [Date.UTC(2017, 9, 1), 6.4],
                [Date.UTC(2017, 10, 1), 6.8],
                [Date.UTC(2017, 11, 1), 5.3],
                [Date.UTC(2017, 12, 1), -6.6],
                [Date.UTC(2018, 1, 1), -5.4],
                [Date.UTC(2018, 2, 1), -4.0],
                [Date.UTC(2018, 3, 1), 2.7],
                [Date.UTC(2018, 4, 1), 7.2],
                [Date.UTC(2018, 5, 1), 3.6],
                [Date.UTC(2018, 6, 1), 2.3],
                [Date.UTC(2018, 7, 1), 0.8],
                [Date.UTC(2018, 8, 1), 4.3],
                [Date.UTC(2018, 9, 1), -3.8],
                [Date.UTC(2018, 10, 1), -6.8],
                [Date.UTC(2018, 11, 1), -6.5],
                [Date.UTC(2018, 12, 1), 0.6],
                [Date.UTC(2019, 1, 1), 3.1],
                [Date.UTC(2019, 2, 1), -5.9],
                [Date.UTC(2019, 3, 1), -7.2],
                [Date.UTC(2019, 4, 1), -5.2],
                [Date.UTC(2019, 5, 1), -4.3],
                [Date.UTC(2019, 6, 1), -5.3],
                [Date.UTC(2019, 7, 1), -2.5],
                [Date.UTC(2019, 8, 1), -2.8],
                [Date.UTC(2019, 9, 1), -6.2],
                [Date.UTC(2019, 10, 1), -8.8],
                [Date.UTC(2019, 11, 1), -5.9],
                [Date.UTC(2019, 12, 1), -9.7],
                [Date.UTC(2020, 1, 1), -8.0],
                [Date.UTC(2020, 2, 1), -7.6],
                [Date.UTC(2020, 3, 1), -12.3],
                [Date.UTC(2020, 4, 1), -24.3]
            ]
        },
        {
            name: 'Hungary',
            fillOpacity: 0,
            data: [
                [Date.UTC(2002, 4, 1), -0.2],
                [Date.UTC(2002, 5, 1), -6.1],
                [Date.UTC(2002, 6, 1), -6.1],
                [Date.UTC(2002, 7, 1), -5.0],
                [Date.UTC(2002, 8, 1), -8.6],
                [Date.UTC(2002, 9, 1), -10.4],
                [Date.UTC(2002, 10, 1), -7.5],
                [Date.UTC(2002, 11, 1), -9.0],
                [Date.UTC(2002, 12, 1), -9.0],
                [Date.UTC(2003, 1, 1), -10.2],
                [Date.UTC(2003, 2, 1), -3.0],
                [Date.UTC(2003, 3, 1), -1.6],
                [Date.UTC(2003, 4, 1), -5.7],
                [Date.UTC(2003, 5, 1), -0.8],
                [Date.UTC(2003, 6, 1), 1.1],
                [Date.UTC(2003, 7, 1), 6.8],
                [Date.UTC(2003, 8, 1), 7.6],
                [Date.UTC(2003, 9, 1), 3.7],
                [Date.UTC(2003, 10, 1), 3.4],
                [Date.UTC(2003, 11, 1), 3.8],
                [Date.UTC(2003, 12, 1), 1.7],
                [Date.UTC(2004, 1, 1), 8.9],
                [Date.UTC(2004, 2, 1), 0.0],
                [Date.UTC(2004, 3, 1), 0.4],
                [Date.UTC(2004, 4, 1), 5.9],
                [Date.UTC(2004, 5, 1), 7.6],
                [Date.UTC(2004, 6, 1), 7.4],
                [Date.UTC(2004, 7, 1), 7.5],
                [Date.UTC(2004, 8, 1), 7.4],
                [Date.UTC(2004, 9, 1), 5.2],
                [Date.UTC(2004, 10, 1), 4.4],
                [Date.UTC(2004, 11, 1), 5.3],
                [Date.UTC(2004, 12, 1), 6.0],
                [Date.UTC(2005, 1, 1), -0.6],
                [Date.UTC(2005, 2, 1), 2.1],
                [Date.UTC(2005, 3, 1), 0.9],
                [Date.UTC(2005, 4, 1), 2.3],
                [Date.UTC(2005, 5, 1), -1.3],
                [Date.UTC(2005, 6, 1), -2.5],
                [Date.UTC(2005, 7, 1), -2.6],
                [Date.UTC(2005, 8, 1), -3.7],
                [Date.UTC(2005, 9, 1), -0.8],
                [Date.UTC(2005, 10, 1), 0.0],
                [Date.UTC(2005, 11, 1), -1.1],
                [Date.UTC(2005, 12, 1), 0.6],
                [Date.UTC(2006, 1, 1), 0.6],
                [Date.UTC(2006, 2, 1), 2.5],
                [Date.UTC(2006, 3, 1), 1.9],
                [Date.UTC(2006, 4, 1), -1.1],
                [Date.UTC(2006, 5, 1), 4.1],
                [Date.UTC(2006, 6, 1), 4.5],
                [Date.UTC(2006, 7, 1), 2.3],
                [Date.UTC(2006, 8, 1), 4.6],
                [Date.UTC(2006, 9, 1), 6.1],
                [Date.UTC(2006, 10, 1), 9.1],
                [Date.UTC(2006, 11, 1), 8.4],
                [Date.UTC(2006, 12, 1), 7.4],
                [Date.UTC(2007, 1, 1), 6.6],
                [Date.UTC(2007, 2, 1), 9.8],
                [Date.UTC(2007, 3, 1), 9.8],
                [Date.UTC(2007, 4, 1), 1.4],
                [Date.UTC(2007, 5, 1), 0.0],
                [Date.UTC(2007, 6, 1), -0.5],
                [Date.UTC(2007, 7, 1), -0.1],
                [Date.UTC(2007, 8, 1), 0.2],
                [Date.UTC(2007, 9, 1), 1.8],
                [Date.UTC(2007, 10, 1), 2.6],
                [Date.UTC(2007, 11, 1), 5.7],
                [Date.UTC(2007, 12, 1), 3.4],
                [Date.UTC(2008, 1, 1), 3.6],
                [Date.UTC(2008, 2, 1), 3.8],
                [Date.UTC(2008, 3, 1), 5.1],
                [Date.UTC(2008, 4, 1), 18.8],
                [Date.UTC(2008, 5, 1), 22.5],
                [Date.UTC(2008, 6, 1), 27.1],
                [Date.UTC(2008, 7, 1), 27.2],
                [Date.UTC(2008, 8, 1), 25.0],
                [Date.UTC(2008, 9, 1), 10.9],
                [Date.UTC(2008, 10, 1), 4.6],
                [Date.UTC(2008, 11, 1), 1.9],
                [Date.UTC(2008, 12, 1), 23.1],
                [Date.UTC(2009, 1, 1), -0.5],
                [Date.UTC(2009, 2, 1), -5.1],
                [Date.UTC(2009, 3, 1), -9.1],
                [Date.UTC(2009, 4, 1), -11.1],
                [Date.UTC(2009, 5, 1), -20.2],
                [Date.UTC(2009, 6, 1), -22.7],
                [Date.UTC(2009, 7, 1), -21.2],
                [Date.UTC(2009, 8, 1), -16.8],
                [Date.UTC(2009, 9, 1), -12.3],
                [Date.UTC(2009, 10, 1), -7.2],
                [Date.UTC(2009, 11, 1), 0.6],
                [Date.UTC(2009, 12, 1), -7.2],
                [Date.UTC(2010, 1, 1), 3.1],
                [Date.UTC(2010, 2, 1), 8.5],
                [Date.UTC(2010, 3, 1), 15.0],
                [Date.UTC(2010, 4, 1), 20.6],
                [Date.UTC(2010, 5, 1), 22.5],
                [Date.UTC(2010, 6, 1), 23.4],
                [Date.UTC(2010, 7, 1), 18.4],
                [Date.UTC(2010, 8, 1), 14.5],
                [Date.UTC(2010, 9, 1), 21.4],
                [Date.UTC(2010, 10, 1), 24.7],
                [Date.UTC(2010, 11, 1), 20.4],
                [Date.UTC(2010, 12, 1), 16.7],
                [Date.UTC(2011, 1, 1), 20.6],
                [Date.UTC(2011, 2, 1), 19.8],
                [Date.UTC(2011, 3, 1), 20.0],
                [Date.UTC(2011, 4, 1), 18.2],
                [Date.UTC(2011, 5, 1), 22.7],
                [Date.UTC(2011, 6, 1), 19.3],
                [Date.UTC(2011, 7, 1), 22.3],
                [Date.UTC(2011, 8, 1), 23.8],
                [Date.UTC(2011, 9, 1), 17.4],
                [Date.UTC(2011, 10, 1), 14.0],
                [Date.UTC(2011, 11, 1), 10.5],
                [Date.UTC(2011, 12, 1), 9.2],
                [Date.UTC(2012, 1, 1), 13.3],
                [Date.UTC(2012, 2, 1), 12.1],
                [Date.UTC(2012, 3, 1), 9.3],
                [Date.UTC(2012, 4, 1), 5.9],
                [Date.UTC(2012, 5, 1), 0.8],
                [Date.UTC(2012, 6, 1), 3.8],
                [Date.UTC(2012, 7, 1), -1.0],
                [Date.UTC(2012, 8, 1), -5.2],
                [Date.UTC(2012, 9, 1), -6.4],
                [Date.UTC(2012, 10, 1), -6.9],
                [Date.UTC(2012, 11, 1), -2.3],
                [Date.UTC(2012, 12, 1), -1.0],
                [Date.UTC(2013, 1, 1), -8.5],
                [Date.UTC(2013, 2, 1), -7.8],
                [Date.UTC(2013, 3, 1), -5.8],
                [Date.UTC(2013, 4, 1), -7.7],
                [Date.UTC(2013, 5, 1), -3.5],
                [Date.UTC(2013, 6, 1), -0.4],
                [Date.UTC(2013, 7, 1), -0.2],
                [Date.UTC(2013, 8, 1), 0.4],
                [Date.UTC(2013, 9, 1), 3.5],
                [Date.UTC(2013, 10, 1), 3.1],
                [Date.UTC(2013, 11, 1), 0.8],
                [Date.UTC(2013, 12, 1), 1.4],
                [Date.UTC(2014, 1, 1), 2.8],
                [Date.UTC(2014, 2, 1), 1.2],
                [Date.UTC(2014, 3, 1), 0.5],
                [Date.UTC(2014, 4, 1), 3.7],
                [Date.UTC(2014, 5, 1), 2.1],
                [Date.UTC(2014, 6, 1), -2.3],
                [Date.UTC(2014, 7, 1), -2.1],
                [Date.UTC(2014, 8, 1), 0.1],
                [Date.UTC(2014, 9, 1), 0.9],
                [Date.UTC(2014, 10, 1), 4.3],
                [Date.UTC(2014, 11, 1), -1.3],
                [Date.UTC(2014, 12, 1), -0.7],
                [Date.UTC(2015, 1, 1), -1.7],
                [Date.UTC(2015, 2, 1), 0.2],
                [Date.UTC(2015, 3, 1), -1.0],
                [Date.UTC(2015, 4, 1), -4.8],
                [Date.UTC(2015, 5, 1), -5.5],
                [Date.UTC(2015, 6, 1), -5.7],
                [Date.UTC(2015, 7, 1), -4.4],
                [Date.UTC(2015, 8, 1), -5.4],
                [Date.UTC(2015, 9, 1), -9.1],
                [Date.UTC(2015, 10, 1), -13.0],
                [Date.UTC(2015, 11, 1), -11.3],
                [Date.UTC(2015, 12, 1), -8.4],
                [Date.UTC(2016, 1, 1), -13.8],
                [Date.UTC(2016, 2, 1), -11.7],
                [Date.UTC(2016, 3, 1), -11.2],
                [Date.UTC(2016, 4, 1), -12.4],
                [Date.UTC(2016, 5, 1), -9.5],
                [Date.UTC(2016, 6, 1), -4.6],
                [Date.UTC(2016, 7, 1), -4.7],
                [Date.UTC(2016, 8, 1), -4.1],
                [Date.UTC(2016, 9, 1), -0.4],
                [Date.UTC(2016, 10, 1), 3.7],
                [Date.UTC(2016, 11, 1), 8.4],
                [Date.UTC(2016, 12, 1), 2.8],
                [Date.UTC(2017, 1, 1), 8.6],
                [Date.UTC(2017, 2, 1), 8.0],
                [Date.UTC(2017, 3, 1), 9.3],
                [Date.UTC(2017, 4, 1), 12.7],
                [Date.UTC(2017, 5, 1), 8.3],
                [Date.UTC(2017, 6, 1), 6.8],
                [Date.UTC(2017, 7, 1), 5.8],
                [Date.UTC(2017, 8, 1), 3.0],
                [Date.UTC(2017, 9, 1), 3.0],
                [Date.UTC(2017, 10, 1), 0.4],
                [Date.UTC(2017, 11, 1), 0.4],
                [Date.UTC(2017, 12, 1), 2.7],
                [Date.UTC(2018, 1, 1), 1.2],
                [Date.UTC(2018, 2, 1), 3.5],
                [Date.UTC(2018, 3, 1), 3.4],
                [Date.UTC(2018, 4, 1), 2.2],
                [Date.UTC(2018, 5, 1), -1.5],
                [Date.UTC(2018, 6, 1), -1.2],
                [Date.UTC(2018, 7, 1), -1.0],
                [Date.UTC(2018, 8, 1), -2.7],
                [Date.UTC(2018, 9, 1), -2.6],
                [Date.UTC(2018, 10, 1), -2.4],
                [Date.UTC(2018, 11, 1), -0.9],
                [Date.UTC(2018, 12, 1), -1.2],
                [Date.UTC(2019, 1, 1), -5.4],
                [Date.UTC(2019, 2, 1), -5.1],
                [Date.UTC(2019, 3, 1), -7.8],
                [Date.UTC(2019, 4, 1), -6.9],
                [Date.UTC(2019, 5, 1), -1.2],
                [Date.UTC(2019, 6, 1), -1.4],
                [Date.UTC(2019, 7, 1), 2.3],
                [Date.UTC(2019, 8, 1), 1.8],
                [Date.UTC(2019, 9, 1), -0.8],
                [Date.UTC(2019, 10, 1), 1.4],
                [Date.UTC(2019, 11, 1), -0.9],
                [Date.UTC(2019, 12, 1), 4.2],
                [Date.UTC(2020, 1, 1), 1.1],
                [Date.UTC(2020, 2, 1), 4.7],
                [Date.UTC(2020, 3, 1), -2.5],
                [Date.UTC(2020, 4, 1), -6.9]
            ]
        }
    ]
};

const charts = [str, cr, sk, rc];

function makeChart() {
    const chartNum = Math.round(randomNumber(0, 3));
    const chart = charts[chartNum];
    Highcharts.chart('hero', chart);
}

makeChart();
