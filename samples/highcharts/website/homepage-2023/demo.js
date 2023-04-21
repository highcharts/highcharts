const  colors = [
    '#2caffe',
    '#544fc5',
    '#00e272',
    '#fe6a35',
    '#6b8abc',
    '#d568fb',
    '#2ee0ca',
    '#fa4b42',
    '#feb56a',
    '#91e8e1'
];

// data for Variwide (V)
const dataVW = [
    ['Norway', 50.2, 335504],
    ['Denmark', 42, 277339],
    ['Belgium', 39.2, 421611],
    ['Sweden', 38, 462057],
    ['France', 35.6, 2228857],
    ['Netherlands', 34.3, 702641],
    ['Finland', 33.2, 215615],
    ['Germany', 33.0, 3144050],
    ['Austria', 32.7, 349344],
    ['Ireland', 30.4, 275567],
    ['Italy', 27.8, 1672438],
    ['United Kingdom', 26.7, 2366911],
    ['Spain', 21.3, 1113851],
    ['Greece', 14.2, 175887],
    ['Portugal', 13.7, 184933],
    ['Czech Republic', 10.2, 176564],
    ['Poland', 8.6, 424269],
    ['Romania', 5.5, 169578]

];

// data for Sankey (SK)
const dataSK =
    [
        // ['Robinhood', 'Retail Investing', 2200.00],
        // ['Klarna', 'E-commerce', 2100.00],
        // ['Chime', 'Digital banking', 1500.00],
        // ['Figure Technologies', 'Real Estate', 1400.00],
        // ['LendInvest', 'Real Estate', 1300.00],
        // ['TransferWise', 'Mobile Wallets', 1100.00],
        // ['AvidXchange', 'Accounting & Finance', 1100.00],

        ['N26', 'Digital Banking', 782.80],
        ['BlueVine', 'Business Lending & Finance', 767.50],
        ['Brex', 'Payments Processing & Networks', 732.10],
        ['Coinbase', 'Crypto', 547.30],
        ['Marqeta', 'Payments Processing & Networks', 528.00],
        ['Root Insurance', 'Insurance', 527.50],
        ['Gusto', 'Payroll & Benefits', 516.10],
        ['Cambridge Mobile Telematics', 'Insurance', 502.50],
        ['Future Finance', 'Credit Score & Analytics', 485.20],
        ['Petal', 'POS & Consumer Lending', 435.00],
        ['Varo Money', 'Personal Finance', 419.40],
        ['Monzo', 'Digital Banking', 419.32],
        ['Airwallex', 'Payments Processing & Networks', 402.70],
        ['C2FO', 'Accounting & Finance', 397.70],
        ['Starling Bank', 'Digital Banking', 395.67],
        ['Alkami Technology', 'Digital Banking', 385.20],
        ['Checkout.com', 'Payments Processing & Networks', 380.00],
        ['Unqork', 'Financial Services', 365.20],
        ['Revolut', 'Digital Banking', 917.00],
        ['Toast', 'Payments Processing - Food Service', 902.00],
        ['Blend', 'Real Estate', 365.00],
        ['Hippo', 'Insurance', 359.00],
        ['Creditas', 'General Lending', 314.00],
        ['Paidy', 'POS & Consumer Lending', 277.90],
        ['Betterment', 'Personal Finance', 275.00],
        ['Payoneer', 'Payments Processing & Networks', 270.00],
        ['wefox Group', 'Insurance', 268.50],
        ['Linklogis', 'Business Lending', 265.10],
        ['Flywire', 'Payments Processing & Networks', 263.20],
        ['Better.com', 'Real Estate', 254.00],
        ['Addepar', 'Asset Management', 245.80],
        ['Deserve', 'POS & Consumer Lending', 237.10],
        ['Riskified', 'Payments Processing & Networks', 228.70],
        ['BioCatch', 'Regulatory & Compliance', 213.70],
        ['TouchBistro', 'Payments Processing - Food Service', 209.40],
        ['Raisin', 'Digital Banking', 206.00],
        ['Tink', 'Core Banking & Infrastructure', 205.50],
        ['MX Technologies', 'Core Banking & Infrastructure', 205.00],
        ['Wealthfront', 'Personal finance', 204.50],
        ['Bread', 'POS & Consumer Lending', 200.30],
        ['Onfido', 'Regulatory & Compliance', 188.80],
        ['CRED', 'Personal Finance', 175.50],
        ['HighRadius', 'Accounting & Finance', 175.00],
        ['Rapyd', 'Payments Processing & Networks', 170.00],
        ['HomeLight', 'Real Estate', 164.50],
        ['PolicyGenius', 'Insurance', 161.00],
        ['CurrencyCloud', 'Payments Processing & Networks', 160.20],
        ['Flyhomes', 'Real Estate', 160.00],
        ['Qonto', 'Digital Banking', 151.50],
        ['Thought Machine', 'Core Banking & Infrastructure', 148.60]
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

// data for Radial Bar (RB)
const dataRB =  [129, 171, 126, 129, 144, 176, 135, 148, 216, 194, 195, 194];
const dataRBAlt =  [129, 71, 106, 129, 44, 176, 35, 148, 16, 94, 95, 94];

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};

