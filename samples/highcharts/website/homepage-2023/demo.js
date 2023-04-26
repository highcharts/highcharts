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

const colors = ['#8087E8', '#A3EDBA', '#F19E53', '#6699A1',
    '#E1D369', '#87B4E7', '#DA6D85', '#BBBAC5'];


// data for Sankey (SK)
const dataSK =
    [
        ['Starling Bank', 'Digital Banking', 195.67],
        ['Alkami Technology', 'Digital Banking', 185.20],
        ['Checkout.com', 'Payments Processing & Networks', 380.00],
        ['Unqork', 'Financial Services', 365.20],
        ['LendInvest', 'Real Estate', 1300.00],
        ['AvidXchange', 'Accounting & Finance', 1100.00],
        ['N26', 'Digital Banking', 782.80],
        ['BlueVine', 'Business Lending & Finance', 767.50],
        ['Marqeta', 'Payments Processing & Networks', 528.00],
        ['Root Insurance', 'Insurance', 527.50],
        ['Cambridge Mobile Telematics', 'Insurance', 502.50],
        ['Petal', 'POS & Consumer Lending', 435.00],
        ['Monzo', 'Digital Banking', 419.32],
        ['Airwallex', 'Payments Processing & Networks', 402.70],
        ['Hippo', 'Insurance', 359.00],
        ['Paidy', 'POS & Consumer Lending', 277.90]
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
    return (Math.pow((pos - 1), 5) + 1);
};

function changeOpacity(elements, opacity, transition) {
    [].forEach.call(
        elements,
        function (element) {
            element.style.opacity = opacity;
            element.style.transition = 'all ' + transition + 's';
        }
    );
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
// arc
const arc = {

    chart: {
        type: 'arcdiagram',
        backgroundColor: 'transparent',
        height: 400,
        animation: {
            duration: 2000,
            easing: ' easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                if (chart.chartWidth < 500) {
                    chart.series[0].update({
                        data: [
                            ['Paris', 'Brest', 1],
                            ['Paris', 'Nantes', 1],
                            ['Paris', 'Bayonne', 1],
                            ['Paris', 'Bordeaux', 1],
                            ['Paris', 'Toulouse', 1]
                        ]
                    });
                }
                setTimeout(function () {
                    const links = document.querySelectorAll('.highcharts-link');
                    [].forEach.call(
                        links,
                        function (element) {
                            element.style.opacity = 1;
                            element.style.transition = 'all 2s';
                        }
                    );
                }, 1900);

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
        description: 'Arc diagram chart with circles of different sizes along the X axis, and connections drawn as arcs between them. From the chart we can see that Paris is the city with the most connections to other cities.',
        point: {
            valueDescriptionFormat: 'Connection from {point.from} to {point.to}.'
        }
    },

    plotOptions: {
        series: {
            animation: {
                duration: 2000,
                easing: 'easeOutQuint'
            },
            equalNodes: false,
            marker: {
                lineWidth: 1
            },
            opacity: 0.8,
            linkWeight: 1,
            centeredLinks: true,
            dataLabels: {
                enabled: false
            }
        }
    },

    series: [
        // 1 desktop
        {
            keys: ['from', 'to', 'weight'],
            visible: true,
            name: 'Train connections',
            data: [
                ['Hamburg', 'Stuttgart', 1],
                ['Hamburg', 'Frankfurt', 1],
                ['Hamburg', 'München', 1],
                ['Paris', 'Brest', 1],
                ['Paris', 'Nantes', 1],
                ['Paris', 'Bayonne', 1],
                ['Paris', 'Bordeaux', 1],
                ['Paris', 'Toulouse', 1]
            // ['Paris', 'Montpellier', 1]
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
                        margin: [20, 0, 10, 80],
                        inverted: true
                    }
                }
            },
            {
                condition: {
                    minWidth: 501
                },
                chartOptions: {
                    chart: {
                        margin: [80, 60, 0, 60],
                        inverted: false
                    }
                }
            }]
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
                const seriesGroup = document.querySelector('.highcharts-series-group');
                const gridLines = document.querySelectorAll('.highcharts-grid-line');

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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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

    series: [{
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
    }]

};

