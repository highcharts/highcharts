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
        marginBottom: 10,
        marginRight: 0,
        // height: 430,
        zooming: {
            type: 'x'
        },
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
            'Streamgraphs are a type of stacked area charts where the areas ' +
            'are displaced around a central axis. This chart is showing ' +
            'price indices for air freight, importing and exporting.'
    },
    responsive: {
        rules: [
            {
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    xAxis: {
                        min: '2017-02-01'
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
        min: '2011-02-01',
        max: '2020-02-01',
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
                ['2002-05-01', 0.5],
                ['2002-06-01', 1.9],
                ['2002-07-01', 2.8],
                ['2002-08-01', 7.5],
                ['2002-09-01', 10.0],
                ['2002-10-01', 5.5],
                ['2002-11-01', 2.3],
                ['2002-12-01', 4.5],
                ['2002-13-01', 4.9],
                ['2003-02-01', 9.2],
                ['2003-03-01', 9.0],
                ['2003-04-01', 11.2],
                ['2003-05-01', 10.9],
                ['2003-06-01', 10.5],
                ['2003-07-01', 13.4],
                ['2003-08-01', 11.9],
                ['2003-09-01', 10.2],
                ['2003-10-01', 9.2],
                ['2003-11-01', 15.1],
                ['2003-12-01', 14.8],
                ['2003-13-01', 14.7],
                ['2004-02-01', 15.7],
                ['2004-03-01', 15.1],
                ['2004-04-01', 13.7],
                ['2004-05-01', 13.7],
                ['2004-06-01', 8.3],
                ['2004-07-01', 5.8],
                ['2004-08-01', 4.9],
                ['2004-09-01', 9.3],
                ['2004-10-01', 10.3],
                ['2004-11-01', 6.2],
                ['2004-12-01', 9.8],
                ['2004-13-01', 13.2],
                ['2005-02-01', 10.3],
                ['2005-03-01', 9.1],
                ['2005-04-01', 10.6],
                ['2005-05-01', 7.8],
                ['2005-06-01', 15.5],
                ['2005-07-01', 10.0],
                ['2005-08-01', 13.7],
                ['2005-09-01', 11.0],
                ['2005-10-01', 7.2],
                ['2005-11-01', 6.3],
                ['2005-12-01', -1.6],
                ['2005-13-01', -4.3],
                ['2006-02-01', -6.0],
                ['2006-03-01', 0.2],
                ['2006-04-01', -4.0],
                ['2006-05-01', -1.3],
                ['2006-06-01', -2.5],
                ['2006-07-01', 2.3],
                ['2006-08-01', -0.5],
                ['2006-09-01', -0.5],
                ['2006-10-01', 2.1],
                ['2006-11-01', 3.0],
                ['2006-12-01', 6.4],
                ['2006-13-01', 7.0],
                ['2007-02-01', 6.9],
                ['2007-03-01', 3.2],
                ['2007-04-01', 7.2],
                ['2007-05-01', 9.3],
                ['2007-06-01', 7.5],
                ['2007-07-01', 5.7],
                ['2007-08-01', 5.7],
                ['2007-09-01', 3.9],
                ['2007-10-01', 8.6],
                ['2007-11-01', 10.0],
                ['2007-12-01', 11.5],
                ['2007-13-01', 13.4],
                ['2008-02-01', 14.3],
                ['2008-03-01', 9.8],
                ['2008-04-01', 11.6],
                ['2008-05-01', 6.3],
                ['2008-06-01', 6.0],
                ['2008-07-01', 16.4],
                ['2008-08-01', 17.6],
                ['2008-09-01', 20.6],
                ['2008-10-01', 11.2],
                ['2008-11-01', 5.5],
                ['2008-12-01', 5.2],
                ['2008-13-01', 5.7],
                ['2009-02-01', 1.9],
                ['2009-03-01', -3.5],
                ['2009-04-01', -9.4],
                ['2009-05-01', -11.0],
                ['2009-06-01', -15.5],
                ['2009-07-01', -19.4],
                ['2009-08-01', -21.8],
                ['2009-09-01', -19.5],
                ['2009-10-01', -17.8],
                ['2009-11-01', -14.4],
                ['2009-12-01', -11.3],
                ['2009-13-01', -5.2],
                ['2010-02-01', -4.4],
                ['2010-03-01', 5.1],
                ['2010-04-01', 11.3],
                ['2010-05-01', 19.2],
                ['2010-06-01', 22.0],
                ['2010-07-01', 27.6],
                ['2010-08-01', 30.5],
                ['2010-09-01', 21.2],
                ['2010-10-01', 21.9],
                ['2010-11-01', 21.2],
                ['2010-12-01', 15.0],
                ['2010-13-01', 8.3],
                ['2011-02-01', 13.2],
                ['2011-03-01', 4.1],
                ['2011-04-01', 9.6],
                ['2011-05-01', 8.1],
                ['2011-06-01', 12.2],
                ['2011-07-01', 5.8],
                ['2011-08-01', 10.2],
                ['2011-09-01', 18.1],
                ['2011-10-01', 11.9],
                ['2011-11-01', 11.9],
                ['2011-12-01', 13.0],
                ['2011-13-01', 13.1],
                ['2012-02-01', 9.5],
                ['2012-03-01', 15.6],
                ['2012-04-01', 7.1],
                ['2012-05-01', 6.2],
                ['2012-06-01', 8.4],
                ['2012-07-01', 8.7],
                ['2012-08-01', 3.8],
                ['2012-09-01', -3.6],
                ['2012-10-01', -2.5],
                ['2012-11-01', -0.7],
                ['2012-12-01', -0.7],
                ['2012-13-01', -2.5],
                ['2013-02-01', 2.6],
                ['2013-03-01', -1.4],
                ['2013-04-01', 0.1],
                ['2013-05-01', -3.2],
                ['2013-06-01', -4.4],
                ['2013-07-01', -3.4],
                ['2013-08-01', -4.7],
                ['2013-09-01', -3.6],
                ['2013-10-01', -1.2],
                ['2013-11-01', -3.6],
                ['2013-12-01', -3.1],
                ['2013-13-01', 3.2],
                ['2014-02-01', -1.6],
                ['2014-03-01', -6.3],
                ['2014-04-01', -3.6],
                ['2014-05-01', 1.9],
                ['2014-06-01', -1.2],
                ['2014-07-01', 0.4],
                ['2014-08-01', 0.5],
                ['2014-09-01', 3.9],
                ['2014-10-01', 1.8],
                ['2014-11-01', 1.6],
                ['2014-12-01', -1.8],
                ['2014-13-01', -2.0],
                ['2015-02-01', -4.0],
                ['2015-03-01', -5.1],
                ['2015-04-01', -7.8],
                ['2015-05-01', -13.8],
                ['2015-06-01', -13.1],
                ['2015-07-01', -14.2],
                ['2015-08-01', -14.2],
                ['2015-09-01', -17.5],
                ['2015-10-01', -17.0],
                ['2015-11-01', -15.6],
                ['2015-12-01', -11.5],
                ['2015-13-01', -14.6],
                ['2016-02-01', -11.0],
                ['2016-03-01', -10.9],
                ['2016-04-01', -4.9],
                ['2016-05-01', -7.2],
                ['2016-06-01', -10.2],
                ['2016-07-01', -9.2],
                ['2016-08-01', -9.9],
                ['2016-09-01', -7.1],
                ['2016-10-01', -6.7],
                ['2016-11-01', -3.0],
                ['2016-12-01', 1.4],
                ['2016-13-01', 4.7],
                ['2017-02-01', 0.5],
                ['2017-03-01', 2.7],
                ['2017-04-01', -0.5],
                ['2017-05-01', -0.5],
                ['2017-06-01', 1.9],
                ['2017-07-01', 2.2],
                ['2017-08-01', 4.4],
                ['2017-09-01', -2.2],
                ['2017-10-01', 1.0],
                ['2017-11-01', 2.0],
                ['2017-12-01', -1.6],
                ['2017-13-01', -5.8],
                ['2018-02-01', -1.9],
                ['2018-03-01', 2.3],
                ['2018-04-01', 1.7],
                ['2018-05-01', 4.1],
                ['2018-06-01', 1.4],
                ['2018-07-01', 1.5],
                ['2018-08-01', -1.8],
                ['2018-09-01', -3.3],
                ['2018-10-01', 2.4],
                ['2018-11-01', -2.9],
                ['2018-12-01', -3.3],
                ['2018-13-01', -5.0],
                ['2019-02-01', -2.9],
                ['2019-03-01', -4.0],
                ['2019-04-01', -5.8],
                ['2019-05-01', -3.5],
                ['2019-06-01', -2.1],
                ['2019-07-01', -3.0],
                ['2019-08-01', -1.4],
                ['2019-09-01', -0.8],
                ['2019-10-01', -3.2],
                ['2019-11-01', -3.6],
                ['2019-12-01', -0.5],
                ['2019-13-01', -2.6],
                ['2020-02-01', -2.2],
                ['2020-03-01', -2.6],
                ['2020-04-01', -8.1],
                ['2020-05-01', -14.1]
            ]
        },
        {
            name: 'Germany',
            fillOpacity: 0,
            visible: true,
            data: [
                ['2002-05-01', 0.0],
                ['2002-06-01', 0.3],
                ['2002-07-01', 0.8],
                ['2002-08-01', 1.2],
                ['2002-09-01', 1.8],
                ['2002-10-01', 1.5],
                ['2002-11-01', 0.7],
                ['2002-12-01', 3.3],
                ['2002-13-01', 3.3],
                ['2003-02-01', 1.6],
                ['2003-03-01', 3.5],
                ['2003-04-01', 5.6],
                ['2003-05-01', 5.6],
                ['2003-06-01', 4.0],
                ['2003-07-01', 0.3],
                ['2003-08-01', -0.5],
                ['2003-09-01', -1.1],
                ['2003-10-01', -1.1],
                ['2003-11-01', -4.3],
                ['2003-12-01', -2.0],
                ['2003-13-01', -3.2],
                ['2004-02-01', -3.7],
                ['2004-03-01', -3.5],
                ['2004-04-01', -5.5],
                ['2004-05-01', -8.6],
                ['2004-06-01', -8.2],
                ['2004-07-01', -1.6],
                ['2004-08-01', -6.4],
                ['2004-09-01', -7.4],
                ['2004-10-01', -7.1],
                ['2004-11-01', 0.6],
                ['2004-12-01', 2.8],
                ['2004-13-01', 5.6],
                ['2005-02-01', 5.8],
                ['2005-03-01', 6.1],
                ['2005-04-01', 5.3],
                ['2005-05-01', 3.1],
                ['2005-06-01', 3.5],
                ['2005-07-01', 5.0],
                ['2005-08-01', 4.6],
                ['2005-09-01', 5.0],
                ['2005-10-01', 3.0],
                ['2005-11-01', 2.5],
                ['2005-12-01', 4.6],
                ['2005-13-01', 3.4],
                ['2006-02-01', 4.0],
                ['2006-03-01', 4.9],
                ['2006-04-01', 5.5],
                ['2006-05-01', 5.3],
                ['2006-06-01', 4.7],
                ['2006-07-01', 5.8],
                ['2006-08-01', 5.1],
                ['2006-09-01', 4.6],
                ['2006-10-01', 5.1],
                ['2006-11-01', 5.0],
                ['2006-12-01', 8.8],
                ['2006-13-01', 8.9],
                ['2007-02-01', 8.6],
                ['2007-03-01', 10.3],
                ['2007-04-01', 10.5],
                ['2007-05-01', 11.2],
                ['2007-06-01', 11.5],
                ['2007-07-01', 15.5],
                ['2007-08-01', 15.5],
                ['2007-09-01', 17.0],
                ['2007-10-01', 18.8],
                ['2007-11-01', 11.3],
                ['2007-12-01', 7.4],
                ['2007-13-01', 8.9],
                ['2008-02-01', 8.5],
                ['2008-03-01', 5.2],
                ['2008-04-01', 5.0],
                ['2008-05-01', 13.3],
                ['2008-06-01', 12.5],
                ['2008-07-01', 21.2],
                ['2008-08-01', 24.0],
                ['2008-09-01', 20.8],
                ['2008-10-01', 11.3],
                ['2008-11-01', 32.7],
                ['2008-12-01', 33.9],
                ['2008-13-01', 18.5],
                ['2009-02-01', 24.2],
                ['2009-03-01', 17.6],
                ['2009-04-01', 8.1],
                ['2009-05-01', -9.0],
                ['2009-06-01', -14.9],
                ['2009-07-01', -13.9],
                ['2009-08-01', -21.1],
                ['2009-09-01', -23.9],
                ['2009-10-01', -13.1],
                ['2009-11-01', -9.4],
                ['2009-12-01', -2.5],
                ['2009-13-01', 6.1],
                ['2010-02-01', -0.8],
                ['2010-03-01', 1.3],
                ['2010-04-01', 20.8],
                ['2010-05-01', 28.7],
                ['2010-06-01', 42.0],
                ['2010-07-01', 25.6],
                ['2010-08-01', 28.4],
                ['2010-09-01', 27.6],
                ['2010-10-01', 20.4],
                ['2010-11-01', 17.3],
                ['2010-12-01', 13.6],
                ['2010-13-01', 9.4],
                ['2011-02-01', 15.2],
                ['2011-03-01', 16.4],
                ['2011-04-01', 2.2],
                ['2011-05-01', -0.1],
                ['2011-06-01', 4.2],
                ['2011-07-01', 2.1],
                ['2011-08-01', 1.0],
                ['2011-09-01', 0.3],
                ['2011-10-01', 3.3],
                ['2011-11-01', -0.4],
                ['2011-12-01', -0.7],
                ['2011-13-01', 3.3],
                ['2012-02-01', 4.5],
                ['2012-03-01', 7.6],
                ['2012-04-01', 8.8],
                ['2012-05-01', 9.8],
                ['2012-06-01', 0.2],
                ['2012-07-01', 7.9],
                ['2012-08-01', 5.5],
                ['2012-09-01', 3.9],
                ['2012-10-01', 4.5],
                ['2012-11-01', 6.3],
                ['2012-12-01', 12.7],
                ['2012-13-01', 17.5],
                ['2013-02-01', 14.1],
                ['2013-03-01', 16.6],
                ['2013-04-01', 14.2],
                ['2013-05-01', 11.6],
                ['2013-06-01', 12.4],
                ['2013-07-01', 7.4],
                ['2013-08-01', 6.4],
                ['2013-09-01', 6.2],
                ['2013-10-01', 10.5],
                ['2013-11-01', 10.3],
                ['2013-12-01', 10.3],
                ['2013-13-01', 5.4],
                ['2014-02-01', 2.8],
                ['2014-03-01', 3.6],
                ['2014-04-01', 3.0],
                ['2014-05-01', 0.1],
                ['2014-06-01', 4.3],
                ['2014-07-01', -1.1],
                ['2014-08-01', 1.8],
                ['2014-09-01', 3.1],
                ['2014-10-01', 2.0],
                ['2014-11-01', 0.8],
                ['2014-12-01', 1.2],
                ['2014-13-01', 4.5],
                ['2015-02-01', 8.6],
                ['2015-03-01', 8.1],
                ['2015-04-01', 9.5],
                ['2015-05-01', 5.0],
                ['2015-06-01', 4.6],
                ['2015-07-01', 2.4],
                ['2015-08-01', 0.7],
                ['2015-09-01', -1.5],
                ['2015-10-01', -1.1],
                ['2015-11-01', 0.4],
                ['2015-12-01', 2.6],
                ['2015-13-01', -9.9],
                ['2016-02-01', -3.0],
                ['2016-03-01', -2.2],
                ['2016-04-01', -9.7],
                ['2016-05-01', 0.3],
                ['2016-06-01', -2.6],
                ['2016-07-01', -7.4],
                ['2016-08-01', -8.9],
                ['2016-09-01', -8.4],
                ['2016-10-01', -3.1],
                ['2016-11-01', -0.3],
                ['2016-12-01', -6.3],
                ['2016-13-01', -4.4],
                ['2017-02-01', -5.6],
                ['2017-03-01', -8.6],
                ['2017-04-01', -5.9],
                ['2017-05-01', -17.1],
                ['2017-06-01', -14.4],
                ['2017-07-01', -11.9],
                ['2017-08-01', -9.6],
                ['2017-09-01', -13.5],
                ['2017-10-01', -6.5],
                ['2017-11-01', -3.9],
                ['2017-12-01', 0.4],
                ['2017-13-01', 10.3],
                ['2018-02-01', 8.6],
                ['2018-03-01', 10.3],
                ['2018-04-01', 3.1],
                ['2018-05-01', 16.9],
                ['2018-06-01', 7.1],
                ['2018-07-01', 10.9],
                ['2018-08-01', 8.0],
                ['2018-09-01', 8.3],
                ['2018-10-01', 9.6],
                ['2018-11-01', 2.5],
                ['2018-12-01', 1.5],
                ['2018-13-01', 1.3],
                ['2019-02-01', -2.2],
                ['2019-03-01', -5.6],
                ['2019-04-01', 1.1],
                ['2019-05-01', -14.7],
                ['2019-06-01', -3.0],
                ['2019-07-01', -3.5],
                ['2019-08-01', -7.9],
                ['2019-09-01', -7.8],
                ['2019-10-01', -8.9],
                ['2019-11-01', -11.3],
                ['2019-12-01', -6.3],
                ['2019-13-01', -6.5],
                ['2020-02-01', -9.5],
                ['2020-03-01', -7.5],
                ['2020-04-01', -11.9],
                ['2020-05-01', -26.3]
            ]
        },
        {
            name: 'Soviet Union',
            fillOpacity: 0,
            data: [
                ['2002-05-01', -8.0],
                ['2002-06-01', -1.1],
                ['2002-07-01', -2.7],
                ['2002-08-01', 4.7],
                ['2002-09-01', 17.1],
                ['2002-10-01', 5.3],
                ['2002-11-01', -2.4],
                ['2002-12-01', -0.3],
                ['2002-13-01', 2.3],
                ['2003-02-01', 7.4],
                ['2003-03-01', 10.8],
                ['2003-04-01', 11.6],
                ['2003-05-01', 11.5],
                ['2003-06-01', 5.7],
                ['2003-07-01', 8.9],
                ['2003-08-01', 4.8],
                ['2003-09-01', -1.0],
                ['2003-10-01', 2.1],
                ['2003-11-01', 13.3],
                ['2003-12-01', 15.7],
                ['2003-13-01', 12.7],
                ['2004-02-01', 12.9],
                ['2004-03-01', 12.2],
                ['2004-04-01', 10.1],
                ['2004-05-01', 14.8],
                ['2004-06-01', 8.0],
                ['2004-07-01', 6.2],
                ['2004-08-01', 8.8],
                ['2004-09-01', 19.4],
                ['2004-10-01', 16.0],
                ['2004-11-01', 8.2],
                ['2004-12-01', 9.9],
                ['2004-13-01', 13.5],
                ['2005-02-01', 10.3],
                ['2005-03-01', 11.5],
                ['2005-04-01', 12.9],
                ['2005-05-01', 5.6],
                ['2005-06-01', 14.6],
                ['2005-07-01', 8.3],
                ['2005-08-01', 8.7],
                ['2005-09-01', 4.0],
                ['2005-10-01', -0.7],
                ['2005-11-01', -1.1],
                ['2005-12-01', -5.5],
                ['2005-13-01', -9.2],
                ['2006-02-01', -10.5],
                ['2006-03-01', -2.7],
                ['2006-04-01', -8.1],
                ['2006-05-01', -6.6],
                ['2006-06-01', -7.6],
                ['2006-07-01', -2.4],
                ['2006-08-01', -4.3],
                ['2006-09-01', -4.7],
                ['2006-10-01', -4.3],
                ['2006-11-01', -2.4],
                ['2006-12-01', -0.5],
                ['2006-13-01', 1.5],
                ['2007-02-01', 0.8],
                ['2007-03-01', -5.3],
                ['2007-04-01', -1.3],
                ['2007-05-01', 3.7],
                ['2007-06-01', 3.9],
                ['2007-07-01', 3.2],
                ['2007-08-01', 3.1],
                ['2007-09-01', -1.9],
                ['2007-10-01', 10.8],
                ['2007-11-01', 11.5],
                ['2007-12-01', 9.9],
                ['2007-13-01', 16.7],
                ['2008-02-01', 23.4],
                ['2008-03-01', 17.1],
                ['2008-04-01', 21.4],
                ['2008-05-01', 18.2],
                ['2008-06-01', 9.6],
                ['2008-07-01', 17.0],
                ['2008-08-01', 19.7],
                ['2008-09-01', 29.8],
                ['2008-10-01', 15.3],
                ['2008-11-01', 7.6],
                ['2008-12-01', 14.6],
                ['2008-13-01', 14.8],
                ['2009-02-01', 5.4],
                ['2009-03-01', -1.1],
                ['2009-04-01', -3.7],
                ['2009-05-01', -9.3],
                ['2009-06-01', -9.1],
                ['2009-07-01', -20.0],
                ['2009-08-01', -21.6],
                ['2009-09-01', -19.7],
                ['2009-10-01', -16.4],
                ['2009-11-01', -12.9],
                ['2009-12-01', -15.8],
                ['2009-13-01', -12.3],
                ['2010-02-01', -9.2],
                ['2010-03-01', 4.9],
                ['2010-04-01', 11.4],
                ['2010-05-01', 21.4],
                ['2010-06-01', 24.8],
                ['2010-07-01', 42.2],
                ['2010-08-01', 45.7],
                ['2010-09-01', 42.0],
                ['2010-10-01', 33.6],
                ['2010-11-01', 34.1],
                ['2010-12-01', 38.8],
                ['2010-13-01', 23.8],
                ['2011-02-01', 30.5],
                ['2011-03-01', 9.7],
                ['2011-04-01', 14.2],
                ['2011-05-01', 9.2],
                ['2011-06-01', 16.2],
                ['2011-07-01', 5.0],
                ['2011-08-01', 7.9],
                ['2011-09-01', 11.4],
                ['2011-10-01', 10.8],
                ['2011-11-01', 11.9],
                ['2011-12-01', 9.4],
                ['2011-13-01', 13.5],
                ['2012-02-01', 7.9],
                ['2012-03-01', 10.0],
                ['2012-04-01', 2.3],
                ['2012-05-01', 7.8],
                ['2012-06-01', 1.8],
                ['2012-07-01', 9.7],
                ['2012-08-01', 4.4],
                ['2012-09-01', 5.2],
                ['2012-10-01', -3.7],
                ['2012-11-01', 0.7],
                ['2012-12-01', -4.9],
                ['2012-13-01', 0.7],
                ['2013-02-01', 4.3],
                ['2013-03-01', 0.4],
                ['2013-04-01', -3.9],
                ['2013-05-01', -8.6],
                ['2013-06-01', -7.1],
                ['2013-07-01', -6.4],
                ['2013-08-01', -10.0],
                ['2013-09-01', -11.8],
                ['2013-10-01', -10.9],
                ['2013-11-01', -13.5],
                ['2013-12-01', -10.3],
                ['2013-13-01', -9.6],
                ['2014-02-01', -8.0],
                ['2014-03-01', -11.8],
                ['2014-04-01', -6.9],
                ['2014-05-01', -0.7],
                ['2014-06-01', -0.3],
                ['2014-07-01', 0.5],
                ['2014-08-01', 3.3],
                ['2014-09-01', 1.0],
                ['2014-10-01', 0.7],
                ['2014-11-01', 1.1],
                ['2014-12-01', 2.4],
                ['2014-13-01', 0.2],
                ['2015-02-01', -8.3],
                ['2015-03-01', -3.8],
                ['2015-04-01', -7.8],
                ['2015-05-01', -14.7],
                ['2015-06-01', -14.5],
                ['2015-07-01', -14.9],
                ['2015-08-01', -16.2],
                ['2015-09-01', -15.2],
                ['2015-10-01', -14.6],
                ['2015-11-01', -11.3],
                ['2015-12-01', -12.9],
                ['2015-13-01', -14.6],
                ['2016-02-01', -9.1],
                ['2016-03-01', -7.9],
                ['2016-04-01', -6.7],
                ['2016-05-01', -4.8],
                ['2016-06-01', -6.1],
                ['2016-07-01', -6.6],
                ['2016-08-01', -5.7],
                ['2016-09-01', -4.3],
                ['2016-10-01', -6.4],
                ['2016-11-01', -5.7],
                ['2016-12-01', 1.5],
                ['2016-13-01', 1.3],
                ['2017-02-01', 2.2],
                ['2017-03-01', -2.7],
                ['2017-04-01', -1.7],
                ['2017-05-01', 0.2],
                ['2017-06-01', -7.5],
                ['2017-07-01', -4.2],
                ['2017-08-01', -5.2],
                ['2017-09-01', -9.9],
                ['2017-10-01', -4.9],
                ['2017-11-01', -8.3],
                ['2017-12-01', -11.4],
                ['2017-13-01', -5.0],
                ['2018-02-01', -2.8],
                ['2018-03-01', 4.5],
                ['2018-04-01', 4.4],
                ['2018-05-01', 0.5],
                ['2018-06-01', 3.2],
                ['2018-07-01', 6.3],
                ['2018-08-01', 10.7],
                ['2018-09-01', -2.9],
                ['2018-10-01', 13.5],
                ['2018-11-01', 9.3],
                ['2018-12-01', 7.4],
                ['2018-13-01', -0.7],
                ['2019-02-01', -0.7],
                ['2019-03-01', 0.3],
                ['2019-04-01', -0.5],
                ['2019-05-01', 0.0],
                ['2019-06-01', 3.4],
                ['2019-07-01', 1.9],
                ['2019-08-01', -0.8],
                ['2019-09-01', 0.3],
                ['2019-10-01', -3.2],
                ['2019-11-01', -1.3],
                ['2019-12-01', 2.8],
                ['2019-13-01', -3.1],
                ['2020-02-01', -1.5],
                ['2020-03-01', -1.9],
                ['2020-04-01', -7.9],
                ['2020-05-01', -9.7]
            ]
        },
        {
            name: 'Unified Team',
            fillOpacity: 0,
            data: [
                ['2002-05-01', 5.0],
                ['2002-06-01', 6.8],
                ['2002-07-01', 9.0],
                ['2002-08-01', 10.8],
                ['2002-09-01', 11.1],
                ['2002-10-01', 8.3],
                ['2002-11-01', 8.0],
                ['2002-12-01', 10.3],
                ['2002-13-01', 11.4],
                ['2003-02-01', 14.2],
                ['2003-03-01', 15.2],
                ['2003-04-01', 18.2],
                ['2003-05-01', 17.4],
                ['2003-06-01', 19.3],
                ['2003-07-01', 25.8],
                ['2003-08-01', 23.9],
                ['2003-09-01', 19.3],
                ['2003-10-01', 15.4],
                ['2003-11-01', 21.4],
                ['2003-12-01', 19.2],
                ['2003-13-01', 18.5],
                ['2004-02-01', 19.2],
                ['2004-03-01', 20.8],
                ['2004-04-01', 19.8],
                ['2004-05-01', 13.2],
                ['2004-06-01', 6.7],
                ['2004-07-01', 2.7],
                ['2004-08-01', -1.1],
                ['2004-09-01', -1.0],
                ['2004-10-01', 7.9],
                ['2004-11-01', 3.8],
                ['2004-12-01', 9.7],
                ['2004-13-01', 13.6],
                ['2005-02-01', 10.6],
                ['2005-03-01', 6.0],
                ['2005-04-01', 8.0],
                ['2005-05-01', 8.1],
                ['2005-06-01', 18.8],
                ['2005-07-01', 10.6],
                ['2005-08-01', 18.6],
                ['2005-09-01', 19.1],
                ['2005-10-01', 9.1],
                ['2005-11-01', 6.5],
                ['2005-12-01', -5.0],
                ['2005-13-01', -9.4],
                ['2006-02-01', -11.6],
                ['2006-03-01', -4.6],
                ['2006-04-01', -10.5],
                ['2006-05-01', 0.5],
                ['2006-06-01', -4.6],
                ['2006-07-01', 1.7],
                ['2006-08-01', -2.2],
                ['2006-09-01', 0.3],
                ['2006-10-01', 6.0],
                ['2006-11-01', 7.1],
                ['2006-12-01', 11.0],
                ['2006-13-01', 12.7],
                ['2007-02-01', 14.2],
                ['2007-03-01', 8.0],
                ['2007-04-01', 12.9],
                ['2007-05-01', 11.1],
                ['2007-06-01', 10.1],
                ['2007-07-01', 6.3],
                ['2007-08-01', 6.3],
                ['2007-09-01', 6.7],
                ['2007-10-01', 7.3],
                ['2007-11-01', 7.8],
                ['2007-12-01', 9.6],
                ['2007-13-01', 12.6],
                ['2008-02-01', 11.5],
                ['2008-03-01', 7.9],
                ['2008-04-01', 8.0],
                ['2008-05-01', 4.8],
                ['2008-06-01', 7.0],
                ['2008-07-01', 24.8],
                ['2008-08-01', 21.3],
                ['2008-09-01', 17.4],
                ['2008-10-01', 12.9],
                ['2008-11-01', 9.9],
                ['2008-12-01', 9.7],
                ['2008-13-01', 2.2],
                ['2009-02-01', -0.2],
                ['2009-03-01', -5.7],
                ['2009-04-01', -13.7],
                ['2009-05-01', -17.5],
                ['2009-06-01', -22.1],
                ['2009-07-01', -22.4],
                ['2009-08-01', -22.1],
                ['2009-09-01', -22.0],
                ['2009-10-01', -21.2],
                ['2009-11-01', -15.5],
                ['2009-12-01', -8.0],
                ['2009-13-01', 0.4],
                ['2010-02-01', 1.5],
                ['2010-03-01', 17.8],
                ['2010-04-01', 27.9],
                ['2010-05-01', 33.4],
                ['2010-06-01', 37.2],
                ['2010-07-01', 38.1],
                ['2010-08-01', 33.4],
                ['2010-09-01', 24.9],
                ['2010-10-01', 29.5],
                ['2010-11-01', 23.6],
                ['2010-12-01', 4.0],
                ['2010-13-01', 1.0],
                ['2011-02-01', -0.8],
                ['2011-03-01', -6.6],
                ['2011-04-01', -7.2],
                ['2011-05-01', -3.2],
                ['2011-06-01', 2.8],
                ['2011-07-01', 0.5],
                ['2011-08-01', 7.8],
                ['2011-09-01', 13.3],
                ['2011-10-01', 6.8],
                ['2011-11-01', 7.1],
                ['2011-12-01', 14.8],
                ['2011-13-01', 9.3],
                ['2012-02-01', 12.8],
                ['2012-03-01', 20.4],
                ['2012-04-01', 14.6],
                ['2012-05-01', 13.1],
                ['2012-06-01', 5.2],
                ['2012-07-01', 4.9],
                ['2012-08-01', -4.1],
                ['2012-09-01', -7.5],
                ['2012-10-01', -4.6],
                ['2012-11-01', -6.2],
                ['2012-12-01', 1.8],
                ['2012-13-01', 4.5],
                ['2013-02-01', 4.0],
                ['2013-03-01', -0.3],
                ['2013-04-01', 6.1],
                ['2013-05-01', -5.7],
                ['2013-06-01', -0.8],
                ['2013-07-01', 1.9],
                ['2013-08-01', 2.7],
                ['2013-09-01', 2.9],
                ['2013-10-01', 1.8],
                ['2013-11-01', 0.5],
                ['2013-12-01', 2.3],
                ['2013-13-01', -0.1],
                ['2014-02-01', -3.0],
                ['2014-03-01', -3.8],
                ['2014-04-01', -2.4],
                ['2014-05-01', 5.2],
                ['2014-06-01', 5.0],
                ['2014-07-01', 1.8],
                ['2014-08-01', -0.7],
                ['2014-09-01', -4.6],
                ['2014-10-01', 4.4],
                ['2014-11-01', 7.0],
                ['2014-12-01', -2.2],
                ['2014-13-01', 4.4],
                ['2015-02-01', 1.5],
                ['2015-03-01', -0.8],
                ['2015-04-01', -3.1],
                ['2015-05-01', -9.8],
                ['2015-06-01', -9.8],
                ['2015-07-01', -13.0],
                ['2015-08-01', -9.0],
                ['2015-09-01', -10.3],
                ['2015-10-01', -8.6],
                ['2015-11-01', -10.8],
                ['2015-12-01', -2.3],
                ['2015-13-01', -11.7],
                ['2016-02-01', -7.3],
                ['2016-03-01', -6.7],
                ['2016-04-01', 6.5],
                ['2016-05-01', -1.7],
                ['2016-06-01', -9.0],
                ['2016-07-01', -7.1],
                ['2016-08-01', -13.6],
                ['2016-09-01', -9.9],
                ['2016-10-01', -9.3],
                ['2016-11-01', -3.6],
                ['2016-12-01', -3.7],
                ['2016-13-01', 9.3],
                ['2017-02-01', 3.1],
                ['2017-03-01', 10.5],
                ['2017-04-01', -8.0],
                ['2017-05-01', -5.7],
                ['2017-06-01', 0.9],
                ['2017-07-01', -2.4],
                ['2017-08-01', 2.8],
                ['2017-09-01', -5.9],
                ['2017-10-01', 6.4],
                ['2017-11-01', 6.8],
                ['2017-12-01', 5.3],
                ['2017-13-01', -6.6],
                ['2018-02-01', -5.4],
                ['2018-03-01', -4.0],
                ['2018-04-01', 2.7],
                ['2018-05-01', 7.2],
                ['2018-06-01', 3.6],
                ['2018-07-01', 2.3],
                ['2018-08-01', 0.8],
                ['2018-09-01', 4.3],
                ['2018-10-01', -3.8],
                ['2018-11-01', -6.8],
                ['2018-12-01', -6.5],
                ['2018-13-01', 0.6],
                ['2019-02-01', 3.1],
                ['2019-03-01', -5.9],
                ['2019-04-01', -7.2],
                ['2019-05-01', -5.2],
                ['2019-06-01', -4.3],
                ['2019-07-01', -5.3],
                ['2019-08-01', -2.5],
                ['2019-09-01', -2.8],
                ['2019-10-01', -6.2],
                ['2019-11-01', -8.8],
                ['2019-12-01', -5.9],
                ['2019-13-01', -9.7],
                ['2020-02-01', -8.0],
                ['2020-03-01', -7.6],
                ['2020-04-01', -12.3],
                ['2020-05-01', -24.3]
            ]
        },
        {
            name: 'Hungary',
            fillOpacity: 0,
            data: [
                ['2002-05-01', -0.2],
                ['2002-06-01', -6.1],
                ['2002-07-01', -6.1],
                ['2002-08-01', -5.0],
                ['2002-09-01', -8.6],
                ['2002-10-01', -10.4],
                ['2002-11-01', -7.5],
                ['2002-12-01', -9.0],
                ['2002-13-01', -9.0],
                ['2003-02-01', -10.2],
                ['2003-03-01', -3.0],
                ['2003-04-01', -1.6],
                ['2003-05-01', -5.7],
                ['2003-06-01', -0.8],
                ['2003-07-01', 1.1],
                ['2003-08-01', 6.8],
                ['2003-09-01', 7.6],
                ['2003-10-01', 3.7],
                ['2003-11-01', 3.4],
                ['2003-12-01', 3.8],
                ['2003-13-01', 1.7],
                ['2004-02-01', 8.9],
                ['2004-03-01', 0.0],
                ['2004-04-01', 0.4],
                ['2004-05-01', 5.9],
                ['2004-06-01', 7.6],
                ['2004-07-01', 7.4],
                ['2004-08-01', 7.5],
                ['2004-09-01', 7.4],
                ['2004-10-01', 5.2],
                ['2004-11-01', 4.4],
                ['2004-12-01', 5.3],
                ['2004-13-01', 6.0],
                ['2005-02-01', -0.6],
                ['2005-03-01', 2.1],
                ['2005-04-01', 0.9],
                ['2005-05-01', 2.3],
                ['2005-06-01', -1.3],
                ['2005-07-01', -2.5],
                ['2005-08-01', -2.6],
                ['2005-09-01', -3.7],
                ['2005-10-01', -0.8],
                ['2005-11-01', 0.0],
                ['2005-12-01', -1.1],
                ['2005-13-01', 0.6],
                ['2006-02-01', 0.6],
                ['2006-03-01', 2.5],
                ['2006-04-01', 1.9],
                ['2006-05-01', -1.1],
                ['2006-06-01', 4.1],
                ['2006-07-01', 4.5],
                ['2006-08-01', 2.3],
                ['2006-09-01', 4.6],
                ['2006-10-01', 6.1],
                ['2006-11-01', 9.1],
                ['2006-12-01', 8.4],
                ['2006-13-01', 7.4],
                ['2007-02-01', 6.6],
                ['2007-03-01', 9.8],
                ['2007-04-01', 9.8],
                ['2007-05-01', 1.4],
                ['2007-06-01', 0.0],
                ['2007-07-01', -0.5],
                ['2007-08-01', -0.1],
                ['2007-09-01', 0.2],
                ['2007-10-01', 1.8],
                ['2007-11-01', 2.6],
                ['2007-12-01', 5.7],
                ['2007-13-01', 3.4],
                ['2008-02-01', 3.6],
                ['2008-03-01', 3.8],
                ['2008-04-01', 5.1],
                ['2008-05-01', 18.8],
                ['2008-06-01', 22.5],
                ['2008-07-01', 27.1],
                ['2008-08-01', 27.2],
                ['2008-09-01', 25.0],
                ['2008-10-01', 10.9],
                ['2008-11-01', 4.6],
                ['2008-12-01', 1.9],
                ['2008-13-01', 23.1],
                ['2009-02-01', -0.5],
                ['2009-03-01', -5.1],
                ['2009-04-01', -9.1],
                ['2009-05-01', -11.1],
                ['2009-06-01', -20.2],
                ['2009-07-01', -22.7],
                ['2009-08-01', -21.2],
                ['2009-09-01', -16.8],
                ['2009-10-01', -12.3],
                ['2009-11-01', -7.2],
                ['2009-12-01', 0.6],
                ['2009-13-01', -7.2],
                ['2010-02-01', 3.1],
                ['2010-03-01', 8.5],
                ['2010-04-01', 15.0],
                ['2010-05-01', 20.6],
                ['2010-06-01', 22.5],
                ['2010-07-01', 23.4],
                ['2010-08-01', 18.4],
                ['2010-09-01', 14.5],
                ['2010-10-01', 21.4],
                ['2010-11-01', 24.7],
                ['2010-12-01', 20.4],
                ['2010-13-01', 16.7],
                ['2011-02-01', 20.6],
                ['2011-03-01', 19.8],
                ['2011-04-01', 20.0],
                ['2011-05-01', 18.2],
                ['2011-06-01', 22.7],
                ['2011-07-01', 19.3],
                ['2011-08-01', 22.3],
                ['2011-09-01', 23.8],
                ['2011-10-01', 17.4],
                ['2011-11-01', 14.0],
                ['2011-12-01', 10.5],
                ['2011-13-01', 9.2],
                ['2012-02-01', 13.3],
                ['2012-03-01', 12.1],
                ['2012-04-01', 9.3],
                ['2012-05-01', 5.9],
                ['2012-06-01', 0.8],
                ['2012-07-01', 3.8],
                ['2012-08-01', -1.0],
                ['2012-09-01', -5.2],
                ['2012-10-01', -6.4],
                ['2012-11-01', -6.9],
                ['2012-12-01', -2.3],
                ['2012-13-01', -1.0],
                ['2013-02-01', -8.5],
                ['2013-03-01', -7.8],
                ['2013-04-01', -5.8],
                ['2013-05-01', -7.7],
                ['2013-06-01', -3.5],
                ['2013-07-01', -0.4],
                ['2013-08-01', -0.2],
                ['2013-09-01', 0.4],
                ['2013-10-01', 3.5],
                ['2013-11-01', 3.1],
                ['2013-12-01', 0.8],
                ['2013-13-01', 1.4],
                ['2014-02-01', 2.8],
                ['2014-03-01', 1.2],
                ['2014-04-01', 0.5],
                ['2014-05-01', 3.7],
                ['2014-06-01', 2.1],
                ['2014-07-01', -2.3],
                ['2014-08-01', -2.1],
                ['2014-09-01', 0.1],
                ['2014-10-01', 0.9],
                ['2014-11-01', 4.3],
                ['2014-12-01', -1.3],
                ['2014-13-01', -0.7],
                ['2015-02-01', -1.7],
                ['2015-03-01', 0.2],
                ['2015-04-01', -1.0],
                ['2015-05-01', -4.8],
                ['2015-06-01', -5.5],
                ['2015-07-01', -5.7],
                ['2015-08-01', -4.4],
                ['2015-09-01', -5.4],
                ['2015-10-01', -9.1],
                ['2015-11-01', -13.0],
                ['2015-12-01', -11.3],
                ['2015-13-01', -8.4],
                ['2016-02-01', -13.8],
                ['2016-03-01', -11.7],
                ['2016-04-01', -11.2],
                ['2016-05-01', -12.4],
                ['2016-06-01', -9.5],
                ['2016-07-01', -4.6],
                ['2016-08-01', -4.7],
                ['2016-09-01', -4.1],
                ['2016-10-01', -0.4],
                ['2016-11-01', 3.7],
                ['2016-12-01', 8.4],
                ['2016-13-01', 2.8],
                ['2017-02-01', 8.6],
                ['2017-03-01', 8.0],
                ['2017-04-01', 9.3],
                ['2017-05-01', 12.7],
                ['2017-06-01', 8.3],
                ['2017-07-01', 6.8],
                ['2017-08-01', 5.8],
                ['2017-09-01', 3.0],
                ['2017-10-01', 3.0],
                ['2017-11-01', 0.4],
                ['2017-12-01', 0.4],
                ['2017-13-01', 2.7],
                ['2018-02-01', 1.2],
                ['2018-03-01', 3.5],
                ['2018-04-01', 3.4],
                ['2018-05-01', 2.2],
                ['2018-06-01', -1.5],
                ['2018-07-01', -1.2],
                ['2018-08-01', -1.0],
                ['2018-09-01', -2.7],
                ['2018-10-01', -2.6],
                ['2018-11-01', -2.4],
                ['2018-12-01', -0.9],
                ['2018-13-01', -1.2],
                ['2019-02-01', -5.4],
                ['2019-03-01', -5.1],
                ['2019-04-01', -7.8],
                ['2019-05-01', -6.9],
                ['2019-06-01', -1.2],
                ['2019-07-01', -1.4],
                ['2019-08-01', 2.3],
                ['2019-09-01', 1.8],
                ['2019-10-01', -0.8],
                ['2019-11-01', 1.4],
                ['2019-12-01', -0.9],
                ['2019-13-01', 4.2],
                ['2020-02-01', 1.1],
                ['2020-03-01', 4.7],
                ['2020-04-01', -2.5],
                ['2020-05-01', -6.9]
            ]
        }
    ]
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
        text: ''
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

const charts = [rb, arc, cr, str, sk, rc];

function makeChart() {
    // let chartNum;
    // const flip = Math.round(randomNumber(0, 2));
    // if (flip < 2) {
    //     chartNum = 0;
    // } else {
    //     chartNum = Math.round(randomNumber(1, 6));
    // }
    const chartNum = Math.round(randomNumber(0, charts.length - 1));
    const chart = charts[chartNum];
    // (chartNum);
    Highcharts.chart('container', chart);
}


makeChart();