function changeOpacity(elements, opacity, transition) {
    [].forEach.call(
        elements,
        function (element) {
            element.style.opacity = 1;
            element.style.transition = 'all ' + transition + 's';
        }
    );
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}


// radial bar
const rb = {
    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        inverted: true,
        polar: true,
        margin: 0,
        events: {
            load: function () {
                const chart = this;
                let count = 0;

                setTimeout(function () {
                    setInterval(function () {
                        if (count < dataRB.length) {
                            chart.series[0].addPoint(dataRB[count]);
                            chart.series[1].addPoint(dataRB[count]);
                            chart.series[2].addPoint(dataRB[count]);
                            count = count + 1;
                        }
                    }, 50);
                }, 500);

                setTimeout(function () {

                    chart.pane[0].update({
                        center: ['28%', '55%']
                    }, false);
                    chart.pane[2].update({
                        center: ['72%', '55%']
                    }, false);
                    chart.series[0].update({
                        data: dataRBAlt
                    }, false);
                    chart.series[1].update({
                        data: dataRBAlt
                    }, false);
                    chart.series[2].update({
                        data: dataRBAlt
                    }, false);

                    chart.redraw();
                }, 3000);
            }
        }
    },
    legend: {
        enabled: false
    },
    title: {
        text: ''
    },
    pane: [{
        size: '80%',
        center: ['50%', '55%'],
        startAngle: 90,
        endAngle: 270
    }, {
        size: '80%',
        center: ['50%', '55%'],
        startAngle: -90,
        endAngle: 90
    },
    {
        size: '80%',
        center: ['50%', '55%'],
        startAngle: 90,
        endAngle: 270
    }],
    xAxis: [{
        tickInterval: 1,
        gridLineColor: '#666',
        labels: {
            style: {
                color: '#666'
            }
        }
    }, {
        pane: 1,
        tickInterval: 1,
        reversed: true,
        gridLineColor: '#666',
        labels: {
            style: {
                color: '#666'
            }
        }
    },
    {
        pane: 2,
        tickInterval: 1,
        gridLineColor: '#666',
        labels: {
            style: {
                color: '#666'
            }
        }
    }],
    yAxis: [{
        max: 120,
        visible: false,
        showLastLabel: true,
        labels: {
            style: {
                color: '#666'
            }
        },
        gridLineColor: 'transparent'
    }, {
        pane: 1,
        visible: false,
        max: 120,
        reversed: true,
        showLastLabel: true,
        labels: {
            style: {
                color: '#666'
            }
        },
        gridLineColor: 'transparent'
    },
    {
        pane: 2,
        visible: false,
        max: 120,
        showLastLabel: true,
        labels: {
            style: {
                color: '#666'
            }
        },
        gridLineColor: 'transparent'
    }],
    plotOptions: {
        series: {
            grouping: false,
            animation: false,
            pointPadding: 0,
            groupPadding: 0,
            borderRadius: 8,
            borderWidth: 2,
            colorByPoint: true,
            borderColor: 'transparent',
            dataLabels: {
                enabled: true,
                inside: true,
                allowOverlap: true,
                style: {
                    textOutline: 'none',
                    size: '14px'
                }
            }
        }
    },
    series: [{
        data: [],
        colors: ['#2caffe',
            '#544fc5',
            '#00e272'
        ]
    }, {
        xAxis: 1,
        yAxis: 1,
        data: [],
        colors: ['#fe6a35',
            '#6b8abc',
            '#d568fb']
    }, {
        xAxis: 2,
        yAxis: 2,
        data: [],
        colors: ['#2ee0ca',
            '#fa4b42',
            '#feb56a']
    }
    ]
};

// variwide
const vw = {

    chart: {
        type: 'variwide',
        height: 400,
        margin: [100, 0, 0, 0],
        backgroundColor: 'transparent',
        animation: {
            easing: 'easeOutQuint',
            duration: 2000
        },
        events: {
            load: function () {
                const chart = this;

                let count = 0;
                const changeData = setInterval(function () {
                    if (count < dataVW.length) {
                        chart.series[0].addPoint(dataVW[count]);
                        count = count + 1;
                    } else {
                        clearInterval(changeData);
                    }
                }, 200);

                setTimeout(function () {
                    chart.series[0].points[12].onMouseOver();
                }, 4000);
            }
        }
    },
    colors: colors,
    title: {
        text: ''
    },
    yAxis: {
        visible: true,
        title: {
            text: ''
        },
        max: 50,
        gridLineColor: 'transparent'
    },
    credits: {
        enabled: false
    },

    xAxis: {
        visible: false,
        type: 'category',
        title: {
            text: ''
        },
        reversed: true
    },

    legend: {
        enabled: false
    },
    tooltip: {
        hideDelay: 2000
    },

    series: [{
        animation: false,
        opacity: 0.9,
        borderWidth: 3,
        borderColor: 'transparent',
        name: 'Labor Costs',
        data: [],
        dataLabels: {
            enabled: false,
            format: '€{point.y:.0f}'
        },
        tooltip: {
            pointFormat: 'Labor Costs: <b>€ {point.y}/h</b><br>' +
                'GDP: <b>€ {point.z} million</b><br>'
        },
        colorByPoint: true
    }]

};