// sankey
const sk = {
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
        pointFormat: '<b>{point.fromNode.name}</b> ({point.toNode.name})<br>${point.weight} Total Funding Millions USD</span>',
        nodeFormat: '<p style="margin:6px 0;padding: 0;font-size: 14px;line-height:24px"><span style="font-weight: bold;color:{point.color}">{point.name}:</span> ${point.sum} million USD</p>'
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
                const gridLines = document.querySelectorAll('.highcharts-grid-line');
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

                [].forEach.call(
                    gridLines,
                    function (element) {
                        element.style.opacity = 0;
                    }
                );
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

                    [].forEach.call(
                        gridLines,
                        function (element, index) {
                            if (index !== 7) {
                                element.style.transition = 'all 2s';
                                element.style.opacity = 1;
                            }
                        }
                    );
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
        categories: ['Apples', 'Pears', 'Bananas', 'Oranges', 'Lemons',
            'Limes', 'Grapes', 'Kiwis', 'Mangoes', 'Strawberries']
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
    series: [{
        data: [-71.5, -106.4, 129.2, -144.0, 176.0,
            -135.6, 148.5, -216.4, 194.1,
            -95.6],
        type: 'column'
    }, {
        data: [-71.5, -106.4, 129.2, -144.0,
            176.0, -135.6, 148.5, 216.4, 194.1,
            95.6].reverse(),
        type: 'column'
    }, {
        data: [71.5, 106.4, -129.2, 144.0, 176.0,
            -135.6, 148.5, 216.4, 194.1,
            95.6]
    }]
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
    colors: ['#8087E8', '#A3EDBA', '#F19E53', '#30426B',
        '#6699A1', '#BBBAC5', '#87B4E7', '#DA6D85', '#BBBAC5'],

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
        // 1 export all
        {
            name: 'Export All',
            visible: true,
            fillOpacity: 0,
            data: [
                [Date.UTC(2002, 4, 1), 0.50],
                [Date.UTC(2002, 5, 1), 1.90],
                [Date.UTC(2002, 6, 1), 2.80],
                [Date.UTC(2002, 7, 1), 7.50],
                [Date.UTC(2002, 8, 1), 10.00],
                [Date.UTC(2002, 9, 1), 5.50],
                [Date.UTC(2002, 10, 1), 2.30],
                [Date.UTC(2002, 11, 1), 4.50],
                [Date.UTC(2002, 12, 1), 4.90],
                [Date.UTC(2003, 1, 1), 9.20],
                [Date.UTC(2003, 2, 1), 9.00],
                [Date.UTC(2003, 3, 1), 11.20],
                [Date.UTC(2003, 4, 1), 10.90],
                [Date.UTC(2003, 5, 1), 10.50],
                [Date.UTC(2003, 6, 1), 13.40],
                [Date.UTC(2003, 7, 1), 11.90],
                [Date.UTC(2003, 8, 1), 10.20],
                [Date.UTC(2003, 9, 1), 9.20],
                [Date.UTC(2003, 10, 1), 15.10],
                [Date.UTC(2003, 11, 1), 14.80],
                [Date.UTC(2003, 12, 1), 14.70],
                [Date.UTC(2004, 1, 1), 15.70],
                [Date.UTC(2004, 2, 1), 15.10],
                [Date.UTC(2004, 3, 1), 13.70],
                [Date.UTC(2004, 4, 1), 13.70],
                [Date.UTC(2004, 5, 1), 8.30],
                [Date.UTC(2004, 6, 1), 5.80],
                [Date.UTC(2004, 7, 1), 4.90],
                [Date.UTC(2004, 8, 1), 9.30],
                [Date.UTC(2004, 9, 1), 10.30],
                [Date.UTC(2004, 10, 1), 6.20],
                [Date.UTC(2004, 11, 1), 9.80],
                [Date.UTC(2004, 12, 1), 13.20],
                [Date.UTC(2005, 1, 1), 10.30],
                [Date.UTC(2005, 2, 1), 9.10],
                [Date.UTC(2005, 3, 1), 10.60],
                [Date.UTC(2005, 4, 1), 7.80],
                [Date.UTC(2005, 5, 1), 15.50],
                [Date.UTC(2005, 6, 1), 10.00],
                [Date.UTC(2005, 7, 1), 13.70],
                [Date.UTC(2005, 8, 1), 11.00],
                [Date.UTC(2005, 9, 1), 7.20],
                [Date.UTC(2005, 10, 1), 6.30],
                [Date.UTC(2005, 11, 1), -1.60],
                [Date.UTC(2005, 12, 1), -4.30],
                [Date.UTC(2006, 1, 1), -6.00],
                [Date.UTC(2006, 2, 1), 0.20],
                [Date.UTC(2006, 3, 1), -4.00],
                [Date.UTC(2006, 4, 1), -1.30],
                [Date.UTC(2006, 5, 1), -2.50],
                [Date.UTC(2006, 6, 1), 2.30],
                [Date.UTC(2006, 7, 1), -0.50],
                [Date.UTC(2006, 8, 1), -0.50],
                [Date.UTC(2006, 9, 1), 2.10],
                [Date.UTC(2006, 10, 1), 3.00],
                [Date.UTC(2006, 11, 1), 6.40],
                [Date.UTC(2006, 12, 1), 7.00],
                [Date.UTC(2007, 1, 1), 6.90],
                [Date.UTC(2007, 2, 1), 3.20],
                [Date.UTC(2007, 3, 1), 7.20],
                [Date.UTC(2007, 4, 1), 9.30],
                [Date.UTC(2007, 5, 1), 7.50],
                [Date.UTC(2007, 6, 1), 5.70],
                [Date.UTC(2007, 7, 1), 5.70],
                [Date.UTC(2007, 8, 1), 3.90],
                [Date.UTC(2007, 9, 1), 8.60],
                [Date.UTC(2007, 10, 1), 10.00],
                [Date.UTC(2007, 11, 1), 11.50],
                [Date.UTC(2007, 12, 1), 13.40],
                [Date.UTC(2008, 1, 1), 14.30],
                [Date.UTC(2008, 2, 1), 9.80],
                [Date.UTC(2008, 3, 1), 11.60],
                [Date.UTC(2008, 4, 1), 6.30],
                [Date.UTC(2008, 5, 1), 6.00],
                [Date.UTC(2008, 6, 1), 16.40],
                [Date.UTC(2008, 7, 1), 17.60],
                [Date.UTC(2008, 8, 1), 20.60],
                [Date.UTC(2008, 9, 1), 11.20],
                [Date.UTC(2008, 10, 1), 5.50],
                [Date.UTC(2008, 11, 1), 5.20],
                [Date.UTC(2008, 12, 1), 5.70],
                [Date.UTC(2009, 1, 1), 1.90],
                [Date.UTC(2009, 2, 1), -3.50],
                [Date.UTC(2009, 3, 1), -9.40],
                [Date.UTC(2009, 4, 1), -11.00],
                [Date.UTC(2009, 5, 1), -15.50],
                [Date.UTC(2009, 6, 1), -19.40],
                [Date.UTC(2009, 7, 1), -21.80],
                [Date.UTC(2009, 8, 1), -19.50],
                [Date.UTC(2009, 9, 1), -17.80],
                [Date.UTC(2009, 10, 1), -14.40],
                [Date.UTC(2009, 11, 1), -11.30],
                [Date.UTC(2009, 12, 1), -5.20],
                [Date.UTC(2010, 1, 1), -4.40],
                [Date.UTC(2010, 2, 1), 5.10],
                [Date.UTC(2010, 3, 1), 11.30],
                [Date.UTC(2010, 4, 1), 19.20],
                [Date.UTC(2010, 5, 1), 22.00],
                [Date.UTC(2010, 6, 1), 27.60],
                [Date.UTC(2010, 7, 1), 30.50],
                [Date.UTC(2010, 8, 1), 21.20],
                [Date.UTC(2010, 9, 1), 21.90],
                [Date.UTC(2010, 10, 1), 21.20],
                [Date.UTC(2010, 11, 1), 15.00],
                [Date.UTC(2010, 12, 1), 8.30],
                [Date.UTC(2011, 1, 1), 13.20],
                [Date.UTC(2011, 2, 1), 4.10],
                [Date.UTC(2011, 3, 1), 9.60],
                [Date.UTC(2011, 4, 1), 8.10],
                [Date.UTC(2011, 5, 1), 12.20],
                [Date.UTC(2011, 6, 1), 5.80],
                [Date.UTC(2011, 7, 1), 10.20],
                [Date.UTC(2011, 8, 1), 18.10],
                [Date.UTC(2011, 9, 1), 11.90],
                [Date.UTC(2011, 10, 1), 11.90],
                [Date.UTC(2011, 11, 1), 13.00],
                [Date.UTC(2011, 12, 1), 13.10],
                [Date.UTC(2012, 1, 1), 9.50],
                [Date.UTC(2012, 2, 1), 15.60],
                [Date.UTC(2012, 3, 1), 7.10],
                [Date.UTC(2012, 4, 1), 6.20],
                [Date.UTC(2012, 5, 1), 8.40],
                [Date.UTC(2012, 6, 1), 8.70],
                [Date.UTC(2012, 7, 1), 3.80],
                [Date.UTC(2012, 8, 1), -3.60],
                [Date.UTC(2012, 9, 1), -2.50],
                [Date.UTC(2012, 10, 1), -0.70],
                [Date.UTC(2012, 11, 1), -0.70],
                [Date.UTC(2012, 12, 1), -2.50],
                [Date.UTC(2013, 1, 1), 2.60],
                [Date.UTC(2013, 2, 1), -1.40],
                [Date.UTC(2013, 3, 1), 0.10],
                [Date.UTC(2013, 4, 1), -3.20],
                [Date.UTC(2013, 5, 1), -4.40],
                [Date.UTC(2013, 6, 1), -3.40],
                [Date.UTC(2013, 7, 1), -4.70],
                [Date.UTC(2013, 8, 1), -3.60],
                [Date.UTC(2013, 9, 1), -1.20],
                [Date.UTC(2013, 10, 1), -3.60],
                [Date.UTC(2013, 11, 1), -3.10],
                [Date.UTC(2013, 12, 1), 3.20],
                [Date.UTC(2014, 1, 1), -1.60],
                [Date.UTC(2014, 2, 1), -6.30],
                [Date.UTC(2014, 3, 1), -3.60],
                [Date.UTC(2014, 4, 1), 1.90],
                [Date.UTC(2014, 5, 1), -1.20],
                [Date.UTC(2014, 6, 1), 0.40],
                [Date.UTC(2014, 7, 1), 0.50],
                [Date.UTC(2014, 8, 1), 3.90],
                [Date.UTC(2014, 9, 1), 1.80],
                [Date.UTC(2014, 10, 1), 1.60],
                [Date.UTC(2014, 11, 1), -1.80],
                [Date.UTC(2014, 12, 1), -2.00],
                [Date.UTC(2015, 1, 1), -4.00],
                [Date.UTC(2015, 2, 1), -5.10],
                [Date.UTC(2015, 3, 1), -7.80],
                [Date.UTC(2015, 4, 1), -13.80],
                [Date.UTC(2015, 5, 1), -13.10],
                [Date.UTC(2015, 6, 1), -14.20],
                [Date.UTC(2015, 7, 1), -14.20],
                [Date.UTC(2015, 8, 1), -17.50],
                [Date.UTC(2015, 9, 1), -17.00],
                [Date.UTC(2015, 10, 1), -15.60],
                [Date.UTC(2015, 11, 1), -11.50],
                [Date.UTC(2015, 12, 1), -14.60],
                [Date.UTC(2016, 1, 1), -11.00],
                [Date.UTC(2016, 2, 1), -10.90],
                [Date.UTC(2016, 3, 1), -4.90],
                [Date.UTC(2016, 4, 1), -7.20],
                [Date.UTC(2016, 5, 1), -10.20],
                [Date.UTC(2016, 6, 1), -9.20],
                [Date.UTC(2016, 7, 1), -9.90],
                [Date.UTC(2016, 8, 1), -7.10],
                [Date.UTC(2016, 9, 1), -6.70],
                [Date.UTC(2016, 10, 1), -3.00],
                [Date.UTC(2016, 11, 1), 1.40],
                [Date.UTC(2016, 12, 1), 4.70],
                [Date.UTC(2017, 1, 1), 0.50],
                [Date.UTC(2017, 2, 1), 2.70],
                [Date.UTC(2017, 3, 1), -0.50],
                [Date.UTC(2017, 4, 1), -0.50],
                [Date.UTC(2017, 5, 1), 1.90],
                [Date.UTC(2017, 6, 1), 2.20],
                [Date.UTC(2017, 7, 1), 4.40],
                [Date.UTC(2017, 8, 1), -2.20],
                [Date.UTC(2017, 9, 1), 1.00],
                [Date.UTC(2017, 10, 1), 2.00],
                [Date.UTC(2017, 11, 1), -1.60],
                [Date.UTC(2017, 12, 1), -5.80],
                [Date.UTC(2018, 1, 1), -1.90],
                [Date.UTC(2018, 2, 1), 2.30],
                [Date.UTC(2018, 3, 1), 1.70],
                [Date.UTC(2018, 4, 1), 4.10],
                [Date.UTC(2018, 5, 1), 1.40],
                [Date.UTC(2018, 6, 1), 1.50],
                [Date.UTC(2018, 7, 1), -1.80],
                [Date.UTC(2018, 8, 1), -3.30],
                [Date.UTC(2018, 9, 1), 2.40],
                [Date.UTC(2018, 10, 1), -2.90],
                [Date.UTC(2018, 11, 1), -3.30],
                [Date.UTC(2018, 12, 1), -5.00],
                [Date.UTC(2019, 1, 1), -2.90],
                [Date.UTC(2019, 2, 1), -4.00],
                [Date.UTC(2019, 3, 1), -5.80],
                [Date.UTC(2019, 4, 1), -3.50],
                [Date.UTC(2019, 5, 1), -2.10],
                [Date.UTC(2019, 6, 1), -3.00],
                [Date.UTC(2019, 7, 1), -1.40],
                [Date.UTC(2019, 8, 1), -0.80],
                [Date.UTC(2019, 9, 1), -3.20],
                [Date.UTC(2019, 10, 1), -3.60],
                [Date.UTC(2019, 11, 1), -0.50],
                [Date.UTC(2019, 12, 1), -2.60],
                [Date.UTC(2020, 1, 1), -2.20],
                [Date.UTC(2020, 2, 1), -2.60],
                [Date.UTC(2020, 3, 1), -8.10],
                [Date.UTC(2020, 4, 1), -14.10]]
        },
        // 2 import airfreight europe
        {
            name: 'Import Europe',
            fillOpacity: 0,
            visible: true,
            data:
            [
                [Date.UTC(2002, 4, 1), 0.00],
                [Date.UTC(2002, 5, 1), 0.30],
                [Date.UTC(2002, 6, 1), 0.80],
                [Date.UTC(2002, 7, 1), 1.20],
                [Date.UTC(2002, 8, 1), 1.80],
                [Date.UTC(2002, 9, 1), 1.50],
                [Date.UTC(2002, 10, 1), 0.70],
                [Date.UTC(2002, 11, 1), 3.30],
                [Date.UTC(2002, 12, 1), 3.30],
                [Date.UTC(2003, 1, 1), 1.60],
                [Date.UTC(2003, 2, 1), 3.50],
                [Date.UTC(2003, 3, 1), 5.60],
                [Date.UTC(2003, 4, 1), 5.60],
                [Date.UTC(2003, 5, 1), 4.00],
                [Date.UTC(2003, 6, 1), 0.30],
                [Date.UTC(2003, 7, 1), -0.50],
                [Date.UTC(2003, 8, 1), -1.10],
                [Date.UTC(2003, 9, 1), -1.10],
                [Date.UTC(2003, 10, 1), -4.30],
                [Date.UTC(2003, 11, 1), -2.00],
                [Date.UTC(2003, 12, 1), -3.20],
                [Date.UTC(2004, 1, 1), -3.70],
                [Date.UTC(2004, 2, 1), -3.50],
                [Date.UTC(2004, 3, 1), -5.50],
                [Date.UTC(2004, 4, 1), -8.60],
                [Date.UTC(2004, 5, 1), -8.20],
                [Date.UTC(2004, 6, 1), -1.60],
                [Date.UTC(2004, 7, 1), -6.40],
                [Date.UTC(2004, 8, 1), -7.40],
                [Date.UTC(2004, 9, 1), -7.10],
                [Date.UTC(2004, 10, 1), 0.60],
                [Date.UTC(2004, 11, 1), 2.80],
                [Date.UTC(2004, 12, 1), 5.60],
                [Date.UTC(2005, 1, 1), 5.80],
                [Date.UTC(2005, 2, 1), 6.10],
                [Date.UTC(2005, 3, 1), 5.30],
                [Date.UTC(2005, 4, 1), 3.10],
                [Date.UTC(2005, 5, 1), 3.50],
                [Date.UTC(2005, 6, 1), 5.00],
                [Date.UTC(2005, 7, 1), 4.60],
                [Date.UTC(2005, 8, 1), 5.00],
                [Date.UTC(2005, 9, 1), 3.00],
                [Date.UTC(2005, 10, 1), 2.50],
                [Date.UTC(2005, 11, 1), 4.60],
                [Date.UTC(2005, 12, 1), 3.40],
                [Date.UTC(2006, 1, 1), 4.00],
                [Date.UTC(2006, 2, 1), 4.90],
                [Date.UTC(2006, 3, 1), 5.50],
                [Date.UTC(2006, 4, 1), 5.30],
                [Date.UTC(2006, 5, 1), 4.70],
                [Date.UTC(2006, 6, 1), 5.80],
                [Date.UTC(2006, 7, 1), 5.10],
                [Date.UTC(2006, 8, 1), 4.60],
                [Date.UTC(2006, 9, 1), 5.10],
                [Date.UTC(2006, 10, 1), 5.00],
                [Date.UTC(2006, 11, 1), 8.80],
                [Date.UTC(2006, 12, 1), 8.90],
                [Date.UTC(2007, 1, 1), 8.60],
                [Date.UTC(2007, 2, 1), 10.30],
                [Date.UTC(2007, 3, 1), 10.50],
                [Date.UTC(2007, 4, 1), 11.20],
                [Date.UTC(2007, 5, 1), 11.50],
                [Date.UTC(2007, 6, 1), 15.50],
                [Date.UTC(2007, 7, 1), 15.50],
                [Date.UTC(2007, 8, 1), 17.00],
                [Date.UTC(2007, 9, 1), 18.80],
                [Date.UTC(2007, 10, 1), 11.30],
                [Date.UTC(2007, 11, 1), 7.40],
                [Date.UTC(2007, 12, 1), 8.90],
                [Date.UTC(2008, 1, 1), 8.50],
                [Date.UTC(2008, 2, 1), 5.20],
                [Date.UTC(2008, 3, 1), 5.00],
                [Date.UTC(2008, 4, 1), 13.30],
                [Date.UTC(2008, 5, 1), 12.50],
                [Date.UTC(2008, 6, 1), 21.20],
                [Date.UTC(2008, 7, 1), 24.00],
                [Date.UTC(2008, 8, 1), 20.80],
                [Date.UTC(2008, 9, 1), 11.30],
                [Date.UTC(2008, 10, 1), 32.70],
                [Date.UTC(2008, 11, 1), 33.90],
                [Date.UTC(2008, 12, 1), 18.50],
                [Date.UTC(2009, 1, 1), 24.20],
                [Date.UTC(2009, 2, 1), 17.60],
                [Date.UTC(2009, 3, 1), 8.10],
                [Date.UTC(2009, 4, 1), -9.00],
                [Date.UTC(2009, 5, 1), -14.90],
                [Date.UTC(2009, 6, 1), -13.90],
                [Date.UTC(2009, 7, 1), -21.10],
                [Date.UTC(2009, 8, 1), -23.90],
                [Date.UTC(2009, 9, 1), -13.10],
                [Date.UTC(2009, 10, 1), -9.40],
                [Date.UTC(2009, 11, 1), -2.50],
                [Date.UTC(2009, 12, 1), 6.10],
                [Date.UTC(2010, 1, 1), -0.80],
                [Date.UTC(2010, 2, 1), 1.30],
                [Date.UTC(2010, 3, 1), 20.80],
                [Date.UTC(2010, 4, 1), 28.70],
                [Date.UTC(2010, 5, 1), 42.00],
                [Date.UTC(2010, 6, 1), 25.60],
                [Date.UTC(2010, 7, 1), 28.40],
                [Date.UTC(2010, 8, 1), 27.60],
                [Date.UTC(2010, 9, 1), 20.40],
                [Date.UTC(2010, 10, 1), 17.30],
                [Date.UTC(2010, 11, 1), 13.60],
                [Date.UTC(2010, 12, 1), 9.40],
                [Date.UTC(2011, 1, 1), 15.20],
                [Date.UTC(2011, 2, 1), 16.40],
                [Date.UTC(2011, 3, 1), 2.20],
                [Date.UTC(2011, 4, 1), -0.10],
                [Date.UTC(2011, 5, 1), 4.20],
                [Date.UTC(2011, 6, 1), 2.10],
                [Date.UTC(2011, 7, 1), 1.00],
                [Date.UTC(2011, 8, 1), 0.30],
                [Date.UTC(2011, 9, 1), 3.30],
                [Date.UTC(2011, 10, 1), -0.40],
                [Date.UTC(2011, 11, 1), -0.70],
                [Date.UTC(2011, 12, 1), 3.30],
                [Date.UTC(2012, 1, 1), 4.50],
                [Date.UTC(2012, 2, 1), 7.60],
                [Date.UTC(2012, 3, 1), 8.80],
                [Date.UTC(2012, 4, 1), 9.80],
                [Date.UTC(2012, 5, 1), 0.20],
                [Date.UTC(2012, 6, 1), 7.90],
                [Date.UTC(2012, 7, 1), 5.50],
                [Date.UTC(2012, 8, 1), 3.90],
                [Date.UTC(2012, 9, 1), 4.50],
                [Date.UTC(2012, 10, 1), 6.30],
                [Date.UTC(2012, 11, 1), 12.70],
                [Date.UTC(2012, 12, 1), 17.50],
                [Date.UTC(2013, 1, 1), 14.10],
                [Date.UTC(2013, 2, 1), 16.60],
                [Date.UTC(2013, 3, 1), 14.20],
                [Date.UTC(2013, 4, 1), 11.60],
                [Date.UTC(2013, 5, 1), 12.40],
                [Date.UTC(2013, 6, 1), 7.40],
                [Date.UTC(2013, 7, 1), 6.40],
                [Date.UTC(2013, 8, 1), 6.20],
                [Date.UTC(2013, 9, 1), 10.50],
                [Date.UTC(2013, 10, 1), 10.30],
                [Date.UTC(2013, 11, 1), 10.30],
                [Date.UTC(2013, 12, 1), 5.40],
                [Date.UTC(2014, 1, 1), 2.80],
                [Date.UTC(2014, 2, 1), 3.60],
                [Date.UTC(2014, 3, 1), 3.00],
                [Date.UTC(2014, 4, 1), 0.10],
                [Date.UTC(2014, 5, 1), 4.30],
                [Date.UTC(2014, 6, 1), -1.10],
                [Date.UTC(2014, 7, 1), 1.80],
                [Date.UTC(2014, 8, 1), 3.10],
                [Date.UTC(2014, 9, 1), 2.00],
                [Date.UTC(2014, 10, 1), 0.80],
                [Date.UTC(2014, 11, 1), 1.20],
                [Date.UTC(2014, 12, 1), 4.50],
                [Date.UTC(2015, 1, 1), 8.60],
                [Date.UTC(2015, 2, 1), 8.10],
                [Date.UTC(2015, 3, 1), 9.50],
                [Date.UTC(2015, 4, 1), 5.00],
                [Date.UTC(2015, 5, 1), 4.60],
                [Date.UTC(2015, 6, 1), 2.40],
                [Date.UTC(2015, 7, 1), 0.70],
                [Date.UTC(2015, 8, 1), -1.50],
                [Date.UTC(2015, 9, 1), -1.10],
                [Date.UTC(2015, 10, 1), 0.40],
                [Date.UTC(2015, 11, 1), 2.60],
                [Date.UTC(2015, 12, 1), -9.90],
                [Date.UTC(2016, 1, 1), -3.00],
                [Date.UTC(2016, 2, 1), -2.20],
                [Date.UTC(2016, 3, 1), -9.70],
                [Date.UTC(2016, 4, 1), 0.30],
                [Date.UTC(2016, 5, 1), -2.60],
                [Date.UTC(2016, 6, 1), -7.40],
                [Date.UTC(2016, 7, 1), -8.90],
                [Date.UTC(2016, 8, 1), -8.40],
                [Date.UTC(2016, 9, 1), -3.10],
                [Date.UTC(2016, 10, 1), -0.30],
                [Date.UTC(2016, 11, 1), -6.30],
                [Date.UTC(2016, 12, 1), -4.40],
                [Date.UTC(2017, 1, 1), -5.60],
                [Date.UTC(2017, 2, 1), -8.60],
                [Date.UTC(2017, 3, 1), -5.90],
                [Date.UTC(2017, 4, 1), -17.10],
                [Date.UTC(2017, 5, 1), -14.40],
                [Date.UTC(2017, 6, 1), -11.90],
                [Date.UTC(2017, 7, 1), -9.60],
                [Date.UTC(2017, 8, 1), -13.50],
                [Date.UTC(2017, 9, 1), -6.50],
                [Date.UTC(2017, 10, 1), -3.90],
                [Date.UTC(2017, 11, 1), 0.40],
                [Date.UTC(2017, 12, 1), 10.30],
                [Date.UTC(2018, 1, 1), 8.60],
                [Date.UTC(2018, 2, 1), 10.30],
                [Date.UTC(2018, 3, 1), 3.10],
                [Date.UTC(2018, 4, 1), 16.90],
                [Date.UTC(2018, 5, 1), 7.10],
                [Date.UTC(2018, 6, 1), 10.90],
                [Date.UTC(2018, 7, 1), 8.00],
                [Date.UTC(2018, 8, 1), 8.30],
                [Date.UTC(2018, 9, 1), 9.60],
                [Date.UTC(2018, 10, 1), 2.50],
                [Date.UTC(2018, 11, 1), 1.50],
                [Date.UTC(2018, 12, 1), 1.30],
                [Date.UTC(2019, 1, 1), -2.20],
                [Date.UTC(2019, 2, 1), -5.60],
                [Date.UTC(2019, 3, 1), 1.10],
                [Date.UTC(2019, 4, 1), -14.70],
                [Date.UTC(2019, 5, 1), -3.00],
                [Date.UTC(2019, 6, 1), -3.50],
                [Date.UTC(2019, 7, 1), -7.90],
                [Date.UTC(2019, 8, 1), -7.80],
                [Date.UTC(2019, 9, 1), -8.90],
                [Date.UTC(2019, 10, 1), -11.30],
                [Date.UTC(2019, 11, 1), -6.30],
                [Date.UTC(2019, 12, 1), -6.50],
                [Date.UTC(2020, 1, 1), -9.50],
                [Date.UTC(2020, 2, 1), -7.50],
                [Date.UTC(2020, 3, 1), -11.90],
                [Date.UTC(2020, 4, 1), -26.30]
            ]
        },
        // 3 export asia
        {
            name: 'Export Asia',
            fillOpacity: 0,
            data: [
                [Date.UTC(2002, 4, 1), -8.00],
                [Date.UTC(2002, 5, 1), -1.10],
                [Date.UTC(2002, 6, 1), -2.70],
                [Date.UTC(2002, 7, 1), 4.70],
                [Date.UTC(2002, 8, 1), 17.10],
                [Date.UTC(2002, 9, 1), 5.30],
                [Date.UTC(2002, 10, 1), -2.40],
                [Date.UTC(2002, 11, 1), -0.30],
                [Date.UTC(2002, 12, 1), 2.30],
                [Date.UTC(2003, 1, 1), 7.40],
                [Date.UTC(2003, 2, 1), 10.80],
                [Date.UTC(2003, 3, 1), 11.60],
                [Date.UTC(2003, 4, 1), 11.50],
                [Date.UTC(2003, 5, 1), 5.70],
                [Date.UTC(2003, 6, 1), 8.90],
                [Date.UTC(2003, 7, 1), 4.80],
                [Date.UTC(2003, 8, 1), -1.00],
                [Date.UTC(2003, 9, 1), 2.10],
                [Date.UTC(2003, 10, 1), 13.30],
                [Date.UTC(2003, 11, 1), 15.70],
                [Date.UTC(2003, 12, 1), 12.70],
                [Date.UTC(2004, 1, 1), 12.90],
                [Date.UTC(2004, 2, 1), 12.20],
                [Date.UTC(2004, 3, 1), 10.10],
                [Date.UTC(2004, 4, 1), 14.80],
                [Date.UTC(2004, 5, 1), 8.00],
                [Date.UTC(2004, 6, 1), 6.20],
                [Date.UTC(2004, 7, 1), 8.80],
                [Date.UTC(2004, 8, 1), 19.40],
                [Date.UTC(2004, 9, 1), 16.00],
                [Date.UTC(2004, 10, 1), 8.20],
                [Date.UTC(2004, 11, 1), 9.90],
                [Date.UTC(2004, 12, 1), 13.50],
                [Date.UTC(2005, 1, 1), 10.30],
                [Date.UTC(2005, 2, 1), 11.50],
                [Date.UTC(2005, 3, 1), 12.90],
                [Date.UTC(2005, 4, 1), 5.60],
                [Date.UTC(2005, 5, 1), 14.60],
                [Date.UTC(2005, 6, 1), 8.30],
                [Date.UTC(2005, 7, 1), 8.70],
                [Date.UTC(2005, 8, 1), 4.00],
                [Date.UTC(2005, 9, 1), -0.70],
                [Date.UTC(2005, 10, 1), -1.10],
                [Date.UTC(2005, 11, 1), -5.50],
                [Date.UTC(2005, 12, 1), -9.20],
                [Date.UTC(2006, 1, 1), -10.50],
                [Date.UTC(2006, 2, 1), -2.70],
                [Date.UTC(2006, 3, 1), -8.10],
                [Date.UTC(2006, 4, 1), -6.60],
                [Date.UTC(2006, 5, 1), -7.60],
                [Date.UTC(2006, 6, 1), -2.40],
                [Date.UTC(2006, 7, 1), -4.30],
                [Date.UTC(2006, 8, 1), -4.70],
                [Date.UTC(2006, 9, 1), -4.30],
                [Date.UTC(2006, 10, 1), -2.40],
                [Date.UTC(2006, 11, 1), -0.50],
                [Date.UTC(2006, 12, 1), 1.50],
                [Date.UTC(2007, 1, 1), 0.80],
                [Date.UTC(2007, 2, 1), -5.30],
                [Date.UTC(2007, 3, 1), -1.30],
                [Date.UTC(2007, 4, 1), 3.70],
                [Date.UTC(2007, 5, 1), 3.90],
                [Date.UTC(2007, 6, 1), 3.20],
                [Date.UTC(2007, 7, 1), 3.10],
                [Date.UTC(2007, 8, 1), -1.90],
                [Date.UTC(2007, 9, 1), 10.80],
                [Date.UTC(2007, 10, 1), 11.50],
                [Date.UTC(2007, 11, 1), 9.90],
                [Date.UTC(2007, 12, 1), 16.70],
                [Date.UTC(2008, 1, 1), 23.40],
                [Date.UTC(2008, 2, 1), 17.10],
                [Date.UTC(2008, 3, 1), 21.40],
                [Date.UTC(2008, 4, 1), 18.20],
                [Date.UTC(2008, 5, 1), 9.60],
                [Date.UTC(2008, 6, 1), 17.00],
                [Date.UTC(2008, 7, 1), 19.70],
                [Date.UTC(2008, 8, 1), 29.80],
                [Date.UTC(2008, 9, 1), 15.30],
                [Date.UTC(2008, 10, 1), 7.60],
                [Date.UTC(2008, 11, 1), 14.60],
                [Date.UTC(2008, 12, 1), 14.80],
                [Date.UTC(2009, 1, 1), 5.40],
                [Date.UTC(2009, 2, 1), -1.10],
                [Date.UTC(2009, 3, 1), -3.70],
                [Date.UTC(2009, 4, 1), -9.30],
                [Date.UTC(2009, 5, 1), -9.10],
                [Date.UTC(2009, 6, 1), -20.00],
                [Date.UTC(2009, 7, 1), -21.60],
                [Date.UTC(2009, 8, 1), -19.70],
                [Date.UTC(2009, 9, 1), -16.40],
                [Date.UTC(2009, 10, 1), -12.90],
                [Date.UTC(2009, 11, 1), -15.80],
                [Date.UTC(2009, 12, 1), -12.30],
                [Date.UTC(2010, 1, 1), -9.20],
                [Date.UTC(2010, 2, 1), 4.90],
                [Date.UTC(2010, 3, 1), 11.40],
                [Date.UTC(2010, 4, 1), 21.40],
                [Date.UTC(2010, 5, 1), 24.80],
                [Date.UTC(2010, 6, 1), 42.20],
                [Date.UTC(2010, 7, 1), 45.70],
                [Date.UTC(2010, 8, 1), 42.00],
                [Date.UTC(2010, 9, 1), 33.60],
                [Date.UTC(2010, 10, 1), 34.10],
                [Date.UTC(2010, 11, 1), 38.80],
                [Date.UTC(2010, 12, 1), 23.80],
                [Date.UTC(2011, 1, 1), 30.50],
                [Date.UTC(2011, 2, 1), 9.70],
                [Date.UTC(2011, 3, 1), 14.20],
                [Date.UTC(2011, 4, 1), 9.20],
                [Date.UTC(2011, 5, 1), 16.20],
                [Date.UTC(2011, 6, 1), 5.00],
                [Date.UTC(2011, 7, 1), 7.90],
                [Date.UTC(2011, 8, 1), 11.40],
                [Date.UTC(2011, 9, 1), 10.80],
                [Date.UTC(2011, 10, 1), 11.90],
                [Date.UTC(2011, 11, 1), 9.40],
                [Date.UTC(2011, 12, 1), 13.50],
                [Date.UTC(2012, 1, 1), 7.90],
                [Date.UTC(2012, 2, 1), 10.00],
                [Date.UTC(2012, 3, 1), 2.30],
                [Date.UTC(2012, 4, 1), 7.80],
                [Date.UTC(2012, 5, 1), 1.80],
                [Date.UTC(2012, 6, 1), 9.70],
                [Date.UTC(2012, 7, 1), 4.40],
                [Date.UTC(2012, 8, 1), 5.20],
                [Date.UTC(2012, 9, 1), -3.70],
                [Date.UTC(2012, 10, 1), 0.70],
                [Date.UTC(2012, 11, 1), -4.90],
                [Date.UTC(2012, 12, 1), 0.70],
                [Date.UTC(2013, 1, 1), 4.30],
                [Date.UTC(2013, 2, 1), 0.40],
                [Date.UTC(2013, 3, 1), -3.90],
                [Date.UTC(2013, 4, 1), -8.60],
                [Date.UTC(2013, 5, 1), -7.10],
                [Date.UTC(2013, 6, 1), -6.40],
                [Date.UTC(2013, 7, 1), -10.00],
                [Date.UTC(2013, 8, 1), -11.80],
                [Date.UTC(2013, 9, 1), -10.90],
                [Date.UTC(2013, 10, 1), -13.50],
                [Date.UTC(2013, 11, 1), -10.30],
                [Date.UTC(2013, 12, 1), -9.60],
                [Date.UTC(2014, 1, 1), -8.00],
                [Date.UTC(2014, 2, 1), -11.80],
                [Date.UTC(2014, 3, 1), -6.90],
                [Date.UTC(2014, 4, 1), -0.70],
                [Date.UTC(2014, 5, 1), -0.30],
                [Date.UTC(2014, 6, 1), 0.50],
                [Date.UTC(2014, 7, 1), 3.30],
                [Date.UTC(2014, 8, 1), 1.00],
                [Date.UTC(2014, 9, 1), 0.70],
                [Date.UTC(2014, 10, 1), 1.10],
                [Date.UTC(2014, 11, 1), 2.40],
                [Date.UTC(2014, 12, 1), 0.20],
                [Date.UTC(2015, 1, 1), -8.30],
                [Date.UTC(2015, 2, 1), -3.80],
                [Date.UTC(2015, 3, 1), -7.80],
                [Date.UTC(2015, 4, 1), -14.70],
                [Date.UTC(2015, 5, 1), -14.50],
                [Date.UTC(2015, 6, 1), -14.90],
                [Date.UTC(2015, 7, 1), -16.20],
                [Date.UTC(2015, 8, 1), -15.20],
                [Date.UTC(2015, 9, 1), -14.60],
                [Date.UTC(2015, 10, 1), -11.30],
                [Date.UTC(2015, 11, 1), -12.90],
                [Date.UTC(2015, 12, 1), -14.60],
                [Date.UTC(2016, 1, 1), -9.10],
                [Date.UTC(2016, 2, 1), -7.90],
                [Date.UTC(2016, 3, 1), -6.70],
                [Date.UTC(2016, 4, 1), -4.80],
                [Date.UTC(2016, 5, 1), -6.10],
                [Date.UTC(2016, 6, 1), -6.60],
                [Date.UTC(2016, 7, 1), -5.70],
                [Date.UTC(2016, 8, 1), -4.30],
                [Date.UTC(2016, 9, 1), -6.40],
                [Date.UTC(2016, 10, 1), -5.70],
                [Date.UTC(2016, 11, 1), 1.50],
                [Date.UTC(2016, 12, 1), 1.30],
                [Date.UTC(2017, 1, 1), 2.20],
                [Date.UTC(2017, 2, 1), -2.70],
                [Date.UTC(2017, 3, 1), -1.70],
                [Date.UTC(2017, 4, 1), 0.20],
                [Date.UTC(2017, 5, 1), -7.50],
                [Date.UTC(2017, 6, 1), -4.20],
                [Date.UTC(2017, 7, 1), -5.20],
                [Date.UTC(2017, 8, 1), -9.90],
                [Date.UTC(2017, 9, 1), -4.90],
                [Date.UTC(2017, 10, 1), -8.30],
                [Date.UTC(2017, 11, 1), -11.40],
                [Date.UTC(2017, 12, 1), -5.00],
                [Date.UTC(2018, 1, 1), -2.80],
                [Date.UTC(2018, 2, 1), 4.50],
                [Date.UTC(2018, 3, 1), 4.40],
                [Date.UTC(2018, 4, 1), 0.50],
                [Date.UTC(2018, 5, 1), 3.20],
                [Date.UTC(2018, 6, 1), 6.30],
                [Date.UTC(2018, 7, 1), 10.70],
                [Date.UTC(2018, 8, 1), -2.90],
                [Date.UTC(2018, 9, 1), 13.50],
                [Date.UTC(2018, 10, 1), 9.30],
                [Date.UTC(2018, 11, 1), 7.40],
                [Date.UTC(2018, 12, 1), -0.70],
                [Date.UTC(2019, 1, 1), -0.70],
                [Date.UTC(2019, 2, 1), 0.30],
                [Date.UTC(2019, 3, 1), -0.50],
                [Date.UTC(2019, 4, 1), 0.00],
                [Date.UTC(2019, 5, 1), 3.40],
                [Date.UTC(2019, 6, 1), 1.90],
                [Date.UTC(2019, 7, 1), -0.80],
                [Date.UTC(2019, 8, 1), 0.30],
                [Date.UTC(2019, 9, 1), -3.20],
                [Date.UTC(2019, 10, 1), -1.30],
                [Date.UTC(2019, 11, 1), 2.80],
                [Date.UTC(2019, 12, 1), -3.10],
                [Date.UTC(2020, 1, 1), -1.50],
                [Date.UTC(2020, 2, 1), -1.90],
                [Date.UTC(2020, 3, 1), -7.90],
                [Date.UTC(2020, 4, 1), -9.70]]
        },
        // 4 export europe
        {
            name: 'Export Europe',
            fillOpacity: 0,
            data: [
                [Date.UTC(2002, 4, 1), 5.00],
                [Date.UTC(2002, 5, 1), 6.80],
                [Date.UTC(2002, 6, 1), 9.00],
                [Date.UTC(2002, 7, 1), 10.80],
                [Date.UTC(2002, 8, 1), 11.10],
                [Date.UTC(2002, 9, 1), 8.30],
                [Date.UTC(2002, 10, 1), 8.00],
                [Date.UTC(2002, 11, 1), 10.30],
                [Date.UTC(2002, 12, 1), 11.40],
                [Date.UTC(2003, 1, 1), 14.20],
                [Date.UTC(2003, 2, 1), 15.20],
                [Date.UTC(2003, 3, 1), 18.20],
                [Date.UTC(2003, 4, 1), 17.40],
                [Date.UTC(2003, 5, 1), 19.30],
                [Date.UTC(2003, 6, 1), 25.80],
                [Date.UTC(2003, 7, 1), 23.90],
                [Date.UTC(2003, 8, 1), 19.30],
                [Date.UTC(2003, 9, 1), 15.40],
                [Date.UTC(2003, 10, 1), 21.40],
                [Date.UTC(2003, 11, 1), 19.20],
                [Date.UTC(2003, 12, 1), 18.50],
                [Date.UTC(2004, 1, 1), 19.20],
                [Date.UTC(2004, 2, 1), 20.80],
                [Date.UTC(2004, 3, 1), 19.80],
                [Date.UTC(2004, 4, 1), 13.20],
                [Date.UTC(2004, 5, 1), 6.70],
                [Date.UTC(2004, 6, 1), 2.70],
                [Date.UTC(2004, 7, 1), -1.10],
                [Date.UTC(2004, 8, 1), -1.00],
                [Date.UTC(2004, 9, 1), 7.90],
                [Date.UTC(2004, 10, 1), 3.80],
                [Date.UTC(2004, 11, 1), 9.70],
                [Date.UTC(2004, 12, 1), 13.60],
                [Date.UTC(2005, 1, 1), 10.60],
                [Date.UTC(2005, 2, 1), 6.00],
                [Date.UTC(2005, 3, 1), 8.00],
                [Date.UTC(2005, 4, 1), 8.10],
                [Date.UTC(2005, 5, 1), 18.80],
                [Date.UTC(2005, 6, 1), 10.60],
                [Date.UTC(2005, 7, 1), 18.60],
                [Date.UTC(2005, 8, 1), 19.10],
                [Date.UTC(2005, 9, 1), 9.10],
                [Date.UTC(2005, 10, 1), 6.50],
                [Date.UTC(2005, 11, 1), -5.00],
                [Date.UTC(2005, 12, 1), -9.40],
                [Date.UTC(2006, 1, 1), -11.60],
                [Date.UTC(2006, 2, 1), -4.60],
                [Date.UTC(2006, 3, 1), -10.50],
                [Date.UTC(2006, 4, 1), 0.50],
                [Date.UTC(2006, 5, 1), -4.60],
                [Date.UTC(2006, 6, 1), 1.70],
                [Date.UTC(2006, 7, 1), -2.20],
                [Date.UTC(2006, 8, 1), 0.30],
                [Date.UTC(2006, 9, 1), 6.00],
                [Date.UTC(2006, 10, 1), 7.10],
                [Date.UTC(2006, 11, 1), 11.00],
                [Date.UTC(2006, 12, 1), 12.70],
                [Date.UTC(2007, 1, 1), 14.20],
                [Date.UTC(2007, 2, 1), 8.00],
                [Date.UTC(2007, 3, 1), 12.90],
                [Date.UTC(2007, 4, 1), 11.10],
                [Date.UTC(2007, 5, 1), 10.10],
                [Date.UTC(2007, 6, 1), 6.30],
                [Date.UTC(2007, 7, 1), 6.30],
                [Date.UTC(2007, 8, 1), 6.70],
                [Date.UTC(2007, 9, 1), 7.30],
                [Date.UTC(2007, 10, 1), 7.80],
                [Date.UTC(2007, 11, 1), 9.60],
                [Date.UTC(2007, 12, 1), 12.60],
                [Date.UTC(2008, 1, 1), 11.50],
                [Date.UTC(2008, 2, 1), 7.90],
                [Date.UTC(2008, 3, 1), 8.00],
                [Date.UTC(2008, 4, 1), 4.80],
                [Date.UTC(2008, 5, 1), 7.00],
                [Date.UTC(2008, 6, 1), 24.80],
                [Date.UTC(2008, 7, 1), 21.30],
                [Date.UTC(2008, 8, 1), 17.40],
                [Date.UTC(2008, 9, 1), 12.90],
                [Date.UTC(2008, 10, 1), 9.90],
                [Date.UTC(2008, 11, 1), 9.70],
                [Date.UTC(2008, 12, 1), 2.20],
                [Date.UTC(2009, 1, 1), -0.20],
                [Date.UTC(2009, 2, 1), -5.70],
                [Date.UTC(2009, 3, 1), -13.70],
                [Date.UTC(2009, 4, 1), -17.50],
                [Date.UTC(2009, 5, 1), -22.10],
                [Date.UTC(2009, 6, 1), -22.40],
                [Date.UTC(2009, 7, 1), -22.10],
                [Date.UTC(2009, 8, 1), -22.00],
                [Date.UTC(2009, 9, 1), -21.20],
                [Date.UTC(2009, 10, 1), -15.50],
                [Date.UTC(2009, 11, 1), -8.00],
                [Date.UTC(2009, 12, 1), 0.40],
                [Date.UTC(2010, 1, 1), 1.50],
                [Date.UTC(2010, 2, 1), 17.80],
                [Date.UTC(2010, 3, 1), 27.90],
                [Date.UTC(2010, 4, 1), 33.40],
                [Date.UTC(2010, 5, 1), 37.20],
                [Date.UTC(2010, 6, 1), 38.10],
                [Date.UTC(2010, 7, 1), 33.40],
                [Date.UTC(2010, 8, 1), 24.90],
                [Date.UTC(2010, 9, 1), 29.50],
                [Date.UTC(2010, 10, 1), 23.60],
                [Date.UTC(2010, 11, 1), 4.00],
                [Date.UTC(2010, 12, 1), 1.00],
                [Date.UTC(2011, 1, 1), -0.80],
                [Date.UTC(2011, 2, 1), -6.60],
                [Date.UTC(2011, 3, 1), -7.20],
                [Date.UTC(2011, 4, 1), -3.20],
                [Date.UTC(2011, 5, 1), 2.80],
                [Date.UTC(2011, 6, 1), 0.50],
                [Date.UTC(2011, 7, 1), 7.80],
                [Date.UTC(2011, 8, 1), 13.30],
                [Date.UTC(2011, 9, 1), 6.80],
                [Date.UTC(2011, 10, 1), 7.10],
                [Date.UTC(2011, 11, 1), 14.80],
                [Date.UTC(2011, 12, 1), 9.30],
                [Date.UTC(2012, 1, 1), 12.80],
                [Date.UTC(2012, 2, 1), 20.40],
                [Date.UTC(2012, 3, 1), 14.60],
                [Date.UTC(2012, 4, 1), 13.10],
                [Date.UTC(2012, 5, 1), 5.20],
                [Date.UTC(2012, 6, 1), 4.90],
                [Date.UTC(2012, 7, 1), -4.10],
                [Date.UTC(2012, 8, 1), -7.50],
                [Date.UTC(2012, 9, 1), -4.60],
                [Date.UTC(2012, 10, 1), -6.20],
                [Date.UTC(2012, 11, 1), 1.80],
                [Date.UTC(2012, 12, 1), 4.50],
                [Date.UTC(2013, 1, 1), 4.00],
                [Date.UTC(2013, 2, 1), -0.30],
                [Date.UTC(2013, 3, 1), 6.10],
                [Date.UTC(2013, 4, 1), -5.70],
                [Date.UTC(2013, 5, 1), -0.80],
                [Date.UTC(2013, 6, 1), 1.90],
                [Date.UTC(2013, 7, 1), 2.70],
                [Date.UTC(2013, 8, 1), 2.90],
                [Date.UTC(2013, 9, 1), 1.80],
                [Date.UTC(2013, 10, 1), 0.50],
                [Date.UTC(2013, 11, 1), 2.30],
                [Date.UTC(2013, 12, 1), -0.10],
                [Date.UTC(2014, 1, 1), -3.00],
                [Date.UTC(2014, 2, 1), -3.80],
                [Date.UTC(2014, 3, 1), -2.40],
                [Date.UTC(2014, 4, 1), 5.20],
                [Date.UTC(2014, 5, 1), 5.00],
                [Date.UTC(2014, 6, 1), 1.80],
                [Date.UTC(2014, 7, 1), -0.70],
                [Date.UTC(2014, 8, 1), -4.60],
                [Date.UTC(2014, 9, 1), 4.40],
                [Date.UTC(2014, 10, 1), 7.00],
                [Date.UTC(2014, 11, 1), -2.20],
                [Date.UTC(2014, 12, 1), 4.40],
                [Date.UTC(2015, 1, 1), 1.50],
                [Date.UTC(2015, 2, 1), -0.80],
                [Date.UTC(2015, 3, 1), -3.10],
                [Date.UTC(2015, 4, 1), -9.80],
                [Date.UTC(2015, 5, 1), -9.80],
                [Date.UTC(2015, 6, 1), -13.00],
                [Date.UTC(2015, 7, 1), -9.00],
                [Date.UTC(2015, 8, 1), -10.30],
                [Date.UTC(2015, 9, 1), -8.60],
                [Date.UTC(2015, 10, 1), -10.80],
                [Date.UTC(2015, 11, 1), -2.30],
                [Date.UTC(2015, 12, 1), -11.70],
                [Date.UTC(2016, 1, 1), -7.30],
                [Date.UTC(2016, 2, 1), -6.70],
                [Date.UTC(2016, 3, 1), 6.50],
                [Date.UTC(2016, 4, 1), -1.70],
                [Date.UTC(2016, 5, 1), -9.00],
                [Date.UTC(2016, 6, 1), -7.10],
                [Date.UTC(2016, 7, 1), -13.60],
                [Date.UTC(2016, 8, 1), -9.90],
                [Date.UTC(2016, 9, 1), -9.30],
                [Date.UTC(2016, 10, 1), -3.60],
                [Date.UTC(2016, 11, 1), -3.70],
                [Date.UTC(2016, 12, 1), 9.30],
                [Date.UTC(2017, 1, 1), 3.10],
                [Date.UTC(2017, 2, 1), 10.50],
                [Date.UTC(2017, 3, 1), -8.00],
                [Date.UTC(2017, 4, 1), -5.70],
                [Date.UTC(2017, 5, 1), 0.90],
                [Date.UTC(2017, 6, 1), -2.40],
                [Date.UTC(2017, 7, 1), 2.80],
                [Date.UTC(2017, 8, 1), -5.90],
                [Date.UTC(2017, 9, 1), 6.40],
                [Date.UTC(2017, 10, 1), 6.80],
                [Date.UTC(2017, 11, 1), 5.30],
                [Date.UTC(2017, 12, 1), -6.60],
                [Date.UTC(2018, 1, 1), -5.40],
                [Date.UTC(2018, 2, 1), -4.00],
                [Date.UTC(2018, 3, 1), 2.70],
                [Date.UTC(2018, 4, 1), 7.20],
                [Date.UTC(2018, 5, 1), 3.60],
                [Date.UTC(2018, 6, 1), 2.30],
                [Date.UTC(2018, 7, 1), 0.80],
                [Date.UTC(2018, 8, 1), 4.30],
                [Date.UTC(2018, 9, 1), -3.80],
                [Date.UTC(2018, 10, 1), -6.80],
                [Date.UTC(2018, 11, 1), -6.50],
                [Date.UTC(2018, 12, 1), 0.60],
                [Date.UTC(2019, 1, 1), 3.10],
                [Date.UTC(2019, 2, 1), -5.90],
                [Date.UTC(2019, 3, 1), -7.20],
                [Date.UTC(2019, 4, 1), -5.20],
                [Date.UTC(2019, 5, 1), -4.30],
                [Date.UTC(2019, 6, 1), -5.30],
                [Date.UTC(2019, 7, 1), -2.50],
                [Date.UTC(2019, 8, 1), -2.80],
                [Date.UTC(2019, 9, 1), -6.20],
                [Date.UTC(2019, 10, 1), -8.80],
                [Date.UTC(2019, 11, 1), -5.90],
                [Date.UTC(2019, 12, 1), -9.70],
                [Date.UTC(2020, 1, 1), -8.00],
                [Date.UTC(2020, 2, 1), -7.60],
                [Date.UTC(2020, 3, 1), -12.30],
                [Date.UTC(2020, 4, 1), -24.30]]
        },
        {
            name: 'Export All Air Passenger Fares',
            fillOpacity: 0,
            data: [
                [Date.UTC(2002, 4, 1), -0.20],
                [Date.UTC(2002, 5, 1), -6.10],
                [Date.UTC(2002, 6, 1), -6.10],
                [Date.UTC(2002, 7, 1), -5.00],
                [Date.UTC(2002, 8, 1), -8.60],
                [Date.UTC(2002, 9, 1), -10.40],
                [Date.UTC(2002, 10, 1), -7.50],
                [Date.UTC(2002, 11, 1), -9.00],
                [Date.UTC(2002, 12, 1), -9.00],
                [Date.UTC(2003, 1, 1), -10.20],
                [Date.UTC(2003, 2, 1), -3.00],
                [Date.UTC(2003, 3, 1), -1.60],
                [Date.UTC(2003, 4, 1), -5.70],
                [Date.UTC(2003, 5, 1), -0.80],
                [Date.UTC(2003, 6, 1), 1.10],
                [Date.UTC(2003, 7, 1), 6.80],
                [Date.UTC(2003, 8, 1), 7.60],
                [Date.UTC(2003, 9, 1), 3.70],
                [Date.UTC(2003, 10, 1), 3.40],
                [Date.UTC(2003, 11, 1), 3.80],
                [Date.UTC(2003, 12, 1), 1.70],
                [Date.UTC(2004, 1, 1), 8.90],
                [Date.UTC(2004, 2, 1), 0.00],
                [Date.UTC(2004, 3, 1), 0.40],
                [Date.UTC(2004, 4, 1), 5.90],
                [Date.UTC(2004, 5, 1), 7.60],
                [Date.UTC(2004, 6, 1), 7.40],
                [Date.UTC(2004, 7, 1), 7.50],
                [Date.UTC(2004, 8, 1), 7.40],
                [Date.UTC(2004, 9, 1), 5.20],
                [Date.UTC(2004, 10, 1), 4.40],
                [Date.UTC(2004, 11, 1), 5.30],
                [Date.UTC(2004, 12, 1), 6.00],
                [Date.UTC(2005, 1, 1), -0.60],
                [Date.UTC(2005, 2, 1), 2.10],
                [Date.UTC(2005, 3, 1), 0.90],
                [Date.UTC(2005, 4, 1), 2.30],
                [Date.UTC(2005, 5, 1), -1.30],
                [Date.UTC(2005, 6, 1), -2.50],
                [Date.UTC(2005, 7, 1), -2.60],
                [Date.UTC(2005, 8, 1), -3.70],
                [Date.UTC(2005, 9, 1), -0.80],
                [Date.UTC(2005, 10, 1), 0.00],
                [Date.UTC(2005, 11, 1), -1.10],
                [Date.UTC(2005, 12, 1), 0.60],
                [Date.UTC(2006, 1, 1), 0.60],
                [Date.UTC(2006, 2, 1), 2.50],
                [Date.UTC(2006, 3, 1), 1.90],
                [Date.UTC(2006, 4, 1), -1.10],
                [Date.UTC(2006, 5, 1), 4.10],
                [Date.UTC(2006, 6, 1), 4.50],
                [Date.UTC(2006, 7, 1), 2.30],
                [Date.UTC(2006, 8, 1), 4.60],
                [Date.UTC(2006, 9, 1), 6.10],
                [Date.UTC(2006, 10, 1), 9.10],
                [Date.UTC(2006, 11, 1), 8.40],
                [Date.UTC(2006, 12, 1), 7.40],
                [Date.UTC(2007, 1, 1), 6.60],
                [Date.UTC(2007, 2, 1), 9.80],
                [Date.UTC(2007, 3, 1), 9.80],
                [Date.UTC(2007, 4, 1), 1.40],
                [Date.UTC(2007, 5, 1), 0.00],
                [Date.UTC(2007, 6, 1), -0.50],
                [Date.UTC(2007, 7, 1), -0.10],
                [Date.UTC(2007, 8, 1), 0.20],
                [Date.UTC(2007, 9, 1), 1.80],
                [Date.UTC(2007, 10, 1), 2.60],
                [Date.UTC(2007, 11, 1), 5.70],
                [Date.UTC(2007, 12, 1), 3.40],
                [Date.UTC(2008, 1, 1), 3.60],
                [Date.UTC(2008, 2, 1), 3.80],
                [Date.UTC(2008, 3, 1), 5.10],
                [Date.UTC(2008, 4, 1), 18.80],
                [Date.UTC(2008, 5, 1), 22.50],
                [Date.UTC(2008, 6, 1), 27.10],
                [Date.UTC(2008, 7, 1), 27.20],
                [Date.UTC(2008, 8, 1), 25.00],
                [Date.UTC(2008, 9, 1), 10.90],
                [Date.UTC(2008, 10, 1), 4.60],
                [Date.UTC(2008, 11, 1), 1.90],
                [Date.UTC(2008, 12, 1), 23.10],
                [Date.UTC(2009, 1, 1), -0.50],
                [Date.UTC(2009, 2, 1), -5.10],
                [Date.UTC(2009, 3, 1), -9.10],
                [Date.UTC(2009, 4, 1), -11.10],
                [Date.UTC(2009, 5, 1), -20.20],
                [Date.UTC(2009, 6, 1), -22.70],
                [Date.UTC(2009, 7, 1), -21.20],
                [Date.UTC(2009, 8, 1), -16.80],
                [Date.UTC(2009, 9, 1), -12.30],
                [Date.UTC(2009, 10, 1), -7.20],
                [Date.UTC(2009, 11, 1), 0.60],
                [Date.UTC(2009, 12, 1), -7.20],
                [Date.UTC(2010, 1, 1), 3.10],
                [Date.UTC(2010, 2, 1), 8.50],
                [Date.UTC(2010, 3, 1), 15.00],
                [Date.UTC(2010, 4, 1), 20.60],
                [Date.UTC(2010, 5, 1), 22.50],
                [Date.UTC(2010, 6, 1), 23.40],
                [Date.UTC(2010, 7, 1), 18.40],
                [Date.UTC(2010, 8, 1), 14.50],
                [Date.UTC(2010, 9, 1), 21.40],
                [Date.UTC(2010, 10, 1), 24.70],
                [Date.UTC(2010, 11, 1), 20.40],
                [Date.UTC(2010, 12, 1), 16.70],
                [Date.UTC(2011, 1, 1), 20.60],
                [Date.UTC(2011, 2, 1), 19.80],
                [Date.UTC(2011, 3, 1), 20.00],
                [Date.UTC(2011, 4, 1), 18.20],
                [Date.UTC(2011, 5, 1), 22.70],
                [Date.UTC(2011, 6, 1), 19.30],
                [Date.UTC(2011, 7, 1), 22.30],
                [Date.UTC(2011, 8, 1), 23.80],
                [Date.UTC(2011, 9, 1), 17.40],
                [Date.UTC(2011, 10, 1), 14.00],
                [Date.UTC(2011, 11, 1), 10.50],
                [Date.UTC(2011, 12, 1), 9.20],
                [Date.UTC(2012, 1, 1), 13.30],
                [Date.UTC(2012, 2, 1), 12.10],
                [Date.UTC(2012, 3, 1), 9.30],
                [Date.UTC(2012, 4, 1), 5.90],
                [Date.UTC(2012, 5, 1), 0.80],
                [Date.UTC(2012, 6, 1), 3.80],
                [Date.UTC(2012, 7, 1), -1.00],
                [Date.UTC(2012, 8, 1), -5.20],
                [Date.UTC(2012, 9, 1), -6.40],
                [Date.UTC(2012, 10, 1), -6.90],
                [Date.UTC(2012, 11, 1), -2.30],
                [Date.UTC(2012, 12, 1), -1.00],
                [Date.UTC(2013, 1, 1), -8.50],
                [Date.UTC(2013, 2, 1), -7.80],
                [Date.UTC(2013, 3, 1), -5.80],
                [Date.UTC(2013, 4, 1), -7.70],
                [Date.UTC(2013, 5, 1), -3.50],
                [Date.UTC(2013, 6, 1), -0.40],
                [Date.UTC(2013, 7, 1), -0.20],
                [Date.UTC(2013, 8, 1), 0.40],
                [Date.UTC(2013, 9, 1), 3.50],
                [Date.UTC(2013, 10, 1), 3.10],
                [Date.UTC(2013, 11, 1), 0.80],
                [Date.UTC(2013, 12, 1), 1.40],
                [Date.UTC(2014, 1, 1), 2.80],
                [Date.UTC(2014, 2, 1), 1.20],
                [Date.UTC(2014, 3, 1), 0.50],
                [Date.UTC(2014, 4, 1), 3.70],
                [Date.UTC(2014, 5, 1), 2.10],
                [Date.UTC(2014, 6, 1), -2.30],
                [Date.UTC(2014, 7, 1), -2.10],
                [Date.UTC(2014, 8, 1), 0.10],
                [Date.UTC(2014, 9, 1), 0.90],
                [Date.UTC(2014, 10, 1), 4.30],
                [Date.UTC(2014, 11, 1), -1.30],
                [Date.UTC(2014, 12, 1), -0.70],
                [Date.UTC(2015, 1, 1), -1.70],
                [Date.UTC(2015, 2, 1), 0.20],
                [Date.UTC(2015, 3, 1), -1.00],
                [Date.UTC(2015, 4, 1), -4.80],
                [Date.UTC(2015, 5, 1), -5.50],
                [Date.UTC(2015, 6, 1), -5.70],
                [Date.UTC(2015, 7, 1), -4.40],
                [Date.UTC(2015, 8, 1), -5.40],
                [Date.UTC(2015, 9, 1), -9.10],
                [Date.UTC(2015, 10, 1), -13.00],
                [Date.UTC(2015, 11, 1), -11.30],
                [Date.UTC(2015, 12, 1), -8.40],
                [Date.UTC(2016, 1, 1), -13.80],
                [Date.UTC(2016, 2, 1), -11.70],
                [Date.UTC(2016, 3, 1), -11.20],
                [Date.UTC(2016, 4, 1), -12.40],
                [Date.UTC(2016, 5, 1), -9.50],
                [Date.UTC(2016, 6, 1), -4.60],
                [Date.UTC(2016, 7, 1), -4.70],
                [Date.UTC(2016, 8, 1), -4.10],
                [Date.UTC(2016, 9, 1), -0.40],
                [Date.UTC(2016, 10, 1), 3.70],
                [Date.UTC(2016, 11, 1), 8.40],
                [Date.UTC(2016, 12, 1), 2.80],
                [Date.UTC(2017, 1, 1), 8.60],
                [Date.UTC(2017, 2, 1), 8.00],
                [Date.UTC(2017, 3, 1), 9.30],
                [Date.UTC(2017, 4, 1), 12.70],
                [Date.UTC(2017, 5, 1), 8.30],
                [Date.UTC(2017, 6, 1), 6.80],
                [Date.UTC(2017, 7, 1), 5.80],
                [Date.UTC(2017, 8, 1), 3.00],
                [Date.UTC(2017, 9, 1), 3.00],
                [Date.UTC(2017, 10, 1), 0.40],
                [Date.UTC(2017, 11, 1), 0.40],
                [Date.UTC(2017, 12, 1), 2.70],
                [Date.UTC(2018, 1, 1), 1.20],
                [Date.UTC(2018, 2, 1), 3.50],
                [Date.UTC(2018, 3, 1), 3.40],
                [Date.UTC(2018, 4, 1), 2.20],
                [Date.UTC(2018, 5, 1), -1.50],
                [Date.UTC(2018, 6, 1), -1.20],
                [Date.UTC(2018, 7, 1), -1.00],
                [Date.UTC(2018, 8, 1), -2.70],
                [Date.UTC(2018, 9, 1), -2.60],
                [Date.UTC(2018, 10, 1), -2.40],
                [Date.UTC(2018, 11, 1), -0.90],
                [Date.UTC(2018, 12, 1), -1.20],
                [Date.UTC(2019, 1, 1), -5.40],
                [Date.UTC(2019, 2, 1), -5.10],
                [Date.UTC(2019, 3, 1), -7.80],
                [Date.UTC(2019, 4, 1), -6.90],
                [Date.UTC(2019, 5, 1), -1.20],
                [Date.UTC(2019, 6, 1), -1.40],
                [Date.UTC(2019, 7, 1), 2.30],
                [Date.UTC(2019, 8, 1), 1.80],
                [Date.UTC(2019, 9, 1), -0.80],
                [Date.UTC(2019, 10, 1), 1.40],
                [Date.UTC(2019, 11, 1), -0.90],
                [Date.UTC(2019, 12, 1), 4.20],
                [Date.UTC(2020, 1, 1), 1.10],
                [Date.UTC(2020, 2, 1), 4.70],
                [Date.UTC(2020, 3, 1), -2.50],
                [Date.UTC(2020, 4, 1), -6.90]]
        }
    ]

};

const charts = [arc, str, cr, sk, rc];

function makeChart() {
    const chartNum = Math.round(randomNumber(0, 4));
    const chart = charts[chartNum];
    Highcharts.chart('hero', chart);
}

makeChart();