// column range
const cr = {

    chart: {
        type: 'columnrange',
        inverted: true,
        backgroundColor: 'transparent',
        margin: [100, 0, 30, 0],
        animation: {
            duration: 1000,
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
    xAxis: {
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
        gridLineColor: '#666',
        min: -20,
        max: 30
    },

    tooltip: {
        valueSuffix: '°C'
    },

    plotOptions: {
        columnrange: {
            borderRadius: '50%',
            borderColor: null,
            dataLabels: {
                enabled: true,
                format: '{y}°C',
                style: {
                    textOutline: 'none',
                    color: '#BBBAC5'
                }
            }
        }
    },

    legend: {
        enabled: false
    },

    series: [{
        animation: false,
        color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
                [0, '#FF8D64'], // start
                [0.5, '#D57EEB'], // middle
                [1, '#4CAFFE']// end
            ]
        },

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
        inverted: true,
        height: 10,
        width: 1400,
        marginTop: 100,
        animation: {
            duration: 1000,
            easing: 'easeOutQuint'
        },
        backgroundColor: 'transparent',
        events: {
            load: function () {
                const chart = this;
                setTimeout(function () {
                    chart.update({
                        chart: {
                            height: 400
                        }
                    });
                }, 500);

                setTimeout(function () {
                    chart.series[0].update({
                        nodeWidth: 10
                    });
                }, 2000);

                setTimeout(function () {
                    chart.series[0].update({
                        curveFactor: 0.33
                    });
                }, 3500);

                setTimeout(function () {
                    chart.series[0].points[20].onMouseOver();
                }, 4000);

                setTimeout(function () {
                    chart.series[0].onMouseOut();
                    chart.tooltip.hide();
                }, 6000);

            }
        }
    },
    colors: colors,
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
            animation: false,
            nodePadding: 0,
            nodeWidth: 800,
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
            curveFactor: 4,
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
        width: 1400,
        height: 400,
        margin: [50, 0, 0, 0],
        animation: {
            duration: 2000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                const gridLines = document.querySelectorAll('.highcharts-grid-line');

                [].forEach.call(
                    gridLines,
                    function (element) {
                        element.style.opacity = 0;
                    }
                );
                setTimeout(function () {
                    chart.series[2].update({
                        pointWidth: 60,
                        borderRadius: 50
                    }, false);

                    chart.series[0].update({
                        pointWidth: 60,
                        borderRadius: 50
                    }, false);

                    chart.series[1].update({
                        pointWidth: 60,
                        borderRadius: 50
                    }, false);

                    chart.update({
                        plotOptions: {
                            series: {
                                opacity: 1
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
    xAxis: {
        visible: false,
        categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
    },
    yAxis: {
        gridLineColor: 'rgba(255, 255, 255, 0.2)',
        tickPositions: [-300, -200, -100, 0, 100, 200, 300, 400],
        labels: {
            style: {
                color: '#f0f0f0'
            }
        }
    },
    legend: {
        enabled: false
    },
    accessibility: {
        enabled: false
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
            pointWidth: 500,
            borderColor: 'transparent',
            borderWidth: 2,
            dataLabels: {
                enabled: true,
                style: {
                    textOutline: 'none',
                    color: '#46465C',
                    fontSize: '14px'
                }
            },
            stacking: 'normal'
        }
    },
    series: [{
        data: [-71.5, -106.4, 129.2, -144.0, 176.0,
            -135.6, 148.5, -216.4, 194.1,
            -95.6, 54.4],
        type: 'column'
    }, {
        data: [-60, -71.5, -106.4, 129.2, -144.0,
            176.0, -135.6, 148.5, 216.4, 194.1,
            95.6].reverse(),
        type: 'column'
    }, {
        data: [71.5, 106.4, -129.2, 144.0, 176.0,
            -135.6, 148.5, 216.4, 194.1,
            95.6, 54.4]
    }]
};

const charts = [rb, vw, cr, sk, rc];

function makeChart() {
    const chartNum = Math.round(randomNumber(0, 4));
    const chart = charts[chartNum];
    console.log(chartNum);
    Highcharts.chart('container', chart);
}

makeChart();